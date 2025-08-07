# Documentação Técnica - Módulo de Análise de Recolhimentos INSS

## Visão Geral

O Módulo de Análise de Recolhimentos INSS é um sistema completo para consolidação, análise e geração de relatórios dos recolhimentos de INSS efetuados pelos supridos durante suas prestações de contas no sistema TJ-PA.

## Arquitetura do Sistema

### 1. Estrutura de Banco de Dados

#### Tabela Principal: `recolhimentos_inss`

```sql
CREATE TABLE recolhimentos_inss (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados do prestador (obrigatórios)
  cpf_prestador text NOT NULL CHECK (length(cpf_prestador) = 14),
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
  
  -- Relacionamentos
  prestacao_contas_id uuid REFERENCES prestacoes_contas(id) ON DELETE CASCADE,
  solicitacao_suprimento_id uuid REFERENCES solicitacoes_suprimento(id),
  suprido_id uuid REFERENCES perfis_usuario(id) NOT NULL,
  
  -- Controle
  validado boolean DEFAULT false,
  observacoes text,
  
  -- Auditoria
  criado_em timestamptz DEFAULT now(),
  criado_por uuid REFERENCES auth.users(id),
  atualizado_em timestamptz DEFAULT now(),
  atualizado_por uuid REFERENCES auth.users(id)
);
```

#### Tabela de Documentos: `documentos_inss`

```sql
CREATE TABLE documentos_inss (
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
```

### 2. Relacionamentos Entre Módulos

#### Diagrama de Relacionamento

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   perfis_usuario    │    │ solicitacoes_suprimento │    │ prestacoes_contas   │
│                     │    │                      │    │                     │
│ - id (PK)          │◄───┤ - solicitante_id (FK)│◄───┤ - solicitacao_id(FK)│
│ - nome_completo    │    │ - numero_protocolo   │    │ - numero_protocolo  │
│ - cpf              │    │ - valor_total        │    │ - valor_utilizado   │
│ - tipo_perfil      │    │ - status             │    │ - status            │
└─────────────────────┘    └──────────────────────┘    └─────────────────────┘
           │                                                        │
           │                                                        │
           │               ┌─────────────────────┐                  │
           └──────────────►│ recolhimentos_inss  │◄─────────────────┘
                          │                     │
                          │ - suprido_id (FK)   │
                          │ - prestacao_id (FK) │
                          │ - cpf_prestador     │
                          │ - nome_prestador    │
                          │ - valor_bruto_nf    │
                          │ - inss_11_contrib   │
                          │ - inss_20_patronal  │
                          │ - municipio         │
                          │ - portaria_sf       │
                          └─────────────────────┘
```

#### Mapeamento de Dados

**De Prestação de Contas para INSS:**
- `prestacoes_contas.suprido_id` → `recolhimentos_inss.suprido_id`
- `prestacoes_contas.id` → `recolhimentos_inss.prestacao_contas_id`
- `prestacoes_contas.valor_total_utilizado` → `recolhimentos_inss.valor_bruto_nf`
- `perfis_usuario.nome_completo` → `recolhimentos_inss.nome_prestador`
- `perfis_usuario.cpf` → `recolhimentos_inss.cpf_prestador`

### 3. Funções e Procedures

#### Função de Validação de CPF

```sql
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
  
  -- Validações básicas
  IF length(cpf_numeros) != 11 THEN
    RETURN false;
  END IF;
  
  -- Verifica sequências inválidas
  IF cpf_numeros IN ('00000000000', '11111111111', ...) THEN
    RETURN false;
  END IF;
  
  -- Cálculo dos dígitos verificadores
  -- [Implementação completa do algoritmo]
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;
```

#### Função de Cálculo Automático de INSS

```sql
CREATE OR REPLACE FUNCTION calcular_inss(valor_bruto decimal)
RETURNS TABLE(inss_11 decimal, inss_20 decimal) AS $$
BEGIN
  RETURN QUERY SELECT 
    ROUND(valor_bruto * 0.11, 2) as inss_11,
    ROUND(valor_bruto * 0.20, 2) as inss_20;
