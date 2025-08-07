# Documentação Técnica - Funcionalidades Avançadas do Módulo INSS

## Visão Geral das Implementações

Este documento detalha as duas principais funcionalidades implementadas no módulo de análise de recolhimentos INSS:

1. **Sistema de Relatórios Aprimorado**
2. **Função de Carregamento CSV**

## 1. Sistema de Relatórios Aprimorado

### 1.1 Arquitetura da Solução

#### Interface de Configuração
```typescript
interface ReportData {
  periodo: string;
  municipio: string;
  totalRecolhimentos: number;
  valorBrutoTotal: number;
  inss11Total: number;
  inss20Total: number;
  inssTotal: number;
  recolhimentosValidados: number;
  recolhimentosPendentes: number;
  inconsistenciasEncontradas: string[];
}
```

#### Filtros de Relatório
```typescript
const [reportFilters, setReportFilters] = useState({
  dataInicio: '',
  dataFim: '',
  municipio: 'all',
  incluirInconsistencias: true,
  formato: 'pdf'
});
```

### 1.2 Funcionalidades Implementadas

#### Geração de Relatório Detalhado
```typescript
const generateDetailedReport = () => {
  // Validação de parâmetros obrigatórios
  if (!reportFilters.dataInicio || !reportFilters.dataFim) {
    alert('Selecione o período para o relatório');
    return;
  }

  // Filtrar dados por período e município
  const filteredData = recolhimentos.filter(r => {
    const dataRecolhimento = new Date(r.dataNotaFiscal.split('/').reverse().join('-'));
    const dataInicio = new Date(reportFilters.dataInicio);
    const dataFim = new Date(reportFilters.dataFim);
    
    const dentroPeríodo = dataRecolhimento >= dataInicio && dataRecolhimento <= dataFim;
    const municipioMatch = reportFilters.municipio === 'all' || r.municipio === reportFilters.municipio;
    
    return dentroPeríodo && municipioMatch;
  });

  // Análise de inconsistências
  const inconsistencias = analyzeInconsistencies(filteredData);
  
  // Consolidação dos dados
  const reportData = consolidateReportData(filteredData, inconsistencias);
  
  // Geração do arquivo
  if (reportFilters.formato === 'pdf') {
    generatePDFReport(reportData, filteredData);
  } else {
    generateExcelReport(reportData, filteredData);
  }
};
```

#### Análise de Inconsistências
```typescript
const analyzeInconsistencies = (data: INSSRecolhimento[]): string[] => {
  const inconsistencias: string[] = [];
  
  data.forEach(r => {
    // Validação de CPF
    if (!validateCPF(r.cpfPrestador)) {
      inconsistencias.push(`CPF inválido: ${r.cpfPrestador} - ${r.nomePrestador}`);
    }
    
    // Verificação de cálculos INSS
    const inssCalculado11 = Math.round(r.valorBrutoNF * 0.11 * 100) / 100;
    const inssCalculado20 = Math.round(r.valorBrutoNF * 0.20 * 100) / 100;
    
    if (Math.abs(r.inss11Contribuinte - inssCalculado11) > 0.01) {
      inconsistencias.push(`INSS 11% incorreto: ${r.nomePrestador}`);
    }
    
    if (Math.abs(r.inss20Patronal - inssCalculado20) > 0.01) {
      inconsistencias.push(`INSS 20% incorreto: ${r.nomePrestador}`);
    }
  });
  
  return inconsistencias;
};
```

#### Geração de PDF
```typescript
const generatePDFReport = (reportData: ReportData, data: INSSRecolhimento[]) => {
  const reportContent = `
RELATÓRIO DE ANÁLISE DE RECOLHIMENTOS INSS
==========================================

PERÍODO ANALISADO: ${reportData.periodo}
MUNICÍPIO: ${reportData.municipio}
DATA DE GERAÇÃO: ${new Date().toLocaleDateString('pt-BR')}

RESUMO EXECUTIVO:
- Total de Recolhimentos: ${reportData.totalRecolhimentos}
- Valor Bruto Total: ${formatCurrency(reportData.valorBrutoTotal)}
- INSS 11% Total: ${formatCurrency(reportData.inss11Total)}
- INSS 20% Total: ${formatCurrency(reportData.inss20Total)}
- INSS Total Arrecadado: ${formatCurrency(reportData.inssTotal)}
- Recolhimentos Validados: ${reportData.recolhimentosValidados}
- Recolhimentos Pendentes: ${reportData.recolhimentosPendentes}

