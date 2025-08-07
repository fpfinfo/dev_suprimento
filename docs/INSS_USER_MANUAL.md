# Manual do Usuário - Módulo de Análise de Recolhimentos INSS

## Visão Geral

O Módulo de Análise de Recolhimentos INSS permite gerenciar, analisar e gerar relatórios sobre os recolhimentos de INSS efetuados pelos supridos durante suas prestações de contas.

## Funcionalidades Principais

### 1. Visualização de Recolhimentos

#### Acessando o Módulo
1. Navegue até **SOSFU - Supervisão** > **Análise de Prestações**
2. Clique na aba **"Análise INSS"**
3. A tabela principal exibirá todos os recolhimentos cadastrados

#### Estrutura da Tabela
A tabela apresenta as seguintes colunas na ordem obrigatória:
1. **CPF do prestador** - Documento do prestador de serviços
2. **Nome completo** - Nome completo do prestador
3. **Data de nascimento** - Data de nascimento do prestador
4. **Valor bruto da NF** - Valor total da nota fiscal
5. **Data da NF** - Data de emissão da nota fiscal
6. **INSS 11%** - Valor do INSS contribuinte (11%)
7. **INSS 20%** - Valor do INSS patronal (20%)
8. **Município** - Município de origem
9. **Portaria SF** - Número da portaria do suprimento de fundos
10. **Finalidade** - Descrição da atividade/finalidade

### 2. Filtros e Busca

#### Filtros Disponíveis
- **Busca por texto**: CPF, nome ou município
- **Status**: Todos, Validados, Pendentes
- **Município**: Filtro por município específico

#### Como Usar os Filtros
1. Digite o termo de busca no campo de pesquisa
2. Selecione o status desejado no dropdown
3. Escolha o município específico (opcional)
4. Clique em "Limpar" para resetar todos os filtros

### 3. Gerenciamento de Recolhimentos

#### Cadastrar Novo Recolhimento
1. Clique no botão **"Novo Recolhimento"**
2. Preencha todos os campos obrigatórios:
   - CPF do prestador (será validado automaticamente)
   - Nome completo do prestador
   - Data de nascimento
   - Valor bruto da nota fiscal
   - Data da nota fiscal
   - Município
   - Portaria SF
   - Finalidade/atividade
3. Os valores de INSS (11% e 20%) são calculados automaticamente
4. Marque "Recolhimento validado" se aplicável
5. Clique em **"Salvar Recolhimento"**

#### Editar Recolhimento
1. Clique no ícone de edição (✏️) na linha desejada
2. Modifique os campos necessários
3. Clique em **"Atualizar Recolhimento"**

#### Visualizar Detalhes
1. Clique no ícone de visualização (👁️) na linha desejada
2. Uma janela modal exibirá todos os detalhes do recolhimento
3. Clique em **"Editar Usuário"** para modificar ou **"Fechar"** para sair

#### Excluir Recolhimento
1. Clique no ícone de exclusão (🗑️) na linha desejada
2. Confirme a exclusão na janela de confirmação

### 4. Geração de Relatórios

#### Acessando o Gerador de Relatórios
1. Clique no botão **"Relatório"** no cabeçalho do módulo
2. A janela de configuração do relatório será aberta

#### Configurando o Relatório
1. **Período**: Selecione data de início e fim (obrigatório)
2. **Município**: Escolha um município específico ou "Todos"
3. **Formato**: Selecione PDF ou Excel (CSV)
4. **Inconsistências**: Marque para incluir análise de inconsistências

#### Conteúdo do Relatório
O relatório inclui:
- **Cabeçalho**: Período analisado, município, data de geração
- **Resumo Executivo**: 
  - Total de recolhimentos
  - Valor bruto total
  - INSS 11% total
  - INSS 20% total
  - INSS total arrecadado
  - Recolhimentos validados/pendentes
- **Análise de Inconsistências** (se habilitada):
  - CPFs inválidos
  - Erros de cálculo de INSS
  - Dados inconsistentes
- **Detalhamento**: Lista completa dos recolhimentos no período

#### Gerando o Relatório
1. Configure todos os parâmetros desejados
2. Clique em **"Gerar Relatório"**
3. O arquivo será baixado automaticamente no formato escolhido

