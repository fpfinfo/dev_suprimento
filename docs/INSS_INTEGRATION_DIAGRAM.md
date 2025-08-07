# Diagrama de Integração - Módulo INSS

## Fluxo de Dados Entre Módulos

```mermaid
graph TD
    A[Usuário Suprido] --> B[Solicitação de Suprimento]
    B --> C[Análise SOSFU]
    C --> D[Aprovação/Portaria]
    D --> E[Prestação de Contas]
    E --> F[Análise de Prestação]
    F --> G[Módulo INSS]
    
    G --> H[Consolidação INSS]
    H --> I[Relatórios de Arrecadação]
    
    subgraph "Base de Dados"
        J[perfis_usuario]
        K[solicitacoes_suprimento]
        L[prestacoes_contas]
        M[recolhimentos_inss]
    end
    
    B --> K
    E --> L
    G --> M
    
    J --> M
    K --> M
    L --> M
```

## Relacionamentos de Entidades

```mermaid
erDiagram
    perfis_usuario ||--o{ solicitacoes_suprimento : "solicita"
    perfis_usuario ||--o{ prestacoes_contas : "presta_contas"
    perfis_usuario ||--o{ recolhimentos_inss : "recolhe_inss"
    
    solicitacoes_suprimento ||--o{ prestacoes_contas : "gera"
    solicitacoes_suprimento ||--o{ recolhimentos_inss : "origina"
    
    prestacoes_contas ||--o{ recolhimentos_inss : "consolida"
    
    recolhimentos_inss ||--o{ documentos_inss : "anexa"
    
    perfis_usuario {
        uuid id PK
        text nome_completo
        text cpf
        text email
        tipo_perfil tipo_perfil
        text lotacao
        text cargo
    }
    
    solicitacoes_suprimento {
        uuid id PK
        uuid solicitante_id FK
        text numero_protocolo
        decimal valor_total
        text justificativa
        status_geral status
        text numero_portaria
    }
    
    prestacoes_contas {
        uuid id PK
        uuid solicitacao_suprimento_id FK
        uuid suprido_id FK
        text numero_protocolo
        decimal valor_total_utilizado
        status_geral status
    }
    
    recolhimentos_inss {
        uuid id PK
        uuid prestacao_contas_id FK
        uuid solicitacao_suprimento_id FK
        uuid suprido_id FK
        text cpf_prestador
        text nome_prestador
        date data_nascimento_prestador
        decimal valor_bruto_nf
        date data_nota_fiscal
        decimal inss_11_contribuinte
        decimal inss_20_patronal
        text municipio
        text portaria_sf
        text finalidade_atividade
        boolean validado
    }
    
    documentos_inss {
        uuid id PK
        uuid recolhimento_inss_id FK
        text nome_arquivo
        text tipo_documento
        text caminho_arquivo
    }
```

## Fluxo de Importação de Dados

```mermaid
sequenceDiagram
    participant U as Usuário
    participant P as Prestação de Contas
    participant I as Módulo INSS
    participant DB as Base de Dados
    
    U->>P: Submete Prestação
    P->>DB: Salva dados da prestação
    
    Note over I: Importação Automática
    I->>DB: Busca dados da prestação
    I->>DB: Busca dados do suprido
    I->>DB: Busca dados da solicitação
    
    I->>I: Calcula INSS (11% e 20%)
    I->>DB: Cria registro INSS base
    
    Note over U: Complementação Manual
    U->>I: Acessa módulo INSS
    U->>I: Complementa dados obrigatórios
    U->>I: Valida recolhimento
    
    I->>DB: Atualiza registro completo
```

## Estrutura de Componentes React