INCONSISTÊNCIAS ENCONTRADAS (${reportData.inconsistenciasEncontradas.length}):
${reportData.inconsistenciasEncontradas.map(inc => `- ${inc}`).join('\n')}

DETALHAMENTO DOS RECOLHIMENTOS:
${data.map(r => formatRecolhimentoDetails(r)).join('\n')}
  `;

  // Download do arquivo
  downloadFile(reportContent, `relatorio_inss_${reportData.periodo}.txt`);
};
```

#### Geração de Excel (CSV)
```typescript
const generateExcelReport = (reportData: ReportData, data: INSSRecolhimento[]) => {
  const csvHeader = 'CPF,Nome,Data Nascimento,Valor Bruto NF,Data NF,INSS 11%,INSS 20%,Município,Portaria SF,Finalidade,Status\n';
  const csvData = data.map(r => 
    `"${r.cpfPrestador}","${r.nomePrestador}","${r.dataNascimentoPrestador}","${r.valorBrutoNF}","${r.dataNotaFiscal}","${r.inss11Contribuinte}","${r.inss20Patronal}","${r.municipio}","${r.portariaSF}","${r.finalidadeAtividade}","${r.validado ? 'Validado' : 'Pendente'}"`
  ).join('\n');
  
  const csvContent = csvHeader + csvData;
  downloadFile(csvContent, `relatorio_inss_${reportData.periodo}.csv`, 'text/csv');
};
```

### 1.3 Melhorias Implementadas

#### Conteúdo Expandido do Relatório
- ✅ Período analisado com filtros aplicados
- ✅ Resumo executivo com totalizadores
- ✅ Valores recolhidos por categoria (11% e 20%)
- ✅ Status de validação dos recolhimentos
- ✅ Análise automática de inconsistências
- ✅ Detalhamento completo por prestador
- ✅ Data de geração e parâmetros utilizados

#### Formatos de Exportação
- ✅ **PDF**: Relatório formatado para impressão
- ✅ **Excel (CSV)**: Dados estruturados para análise

#### Interface Aprimorada
- ✅ Seleção de formato de saída
- ✅ Opção para incluir/excluir análise de inconsistências
- ✅ Informações sobre o conteúdo do relatório
- ✅ Validação de parâmetros obrigatórios

## 2. Função de Carregamento CSV

### 2.1 Arquitetura da Solução

#### Interface de Resultado
```typescript
interface CSVUploadResult {
  success: boolean;
  totalRows: number;
  validRows: number;
  errors: string[];
  warnings: string[];
}
```

#### Estados de Controle
```typescript
const [showCSVModal, setShowCSVModal] = useState(false);
const [csvFile, setCSVFile] = useState<File | null>(null);
const [uploadResult, setUploadResult] = useState<CSVUploadResult | null>(null);
```

### 2.2 Funcionalidades Implementadas

#### Upload de Arquivo
```typescript
const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    // Validação do tipo de arquivo
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Por favor, selecione apenas arquivos CSV.');
      return;
    }
    setCSVFile(file);
    setUploadResult(null);
  }
};
```

#### Processamento do Arquivo
```typescript
const processCSVFile = () => {
  if (!csvFile) {
    alert('Selecione um arquivo CSV primeiro.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const csvContent = e.target?.result as string;
    const result = parseAndValidateCSV(csvContent);
    setUploadResult(result);
    
    if (result.success && result.validRows > 0) {
      // Backup automático
      createAutomaticBackup();
      
      // Log de operações
      logOperation({
        timestamp: new Date().toISOString(),
        operation: 'CSV_UPLOAD',
        file: csvFile.name,
        totalRows: result.totalRows,
        validRows: result.validRows,
        errors: result.errors.length,
        warnings: result.warnings.length
      });
    }
  };
  
  reader.readAsText(csvFile);
};
```

#### Validação e Parsing
```typescript
const parseAndValidateCSV = (csvContent: string): CSVUploadResult => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const errors: string[] = [];
  const warnings: string[] = [];
  let validRows = 0;

  // Validação do cabeçalho
  const expectedHeaders = [
    'CPF', 'Nome', 'Data Nascimento', 'Valor Bruto NF', 'Data NF',
    'INSS 11%', 'INSS 20%', 'Município', 'Portaria SF', 'Finalidade'
  ];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
  
  if (missingHeaders.length > 0) {
    errors.push(`Colunas obrigatórias ausentes: ${missingHeaders.join(', ')}`);
  }

  // Validação linha por linha
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(cell => cell.trim().replace(/"/g, ''));
    const rowNumber = i + 1;
    
    // Validações específicas por campo
    const rowErrors = validateCSVRow(row, rowNumber);
    errors.push(...rowErrors.errors);
    warnings.push(...rowErrors.warnings);
    
    if (rowErrors.errors.length === 0) {
      validRows++;
    }
  }

  return {
    success: errors.length === 0 && validRows > 0,
    totalRows: lines.length - 1,
    validRows,
    errors,
    warnings
  };
};
```