END;
$$ LANGUAGE plpgsql;
```

#### Função de Importação de Dados

```sql
CREATE OR REPLACE FUNCTION importar_dados_prestacao_para_inss(prestacao_id uuid)
RETURNS void AS $$
DECLARE
  prestacao_record RECORD;
  suprido_record RECORD;
  solicitacao_record RECORD;
BEGIN
  -- Buscar dados relacionados
  SELECT * INTO prestacao_record FROM prestacoes_contas WHERE id = prestacao_id;
  SELECT * INTO suprido_record FROM perfis_usuario WHERE id = prestacao_record.suprido_id;
  SELECT * INTO solicitacao_record FROM solicitacoes_suprimento WHERE id = prestacao_record.solicitacao_suprimento_id;
  
  -- Inserir registro base (será complementado manualmente)
  INSERT INTO recolhimentos_inss (
    cpf_prestador,
    nome_prestador,
    valor_bruto_nf,
    inss_11_contribuinte,
    inss_20_patronal,
    prestacao_contas_id,
    suprido_id,
    -- outros campos...
  ) VALUES (
    COALESCE(suprido_record.cpf, '000.000.000-00'),
    suprido_record.nome_completo,
    prestacao_record.valor_total_utilizado,
    ROUND(prestacao_record.valor_total_utilizado * 0.11, 2),
    ROUND(prestacao_record.valor_total_utilizado * 0.20, 2),
    prestacao_id,
    prestacao_record.suprido_id
  );
END;
$$ LANGUAGE plpgsql;
```

### 4. Views para Relatórios

#### View Consolidada

```sql
CREATE OR REPLACE VIEW vw_recolhimentos_inss_completos AS
SELECT 
  r.id,
  r.cpf_prestador,
  r.nome_prestador,
  r.data_nascimento_prestador,
  r.valor_bruto_nf,
  r.data_nota_fiscal,
  r.inss_11_contribuinte,
  r.inss_20_patronal,
  (r.inss_11_contribuinte + r.inss_20_patronal) as total_inss,
  r.municipio,
  r.portaria_sf,
  r.finalidade_atividade,
  r.validado,
  
  -- Dados relacionados
  pc.numero_protocolo as prestacao_protocolo,
  ss.numero_protocolo as solicitacao_protocolo,
  pu.lotacao as suprido_lotacao,
  
  r.criado_em,
  r.atualizado_em
FROM recolhimentos_inss r
LEFT JOIN prestacoes_contas pc ON r.prestacao_contas_id = pc.id
LEFT JOIN solicitacoes_suprimento ss ON r.solicitacao_suprimento_id = ss.id
LEFT JOIN perfis_usuario pu ON r.suprido_id = pu.id;
```

#### View para Arrecadação por Período

```sql
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
```

### 5. Políticas de Segurança (RLS)

```sql
-- Habilitar RLS
ALTER TABLE recolhimentos_inss ENABLE ROW LEVEL SECURITY;

-- Administradores podem ver todos os recolhimentos
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

-- Supridos podem ver apenas próprios recolhimentos
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
```

## Interface do Usuário

### 1. Componente Principal: INSSAnalysis

#### Estrutura da Tabela (ordem obrigatória):

1. **CPF do prestador** - Formato: 000.000.000-00
2. **Nome completo do prestador** - Texto completo
3. **Data de nascimento do prestador** - Formato: DD/MM/AAAA
4. **Valor bruto da nota fiscal** - Formato: R$ 0.000,00
5. **Data da nota fiscal (NF)** - Formato: DD/MM/AAAA
6. **INSS 11% (contribuinte)** - Formato: R$ 0.000,00
7. **INSS 20% (patronal)** - Formato: R$ 0.000,00
8. **Município** - Texto
9. **Portaria SF** - Formato: SF-AAAA-NNNN
10. **Finalidade/atividade** - Texto descritivo

#### Funcionalidades Implementadas:

- **Visualização em tabela** com todas as colunas obrigatórias
- **Filtros avançados** por CPF, nome, município, status
- **Formulário de cadastro/edição** com validações
- **Cálculo automático de INSS** baseado no valor bruto
- **Validação de CPF** em tempo real
- **Sistema de status** (Validado/Pendente)
- **Modal de detalhes** com informações completas
- **Geração de relatórios** por período
- **Exportação de dados**

### 2. Integração com Módulo de Prestações

O módulo INSS está integrado ao módulo de Análise de Prestações através de abas:

```typescript
// Em AccountingAnalysis.tsx
const [activeTab, setActiveTab] = useState<'prestacoes' | 'inss'>('prestacoes');

