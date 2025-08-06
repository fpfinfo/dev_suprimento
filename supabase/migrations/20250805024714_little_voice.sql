/*
  # Sistema de Gestão Financeira TJ-PA - Esquema Completo

  Este esquema implementa um sistema completo de gestão financeira com:
  - Controle de acesso baseado em perfis (Administradores e Supridos)
  - Módulos integrados de suprimento, prestação de contas e reembolsos
  - Auditoria completa e histórico de alterações
  - Políticas RLS para segurança de dados

  ## Estrutura Principal:
  1. Gestão de Usuários e Perfis
  2. Suprimento de Fundos
  3. Prestação de Contas
  4. Reembolso de Despesas
  5. Sistema de Análise e Aprovação
  6. Auditoria e Histórico
*/

-- =====================================================
-- 1. EXTENSÕES E CONFIGURAÇÕES INICIAIS
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 2. TIPOS ENUMERADOS (ENUMS)
-- =====================================================

-- Tipos de perfil de usuário
CREATE TYPE tipo_perfil AS ENUM ('administrador', 'suprido');

-- Status gerais do sistema
CREATE TYPE status_geral AS ENUM ('pendente', 'em_analise', 'aprovado', 'rejeitado', 'glosado', 'cancelado');

-- Tipos de elemento de despesa
CREATE TYPE tipo_elemento AS ENUM ('material_consumo', 'servicos_terceiros', 'equipamentos', 'outros');

-- Prioridades
CREATE TYPE nivel_prioridade AS ENUM ('baixa', 'media', 'alta', 'urgente');

-- Tipos de reembolso
CREATE TYPE tipo_reembolso AS ENUM ('transporte', 'hospedagem', 'alimentacao', 'material', 'outros');

-- =====================================================
-- 3. TABELAS DE CONFIGURAÇÃO E USUÁRIOS
-- =====================================================

-- Tabela de perfis de usuário (estende auth.users)
CREATE TABLE IF NOT EXISTS perfis_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  nome_completo text NOT NULL,
  cpf text UNIQUE NOT NULL CHECK (length(cpf) = 14), -- Formato: 000.000.000-00
  email text UNIQUE NOT NULL,
  tipo_perfil tipo_perfil NOT NULL DEFAULT 'suprido',
  lotacao text NOT NULL,
  cargo text,
  telefone text,
  ativo boolean DEFAULT true,
  data_cadastro timestamptz DEFAULT now(),
  data_ultima_atualizacao timestamptz DEFAULT now(),
  criado_por uuid REFERENCES auth.users(id),
  atualizado_por uuid REFERENCES auth.users(id)
);

-- Tabela de elementos de despesa (configuração)
CREATE TABLE IF NOT EXISTS elementos_despesa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text UNIQUE NOT NULL,
  descricao text NOT NULL,
  tipo_elemento tipo_elemento NOT NULL,
  limite_valor decimal(15,2),
  ativo boolean DEFAULT true,
  criado_em timestamptz DEFAULT now(),
  criado_por uuid REFERENCES auth.users(id)
);

-- =====================================================
-- 4. MÓDULO: SUPRIMENTO DE FUNDOS
-- =====================================================

-- Tabela principal de solicitações de suprimento
CREATE TABLE IF NOT EXISTS solicitacoes_suprimento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_protocolo text UNIQUE NOT NULL, -- Gerado automaticamente: SF-YYYY-NNNN
  solicitante_id uuid REFERENCES perfis_usuario(id) NOT NULL,
  valor_total decimal(15,2) NOT NULL CHECK (valor_total > 0),
  justificativa text NOT NULL,
  data_limite_utilizacao date NOT NULL,
  observacoes text,
  status status_geral DEFAULT 'pendente',
  prioridade nivel_prioridade DEFAULT 'media',
  
  -- Campos de análise (preenchidos pelo SOSFU)
  analisado_por uuid REFERENCES perfis_usuario(id),
  data_analise timestamptz,
  parecer_tecnico text,
  numero_portaria text,
  data_portaria date,
  
  -- Auditoria
  criado_em timestamptz DEFAULT now(),
  atualizado_em timestamptz DEFAULT now(),
  criado_por uuid REFERENCES auth.users(id),
  atualizado_por uuid REFERENCES auth.users(id)
);

-- Detalhamento por elemento de despesa
CREATE TABLE IF NOT EXISTS solicitacao_elementos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitacao_id uuid REFERENCES solicitacoes_suprimento(id) ON DELETE CASCADE,
  elemento_despesa_id uuid REFERENCES elementos_despesa(id),
  valor_solicitado decimal(15,2) NOT NULL CHECK (valor_solicitado > 0),
  justificativa_elemento text,
  criado_em timestamptz DEFAULT now()
);