### 5. Importação via CSV

#### Acessando a Importação
1. Clique no botão **"Importar CSV"** no cabeçalho do módulo
2. A janela de importação será aberta

#### Preparando o Arquivo CSV
O arquivo deve conter as seguintes colunas na primeira linha (cabeçalho):
```
CPF,Nome,Data Nascimento,Valor Bruto NF,Data NF,INSS 11%,INSS 20%,Município,Portaria SF,Finalidade
```

#### Exemplo de Linha de Dados
```
123.456.789-00,João Silva,15/03/1980,5000.00,10/01/2024,550.00,1000.00,Belém,SF-2024-0001,Consultoria técnica
```

#### Processo de Importação
1. **Seleção do Arquivo**:
   - Clique em "Clique para selecionar arquivo CSV"
   - Escolha o arquivo .csv do seu computador
   - O nome e tamanho do arquivo serão exibidos

2. **Processamento**:
   - Clique em **"Processar Arquivo"**
   - O sistema validará todos os dados
   - Será exibido um resumo com:
     - Total de linhas processadas
     - Linhas válidas
     - Número de erros
     - Número de avisos

3. **Validações Realizadas**:
   - **CPF**: Validação do algoritmo de CPF
   - **Nome**: Mínimo 3 caracteres
   - **Datas**: Formato e validade das datas
   - **Valores**: Números válidos e positivos
   - **INSS**: Verificação dos cálculos (11% e 20%)
   - **Campos obrigatórios**: Presença de todos os dados

4. **Tratamento de Erros**:
   - **Erros**: Impedem a importação da linha
   - **Avisos**: Permitem importação mas indicam possíveis problemas
   - Lista detalhada de todos os problemas encontrados

5. **Aplicação da Importação**:
   - Se não houver erros, clique em **"Aplicar Importação"**
   - Um backup automático será criado antes da atualização
   - Os dados válidos serão inseridos no sistema
   - Um log da operação será registrado

#### Backup Automático
- Antes de cada importação, um backup automático é criado
- O backup preserva o estado atual dos dados
- Em caso de problemas, os dados podem ser restaurados

#### Log de Operações
Cada importação gera um log contendo:
- Data e hora da operação
- Nome do arquivo importado
- Total de linhas processadas
- Linhas válidas importadas
- Número de erros e avisos
- Usuário responsável pela operação

## Validações e Controles

### Validação de CPF
- Algoritmo completo de validação de CPF brasileiro
- Verificação de dígitos verificadores
- Rejeição de sequências inválidas (111.111.111-11, etc.)

### Cálculo Automático de INSS
- INSS 11% = Valor Bruto × 0,11
- INSS 20% = Valor Bruto × 0,20
- Arredondamento para 2 casas decimais
- Recálculo automático ao alterar valor bruto

### Controle de Status
- **Pendente**: Recolhimento não validado
- **Validado**: Recolhimento verificado e aprovado
- Alteração de status através de clique no badge

## Dicas de Uso

### Performance
- Use filtros para trabalhar com subconjuntos de dados
- Relatórios de períodos menores são gerados mais rapidamente
- A busca por texto é otimizada para CPF, nome e município

### Boas Práticas
- Sempre valide os dados antes de marcar como "Validado"
- Use a funcionalidade de relatórios para análises periódicas
- Mantenha backups regulares antes de importações grandes
- Verifique inconsistências nos relatórios regularmente

### Solução de Problemas
- **CPF inválido**: Verifique a formatação (000.000.000-00)
- **Erro de cálculo**: Confirme se os valores de INSS estão corretos
- **Importação falha**: Verifique o formato do CSV e dados obrigatórios
- **Relatório vazio**: Confirme se há dados no período selecionado

## Suporte Técnico

Para dúvidas ou problemas técnicos:
1. Verifique este manual primeiro
2. Consulte a documentação técnica
3. Entre em contato com o suporte do sistema
4. Relate bugs ou sugestões através dos canais oficiais

---

**Versão do Manual**: 1.0  
**Última Atualização**: Janeiro 2024  
**Sistema**: Portal TJ-PA - Módulo INSS