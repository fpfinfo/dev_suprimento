/*
  # Módulo de Análise de Recolhimentos de INSS
  
  Este módulo implementa o sistema de consolidação e análise dos recolhimentos
  de INSS efetuados pelos supridos durante suas prestações de contas.
  
  ## Estrutura:
  1. Tabela principal de recolhimentos INSS
  2. Views para relatórios consolidados
  3. Funções para importação automática
  4. Triggers para auditoria
  5. Políticas RLS para segurança
*/

-- =====================================================
-- 1. TABELA PRINCIPAL DE RECOLHIMENTOS INSS
-- =====================================================

CREATE TABLE IF NOT EXISTS recolhimentos_inss (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados do prestador (obrigatórios)
  cpf_prestador text NOT NULL CHECK (length(cpf_prestador) = 14), -- Formato: 000.000.000-00
  nome_prestador text NOT NULL,
  data_nascimento_prestador date NOT NULL,
  
  -- Dados da nota fiscal (obrigatórios)
  valor_bruto_nf decimal(15,2) NOT NULL CHECK (valor_bruto_nf > 0),
  data_nota_fiscal date NOT NULL,
  numero_nota_fiscal text,
  
  -- Cálculos INSS (obrigatórios)
  inss_11_contribuinte decimal(15,2) NOT NULL CHECK (inss_11_contribuinte >= 0),
  inss_20_patronal decimal(15,2) NOT NULL CHECK (inss_20_patronal >= 0),
  
  -- Dados administrativos (obrigatórios)
  municipio text NOT NULL,
  portaria_sf text NOT NULL,
  finalidade_atividade text NOT NULL,
  
  -- Relacionamentos com outros módulos
  prestacao_contas_id uuid REFERENCES prestacoes_contas(id) ON DELETE CASCADE,
  solicitacao_suprimento_id uuid REFERENCES solicitacoes_suprimento(id),
  suprido_id uuid REFERENCES perfis_usuario(id) NOT NULL,
  
  -- Dados de validação e controle
  validado boolean DEFAULT false,
  observacoes text,
  
  -- Auditoria
  criado_em timestamptz DEFAULT now(),
  criado_por uuid REFERENCES auth.users(id),
  atualizado_em timestamptz DEFAULT now(),
  atualizado_por uuid REFERENCES auth.users(id),
  
  -- Constraints adicionais
  CONSTRAINT ck_inss_valores_positivos CHECK (
    valor_bruto_nf > 0 AND 
    inss_11_contribuinte >= 0 AND 
    inss_20_patronal >= 0
  ),
  CONSTRAINT ck_data_nascimento_valida CHECK (
    data_nascimento_prestador <= CURRENT_DATE - INTERVAL '18 years'
  ),
  CONSTRAINT ck_data_nf_valida CHECK (
    data_nota_fiscal <= CURRENT_DATE
  )
);

-- =====================================================
-- 2. TABELA DE DOCUMENTOS COMPROBATÓRIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS documentos_inss (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recolhimento_inss_id uuid REFERENCES recolhimentos_inss(id) ON DELETE CASCADE,
  nome_arquivo text NOT NULL,
  tipo_documento text NOT NULL CHECK (tipo_documento IN ('nota_fiscal', 'comprovante_inss', 'outros')),
  caminho_arquivo text NOT NULL,
  tamanho_arquivo bigint,
  hash_arquivo text,
  enviado_por uuid REFERENCES auth.users(id),
  enviado_em timestamptz DEFAULT now()
);

-- =====================================================
-- 3. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices principais
CREATE INDEX IF NOT EXISTS idx_recolhimentos_inss_cpf ON recolhimentos_inss(cpf_prestador);
CREATE INDEX IF NOT EXISTS idx_recolhimentos_inss_data_nf ON recolhimentos_inss(data_nota_fiscal);
CREATE INDEX IF NOT EXISTS idx_recolhimentos_inss_municipio ON recolhimentos_inss(municipio);
CREATE INDEX IF NOT EXISTS idx_recolhimentos_inss_portaria ON recolhimentos_inss(portaria_sf);
CREATE INDEX IF NOT EXISTS idx_recolhimentos_inss_suprido ON recolhimentos_inss(suprido_id);
CREATE INDEX IF NOT EXISTS idx_recolhimentos_inss_prestacao ON recolhimentos_inss(prestacao_contas_id);
CREATE INDEX IF NOT EXISTS idx_recolhimentos_inss_validado ON recolhimentos_inss(validado);