```mermaid
graph TD
    A[AccountingAnalysis] --> B[Tab: Prestações]
    A --> C[Tab: INSS]
    
    C --> D[INSSAnalysis]
    
    D --> E[Header com Stats]
    D --> F[Filtros de Busca]
    D --> G[Tabela de Recolhimentos]
    D --> H[Modal de Detalhes]
    D --> I[Modal de Formulário]
    D --> J[Modal de Relatórios]
    
    G --> K[Linha de Recolhimento]
    K --> L[Ações: Ver/Editar/Excluir]
    
    J --> M[Filtros de Período]
    J --> N[Tabela de Resultados]
    J --> O[Botão Exportar]
```

## APIs e Endpoints

```mermaid
graph LR
    A[Frontend] --> B[API Gateway]
    
    B --> C[GET /recolhimentos-inss]
    B --> D[POST /recolhimentos-inss]
    B --> E[PUT /recolhimentos-inss/:id]
    B --> F[DELETE /recolhimentos-inss/:id]
    B --> G[POST /relatorio-inss]
    B --> H[POST /importar-prestacao/:id]
    
    C --> I[Supabase RLS]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    
    I --> J[PostgreSQL]
```

## Fluxo de Validação

```mermaid
flowchart TD
    A[Dados do Formulário] --> B{CPF Válido?}
    B -->|Não| C[Erro: CPF Inválido]
    B -->|Sim| D{Campos Obrigatórios?}
    
    D -->|Não| E[Erro: Campos Obrigatórios]
    D -->|Sim| F{Valores Positivos?}
    
    F -->|Não| G[Erro: Valores Inválidos]
    F -->|Sim| H{Data Nascimento Válida?}
    
    H -->|Não| I[Erro: Data Inválida]
    H -->|Sim| J[Validação OK]
    
    J --> K[Salvar no Banco]
    K --> L[Trigger de Auditoria]
    L --> M[Registro Salvo]
```

## Segurança e Permissões

```mermaid
graph TD
    A[Usuário Autenticado] --> B{Tipo de Perfil?}
    
    B -->|Administrador| C[Acesso Total]
    B -->|Suprido| D[Acesso Limitado]
    
    C --> E[Ver Todos os Recolhimentos]
    C --> F[Editar Qualquer Registro]
    C --> G[Gerar Relatórios Completos]
    C --> H[Gerenciar Validações]
    
    D --> I[Ver Próprios Recolhimentos]
    D --> J[Editar Próprios Dados]
    D --> K[Relatórios Pessoais]
    
    E --> L[RLS Policy: Admin]
    I --> M[RLS Policy: Suprido]
    
    L --> N[PostgreSQL]
    M --> N
```

## Processo de Geração de Relatórios

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant A as API
    participant DB as Database
    participant R as Relatório
    
    U->>F: Seleciona período
    U->>F: Escolhe município (opcional)
    U->>F: Clica "Gerar Relatório"
    
    F->>A: POST /relatorio-inss
    A->>DB: CALL relatorio_arrecadacao_inss()
    
    DB->>DB: Executa query agregada
    DB->>A: Retorna dados consolidados
    
    A->>F: JSON com resultados
    F->>R: Renderiza tabela
    
    U->>F: Clica "Exportar"
    F->>F: Gera arquivo (CSV/Excel)
    F->>U: Download do arquivo
```

## Monitoramento e Logs

```mermaid
graph TD
    A[Operação CRUD] --> B[Trigger de Auditoria]
    B --> C[historico_alteracoes]
    
    C --> D[Log Entry]
    D --> E[Timestamp]
    D --> F[Usuário]
    D --> G[Ação]
    D --> H[Dados Anteriores]
    D --> I[Dados Novos]
    
    J[Sistema de Monitoramento] --> K[Query Performance]
    J --> L[Uso de Índices]
    J --> M[Volume de Dados]
    
    N[Alertas] --> O[Queries Lentas]
    N --> P[Erros de Validação]
    N --> Q[Falhas de Importação]
```

Este diagrama de integração mostra como o módulo INSS se conecta com os demais componentes do sistema, garantindo a integridade dos dados e o fluxo correto de informações entre os módulos.