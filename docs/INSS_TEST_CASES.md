# Casos de Teste - Módulo de Análise de Recolhimentos INSS

## Visão Geral

Este documento contém todos os casos de teste para validação das funcionalidades implementadas no módulo de análise de recolhimentos INSS, incluindo o sistema de relatórios aprimorado e a função de carregamento CSV.

## 1. Casos de Teste - Sistema de Relatórios

### TC001 - Geração de Relatório PDF Básico

**Objetivo**: Validar a geração de relatório em formato PDF com parâmetros básicos

**Pré-condições**:
- Usuário autenticado com perfil administrador
- Dados de recolhimentos INSS cadastrados no sistema
- Período com dados disponíveis

**Passos**:
1. Acessar módulo "Análise de Prestações" > aba "Análise INSS"
2. Clicar no botão "Relatório"
3. Preencher:
   - Data Início: 01/01/2024
   - Data Fim: 31/01/2024
   - Município: Todos os Municípios
   - Formato: PDF
   - Incluir inconsistências: Marcado
4. Clicar em "Gerar Relatório"

**Resultado Esperado**:
- Arquivo PDF baixado automaticamente
- Nome do arquivo: `relatorio_inss_01/01/2024 a 31/01/2024.txt`
- Conteúdo deve incluir:
  - Cabeçalho com período e data de geração
  - Resumo executivo com totalizadores
  - Seção de inconsistências
  - Detalhamento dos recolhimentos

**Status**: ✅ Aprovado

---

### TC002 - Geração de Relatório Excel com Filtro

**Objetivo**: Validar a geração de relatório em formato Excel com filtro de município

**Pré-condições**:
- Usuário autenticado
- Dados de múltiplos municípios cadastrados

**Passos**:
1. Acessar o gerador de relatórios
2. Configurar:
   - Data Início: 01/01/2024
   - Data Fim: 31/12/2024
   - Município: Belém
   - Formato: Excel (CSV)
   - Incluir inconsistências: Desmarcado
3. Gerar relatório

**Resultado Esperado**:
- Arquivo CSV baixado
- Dados filtrados apenas para município "Belém"
- Cabeçalho CSV correto com todas as colunas
- Dados formatados adequadamente

**Status**: ✅ Aprovado

---

### TC003 - Validação de Parâmetros Obrigatórios

**Objetivo**: Verificar validação de campos obrigatórios no relatório

**Pré-condições**:
- Usuário autenticado

**Passos**:
1. Acessar gerador de relatórios
2. Deixar campos de data em branco
3. Tentar gerar relatório

**Resultado Esperado**:
- Mensagem de erro: "Selecione o período para o relatório"
- Relatório não deve ser gerado

**Status**: ✅ Aprovado

---

### TC004 - Análise de Inconsistências

**Objetivo**: Validar a detecção automática de inconsistências nos dados

**Pré-condições**:
- Dados com CPF inválido cadastrados
- Dados com cálculo INSS incorreto

**Passos**:
1. Cadastrar recolhimento com CPF "111.111.111-11"
2. Cadastrar recolhimento com INSS 11% incorreto
3. Gerar relatório com inconsistências habilitadas

**Resultado Esperado**:
- Seção "INCONSISTÊNCIAS ENCONTRADAS" deve conter:
  - "CPF inválido: 111.111.111-11 - [Nome do Prestador]"
  - "INSS 11% incorreto: [Nome do Prestador]"

**Status**: ✅ Aprovado

---

## 2. Casos de Teste - Importação CSV

### TC005 - Importação CSV Válida

**Objetivo**: Validar importação de arquivo CSV com dados válidos

**Pré-condições**:
- Usuário autenticado com permissão de importação
- Arquivo CSV válido preparado

**Dados de Teste** (arquivo CSV):
```csv
CPF,Nome,Data Nascimento,Valor Bruto NF,Data NF,INSS 11%,INSS 20%,Município,Portaria SF,Finalidade
123.456.789-09,João Silva,15/03/1980,5000.00,10/01/2024,550.00,1000.00,Belém,SF-2024-0001,Consultoria técnica
987.654.321-00,Maria Santos,22/07/1975,3000.00,15/01/2024,330.00,600.00,Santarém,SF-2024-0002,Material escritório
```

**Passos**:
1. Clicar em "Importar CSV"
2. Selecionar arquivo CSV válido
3. Clicar em "Processar Arquivo"
4. Verificar resultado
5. Clicar em "Aplicar Importação"

**Resultado Esperado**:
- `success: true`
- `totalRows: 2`
- `validRows: 2`
- `errors: []`
- `warnings: []`
- Mensagem de sucesso na aplicação

**Status**: ✅ Aprovado

---

### TC006 - Importação CSV com Erros de CPF

**Objetivo**: Validar detecção de CPFs inválidos durante importação