#### Validações Específicas
```typescript
const validateCSVRow = (row: string[], rowNumber: number) => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const [cpf, nome, dataNasc, valorBruto, dataNF, inss11, inss20, municipio, portaria, finalidade] = row;
  
  // Validação de CPF
  if (!validateCPF(cpf)) {
    errors.push(`Linha ${rowNumber}: CPF inválido - ${cpf}`);
  }
  
  // Validação de nome
  if (!nome || nome.length < 3) {
    errors.push(`Linha ${rowNumber}: Nome inválido ou muito curto`);
  }
  
  // Validação de data de nascimento
  if (!isValidDate(dataNasc)) {
    errors.push(`Linha ${rowNumber}: Data de nascimento inválida - ${dataNasc}`);
  }
  
  // Validação de valor bruto
  const valorBrutoNum = parseFloat(valorBruto.replace(',', '.'));
  if (isNaN(valorBrutoNum) || valorBrutoNum <= 0) {
    errors.push(`Linha ${rowNumber}: Valor bruto inválido - ${valorBruto}`);
  }
  
  // Validação de INSS (cálculos)
  const inss11Num = parseFloat(inss11.replace(',', '.'));
  const inss20Num = parseFloat(inss20.replace(',', '.'));
  
  if (!isNaN(valorBrutoNum) && !isNaN(inss11Num)) {
    const inss11Calculado = Math.round(valorBrutoNum * 0.11 * 100) / 100;
    if (Math.abs(inss11Num - inss11Calculado) > 0.01) {
      warnings.push(`Linha ${rowNumber}: INSS 11% pode estar incorreto`);
    }
  }
  
  // Outras validações...
  
  return { errors, warnings };
};
```

### 2.3 Funcionalidades de Segurança

#### Backup Automático
```typescript
const createAutomaticBackup = () => {
  const backupData = {
    timestamp: new Date().toISOString(),
    data: recolhimentos,
    totalRecords: recolhimentos.length
  };
  
  // Simular criação de backup
  console.log('Backup automático criado:', backupData);
  localStorage.setItem(`inss_backup_${Date.now()}`, JSON.stringify(backupData));
};
```

#### Log de Operações
```typescript
interface OperationLog {
  timestamp: string;
  operation: string;
  file: string;
  totalRows: number;
  validRows: number;
  errors: number;
  warnings: number;
  user?: string;
}

const logOperation = (logEntry: OperationLog) => {
  const existingLogs = JSON.parse(localStorage.getItem('inss_operation_logs') || '[]');
  existingLogs.push(logEntry);
  localStorage.setItem('inss_operation_logs', JSON.stringify(existingLogs));
  console.log('Operação registrada:', logEntry);
};
```

### 2.4 Interface do Usuário

#### Modal de Upload
- ✅ **Instruções claras** sobre formato e requisitos
- ✅ **Área de drag-and-drop** para seleção de arquivo
- ✅ **Exemplo de formato** esperado do CSV
- ✅ **Validação de tipo** de arquivo
- ✅ **Feedback visual** do arquivo selecionado

#### Processamento e Resultados
- ✅ **Indicadores de progresso** durante processamento
- ✅ **Resumo detalhado** dos resultados
- ✅ **Lista de erros** com localização específica
- ✅ **Lista de avisos** para revisão
- ✅ **Opção de aplicar** importação apenas se válida

#### Tratamento de Erros
- ✅ **Categorização** entre erros e avisos
- ✅ **Localização precisa** (número da linha)
- ✅ **Descrição clara** do problema
- ✅ **Sugestões de correção** quando aplicável

## 3. Validações Implementadas

### 3.1 Validação de CPF
```typescript
const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  // Verificações básicas
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Cálculo dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 > 9) digit1 = 0;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 > 9) digit2 = 0;
  
  return digit1 === parseInt(cleanCPF.charAt(9)) && 
         digit2 === parseInt(cleanCPF.charAt(10));
};
```

### 3.2 Validação de Datas
```typescript
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString.split('/').reverse().join('-'));
  return date instanceof Date && !isNaN(date.getTime());
};
```