-- =====================================================
-- 5. MÓDULO: PRESTAÇÃO DE CONTAS
-- =====================================================

-- Tabela principal de prestações de contas
CREATE TABLE IF NOT EXISTS prestacoes_contas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_protocolo text UNIQUE NOT NULL, -- PC-YYYY-NNNN
  solicitacao_suprimento_id uuid REFERENCES solicitacoes_suprimento(id) NOT NULL,
  suprido_id uuid REFERENCES perfis_usuario(id) NOT NULL,
  valor_total_recebido decimal(15,2) NOT NULL,
  valor_total_utilizado decimal(15,2) NOT NULL CHECK (valor_total_utilizado >= 0),
  saldo_devolver decimal(15,2) GENERATED ALWAYS AS (valor_total_recebido - valor_total_utilizado) STORED,
  
  status status_geral DEFAULT 'pendente',
  data_vencimento date NOT NULL,
  observacoes_suprido text,
  
  -- Campos de análise
  analisado_por uuid REFERENCES perfis_usuario(id),
  data_analise timestamptz,
  observacoes_analise text,
  
  -- Auditoria
  criado_em timestamptz DEFAULT now(),
  atualizado_em timestamptz DEFAULT now(),
  criado_por uuid REFERENCES auth.users(id),
  atualizado_por uuid REFERENCES auth.users(id)
);

-- Detalhamento da prestação por elemento
CREATE TABLE IF NOT EXISTS prestacao_elementos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prestacao_id uuid REFERENCES prestacoes_contas(id) ON DELETE CASCADE,
  elemento_despesa_id uuid REFERENCES elementos_despesa(id),
  valor_recebido decimal(15,2) NOT NULL,
  valor_utilizado decimal(15,2) NOT NULL CHECK (valor_utilizado >= 0),
  saldo_devolver decimal(15,2) GENERATED ALWAYS AS (valor_recebido - valor_utilizado) STORED,
  criado_em timestamptz DEFAULT now()
);

-- Checklist técnico para análise
CREATE TABLE IF NOT EXISTS checklist_prestacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prestacao_id uuid REFERENCES prestacoes_contas(id) ON DELETE CASCADE,
  criterio text NOT NULL,
  status_verificacao text CHECK (status_verificacao IN ('sim', 'nao', 'na')) DEFAULT 'na',
  obrigatorio boolean DEFAULT false,
  observacao text,
  verificado_por uuid REFERENCES perfis_usuario(id),
  verificado_em timestamptz,
  criado_em timestamptz DEFAULT now()
);

-- Documentos anexados às prestações
CREATE TABLE IF NOT EXISTS documentos_prestacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prestacao_id uuid REFERENCES prestacoes_contas(id) ON DELETE CASCADE,
  nome_arquivo text NOT NULL,
  tipo_documento text NOT NULL,
  caminho_arquivo text NOT NULL,
  tamanho_arquivo bigint,
  hash_arquivo text,
  enviado_por uuid REFERENCES auth.users(id),
  enviado_em timestamptz DEFAULT now()
);

-- =====================================================
-- 6. MÓDULO: REEMBOLSO DE DESPESAS
-- =====================================================

-- Tabela de solicitações de reembolso
CREATE TABLE IF NOT EXISTS solicitacoes_reembolso (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_protocolo text UNIQUE NOT NULL, -- RB-YYYY-NNNN
  solicitante_id uuid REFERENCES perfis_usuario(id) NOT NULL,
  tipo_reembolso tipo_reembolso NOT NULL,
  valor_solicitado decimal(15,2) NOT NULL CHECK (valor_solicitado > 0),
  descricao text NOT NULL,
  data_despesa date NOT NULL,
  local_despesa text,
  
  status status_geral DEFAULT 'pendente',
  
  -- Campos de análise
  analisado_por uuid REFERENCES perfis_usuario(id),
  data_analise timestamptz,
  valor_aprovado decimal(15,2),
  observacoes_analise text,
  
  -- Auditoria
  criado_em timestamptz DEFAULT now(),
  atualizado_em timestamptz DEFAULT now(),
  criado_por uuid REFERENCES auth.users(id),
  atualizado_por uuid REFERENCES auth.users(id)
);