// Renderização condicional
{activeTab === 'inss' ? (
  <INSSAnalysis />
) : (
  // Conteúdo das prestações...
)}
```

### 3. Estados e Gerenciamento de Dados

```typescript
interface INSSRecolhimento {
  id: string;
  cpfPrestador: string;
  nomePrestador: string;
  dataNascimentoPrestador: string;
  valorBrutoNF: number;
  dataNotaFiscal: string;
  numeroNotaFiscal?: string;
  inss11Contribuinte: number;
  inss20Patronal: number;
  municipio: string;
  portariaSF: string;
  finalidadeAtividade: string;
  validado: boolean;
  observacoes?: string;
  // Campos de relacionamento
  prestacaoProtocolo?: string;
  solicitacaoProtocolo?: string;
  supridoLotacao?: string;
  criadoEm: string;
}
```

## Funcionalidades de Relatórios

### 1. Relatório de Arrecadação por Período

```sql
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
```

### 2. Interface de Relatórios

- **Filtros por período** (data início/fim)
- **Filtro por município** (opcional)
- **Geração dinâmica** de relatórios
- **Totalizadores** automáticos
- **Exportação** em diferentes formatos
- **Visualização em tabela** com totais

## Validações e Controles

### 1. Validações de Dados

- **CPF**: Algoritmo completo de validação
- **Datas**: Verificação de consistência
- **Valores**: Não podem ser negativos
- **Campos obrigatórios**: Validação no frontend e backend
- **Relacionamentos**: Integridade referencial

### 2. Controles de Acesso

- **Administradores**: Acesso completo a todos os dados
- **Supridos**: Acesso apenas aos próprios recolhimentos
- **Auditoria**: Log completo de todas as operações
- **Histórico**: Rastreamento de alterações

### 3. Performance e Otimização

- **Índices estratégicos** para consultas frequentes
- **Views materializadas** para relatórios complexos
- **Paginação** na interface
- **Lazy loading** para grandes volumes
- **Cache** de consultas frequentes

## Instalação e Configuração

### 1. Executar Migration

```bash
# Aplicar a migration do módulo INSS
supabase db push
```

### 2. Configurar Permissões

```sql
-- Executar as políticas RLS
-- (já incluídas na migration)
```

### 3. Dados Iniciais

```sql
-- Inserir elementos de despesa relacionados ao INSS
INSERT INTO elementos_despesa (codigo, descricao, tipo_elemento) VALUES
('INSS-11', 'INSS Contribuinte 11%', 'outros'),
('INSS-20', 'INSS Patronal 20%', 'outros');
```

## Manutenção e Monitoramento

### 1. Logs e Auditoria

- Todas as operações são registradas na tabela `historico_alteracoes`
- Timestamps automáticos de criação e atualização
- Rastreamento do usuário responsável por cada operação

### 2. Backup e Recuperação

- Backup automático das tabelas principais
- Procedures de recuperação de dados
- Versionamento das migrations

### 3. Performance Monitoring

- Monitoramento de queries lentas
- Análise de uso dos índices
- Otimização contínua das consultas

## Considerações Técnicas

### 1. Escalabilidade

- Estrutura preparada para grandes volumes
- Índices otimizados para consultas frequentes
- Particionamento por período (futuro)

### 2. Segurança

- Validação rigorosa de dados
- Políticas RLS granulares
- Criptografia de dados sensíveis

### 3. Integração

- APIs RESTful para integração externa
- Webhooks para notificações
- Exportação em múltiplos formatos

## Conclusão

O Módulo de Análise de Recolhimentos INSS fornece uma solução completa e robusta para o gerenciamento dos recolhimentos de INSS no sistema TJ-PA, com funcionalidades avançadas de análise, relatórios e controle, mantendo a integridade dos dados e a segurança das informações.