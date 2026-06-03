import { createContext, useContext, useState, ReactNode } from 'react';

export interface DespesaFixa {
  id: string;
  nome: string;
  valor: number;
  vencimento: string;
  categoria: string;
}

export interface Cartao {
  id: string;
  apelido: string;
  bandeira: string;
  valor: number;
  vencimento: string;
}

export interface GastoVariavel {
  id: string;
  nome: string;
  valor: number;
  createdAt: Date;
}

export interface Meta {
  id: string;
  descricao: string;
  valorTotal: number;
  valorMensal: number;
}

export interface RelatorioExportado {
  id: string;
  dataExportacao: Date;
  periodo: string;
  totalDespesas: number;
  totalReceitas: number;
  saldo: number;
}

export interface DadosMensais {
  mesAno: string; // "2024-06" formato
  despesasFixas: DespesaFixa[];
  cartoes: Cartao[];
  gastosVariaveis: GastoVariavel[];
  metas: Meta[];
  salario: number;
}

interface FinanceContextType {
  despesasFixas: DespesaFixa[];
  cartoes: Cartao[];
  gastosVariaveis: GastoVariavel[];
  metas: Meta[];
  salario: number;
  categorias: string[];
  relatoriosExportados: RelatorioExportado[];
  mesAtualSelecionado: string;
  todosMeses: string[];
  anoSelecionado: number;

  setMesAtualSelecionado: (mes: string) => void;
  setAnoSelecionado: (ano: number) => void;
  addDespesaFixa: (despesa: Omit<DespesaFixa, 'id'>) => void;
  updateDespesaFixa: (id: string, despesa: Omit<DespesaFixa, 'id'>) => void;
  deleteDespesaFixa: (id: string) => void;

  addCartao: (cartao: Omit<Cartao, 'id'>) => void;
  updateCartao: (id: string, cartao: Omit<Cartao, 'id'>) => void;
  deleteCartao: (id: string) => void;

  addGastoVariavel: (gasto: Omit<GastoVariavel, 'id'>) => void;
  updateGastoVariavel: (id: string, gasto: Omit<GastoVariavel, 'id'>) => void;
  deleteGastoVariavel: (id: string) => void;

  addMeta: (meta: Omit<Meta, 'id'>) => void;
  deleteMeta: (id: string) => void;

  updateSalario: (valor: number) => void;

  addGastoComCartao: (gastoNome: string, valorTotal: number, despesaId: string, cartaoId: string, numeroParcelas: number) => void;

  addCategoria: (categoria: string) => void;

  addRelatorioExportado: (relatorio: Omit<RelatorioExportado, 'id'>) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  // Obter mês atual no formato YYYY-MM
  const getMesAtualKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  // Estado para armazenar dados de todos os meses
  const [dadosPorMes, setDadosPorMes] = useState<Record<string, DadosMensais>>(() => {
    const mesAtual = getMesAtualKey();

    // Criar apenas o mês atual na inicialização
    return {
      [mesAtual]: {
        mesAno: mesAtual,
        despesasFixas: [
          { id: '1', nome: 'Apartamento', valor: 645, vencimento: '17', categoria: 'Moradia' },
          { id: '2', nome: 'Condomínio', valor: 170, vencimento: '05', categoria: 'Moradia' },
          { id: '3', nome: 'Luz', valor: 400, vencimento: '11', categoria: 'Utilidades' },
          { id: '4', nome: 'Água', valor: 90, vencimento: '27', categoria: 'Utilidades' },
          { id: '5', nome: 'Internet', valor: 120, vencimento: '10', categoria: 'Utilidades' },
          { id: '6', nome: 'Carro', valor: 870, vencimento: '30', categoria: 'Transporte' },
          { id: '7', nome: 'Seguro', valor: 250, vencimento: '30', categoria: 'Transporte' },
          { id: '8', nome: 'Gasolina', valor: 900, vencimento: '30', categoria: 'Transporte' },
          { id: '9', nome: 'Lava Jato', valor: 100, vencimento: '30', categoria: 'Transporte' },
          { id: '10', nome: 'Escola Gabi', valor: 633, vencimento: '08', categoria: 'Educação' },
          { id: '11', nome: 'Transporte Escolar', valor: 140, vencimento: '08', categoria: 'Educação' },
          { id: '12', nome: 'Mesada Gabi', valor: 50, vencimento: '08', categoria: 'Educação' },
          { id: '13', nome: 'Natação', valor: 120, vencimento: '15', categoria: 'Educação' },
        ],
        cartoes: [
          { id: '1', apelido: 'Nubank Ezequiel', bandeira: 'Nubank', valor: 35, vencimento: '10' },
          { id: '2', apelido: 'BB Ezequiel', bandeira: 'Banco do Brasil', valor: 1510, vencimento: '02' },
          { id: '3', apelido: 'Itaú Ezequiel', bandeira: 'Itaú', valor: 350, vencimento: '02' },
          { id: '4', apelido: 'Nubank Cinthia', bandeira: 'Nubank', valor: 419, vencimento: '06' },
        ],
        gastosVariaveis: [
          { id: '1', nome: 'Supermercado', valor: 85, createdAt: new Date() },
          { id: '2', nome: 'Farmácia', valor: 100, createdAt: new Date() },
          { id: '3', nome: 'Cinthia', valor: 73, createdAt: new Date() },
          { id: '4', nome: 'Rafael', valor: 40, createdAt: new Date() },
        ],
        metas: [],
        salario: 7200
      }
    };
  });