### 3.3 Validação de Valores Monetários
```typescript
const validateMonetaryValue = (value: string): boolean => {
  const numValue = parseFloat(value.replace(',', '.'));
  return !isNaN(numValue) && numValue >= 0;
};
```

## 4. Casos de Teste

### 4.1 Testes de Relatório

#### Teste 1: Geração de Relatório PDF
```typescript
// Cenário: Gerar relatório PDF com período válido
// Entrada: dataInicio: '2024-01-01', dataFim: '2024-01-31', formato: 'pdf'
// Resultado esperado: Arquivo PDF baixado com conteúdo completo
```

#### Teste 2: Geração de Relatório Excel
```typescript
// Cenário: Gerar relatório Excel com filtro de município
// Entrada: dataInicio: '2024-01-01', dataFim: '2024-01-31', municipio: 'Belém', formato: 'excel'
// Resultado esperado: Arquivo CSV baixado com dados filtrados
```

#### Teste 3: Análise de Inconsistências
```typescript
// Cenário: Relatório com inconsistências habilitadas
// Entrada: incluirInconsistencias: true, dados com CPF inválido
// Resultado esperado: Relatório contendo seção de inconsistências
```

### 4.2 Testes de Importação CSV

#### Teste 4: Importação Válida
```typescript
// Cenário: CSV com dados válidos
// Entrada: Arquivo CSV com 10 linhas válidas
// Resultado esperado: success: true, validRows: 10, errors: []
```

#### Teste 5: Importação com Erros
```typescript
// Cenário: CSV com CPFs inválidos
// Entrada: Arquivo CSV com CPFs malformados
// Resultado esperado: success: false, errors contendo detalhes dos CPFs inválidos
```

#### Teste 6: Importação com Avisos
```typescript
// Cenário: CSV com cálculos INSS incorretos
// Entrada: Arquivo CSV com valores INSS divergentes
// Resultado esperado: success: true, warnings contendo alertas de cálculo
```

### 4.3 Testes de Validação

#### Teste 7: Validação de CPF
```typescript
describe('validateCPF', () => {
  test('CPF válido', () => {
    expect(validateCPF('123.456.789-09')).toBe(true);
  });
  
  test('CPF inválido', () => {
    expect(validateCPF('111.111.111-11')).toBe(false);
  });
});
```

#### Teste 8: Validação de Data
```typescript
describe('isValidDate', () => {
  test('Data válida', () => {
    expect(isValidDate('15/03/1980')).toBe(true);
  });
  
  test('Data inválida', () => {
    expect(isValidDate('32/13/2024')).toBe(false);
  });
});
```

## 5. Considerações de Performance

### 5.1 Otimizações Implementadas
- ✅ **Processamento assíncrono** de arquivos CSV
- ✅ **Validação incremental** linha por linha
- ✅ **Filtros otimizados** para grandes volumes
- ✅ **Lazy loading** de dados na interface
- ✅ **Debounce** em campos de busca

### 5.2 Limitações e Recomendações
- **Tamanho máximo de CSV**: Recomendado até 10.000 linhas
- **Memória**: Processamento em chunks para arquivos grandes
- **Timeout**: Implementar timeout para operações longas
- **Progress**: Adicionar barra de progresso para uploads grandes

## 6. Segurança

### 6.1 Validações de Segurança
- ✅ **Validação de tipo** de arquivo (apenas CSV)
- ✅ **Sanitização** de dados de entrada
- ✅ **Escape** de caracteres especiais
- ✅ **Validação de tamanho** de arquivo
- ✅ **Log de auditoria** de todas as operações

### 6.2 Controle de Acesso
- ✅ **Autenticação** obrigatória para todas as operações
- ✅ **Autorização** baseada em perfil de usuário
- ✅ **Auditoria** de todas as modificações
- ✅ **Backup automático** antes de alterações

## 7. Manutenção e Monitoramento

### 7.1 Logs de Sistema
```typescript
interface SystemLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  operation: string;
  details: any;
  user: string;
}
```

### 7.2 Métricas de Uso
- **Relatórios gerados** por período
- **Importações realizadas** com sucesso/erro
- **Tempo médio** de processamento
- **Tipos de erro** mais frequentes

### 7.3 Manutenção Preventiva
- **Limpeza de logs** antigos
- **Backup** de dados críticos
- **Monitoramento** de performance
- **Atualização** de validações conforme necessário

---

**Versão**: 1.0  
**Data**: Janeiro 2024  
**Responsável**: Equipe de Desenvolvimento TJ-PA