-- Índices compostos para relatórios
CREATE INDEX IF NOT EXISTS idx_recolhimentos_inss_periodo ON recolhimentos_inss(data_nota_fiscal, municipio);
CREATE INDEX IF NOT EXISTS idx_recolhimentos_inss_valores ON recolhimentos_inss(inss_11_contribuinte, inss_20_patronal);

-- =====================================================
-- 4. FUNÇÕES AUXILIARES
-- =====================================================

-- Função para validar CPF
CREATE OR REPLACE FUNCTION validar_cpf(cpf text)
RETURNS boolean AS $$
DECLARE
  cpf_numeros text;
  soma integer;
  resto integer;
  digito1 integer;
  digito2 integer;
BEGIN
  -- Remove formatação
  cpf_numeros := regexp_replace(cpf, '[^0-9]', '', 'g');
  
  -- Verifica se tem 11 dígitos
  IF length(cpf_numeros) != 11 THEN
    RETURN false;
  END IF;
  
  -- Verifica sequências inválidas
  IF cpf_numeros IN ('00000000000', '11111111111', '22222222222', '33333333333', 
                     '44444444444', '55555555555', '66666666666', '77777777777',
                     '88888888888', '99999999999') THEN
    RETURN false;
  END IF;
  
  -- Calcula primeiro dígito verificador
  soma := 0;
  FOR i IN 1..9 LOOP
    soma := soma + (substring(cpf_numeros, i, 1)::integer * (11 - i));
  END LOOP;
  
  resto := soma % 11;
  IF resto < 2 THEN
    digito1 := 0;
  ELSE
    digito1 := 11 - resto;
  END IF;
  
  -- Calcula segundo dígito verificador
  soma := 0;
  FOR i IN 1..10 LOOP
    soma := soma + (substring(cpf_numeros, i, 1)::integer * (12 - i));
  END LOOP;
  
  resto := soma % 11;
  IF resto < 2 THEN
    digito2 := 0;
  ELSE
    digito2 := 11 - resto;
  END IF;
  
  -- Verifica se os dígitos calculados conferem
  RETURN (substring(cpf_numeros, 10, 1)::integer = digito1 AND 
          substring(cpf_numeros, 11, 1)::integer = digito2);
END;
$$ LANGUAGE plpgsql;

-- Função para calcular INSS automaticamente
CREATE OR REPLACE FUNCTION calcular_inss(valor_bruto decimal)
RETURNS TABLE(inss_11 decimal, inss_20 decimal) AS $$
BEGIN
  RETURN QUERY SELECT 
    ROUND(valor_bruto * 0.11, 2) as inss_11,
    ROUND(valor_bruto * 0.20, 2) as inss_20;
END;
$$ LANGUAGE plpgsql;

-- Função para importar dados da prestação de contas
CREATE OR REPLACE FUNCTION importar_dados_prestacao_para_inss(prestacao_id uuid)
RETURNS void AS $$
DECLARE
  prestacao_record RECORD;
  suprido_record RECORD;
  solicitacao_record RECORD;