  const [mesAtualSelecionado, setMesAtualSelecionadoInterno] = useState(getMesAtualKey());
  const [anoSelecionado, setAnoSelecionadoInterno] = useState(new Date().getFullYear());

  // Wrapper para setMesAtualSelecionado que também atualiza o ano
  const setMesAtualSelecionado = (novoMes: string) => {
    setMesAtualSelecionadoInterno(novoMes);
    const [ano] = novoMes.split('-').map(Number);
    setAnoSelecionadoInterno(ano);
  };

  // Obter dados do mês atual selecionado
  const getDadosMesAtual = (): DadosMensais => {
    if (!dadosPorMes[mesAtualSelecionado]) {
      // Se o mês não existe, copiar Despesas Fixas, Cartões e Metas do mês mais próximo
      const mesesOrdenados = Object.keys(dadosPorMes).sort();

      // Tentar encontrar o mês anterior
      const mesAnterior = mesesOrdenados
        .filter(m => m < mesAtualSelecionado)
        .sort()
        .reverse()[0];

      // Se não houver mês anterior, pegar o próximo disponível
      const mesReferencia = mesAnterior || mesesOrdenados[0];
      const dadosMesReferencia = mesReferencia ? dadosPorMes[mesReferencia] : null;

      const novosDados: DadosMensais = {
        mesAno: mesAtualSelecionado,
        // Copiar Despesas Fixas do mês de referência (com novos IDs)
        despesasFixas: dadosMesReferencia
          ? dadosMesReferencia.despesasFixas.map(d => ({
              ...d,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }))
          : [],
        // Copiar Cartões do mês de referência (com novos IDs)
        cartoes: dadosMesReferencia
          ? dadosMesReferencia.cartoes.map(c => ({
              ...c,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }))
          : [],
        // Gastos Variáveis começam VAZIOS
        gastosVariaveis: [],
        // Copiar Metas do mês de referência (com novos IDs)
        metas: dadosMesReferencia
          ? dadosMesReferencia.metas.map(m => ({
              ...m,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }))
          : [],
        // Copiar Salário do mês de referência
        salario: dadosMesReferencia?.salario || 7200
      };

      setDadosPorMes({ ...dadosPorMes, [mesAtualSelecionado]: novosDados });
      return novosDados;
    }
    return dadosPorMes[mesAtualSelecionado];
  };

  const dadosMesAtual = getDadosMesAtual();
  const despesasFixas = dadosMesAtual.despesasFixas;
  const cartoes = dadosMesAtual.cartoes;
  const gastosVariaveis = dadosMesAtual.gastosVariaveis;
  const metas = dadosMesAtual.metas;
  const salario = dadosMesAtual.salario;

