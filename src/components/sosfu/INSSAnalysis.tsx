import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus,
  Download,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  MapPin,
  Building,
  User,
  X,
  Save,
  Calculator,
  BarChart3,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';

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

interface CSVUploadResult {
  success: boolean;
  totalRows: number;
  validRows: number;
  errors: string[];
  warnings: string[];
}

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

const INSSAnalysis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [municipioFilter, setMunicipioFilter] = useState('all');
  const [selectedRecolhimento, setSelectedRecolhimento] = useState<INSSRecolhimento | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<CSVUploadResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Dados simulados
  const [recolhimentos, setRecolhimentos] = useState<INSSRecolhimento[]>([
    {
      id: '1',
      cpfPrestador: '123.456.789-00',
      nomePrestador: 'João Silva Santos',
      dataNascimentoPrestador: '15/03/1980',
      valorBrutoNF: 5000.00,
      dataNotaFiscal: '10/01/2024',
      numeroNotaFiscal: 'NF-001',
      inss11Contribuinte: 550.00,
      inss20Patronal: 1000.00,
      municipio: 'Belém',
      portariaSF: 'SF-2024-0001',
      finalidadeAtividade: 'Serviços de consultoria técnica',
      validado: true,
      prestacaoProtocolo: 'PC-2024-0001',
      solicitacaoProtocolo: 'SF-2024-0001',
      supridoLotacao: 'Vara Criminal',
      criadoEm: '2024-01-10'
    },
    {
      id: '2',
      cpfPrestador: '987.654.321-00',
      nomePrestador: 'Maria Oliveira Costa',
      dataNascimentoPrestador: '22/07/1975',
      valorBrutoNF: 3500.00,
      dataNotaFiscal: '15/01/2024',
      numeroNotaFiscal: 'NF-002',
      inss11Contribuinte: 385.00,
      inss20Patronal: 700.00,
      municipio: 'Santarém',
      portariaSF: 'SF-2024-0002',
      finalidadeAtividade: 'Material de escritório',
      validado: false,
      prestacaoProtocolo: 'PC-2024-0002',
      solicitacaoProtocolo: 'SF-2024-0002',
      supridoLotacao: 'Vara Cível',
      criadoEm: '2024-01-15'
    },
    {
      id: '3',
      cpfPrestador: '456.789.123-00',
      nomePrestador: 'Carlos Mendes Silva',
      dataNascimentoPrestador: '08/11/1982',
      valorBrutoNF: 7200.00,
      dataNotaFiscal: '20/01/2024',
      numeroNotaFiscal: 'NF-003',
      inss11Contribuinte: 792.00,
      inss20Patronal: 1440.00,
      municipio: 'Marabá',
      portariaSF: 'SF-2024-0003',
      finalidadeAtividade: 'Serviços de manutenção',
      validado: true,
      prestacaoProtocolo: 'PC-2024-0003',
      solicitacaoProtocolo: 'SF-2024-0003',
      supridoLotacao: 'Administrativo',
      criadoEm: '2024-01-20'
    }
  ]);

  const [formData, setFormData] = useState<Partial<INSSRecolhimento>>({
    cpfPrestador: '',
    nomePrestador: '',
    dataNascimentoPrestador: '',
    valorBrutoNF: 0,
    dataNotaFiscal: '',
    numeroNotaFiscal: '',
    inss11Contribuinte: 0,
    inss20Patronal: 0,
    municipio: '',
    portariaSF: '',
    finalidadeAtividade: '',
    validado: false,
    observacoes: ''
  });

  const [reportFilters, setReportFilters] = useState({
    dataInicio: '',
    dataFim: '',
    municipio: 'all',
    incluirInconsistencias: true,
    formato: 'pdf'
  });

  // Estatísticas
  const stats = {
    total: recolhimentos.length,
    validados: recolhimentos.filter(r => r.validado).length,
    pendentes: recolhimentos.filter(r => !r.validado).length,
    valorTotal: recolhimentos.reduce((sum, r) => sum + r.valorBrutoNF, 0),
    inssTotal: recolhimentos.reduce((sum, r) => sum + r.inss11Contribuinte + r.inss20Patronal, 0)
  };

  const municipios = [...new Set(recolhimentos.map(r => r.municipio))];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Verificar sequências inválidas
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Calcular dígitos verificadores
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
    
    return digit1 === parseInt(cleanCPF.charAt(9)) && digit2 === parseInt(cleanCPF.charAt(10));
  };

  const calculateINSS = (valorBruto: number) => {
    return {
      inss11: Math.round(valorBruto * 0.11 * 100) / 100,
      inss20: Math.round(valorBruto * 0.20 * 100) / 100
    };
  };

  const handleValueChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calcular INSS automaticamente quando o valor bruto mudar
      if (field === 'valorBrutoNF' && typeof value === 'number') {
        const inss = calculateINSS(value);
        updated.inss11Contribuinte = inss.inss11;
        updated.inss20Patronal = inss.inss20;
      }
      
      return updated;
    });
  };

  const openModal = (recolhimento?: INSSRecolhimento) => {
    if (recolhimento) {
      setSelectedRecolhimento(recolhimento);
      setFormData(recolhimento);
      setIsEditing(true);
    } else {
      setSelectedRecolhimento(null);
      setFormData({
        cpfPrestador: '',
        nomePrestador: '',
        dataNascimentoPrestador: '',
        valorBrutoNF: 0,
        dataNotaFiscal: '',
        numeroNotaFiscal: '',
        inss11Contribuinte: 0,
        inss20Patronal: 0,
        municipio: '',
        portariaSF: '',
        finalidadeAtividade: '',
        validado: false,
        observacoes: ''
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecolhimento(null);
    setIsEditing(false);
  };

  const saveRecolhimento = () => {
    if (!formData.cpfPrestador || !formData.nomePrestador || !formData.valorBrutoNF) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (!validateCPF(formData.cpfPrestador)) {
      alert('CPF inválido');
      return;
    }

    if (isEditing && selectedRecolhimento) {
      setRecolhimentos(prev => prev.map(r => 
        r.id === selectedRecolhimento.id 
          ? { ...r, ...formData } as INSSRecolhimento
          : r
      ));
    } else {
      const newRecolhimento: INSSRecolhimento = {
        id: Date.now().toString(),
        ...formData as INSSRecolhimento,
        criadoEm: new Date().toISOString().split('T')[0]
      };
      setRecolhimentos(prev => [...prev, newRecolhimento]);
    }

    closeModal();
  };

  const deleteRecolhimento = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este recolhimento?')) {
      setRecolhimentos(prev => prev.filter(r => r.id !== id));
    }
  };

  const toggleValidacao = (id: string) => {
    setRecolhimentos(prev => prev.map(r => 
      r.id === id ? { ...r, validado: !r.validado } : r
    ));
  };

  const generateReport = () => {
    if (!reportFilters.dataInicio || !reportFilters.dataFim) {
      alert('Selecione o período para o relatório');
      return;
    }

    const filteredData = recolhimentos.filter(r => {
      const dataRecolhimento = new Date(r.dataNotaFiscal.split('/').reverse().join('-'));
      const dataInicio = new Date(reportFilters.dataInicio);
      const dataFim = new Date(reportFilters.dataFim);
      
      const dentroPeríodo = dataRecolhimento >= dataInicio && dataRecolhimento <= dataFim;
      const municipioMatch = reportFilters.municipio === 'all' || r.municipio === reportFilters.municipio;
      
      return dentroPeríodo && municipioMatch;
    });

    const relatorio = {
      periodo: `${reportFilters.dataInicio} a ${reportFilters.dataFim}`,
      municipio: reportFilters.municipio === 'all' ? 'Todos' : reportFilters.municipio,
      totalRecolhimentos: filteredData.length,
      valorBrutoTotal: filteredData.reduce((sum, r) => sum + r.valorBrutoNF, 0),
      inss11Total: filteredData.reduce((sum, r) => sum + r.inss11Contribuinte, 0),
      inss20Total: filteredData.reduce((sum, r) => sum + r.inss20Patronal, 0),
      inssTotal: filteredData.reduce((sum, r) => sum + r.inss11Contribuinte + r.inss20Patronal, 0),
      dados: filteredData
    };

    console.log('Relatório gerado:', relatorio);
    alert(`Relatório gerado com ${relatorio.totalRecolhimentos} recolhimentos. Total INSS: ${formatCurrency(relatorio.inssTotal)}`);
  };

  const generateDetailedReport = () => {
    if (!reportFilters.dataInicio || !reportFilters.dataFim) {
      alert('Selecione o período para o relatório');
      return;
    }

    const filteredData = recolhimentos.filter(r => {
      const dataRecolhimento = new Date(r.dataNotaFiscal.split('/').reverse().join('-'));
      const dataInicio = new Date(reportFilters.dataInicio);
      const dataFim = new Date(reportFilters.dataFim);
      
      const dentroPeríodo = dataRecolhimento >= dataInicio && dataRecolhimento <= dataFim;
      const municipioMatch = reportFilters.municipio === 'all' || r.municipio === reportFilters.municipio;
      
      return dentroPeríodo && municipioMatch;
    });

    // Identificar inconsistências
    const inconsistencias: string[] = [];
    filteredData.forEach(r => {
      if (!validateCPF(r.cpfPrestador)) {
        inconsistencias.push(`CPF inválido: ${r.cpfPrestador} - ${r.nomePrestador}`);
      }
      
      const inssCalculado11 = Math.round(r.valorBrutoNF * 0.11 * 100) / 100;
      const inssCalculado20 = Math.round(r.valorBrutoNF * 0.20 * 100) / 100;
      
      if (Math.abs(r.inss11Contribuinte - inssCalculado11) > 0.01) {
        inconsistencias.push(`INSS 11% incorreto: ${r.nomePrestador} - Calculado: ${formatCurrency(inssCalculado11)}, Informado: ${formatCurrency(r.inss11Contribuinte)}`);
      }
      
      if (Math.abs(r.inss20Patronal - inssCalculado20) > 0.01) {
        inconsistencias.push(`INSS 20% incorreto: ${r.nomePrestador} - Calculado: ${formatCurrency(inssCalculado20)}, Informado: ${formatCurrency(r.inss20Patronal)}`);
      }
    });

    const reportData: ReportData = {
      periodo: `${reportFilters.dataInicio} a ${reportFilters.dataFim}`,
      municipio: reportFilters.municipio === 'all' ? 'Todos os Municípios' : reportFilters.municipio,
      totalRecolhimentos: filteredData.length,
      valorBrutoTotal: filteredData.reduce((sum, r) => sum + r.valorBrutoNF, 0),
      inss11Total: filteredData.reduce((sum, r) => sum + r.inss11Contribuinte, 0),
      inss20Total: filteredData.reduce((sum, r) => sum + r.inss20Patronal, 0),
      inssTotal: filteredData.reduce((sum, r) => sum + r.inss11Contribuinte + r.inss20Patronal, 0),
      recolhimentosValidados: filteredData.filter(r => r.validado).length,
      recolhimentosPendentes: filteredData.filter(r => !r.validado).length,
      inconsistenciasEncontradas: inconsistencias
    };

    // Simular geração do relatório
    if (reportFilters.formato === 'pdf') {
      generatePDFReport(reportData, filteredData);
    } else {
      generateExcelReport(reportData, filteredData);
    }
  };

  const generatePDFReport = (reportData: ReportData, data: INSSRecolhimento[]) => {
    // Simulação de geração de PDF
    console.log('Gerando relatório PDF...', reportData);
    
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
${data.map(r => `
CPF: ${r.cpfPrestador} | Nome: ${r.nomePrestador}
Valor NF: ${formatCurrency(r.valorBrutoNF)} | INSS Total: ${formatCurrency(r.inss11Contribuinte + r.inss20Patronal)}
Município: ${r.municipio} | Status: ${r.validado ? 'Validado' : 'Pendente'}
`).join('\n')}
    `;

    // Criar blob e download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_inss_${reportData.periodo.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Relatório PDF gerado com sucesso!');
  };

  const generateExcelReport = (reportData: ReportData, data: INSSRecolhimento[]) => {
    // Simulação de geração de Excel (CSV)
    console.log('Gerando relatório Excel...', reportData);
    
    const csvHeader = 'CPF,Nome,Data Nascimento,Valor Bruto NF,Data NF,INSS 11%,INSS 20%,Município,Portaria SF,Finalidade,Status\n';
    const csvData = data.map(r => 
      `"${r.cpfPrestador}","${r.nomePrestador}","${r.dataNascimentoPrestador}","${r.valorBrutoNF}","${r.dataNotaFiscal}","${r.inss11Contribuinte}","${r.inss20Patronal}","${r.municipio}","${r.portariaSF}","${r.finalidadeAtividade}","${r.validado ? 'Validado' : 'Pendente'}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvData;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_inss_${reportData.periodo.replace(/\//g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Relatório Excel gerado com sucesso!');
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        alert('Por favor, selecione apenas arquivos CSV.');
        return;
      }
      setCSVFile(file);
      setUploadResult(null);
    }
  };

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
        // Simular backup automático
        console.log('Backup automático realizado antes da atualização');
        
        // Simular atualização dos dados
        console.log(`${result.validRows} registros processados com sucesso`);
        
        // Log de operações
        const logEntry = {
          timestamp: new Date().toISOString(),
          operation: 'CSV_UPLOAD',
          file: csvFile.name,
          totalRows: result.totalRows,
          validRows: result.validRows,
          errors: result.errors.length,
          warnings: result.warnings.length
        };
        console.log('Log de operação:', logEntry);
      }
    };
    
    reader.readAsText(csvFile);
  };

  const parseAndValidateCSV = (csvContent: string): CSVUploadResult => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const errors: string[] = [];
    const warnings: string[] = [];
    let validRows = 0;

    if (lines.length === 0) {
      errors.push('Arquivo CSV está vazio');
      return { success: false, totalRows: 0, validRows: 0, errors, warnings };
    }

    // Validar cabeçalho
    const expectedHeaders = [
      'CPF', 'Nome', 'Data Nascimento', 'Valor Bruto NF', 'Data NF',
      'INSS 11%', 'INSS 20%', 'Município', 'Portaria SF', 'Finalidade'
    ];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      errors.push(`Colunas obrigatórias ausentes: ${missingHeaders.join(', ')}`);
    }

    // Validar dados
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(cell => cell.trim().replace(/"/g, ''));
      const rowNumber = i + 1;
      
      if (row.length !== expectedHeaders.length) {
        errors.push(`Linha ${rowNumber}: Número incorreto de colunas (esperado: ${expectedHeaders.length}, encontrado: ${row.length})`);
        continue;
      }

      const [cpf, nome, dataNasc, valorBruto, dataNF, inss11, inss20, municipio, portaria, finalidade] = row;
      
      // Validar CPF
      if (!validateCPF(cpf)) {
        errors.push(`Linha ${rowNumber}: CPF inválido - ${cpf}`);
      }
      
      // Validar nome
      if (!nome || nome.length < 3) {
        errors.push(`Linha ${rowNumber}: Nome inválido ou muito curto`);
      }
      
      // Validar data de nascimento
      if (!isValidDate(dataNasc)) {
        errors.push(`Linha ${rowNumber}: Data de nascimento inválida - ${dataNasc}`);
      }
      
      // Validar valor bruto
      const valorBrutoNum = parseFloat(valorBruto.replace(',', '.'));
      if (isNaN(valorBrutoNum) || valorBrutoNum <= 0) {
        errors.push(`Linha ${rowNumber}: Valor bruto inválido - ${valorBruto}`);
      }
      
      // Validar data NF
      if (!isValidDate(dataNF)) {
        errors.push(`Linha ${rowNumber}: Data da nota fiscal inválida - ${dataNF}`);
      }
      
      // Validar INSS 11%
      const inss11Num = parseFloat(inss11.replace(',', '.'));
      if (isNaN(inss11Num) || inss11Num < 0) {
        errors.push(`Linha ${rowNumber}: INSS 11% inválido - ${inss11}`);
      }
      
      // Validar INSS 20%
      const inss20Num = parseFloat(inss20.replace(',', '.'));
      if (isNaN(inss20Num) || inss20Num < 0) {
        errors.push(`Linha ${rowNumber}: INSS 20% inválido - ${inss20}`);
      }
      
      // Validar município
      if (!municipio || municipio.length < 2) {
        errors.push(`Linha ${rowNumber}: Município inválido`);
      }
      
      // Validar portaria
      if (!portaria) {
        warnings.push(`Linha ${rowNumber}: Portaria SF não informada`);
      }
      
      // Validar finalidade
      if (!finalidade || finalidade.length < 5) {
        warnings.push(`Linha ${rowNumber}: Finalidade/atividade muito curta ou ausente`);
      }
      
      // Verificar cálculo do INSS
      if (!isNaN(valorBrutoNum) && !isNaN(inss11Num)) {
        const inss11Calculado = Math.round(valorBrutoNum * 0.11 * 100) / 100;
        if (Math.abs(inss11Num - inss11Calculado) > 0.01) {
          warnings.push(`Linha ${rowNumber}: INSS 11% pode estar incorreto. Calculado: ${inss11Calculado.toFixed(2)}, Informado: ${inss11Num.toFixed(2)}`);
        }
      }
      
      if (!isNaN(valorBrutoNum) && !isNaN(inss20Num)) {
        const inss20Calculado = Math.round(valorBrutoNum * 0.20 * 100) / 100;
        if (Math.abs(inss20Num - inss20Calculado) > 0.01) {
          warnings.push(`Linha ${rowNumber}: INSS 20% pode estar incorreto. Calculado: ${inss20Calculado.toFixed(2)}, Informado: ${inss20Num.toFixed(2)}`);
        }
      }
      
      if (errors.length === 0) {
        validRows++;
      }
    }

    const success = errors.length === 0 && validRows > 0;
    return {
      success,
      totalRows: lines.length - 1, // Excluir cabeçalho
      validRows,
      errors,
      warnings
    };
  };

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString.split('/').reverse().join('-'));
    return date instanceof Date && !isNaN(date.getTime());
  };

  const filteredRecolhimentos = recolhimentos.filter(recolhimento => {
    const matchesSearch = 
      recolhimento.cpfPrestador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recolhimento.nomePrestador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recolhimento.municipio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'validado' && recolhimento.validado) ||
      (statusFilter === 'pendente' && !recolhimento.validado);
    
    const matchesMunicipio = municipioFilter === 'all' || recolhimento.municipio === municipioFilter;
    
    return matchesSearch && matchesStatus && matchesMunicipio;
  });

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Calculator size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Análise de Recolhimentos INSS</h2>
              <p className="text-gray-600 dark:text-gray-400">Consolidação dos recolhimentos de INSS das prestações de contas</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              <BarChart3 size={16} className="mr-2" />
              Relatório
            </button>
            <button
              onClick={() => setShowCSVModal(true)}
              className="flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
            >
              <Upload size={16} className="mr-2" />
              Importar CSV
            </button>
            <button
              onClick={() => openModal()}
              className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Novo Recolhimento
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
              </div>
              <FileText size={24} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Validados</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.validados}</p>
              </div>
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Pendentes</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.pendentes}</p>
              </div>
              <AlertTriangle size={24} className="text-orange-500" />
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Valor Total</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{formatCurrency(stats.valorTotal)}</p>
              </div>
              <DollarSign size={24} className="text-purple-500" />
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">INSS Total</p>
                <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{formatCurrency(stats.inssTotal)}</p>
              </div>
              <Calculator size={24} className="text-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="CPF, nome ou município..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="validado">Validados</option>
              <option value="pendente">Pendentes</option>
            </select>
          </div>

          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={municipioFilter}
              onChange={(e) => setMunicipioFilter(e.target.value)}
            >
              <option value="all">Todos os Municípios</option>
              {municipios.map(municipio => (
                <option key={municipio} value={municipio}>{municipio}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setMunicipioFilter('all');
              }}
              className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              <X size={16} className="mr-2" />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Recolhimentos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  CPF Prestador
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome Completo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data Nascimento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor Bruto NF
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data NF
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  INSS 11%
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  INSS 20%
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Município
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Portaria SF
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Finalidade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecolhimentos.map((recolhimento) => (
                <tr key={recolhimento.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {recolhimento.cpfPrestador}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.nomePrestador}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.dataNascimentoPrestador}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(recolhimento.valorBrutoNF)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.dataNotaFiscal}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {formatCurrency(recolhimento.inss11Contribuinte)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                    {formatCurrency(recolhimento.inss20Patronal)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.municipio}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.portariaSF}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                    {recolhimento.finalidadeAtividade}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleValidacao(recolhimento.id)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                        recolhimento.validado 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}
                    >
                      {recolhimento.validado ? 'Validado' : 'Pendente'}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedRecolhimento(recolhimento)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openModal(recolhimento)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteRecolhimento(recolhimento.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecolhimentos.length === 0 && (
          <div className="text-center py-12">
            <Calculator size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhum recolhimento encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' || municipioFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.' 
                : 'Não há recolhimentos cadastrados no momento.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedRecolhimento && !showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Detalhes do Recolhimento INSS
              </h3>
              <button
                onClick={() => setSelectedRecolhimento(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF do Prestador</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.cpfPrestador}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.nomePrestador}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Nascimento</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.dataNascimentoPrestador}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor Bruto da NF</label>
                  <p className="text-sm font-semibold text-green-600">{formatCurrency(selectedRecolhimento.valorBrutoNF)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data da Nota Fiscal</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.dataNotaFiscal}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">INSS 11% (Contribuinte)</label>
                  <p className="text-sm font-semibold text-blue-600">{formatCurrency(selectedRecolhimento.inss11Contribuinte)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">INSS 20% (Patronal)</label>
                  <p className="text-sm font-semibold text-purple-600">{formatCurrency(selectedRecolhimento.inss20Patronal)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total INSS</label>
                  <p className="text-sm font-bold text-indigo-600">
                    {formatCurrency(selectedRecolhimento.inss11Contribuinte + selectedRecolhimento.inss20Patronal)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Município</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.municipio}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Portaria SF</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.portariaSF}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Finalidade/Atividade</label>
              <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {selectedRecolhimento.finalidadeAtividade}
              </p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedRecolhimento(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => openModal(selectedRecolhimento)}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Formulário */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {isEditing ? 'Editar Recolhimento INSS' : 'Novo Recolhimento INSS'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CPF do Prestador *
                  </label>
                  <input
                    type="text"
                    value={formData.cpfPrestador || ''}
                    onChange={(e) => handleValueChange('cpfPrestador', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome Completo do Prestador *
                  </label>
                  <input
                    type="text"
                    value={formData.nomePrestador || ''}
                    onChange={(e) => handleValueChange('nomePrestador', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="text"
                    value={formData.dataNascimentoPrestador || ''}
                    onChange={(e) => handleValueChange('dataNascimentoPrestador', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="DD/MM/AAAA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor Bruto da NF *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valorBrutoNF || ''}
                    onChange={(e) => handleValueChange('valorBrutoNF', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data da Nota Fiscal *
                  </label>
                  <input
                    type="text"
                    value={formData.dataNotaFiscal || ''}
                    onChange={(e) => handleValueChange('dataNotaFiscal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="DD/MM/AAAA"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    INSS 11% (Contribuinte) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.inss11Contribuinte || ''}
                    onChange={(e) => handleValueChange('inss11Contribuinte', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Calculado automaticamente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    INSS 20% (Patronal) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.inss20Patronal || ''}
                    onChange={(e) => handleValueChange('inss20Patronal', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Calculado automaticamente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Município *
                  </label>
                  <input
                    type="text"
                    value={formData.municipio || ''}
                    onChange={(e) => handleValueChange('municipio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Nome do município"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Portaria SF *
                  </label>
                  <input
                    type="text"
                    value={formData.portariaSF || ''}
                    onChange={(e) => handleValueChange('portariaSF', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="SF-AAAA-NNNN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.validado || false}
                      onChange={(e) => handleValueChange('validado', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Recolhimento validado
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Finalidade/Atividade *
              </label>
              <textarea
                value={formData.finalidadeAtividade || ''}
                onChange={(e) => handleValueChange('finalidadeAtividade', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Descreva a finalidade ou atividade..."
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações
              </label>
              <textarea
                value={formData.observacoes || ''}
                onChange={(e) => handleValueChange('observacoes', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Observações adicionais..."
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveRecolhimento}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center"
              >
                <Save size={16} className="mr-2" />
                {isEditing ? 'Atualizar' : 'Salvar'} Recolhimento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Relatório */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Gerar Relatório de Arrecadação INSS
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Início *
                  </label>
                  <input
                    type="date"
                    value={reportFilters.dataInicio}
                    onChange={(e) => setReportFilters({...reportFilters, dataInicio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Fim *
                  </label>
                  <input
                    type="date"
                    value={reportFilters.dataFim}
                    onChange={(e) => setReportFilters({...reportFilters, dataFim: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Município
                </label>
                <select
                  value={reportFilters.municipio}
                  onChange={(e) => setReportFilters({...reportFilters, municipio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">Todos os Municípios</option>
                  {municipios.map(municipio => (
                    <option key={municipio} value={municipio}>{municipio}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Formato do Relatório
                </label>
                <select
                  value={reportFilters.formato}
                  onChange={(e) => setReportFilters({...reportFilters, formato: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel (CSV)</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="incluirInconsistencias"
                  checked={reportFilters.incluirInconsistencias}
                  onChange={(e) => setReportFilters({...reportFilters, incluirInconsistencias: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="incluirInconsistencias" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Incluir análise de inconsistências no relatório
                </label>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <Info size={20} className="text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Conteúdo do Relatório</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                      <li>• Período analisado e filtros aplicados</li>
                      <li>• Resumo executivo com totalizadores</li>
                      <li>• Valores recolhidos por categoria (11% e 20%)</li>
                      <li>• Status de validação dos recolhimentos</li>
                      <li>• Inconsistências encontradas (se habilitado)</li>
                      <li>• Detalhamento completo por prestador</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={generateDetailedReport}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center"
              >
                {reportFilters.formato === 'pdf' ? <FileText size={16} className="mr-2" /> : <FileSpreadsheet size={16} className="mr-2" />}
                Gerar Relatório
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Upload CSV */}
      {showCSVModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Importar Dados via CSV
              </h3>
              <button
                onClick={() => {
                  setShowCSVModal(false);
                  setCSVFile(null);
                  setUploadResult(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Instruções */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle size={20} className="text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Instruções Importantes</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                      <li>• O arquivo deve estar no formato CSV (separado por vírgulas)</li>
                      <li>• A primeira linha deve conter os cabeçalhos das colunas</li>
                      <li>• Um backup automático será criado antes da importação</li>
                      <li>• Dados inconsistentes serão reportados para correção</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Formato esperado */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">Formato Esperado do CSV</h4>
                <div className="bg-white dark:bg-gray-700 rounded border p-3 text-xs font-mono overflow-x-auto">
                  <div className="text-gray-600 dark:text-gray-400">
                    CPF,Nome,Data Nascimento,Valor Bruto NF,Data NF,INSS 11%,INSS 20%,Município,Portaria SF,Finalidade<br/>
                    123.456.789-00,João Silva,15/03/1980,5000.00,10/01/2024,550.00,1000.00,Belém,SF-2024-0001,Consultoria técnica
                  </div>
                </div>
              </div>

              {/* Upload de arquivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selecionar Arquivo CSV
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload size={48} className="text-gray-400 mb-4" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Clique para selecionar arquivo CSV
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Ou arraste e solte o arquivo aqui
                    </span>
                  </label>
                </div>
                
                {csvFile && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <FileText size={16} className="text-blue-600 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{csvFile.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({(csvFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Resultado do processamento */}
              {uploadResult && (
                <div className="space-y-4">
                  <div className={`border rounded-lg p-4 ${
                    uploadResult.success 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-start">
                      {uploadResult.success ? (
                        <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5" />
                      ) : (
                        <AlertCircle size={20} className="text-red-600 mr-3 mt-0.5" />
                      )}
                      <div>
                        <h4 className={`text-sm font-medium ${
                          uploadResult.success 
                            ? 'text-green-800 dark:text-green-200' 
                            : 'text-red-800 dark:text-red-200'
                        }`}>
                          {uploadResult.success ? 'Processamento Concluído' : 'Erros Encontrados'}
                        </h4>
                        <div className={`text-sm mt-2 ${
                          uploadResult.success 
                            ? 'text-green-700 dark:text-green-300' 
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          <p>Total de linhas: {uploadResult.totalRows}</p>
                          <p>Linhas válidas: {uploadResult.validRows}</p>
                          <p>Erros: {uploadResult.errors.length}</p>
                          <p>Avisos: {uploadResult.warnings.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Erros */}
                  {uploadResult.errors.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                        Erros Encontrados ({uploadResult.errors.length})
                      </h5>
                      <div className="max-h-32 overflow-y-auto">
                        {uploadResult.errors.map((error, index) => (
                          <p key={index} className="text-xs text-red-700 dark:text-red-300 mb-1">
                            • {error}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Avisos */}
                  {uploadResult.warnings.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                        Avisos ({uploadResult.warnings.length})
                      </h5>
                      <div className="max-h-32 overflow-y-auto">
                        {uploadResult.warnings.map((warning, index) => (
                          <p key={index} className="text-xs text-yellow-700 dark:text-yellow-300 mb-1">
                            • {warning}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCSVModal(false);
                  setCSVFile(null);
                  setUploadResult(null);
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
              {csvFile && !uploadResult && (
                <button
                  onClick={processCSVFile}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Processar Arquivo
                </button>
              )}
              {uploadResult && uploadResult.success && (
                <button
                  onClick={() => {
                    // Simular aplicação das alterações
                    alert(`${uploadResult.validRows} registros importados com sucesso!`);
                    setShowCSVModal(false);
                    setCSVFile(null);
                    setUploadResult(null);
                  }}
                  className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Aplicar Importação
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default INSSAnalysis;