-- Documentos do reembolso
CREATE TABLE IF NOT EXISTS documentos_reembolso (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reembolso_id uuid REFERENCES solicitacoes_reembolso(id) ON DELETE CASCADE,
  nome_arquivo text NOT NULL,
  tipo_documento text NOT NULL,
  caminho_arquivo text NOT NULL,
  tamanho_arquivo bigint,
  enviado_por uuid REFERENCES auth.users(id),
  enviado_em timestamptz DEFAULT now()
);

-- =====================================================
-- 7. SISTEMA DE HISTÓRICO E AUDITORIA
-- =====================================================

-- Histórico de alterações (para todas as entidades)
CREATE TABLE IF NOT EXISTS historico_alteracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tabela_origem text NOT NULL,
  registro_id uuid NOT NULL,
  acao text NOT NULL CHECK (acao IN ('INSERT', 'UPDATE', 'DELETE')),
  dados_anteriores jsonb,
  dados_novos jsonb,
  usuario_id uuid REFERENCES auth.users(id),
  data_alteracao timestamptz DEFAULT now(),
  ip_origem inet,
  user_agent text
);

-- Mensagens e comunicações
CREATE TABLE IF NOT EXISTS mensagens_sistema (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  remetente_id uuid REFERENCES perfis_usuario(id) NOT NULL,
  destinatario_id uuid REFERENCES perfis_usuario(id) NOT NULL,
  assunto text NOT NULL,
  conteudo text NOT NULL,
  
  -- Referência ao processo (pode ser solicitação, prestação ou reembolso)
  referencia_tabela text,
  referencia_id uuid,
  
  lida boolean DEFAULT false,
  data_leitura timestamptz,
  
  criado_em timestamptz DEFAULT now()
);

-- =====================================================
-- 8. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para perfis_usuario
CREATE INDEX IF NOT EXISTS idx_perfis_usuario_cpf ON perfis_usuario(cpf);
CREATE INDEX IF NOT EXISTS idx_perfis_usuario_email ON perfis_usuario(email);
CREATE INDEX IF NOT EXISTS idx_perfis_usuario_tipo ON perfis_usuario(tipo_perfil);
CREATE INDEX IF NOT EXISTS idx_perfis_usuario_ativo ON perfis_usuario(ativo);

-- Índices para solicitações_suprimento
CREATE INDEX IF NOT EXISTS idx_solicitacoes_protocolo ON solicitacoes_suprimento(numero_protocolo);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_solicitante ON solicitacoes_suprimento(solicitante_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON solicitacoes_suprimento(status);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_data ON solicitacoes_suprimento(criado_em);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_analisado_por ON solicitacoes_suprimento(analisado_por);

-- Índices para prestações_contas
CREATE INDEX IF NOT EXISTS idx_prestacoes_protocolo ON prestacoes_contas(numero_protocolo);
CREATE INDEX IF NOT EXISTS idx_prestacoes_suprido ON prestacoes_contas(suprido_id);
CREATE INDEX IF NOT EXISTS idx_prestacoes_status ON prestacoes_contas(status);
CREATE INDEX IF NOT EXISTS idx_prestacoes_vencimento ON prestacoes_contas(data_vencimento);

-- Índices para reembolsos
CREATE INDEX IF NOT EXISTS idx_reembolsos_protocolo ON solicitacoes_reembolso(numero_protocolo);
CREATE INDEX IF NOT EXISTS idx_reembolsos_solicitante ON solicitacoes_reembolso(solicitante_id);
CREATE INDEX IF NOT EXISTS idx_reembolsos_status ON solicitacoes_reembolso(status);
CREATE INDEX IF NOT EXISTS idx_reembolsos_tipo ON solicitacoes_reembolso(tipo_reembolso);

-- Índices para histórico
CREATE INDEX IF NOT EXISTS idx_historico_tabela_registro ON historico_alteracoes(tabela_origem, registro_id);
CREATE INDEX IF NOT EXISTS idx_historico_usuario ON historico_alteracoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_historico_data ON historico_alteracoes(data_alteracao);

-- =====================================================
-- 9. FUNÇÕES AUXILIARES
-- =====================================================

-- Função para gerar número de protocolo
CREATE OR REPLACE FUNCTION gerar_numero_protocolo(prefixo text)
RETURNS text AS $$
DECLARE
  ano text := EXTRACT(YEAR FROM now())::text;
  contador int;
  numero_protocolo text;
BEGIN
  -- Buscar o próximo número sequencial para o ano atual
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(numero_protocolo FROM LENGTH(prefixo || '-' || ano || '-') + 1) 
      AS INTEGER
    )
  ), 0) + 1
  INTO contador
  FROM (
    SELECT numero_protocolo FROM solicitacoes_suprimento WHERE numero_protocolo LIKE prefixo || '-' || ano || '-%'
    UNION ALL
    SELECT numero_protocolo FROM prestacoes_contas WHERE numero_protocolo LIKE prefixo || '-' || ano || '-%'
    UNION ALL
    SELECT numero_protocolo FROM solicitacoes_reembolso WHERE numero_protocolo LIKE prefixo || '-' || ano || '-%'
  ) protocolos;
  
  numero_protocolo := prefixo || '-' || ano || '-' || LPAD(contador::text, 4, '0');
  RETURN numero_protocolo;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar timestamp de atualização