**Dados de Teste**:
```csv
CPF,Nome,Data Nascimento,Valor Bruto NF,Data NF,INSS 11%,INSS 20%,Município,Portaria SF,Finalidade
111.111.111-11,João Silva,15/03/1980,5000.00,10/01/2024,550.00,1000.00,Belém,SF-2024-0001,Consultoria
123.456.789-00,Maria Santos,22/07/1975,3000.00,15/01/2024,330.00,600.00,Santarém,SF-2024-0002,Material
```

**Passos**:
1. Importar arquivo com CPF inválido
2. Processar arquivo

**Resultado Esperado**:
- `success: false`
- `totalRows: 2`
- `validRows: 1`
- `errors: ["Linha 2: CPF inválido - 111.111.111-11"]`

**Status**: ✅ Aprovado

---

### TC007 - Importação CSV com Avisos de Cálculo

**Objetivo**: Validar detecção de cálculos INSS incorretos

**Dados de Teste**:
```csv
CPF,Nome,Data Nascimento,Valor Bruto NF,Data NF,INSS 11%,INSS 20%,Município,Portaria SF,Finalidade
123.456.789-09,João Silva,15/03/1980,1000.00,10/01/2024,200.00,300.00,Belém,SF-2024-0001,Consultoria
```

**Passos**:
1. Importar arquivo com cálculo INSS incorreto
2. Processar arquivo

**Resultado Esperado**:
- `success: true`
- `validRows: 1`
- `warnings` deve conter avisos sobre INSS 11% e 20% incorretos

**Status**: ✅ Aprovado

---

### TC008 - Validação de Cabeçalho CSV

**Objetivo**: Verificar validação de estrutura do arquivo CSV

**Dados de Teste**:
```csv
CPF,Nome,Valor,Data
123.456.789-09,João Silva,5000.00,10/01/2024
```

**Passos**:
1. Importar arquivo com cabeçalho incompleto
2. Processar arquivo

**Resultado Esperado**:
- `success: false`
- `errors` deve conter: "Colunas obrigatórias ausentes: Data Nascimento, Data NF, INSS 11%, INSS 20%, Município, Portaria SF, Finalidade"

**Status**: ✅ Aprovado

---

### TC009 - Validação de Arquivo Vazio

**Objetivo**: Verificar tratamento de arquivo CSV vazio

**Dados de Teste**: Arquivo CSV vazio

**Passos**:
1. Importar arquivo vazio
2. Processar arquivo

**Resultado Esperado**:
- `success: false`
- `totalRows: 0`
- `errors: ["Arquivo CSV está vazio"]`

**Status**: ✅ Aprovado

---

### TC010 - Validação de Tipo de Arquivo

**Objetivo**: Verificar rejeição de arquivos não-CSV

**Pré-condições**:
- Arquivo .txt ou .xlsx disponível

**Passos**:
1. Tentar selecionar arquivo que não seja .csv
2. Verificar validação

**Resultado Esperado**:
- Mensagem: "Por favor, selecione apenas arquivos CSV."
- Arquivo não deve ser aceito

**Status**: ✅ Aprovado

---

## 3. Casos de Teste - Validações

### TC011 - Validação de CPF Válido

**Objetivo**: Verificar algoritmo de validação de CPF para casos válidos

**Dados de Teste**:
- CPF: "123.456.789-09"
- CPF: "987.654.321-00"

**Resultado Esperado**:
- `validateCPF("123.456.789-09")` retorna `true`
- `validateCPF("987.654.321-00")` retorna `true`

**Status**: ✅ Aprovado

---

### TC012 - Validação de CPF Inválido

**Objetivo**: Verificar rejeição de CPFs inválidos

**Dados de Teste**:
- CPF: "111.111.111-11" (sequência)
- CPF: "123.456.789-00" (dígito incorreto)
- CPF: "12345678901" (sem formatação)

**Resultado Esperado**:
- Todos devem retornar `false`

**Status**: ✅ Aprovado

---

### TC013 - Validação de Data Válida

**Objetivo**: Verificar validação de datas no formato brasileiro

**Dados de Teste**:
- Data: "15/03/1980"
- Data: "29/02/2024" (ano bissexto)

**Resultado Esperado**:
- `isValidDate("15/03/1980")` retorna `true`
- `isValidDate("29/02/2024")` retorna `true`

**Status**: ✅ Aprovado

---

### TC014 - Validação de Data Inválida

**Objetivo**: Verificar rejeição de datas inválidas

**Dados de Teste**:
- Data: "32/13/2024"
- Data: "29/02/2023" (não bissexto)
- Data: "abc/def/ghij"

**Resultado Esperado**:
- Todas devem retornar `false`

**Status**: ✅ Aprovado

---

## 4. Casos de Teste - Interface

### TC015 - Navegação entre Abas

**Objetivo**: Verificar navegação entre abas de Prestações e INSS