BEGIN
  -- Buscar dados da prestação
  SELECT * INTO prestacao_record 
  FROM prestacoes_contas 
  WHERE id = prestacao_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Prestação de contas não encontrada: %', prestacao_id;
  END IF;
  
  -- Buscar dados do suprido
  SELECT * INTO suprido_record 
  FROM perfis_usuario 
  WHERE id = prestacao_record.suprido_id;
  
  -- Buscar dados da solicitação
  SELECT * INTO solicitacao_record 
  FROM solicitacoes_suprimento 
  WHERE id = prestacao_record.solicitacao_suprimento_id;
  
  -- Inserir registro de INSS (dados básicos - será complementado manualmente)
  INSERT INTO recolhimentos_inss (
    cpf_prestador,
    nome_prestador,
    data_nascimento_prestador,
    valor_bruto_nf,
    data_nota_fiscal,
    inss_11_contribuinte,
    inss_20_patronal,
    municipio,
    portaria_sf,
    finalidade_atividade,
    prestacao_contas_id,
    solicitacao_suprimento_id,
    suprido_id,
    criado_por
  ) VALUES (
    COALESCE(suprido_record.cpf, '000.000.000-00'), -- Será atualizado
    suprido_record.nome_completo,
    CURRENT_DATE - INTERVAL '30 years', -- Será atualizado
    prestacao_record.valor_total_utilizado,
    CURRENT_DATE, -- Será atualizado
    ROUND(prestacao_record.valor_total_utilizado * 0.11, 2),
    ROUND(prestacao_record.valor_total_utilizado * 0.20, 2),
    'A definir', -- Será atualizado
    COALESCE(solicitacao_record.numero_portaria, 'Pendente'),
    solicitacao_record.justificativa,
    prestacao_id,
    prestacao_record.solicitacao_suprimento_id,
    prestacao_record.suprido_id,
    auth.uid()
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. TRIGGERS
-- =====================================================

-- Trigger para atualizar timestamp de modificação
CREATE TRIGGER trigger_atualizar_recolhimentos_inss
  BEFORE UPDATE ON recolhimentos_inss
  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_modificacao();

-- Trigger para validar CPF antes da inserção/atualização
CREATE OR REPLACE FUNCTION validar_cpf_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT validar_cpf(NEW.cpf_prestador) THEN
    RAISE EXCEPTION 'CPF inválido: %', NEW.cpf_prestador;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_cpf_recolhimentos
  BEFORE INSERT OR UPDATE ON recolhimentos_inss
  FOR EACH ROW EXECUTE FUNCTION validar_cpf_trigger();

-- Trigger para histórico de alterações
CREATE TRIGGER trigger_historico_recolhimentos_inss
  AFTER INSERT OR UPDATE OR DELETE ON recolhimentos_inss
  FOR EACH ROW EXECUTE FUNCTION registrar_historico();

-- =====================================================
-- 6. VIEWS PARA RELATÓRIOS
-- =====================================================

-- View consolidada de recolhimentos com dados completos
CREATE OR REPLACE VIEW vw_recolhimentos_inss_completos AS
SELECT 
  r.id,
  r.cpf_prestador,
  r.nome_prestador,
  r.data_nascimento_prestador,
  r.valor_bruto_nf,
  r.data_nota_fiscal,
  r.numero_nota_fiscal,
  r.inss_11_contribuinte,
  r.inss_20_patronal,
  (r.inss_11_contribuinte + r.inss_20_patronal) as total_inss,
  r.municipio,
  r.portaria_sf,
  r.finalidade_atividade,
  r.validado,
  r.observacoes,
  
  -- Dados da prestação
  pc.numero_protocolo as prestacao_protocolo,
  pc.status as prestacao_status,
  
  -- Dados da solicitação
  ss.numero_protocolo as solicitacao_protocolo,
  
  -- Dados do suprido
  pu.lotacao as suprido_lotacao,
  pu.cargo as suprido_cargo,
  
  r.criado_em,
  r.atualizado_em
FROM recolhimentos_inss r
LEFT JOIN prestacoes_contas pc ON r.prestacao_contas_id = pc.id
LEFT JOIN solicitacoes_suprimento ss ON r.solicitacao_suprimento_id = ss.id
LEFT JOIN perfis_usuario pu ON r.suprido_id = pu.id;

-- View para relatórios de arrecadação por período
CREATE OR REPLACE VIEW vw_arrecadacao_inss_periodo AS
SELECT 
  DATE_TRUNC('month', data_nota_fiscal) as mes_referencia,
  municipio,
  COUNT(*) as total_recolhimentos,
  SUM(valor_bruto_nf) as total_valor_bruto,
  SUM(inss_11_contribuinte) as total_inss_11,
  SUM(inss_20_patronal) as total_inss_20,
  SUM(inss_11_contribuinte + inss_20_patronal) as total_inss_geral,
  COUNT(CASE WHEN validado THEN 1 END) as recolhimentos_validados,
  COUNT(CASE WHEN NOT validado THEN 1 END) as recolhimentos_pendentes
FROM recolhimentos_inss
GROUP BY DATE_TRUNC('month', data_nota_fiscal), municipio
ORDER BY mes_referencia DESC, municipio;

-- View para ranking de prestadores
CREATE OR REPLACE VIEW vw_ranking_prestadores_inss AS
SELECT 
  cpf_prestador,
  nome_prestador,
  COUNT(*) as total_recolhimentos,
  SUM(valor_bruto_nf) as total_valor_bruto,
  SUM(inss_11_contribuinte + inss_20_patronal) as total_inss,
  AVG(valor_bruto_nf) as valor_medio_nf,
  MIN(data_nota_fiscal) as primeira_nf,
  MAX(data_nota_fiscal) as ultima_nf
FROM recolhimentos_inss
GROUP BY cpf_prestador, nome_prestador
ORDER BY total_inss DESC;

-- =====================================================
-- 7. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS
ALTER TABLE recolhimentos_inss ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_inss ENABLE ROW LEVEL SECURITY;

-- Políticas para recolhimentos_inss
CREATE POLICY "Administradores podem ver todos os recolhimentos"
  ON recolhimentos_inss FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.tipo_perfil = 'administrador'
    )
  );