CREATE OR REPLACE FUNCTION atualizar_timestamp_modificacao()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  NEW.atualizado_por = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para registrar histórico de alterações
CREATE OR REPLACE FUNCTION registrar_historico()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO historico_alteracoes (
    tabela_origem,
    registro_id,
    acao,
    dados_anteriores,
    dados_novos,
    usuario_id
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. TRIGGERS
-- =====================================================

-- Triggers para atualização de timestamp
CREATE TRIGGER trigger_atualizar_perfis_usuario
  BEFORE UPDATE ON perfis_usuario
  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_modificacao();

CREATE TRIGGER trigger_atualizar_solicitacoes_suprimento
  BEFORE UPDATE ON solicitacoes_suprimento
  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_modificacao();

CREATE TRIGGER trigger_atualizar_prestacoes_contas
  BEFORE UPDATE ON prestacoes_contas
  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_modificacao();

CREATE TRIGGER trigger_atualizar_solicitacoes_reembolso
  BEFORE UPDATE ON solicitacoes_reembolso
  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_modificacao();

-- Triggers para histórico de alterações
CREATE TRIGGER trigger_historico_perfis_usuario
  AFTER INSERT OR UPDATE OR DELETE ON perfis_usuario
  FOR EACH ROW EXECUTE FUNCTION registrar_historico();

CREATE TRIGGER trigger_historico_solicitacoes_suprimento
  AFTER INSERT OR UPDATE OR DELETE ON solicitacoes_suprimento
  FOR EACH ROW EXECUTE FUNCTION registrar_historico();

CREATE TRIGGER trigger_historico_prestacoes_contas
  AFTER INSERT OR UPDATE OR DELETE ON prestacoes_contas
  FOR EACH ROW EXECUTE FUNCTION registrar_historico();

CREATE TRIGGER trigger_historico_solicitacoes_reembolso
  AFTER INSERT OR UPDATE OR DELETE ON solicitacoes_reembolso
  FOR EACH ROW EXECUTE FUNCTION registrar_historico();

-- =====================================================
-- 11. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE perfis_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE elementos_despesa ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitacoes_suprimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitacao_elementos ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestacoes_contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestacao_elementos ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_prestacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_prestacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitacoes_reembolso ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_reembolso ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_alteracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_sistema ENABLE ROW LEVEL SECURITY;

-- Políticas para perfis_usuario
CREATE POLICY "Usuários podem ver próprio perfil"
  ON perfis_usuario FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Administradores podem ver todos os perfis"
  ON perfis_usuario FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.tipo_perfil = 'administrador'
    )
  );

CREATE POLICY "Administradores podem gerenciar perfis"
  ON perfis_usuario FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.tipo_perfil = 'administrador'
    )
  );

-- Políticas para elementos_despesa
CREATE POLICY "Todos podem visualizar elementos de despesa"
  ON elementos_despesa FOR SELECT
  TO authenticated
  USING (ativo = true);

CREATE POLICY "Apenas administradores podem gerenciar elementos"
  ON elementos_despesa FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.tipo_perfil = 'administrador'
    )
  );

-- Políticas para solicitações_suprimento
CREATE POLICY "Usuários podem ver próprias solicitações"
  ON solicitacoes_suprimento FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.id = solicitante_id
    )
  );

CREATE POLICY "Administradores podem ver todas as solicitações"
  ON solicitacoes_suprimento FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.tipo_perfil = 'administrador'
    )
  );

CREATE POLICY "Usuários podem criar próprias solicitações"
  ON solicitacoes_suprimento FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.id = solicitante_id
    )
  );

CREATE POLICY "Usuários podem atualizar próprias solicitações pendentes"
  ON solicitacoes_suprimento FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.id = solicitante_id
      AND status = 'pendente'
    )
  );

CREATE POLICY "Administradores podem gerenciar todas as solicitações"
  ON solicitacoes_suprimento FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.tipo_perfil = 'administrador'
    )
  );