  // Lista de todos os meses disponíveis
  const todosMeses = Object.keys(dadosPorMes).sort().reverse();

  const [categorias, setCategorias] = useState<string[]>([
    'Moradia',
    'Utilidades',
    'Transporte',
    'Educação',
    'Alimentação',
    'Saúde',
    'Lazer',
    'Investimentos',
    'Outros'
  ]);

  const [relatoriosExportados, setRelatoriosExportados] = useState<RelatorioExportado[]>([]);

  // Função auxiliar para atualizar dados do mês atual
  const updateDadosMesAtual = (updater: (dados: DadosMensais) => DadosMensais) => {
    setDadosPorMes(prev => ({
      ...prev,
      [mesAtualSelecionado]: updater(prev[mesAtualSelecionado] || getDadosMesAtual())
    }));
  };

  // Despesas Fixas
  const addDespesaFixa = (despesa: Omit<DespesaFixa, 'id'>) => {
    updateDadosMesAtual(dados => ({
      ...dados,
      despesasFixas: [...dados.despesasFixas, { ...despesa, id: Date.now().toString() }]
    }));
  };

  const updateDespesaFixa = (id: string, despesa: Omit<DespesaFixa, 'id'>) => {
    updateDadosMesAtual(dados => ({
      ...dados,
      despesasFixas: dados.despesasFixas.map(d => d.id === id ? { ...despesa, id } : d)
    }));
  };

  const deleteDespesaFixa = (id: string) => {
    updateDadosMesAtual(dados => ({
      ...dados,
      despesasFixas: dados.despesasFixas.filter(d => d.id !== id)
    }));
  };

  // Cartões
  const addCartao = (cartao: Omit<Cartao, 'id'>) => {
    updateDadosMesAtual(dados => ({
      ...dados,
      cartoes: [...dados.cartoes, { ...cartao, id: Date.now().toString() }]
    }));
  };

  const updateCartao = (id: string, cartao: Omit<Cartao, 'id'>) => {
    updateDadosMesAtual(dados => ({
      ...dados,
      cartoes: dados.cartoes.map(c => c.id === id ? { ...cartao, id } : c)
    }));
  };

  const deleteCartao = (id: string) => {
    updateDadosMesAtual(dados => ({
      ...dados,
      cartoes: dados.cartoes.filter(c => c.id !== id)
    }));
  };

  // Gastos Variáveis
  const addGastoVariavel = (gasto: Omit<GastoVariavel, 'id' | 'createdAt'>) => {
    updateDadosMesAtual(dados => ({
      ...dados,
      gastosVariaveis: [...dados.gastosVariaveis, { ...gasto, id: Date.now().toString(), createdAt: new Date() }]
    }));
  };

  const updateGastoVariavel = (id: string, gasto: Omit<GastoVariavel, 'id' | 'createdAt'>) => {
    updateDadosMesAtual(dados => ({
      ...dados,
      gastosVariaveis: dados.gastosVariaveis.map(g => g.id === id ? { ...gasto, id, createdAt: g.createdAt } : g)
    }));
  };

  const deleteGastoVariavel = (id: string) => {
    updateDadosMesAtual(dados => ({
      ...dados,
      gastosVariaveis: dados.gastosVariaveis.filter(g => g.id !== id)
    }));
  };

  // Metas
  const addMeta = (meta: Omit<Meta, 'id'>) => {
    updateDadosMesAtual(dados => ({
      ...dados,
      metas: [...dados.metas, { ...meta, id: Date.now().toString() }]
    }));
  };

  const deleteMeta = (id: string) => {
    updateDadosMesAtual(dados => ({
      ...dados,
      metas: dados.metas.filter(m => m.id !== id)
    }));
  };

  const updateSalario = (valor: number) => {
    updateDadosMesAtual(dados => ({
      ...dados,
      salario: valor
    }));
  };

  // Função para obter próximo mês
  const getProximoMes = (mesAtual: string): string => {
    const [ano, mes] = mesAtual.split('-').map(Number);
    const proximaData = new Date(ano, mes); // mes é 0-indexed, então mes = próximo mês
    return `${proximaData.getFullYear()}-${String(proximaData.getMonth() + 1).padStart(2, '0')}`;
  };