CREATE POLICY "Supridos podem ver próprios recolhimentos"
  ON recolhimentos_inss FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.id = suprido_id
    )
  );

CREATE POLICY "Administradores podem gerenciar recolhimentos"
  ON recolhimentos_inss FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.tipo_perfil = 'administrador'
    )
  );

-- Políticas para documentos_inss
CREATE POLICY "Administradores podem gerenciar documentos INSS"
  ON documentos_inss FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.tipo_perfil = 'administrador'
    )
  );

-- =====================================================
-- 8. FUNÇÕES PARA RELATÓRIOS
-- =====================================================

-- Função para gerar relatório de arrecadação por período
CREATE OR REPLACE FUNCTION relatorio_arrecadacao_inss(
  data_inicio date,
  data_fim date,
  municipio_filtro text DEFAULT NULL
)
RETURNS TABLE(
  periodo text,
  municipio text,
  total_recolhimentos bigint,
  valor_bruto_total decimal,
  inss_11_total decimal,
  inss_20_total decimal,
  inss_total decimal
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(r.data_nota_fiscal, 'MM/YYYY') as periodo,
    r.municipio,
    COUNT(*)::bigint as total_recolhimentos,
    SUM(r.valor_bruto_nf) as valor_bruto_total,
    SUM(r.inss_11_contribuinte) as inss_11_total,
    SUM(r.inss_20_patronal) as inss_20_total,
    SUM(r.inss_11_contribuinte + r.inss_20_patronal) as inss_total
  FROM recolhimentos_inss r
  WHERE r.data_nota_fiscal BETWEEN data_inicio AND data_fim
    AND (municipio_filtro IS NULL OR r.municipio = municipio_filtro)
  GROUP BY TO_CHAR(r.data_nota_fiscal, 'MM/YYYY'), r.municipio
  ORDER BY periodo DESC, r.municipio;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. DADOS INICIAIS E CONFIGURAÇÕES
-- =====================================================

-- Inserir configurações padrão se necessário
INSERT INTO elementos_despesa (codigo, descricao, tipo_elemento, limite_valor) VALUES
('INSS-11', 'INSS Contribuinte 11%', 'outros', NULL),
('INSS-20', 'INSS Patronal 20%', 'outros', NULL)
ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE recolhimentos_inss IS 'Consolidação dos recolhimentos de INSS efetuados pelos supridos';
COMMENT ON COLUMN recolhimentos_inss.cpf_prestador IS 'CPF do prestador de serviços (formato: 000.000.000-00)';
COMMENT ON COLUMN recolhimentos_inss.inss_11_contribuinte IS 'Valor do INSS 11% (contribuinte)';
COMMENT ON COLUMN recolhimentos_inss.inss_20_patronal IS 'Valor do INSS 20% (patronal)';
COMMENT ON COLUMN recolhimentos_inss.validado IS 'Indica se o recolhimento foi validado pelo analista';

COMMENT ON VIEW vw_recolhimentos_inss_completos IS 'View consolidada com todos os dados dos recolhimentos INSS';
COMMENT ON VIEW vw_arrecadacao_inss_periodo IS 'View para relatórios de arrecadação por período';
COMMENT ON VIEW vw_ranking_prestadores_inss IS 'Ranking dos prestadores por volume de INSS recolhido';

COMMENT ON FUNCTION relatorio_arrecadacao_inss IS 'Gera relatório de arrecadação INSS filtrado por período e município';
COMMENT ON FUNCTION importar_dados_prestacao_para_inss IS 'Importa dados básicos da prestação de contas para o módulo INSS';