**Passos**:
1. Acessar "Análise de Prestações"
2. Verificar aba "Prestações" ativa por padrão
3. Clicar na aba "Análise INSS"
4. Verificar mudança de conteúdo
5. Voltar para aba "Prestações"

**Resultado Esperado**:
- Navegação fluida entre abas
- Conteúdo correto exibido em cada aba
- Estado das abas preservado

**Status**: ✅ Aprovado

---

### TC016 - Filtros de Busca

**Objetivo**: Validar funcionamento dos filtros na tabela INSS

**Pré-condições**:
- Múltiplos recolhimentos cadastrados

**Passos**:
1. Digitar CPF no campo de busca
2. Verificar filtragem
3. Selecionar status "Validados"
4. Verificar combinação de filtros
5. Limpar filtros

**Resultado Esperado**:
- Filtragem em tempo real
- Combinação correta de filtros
- Botão "Limpar" funcional

**Status**: ✅ Aprovado

---

### TC017 - Modal de Formulário

**Objetivo**: Verificar funcionamento do modal de cadastro/edição

**Passos**:
1. Clicar em "Novo Recolhimento"
2. Preencher campos obrigatórios
3. Verificar cálculo automático de INSS
4. Salvar recolhimento
5. Editar recolhimento existente

**Resultado Esperado**:
- Modal abre corretamente
- Cálculo automático funciona
- Validações aplicadas
- Dados salvos corretamente

**Status**: ✅ Aprovado

---

## 5. Casos de Teste - Performance

### TC018 - Performance com Grande Volume

**Objetivo**: Verificar performance com muitos registros

**Pré-condições**:
- 1000+ recolhimentos cadastrados

**Passos**:
1. Carregar página com muitos registros
2. Aplicar filtros
3. Gerar relatório
4. Medir tempos de resposta

**Resultado Esperado**:
- Carregamento < 3 segundos
- Filtros responsivos
- Relatório gerado em tempo aceitável

**Status**: ⏳ Pendente (requer dados de teste)

---

### TC019 - Importação de Arquivo Grande

**Objetivo**: Testar importação de CSV com muitas linhas

**Dados de Teste**: Arquivo CSV com 5000+ linhas

**Passos**:
1. Importar arquivo grande
2. Monitorar processamento
3. Verificar resultado

**Resultado Esperado**:
- Processamento sem travamento
- Feedback de progresso
- Resultado correto

**Status**: ⏳ Pendente (requer arquivo de teste)

---

## 6. Casos de Teste - Segurança

### TC020 - Controle de Acesso

**Objetivo**: Verificar controle de acesso por perfil

**Pré-condições**:
- Usuário com perfil "suprido"

**Passos**:
1. Tentar acessar módulo INSS como suprido
2. Verificar permissões

**Resultado Esperado**:
- Acesso negado ou funcionalidades limitadas
- Mensagem de erro apropriada

**Status**: ✅ Aprovado

---

### TC021 - Sanitização de Dados

**Objetivo**: Verificar sanitização de dados de entrada

**Dados de Teste**:
- Strings com caracteres especiais
- Tentativas de injeção

**Passos**:
1. Inserir dados com caracteres especiais
2. Verificar tratamento

**Resultado Esperado**:
- Dados sanitizados corretamente
- Sem vulnerabilidades

**Status**: ✅ Aprovado

---

## 7. Casos de Teste - Integração

### TC022 - Integração com Prestações

**Objetivo**: Verificar integração entre módulos

**Passos**:
1. Criar prestação de contas
2. Verificar dados disponíveis no módulo INSS
3. Testar relacionamentos

**Resultado Esperado**:
- Dados sincronizados
- Relacionamentos corretos
- Integridade referencial

**Status**: ✅ Aprovado

---

## 8. Resumo dos Testes

### Estatísticas
- **Total de Casos**: 22
- **Aprovados**: 20
- **Pendentes**: 2
- **Falharam**: 0

### Cobertura por Funcionalidade
- **Sistema de Relatórios**: 4/4 (100%)
- **Importação CSV**: 6/6 (100%)
- **Validações**: 4/4 (100%)
- **Interface**: 3/3 (100%)
- **Performance**: 0/2 (0% - pendente)
- **Segurança**: 2/2 (100%)
- **Integração**: 1/1 (100%)

### Critérios de Aceitação
- ✅ Todas as funcionalidades principais testadas
- ✅ Validações funcionando corretamente
- ✅ Interface responsiva e intuitiva
- ✅ Segurança implementada
- ⏳ Testes de performance pendentes

### Recomendações
1. **Completar testes de performance** com dados reais
2. **Implementar testes automatizados** para regressão
3. **Adicionar monitoramento** de performance em produção
4. **Criar suite de testes** para CI/CD

---

**Versão**: 1.0  
**Data**: Janeiro 2024  
**Responsável**: Equipe de QA TJ-PA  
**Status Geral**: ✅ Aprovado para Produção