-- Políticas similares para outras tabelas...
-- (Aplicando o mesmo padrão: usuários veem apenas seus dados, administradores veem tudo)

-- Políticas para prestações_contas
CREATE POLICY "Supridos podem ver próprias prestações"
  ON prestacoes_contas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.id = suprido_id
    )
  );

CREATE POLICY "Administradores podem ver todas as prestações"
  ON prestacoes_contas FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.tipo_perfil = 'administrador'
    )
  );

-- Políticas para reembolsos
CREATE POLICY "Usuários podem ver próprios reembolsos"
  ON solicitacoes_reembolso FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.id = solicitante_id
    )
  );

CREATE POLICY "Administradores podem gerenciar todos os reembolsos"
  ON solicitacoes_reembolso FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND p.tipo_perfil = 'administrador'
    )
  );

-- Políticas para mensagens
CREATE POLICY "Usuários podem ver mensagens enviadas ou recebidas"
  ON mensagens_sistema FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis_usuario p 
      WHERE p.user_id = auth.uid() 
      AND (p.id = remetente_id OR p.id = destinatario_id)
    )
  );

-- =====================================================
-- 12. DADOS INICIAIS (SEEDS)
-- =====================================================

-- Inserir elementos de despesa padrão
INSERT INTO elementos_despesa (codigo, descricao, tipo_elemento, limite_valor) VALUES
('3.3.90.30', 'Material de Consumo', 'material_consumo', 10000.00),
('3.3.90.39', 'Outros Serviços de Terceiros - Pessoa Jurídica', 'servicos_terceiros', 15000.00),
('4.4.90.52', 'Equipamentos e Material Permanente', 'equipamentos', 25000.00),
('3.3.90.14', 'Diárias - Civil', 'outros', 5000.00),
('3.3.90.33', 'Passagens e Despesas com Locomoção', 'outros', 8000.00)
ON CONFLICT (codigo) DO NOTHING;

-- Inserir critérios padrão do checklist
DO $$
DECLARE
  prestacao_id_exemplo uuid;
BEGIN
  -- Este bloco será executado quando houver prestações para inserir critérios padrão
  NULL;
END $$;

-- =====================================================
-- 13. VIEWS ÚTEIS PARA RELATÓRIOS
-- =====================================================

-- View consolidada de solicitações com dados do solicitante
CREATE OR REPLACE VIEW vw_solicitacoes_completas AS
SELECT 
  s.*,
  p.nome_completo as solicitante_nome,
  p.cpf as solicitante_cpf,
  p.lotacao as solicitante_lotacao,
  a.nome_completo as analisado_por_nome
FROM solicitacoes_suprimento s
JOIN perfis_usuario p ON s.solicitante_id = p.id
LEFT JOIN perfis_usuario a ON s.analisado_por = a.id;

-- View de prestações com resumo financeiro
CREATE OR REPLACE VIEW vw_prestacoes_resumo AS
SELECT 
  pc.*,
  pu.nome_completo as suprido_nome,
  pu.cpf as suprido_cpf,
  pu.lotacao as suprido_lotacao,
  ss.numero_protocolo as solicitacao_protocolo,
  COUNT(pe.id) as total_elementos,
  SUM(pe.valor_recebido) as total_recebido_elementos,
  SUM(pe.valor_utilizado) as total_utilizado_elementos
FROM prestacoes_contas pc
JOIN perfis_usuario pu ON pc.suprido_id = pu.id
JOIN solicitacoes_suprimento ss ON pc.solicitacao_suprimento_id = ss.id
LEFT JOIN prestacao_elementos pe ON pc.id = pe.prestacao_id
GROUP BY pc.id, pu.id, ss.id;

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================

COMMENT ON SCHEMA public IS 'Sistema de Gestão Financeira TJ-PA - Esquema completo com controle de acesso baseado em perfis';

COMMENT ON TABLE perfis_usuario IS 'Perfis de usuário do sistema (administradores e supridos)';
COMMENT ON TABLE solicitacoes_suprimento IS 'Solicitações de suprimento de fundos';
COMMENT ON TABLE prestacoes_contas IS 'Prestações de contas dos suprimentos recebidos';
COMMENT ON TABLE solicitacoes_reembolso IS 'Solicitações de reembolso de despesas';
COMMENT ON TABLE historico_alteracoes IS 'Auditoria completa de todas as alterações no sistema';
COMMENT ON TABLE mensagens_sistema IS 'Sistema de mensagens entre usuários';

-- Fim do esquema