  // Adiciona gasto com cartão parcelado: debita da despesa fixa e adiciona ao cartão
  const addGastoComCartao = (gastoNome: string, valorTotal: number, despesaId: string, cartaoId: string, numeroParcelas: number = 1) => {
    const valorParcela = valorTotal / numeroParcelas;
    let mesCorrente = mesAtualSelecionado;

    // Criar parcelas para cada mês
    for (let parcela = 1; parcela <= numeroParcelas; parcela++) {
      const nomeParcela = numeroParcelas > 1
        ? `${gastoNome} (${parcela}/${numeroParcelas}x)`
        : gastoNome;

      // Garantir que o mês existe
      if (!dadosPorMes[mesCorrente]) {
        getDadosMesAtual(); // Isso criará o mês se não existir
      }

      setDadosPorMes(prev => {
        const dadosMes = prev[mesCorrente] || getDadosMesAtual();

        // Adiciona aos gastos variáveis
        const novosGastos = [...dadosMes.gastosVariaveis, {
          id: `${Date.now()}-${parcela}-${Math.random().toString(36).substr(2, 9)}`,
          nome: nomeParcela,
          valor: valorParcela,
          createdAt: new Date()
        }];

        // Debita da despesa fixa (se foi selecionada)
        const novasDespesas = despesaId
          ? dadosMes.despesasFixas.map(d =>
              d.id === despesaId ? { ...d, valor: Math.max(0, d.valor - valorParcela) } : d
            )
          : dadosMes.despesasFixas;

        // Adiciona ao cartão (se foi selecionado)
        const novosCartoes = cartaoId
          ? dadosMes.cartoes.map(c =>
              c.id === cartaoId ? { ...c, valor: c.valor + valorParcela } : c
            )
          : dadosMes.cartoes;

        return {
          ...prev,
          [mesCorrente]: {
            ...dadosMes,
            gastosVariaveis: novosGastos,
            despesasFixas: novasDespesas,
            cartoes: novosCartoes
          }
        };
      });

      // Avançar para o próximo mês
      mesCorrente = getProximoMes(mesCorrente);
    }
  };

  // Adiciona nova categoria
  const addCategoria = (categoria: string) => {
    if (categoria && !categorias.includes(categoria)) {
      setCategorias([...categorias, categoria]);
    }
  };

  // Adiciona relatório exportado ao histórico
  const addRelatorioExportado = (relatorio: Omit<RelatorioExportado, 'id'>) => {
    const novoRelatorio: RelatorioExportado = {
      ...relatorio,
      id: Date.now().toString()
    };
    setRelatoriosExportados([novoRelatorio, ...relatoriosExportados]);
  };

  // Atualizar ano selecionado
  const handleSetAnoSelecionado = (ano: number) => {
    setAnoSelecionadoInterno(ano);

    // Atualizar mês selecionado para janeiro do novo ano (ou mês atual se for o ano atual)
    const mesAtualReal = getMesAtualKey();
    const [anoAtualReal, mesNumAtualReal] = mesAtualReal.split('-').map(Number);

    if (ano === anoAtualReal) {
      setMesAtualSelecionadoInterno(mesAtualReal);
    } else {
      setMesAtualSelecionadoInterno(`${ano}-01`);
    }
    // Os meses serão criados automaticamente quando navegados via getDadosMesAtual
  };

  return (
    <FinanceContext.Provider
      value={{
        despesasFixas,
        cartoes,
        gastosVariaveis,
        metas,
        salario,
        categorias,
        relatoriosExportados,
        mesAtualSelecionado,
        todosMeses,
        anoSelecionado,
        setMesAtualSelecionado,
        setAnoSelecionado: handleSetAnoSelecionado,
        addDespesaFixa,
        updateDespesaFixa,
        deleteDespesaFixa,
        addCartao,
        updateCartao,
        deleteCartao,
        addGastoVariavel,
        updateGastoVariavel,
        deleteGastoVariavel,
        addMeta,
        deleteMeta,
        updateSalario,
        addGastoComCartao,
        addCategoria,
        addRelatorioExportado,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
}