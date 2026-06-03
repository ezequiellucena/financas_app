import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import * as supabaseApi from '../services/supabaseApi';
import { toast } from 'sonner';

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
  isLoading: boolean;
  userId: string | null;

  setMesAtualSelecionado: (mes: string) => void;
  setAnoSelecionado: (ano: number) => void;
  addDespesaFixa: (despesa: Omit<DespesaFixa, 'id'>) => Promise<void>;
  updateDespesaFixa: (id: string, despesa: Omit<DespesaFixa, 'id'>) => Promise<void>;
  deleteDespesaFixa: (id: string) => Promise<void>;

  addCartao: (cartao: Omit<Cartao, 'id'>) => Promise<void>;
  updateCartao: (id: string, cartao: Omit<Cartao, 'id'>) => Promise<void>;
  deleteCartao: (id: string) => Promise<void>;

  addGastoVariavel: (gasto: Omit<GastoVariavel, 'id'>) => Promise<void>;
  updateGastoVariavel: (id: string, gasto: Omit<GastoVariavel, 'id'>) => Promise<void>;
  deleteGastoVariavel: (id: string) => Promise<void>;

  addMeta: (meta: Omit<Meta, 'id'>) => Promise<void>;
  deleteMeta: (id: string) => Promise<void>;

  updateSalario: (valor: number) => Promise<void>;

  addGastoComCartao: (gastoNome: string, valorTotal: number, despesaId: string, cartaoId: string, numeroParcelas: number) => Promise<void>;

  addCategoria: (categoria: string) => void;

  addRelatorioExportado: (relatorio: Omit<RelatorioExportado, 'id'>) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  // Obter mês atual no formato YYYY-MM
  const getMesAtualKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dadosPorMes, setDadosPorMes] = useState<Record<string, DadosMensais>>({});
  const [mesAtualSelecionado, setMesAtualSelecionadoInterno] = useState(getMesAtualKey());
  const [anoSelecionado, setAnoSelecionadoInterno] = useState(new Date().getFullYear());
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

  // Get current user on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          // Load initial data for current month
          await loadMonthData(getMesAtualKey(), user.id);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Load data for a specific month
  const loadMonthData = async (mesAno: string, uid: string) => {
    try {
      const [despesasFixas, cartoes, gastosVariaveis, metas, salario] = await Promise.all([
        supabaseApi.getDespesasFixas(mesAno, uid),
        supabaseApi.getCartoes(mesAno, uid),
        supabaseApi.getGastosVariaveis(mesAno, uid),
        supabaseApi.getMetas(mesAno, uid),
        supabaseApi.getSalario(mesAno, uid),
      ]);

      setDadosPorMes(prev => ({
        ...prev,
        [mesAno]: {
          mesAno,
          despesasFixas,
          cartoes,
          gastosVariaveis,
          metas,
          salario: salario || 7200,
        }
      }));
    } catch (error) {
      console.error('Error loading month data:', error);
      toast.error('Erro ao carregar dados');
    }
  };

  // Wrapper para setMesAtualSelecionado que também atualiza o ano
  const setMesAtualSelecionado = (novoMes: string) => {
    setMesAtualSelecionadoInterno(novoMes);
    const [ano] = novoMes.split('-').map(Number);
    setAnoSelecionadoInterno(ano);
    
    // Load data for the new month if not already loaded
    if (userId && !dadosPorMes[novoMes]) {
      loadMonthData(novoMes, userId);
    }
  };

  // Obter dados do mês atual selecionado
  const getDadosMesAtual = (): DadosMensais => {
    if (!dadosPorMes[mesAtualSelecionado]) {
      return {
        mesAno: mesAtualSelecionado,
        despesasFixas: [],
        cartoes: [],
        gastosVariaveis: [],
        metas: [],
        salario: 7200
      };
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

  // Despesas Fixas
  const addDespesaFixa = async (despesa: Omit<DespesaFixa, 'id'>) => {
    if (!userId) {
      toast.error('Usuário não autenticado');
      return;
    }
    try {
      const newDespesa = await supabaseApi.createDespesaFixa({
        ...despesa,
        mes_ano: mesAtualSelecionado,
        user_id: userId,
      });

      setDadosPorMes(prev => ({
        ...prev,
        [mesAtualSelecionado]: {
          ...prev[mesAtualSelecionado],
          despesasFixas: [...prev[mesAtualSelecionado].despesasFixas, newDespesa],
        }
      }));
      toast.success('Despesa fixa adicionada');
    } catch (error) {
      console.error('Error adding despesa fixa:', error);
      toast.error('Erro ao adicionar despesa fixa');
    }
  };

  const updateDespesaFixa = async (id: string, despesa: Omit<DespesaFixa, 'id'>) => {
    try {
      await supabaseApi.updateDespesaFixa(id, despesa);

      setDadosPorMes(prev => ({
        ...prev,
        [mesAtualSelecionado]: {
          ...prev[mesAtualSelecionado],
          despesasFixas: prev[mesAtualSelecionado].despesasFixas.map(d =>
            d.id === id ? { ...despesa, id } : d
          ),
        }
      }));
      toast.success('Despesa fixa atualizada');
    } catch (error) {
      console.error('Error updating despesa fixa:', error);
      toast.error('Erro ao atualizar despesa fixa');
    }
  };

  const deleteDespesaFixa = async (id: string) => {
    try {
      await supabaseApi.deleteDespesaFixa(id);

      setDadosPorMes(prev => ({
        ...prev,
        [mesAtualSelecionado]: {
          ...prev[mesAtualSelecionado],
          despesasFixas: prev[mesAtualSelecionado].despesasFixas.filter(d => d.id !== id),
        }
      }));
      toast.success('Despesa fixa removida');
    } catch (error) {
      console.error('Error deleting despesa fixa:', error);
      toast.error('Erro ao remover despesa fixa');
    }
  };

  // Cartões
  const addCartao = async (cartao: Omit<Cartao, 'id'>) => {
    if (!userId) {
      toast.error('Usuário não autenticado');
      return;
    }
    try {
      const newCartao = await supabaseApi.createCartao({
        ...cartao,
        mes_ano: mesAtualSelecionado,
        user_id: userId,
      });

      setDadosPorMes(prev => ({
        ...prev,
        [mesAtualSelecionado]: {
          ...prev[mesAtualSelecionado],
          cartoes: [...prev[mesAtualSelecionado].cartoes, newCartao],
        }
      }));
      toast.success('Cartão adicionado');
    } catch (error) {
      console.error('Error adding cartao:', error);
      toast.error('Erro ao adicionar cartão');
    }
  };

  const updateCartao = async (id: string, cartao: Omit<Cartao, 'id'>) => {
    try {
      await supabaseApi.updateCartao(id, cartao);

      setDadosPorMes(prev => ({
        ...prev,
        [mesAtualSelecionado]: {
          ...prev[mesAtualSelecionado],
          cartoes: prev[mesAtualSelecionado].cartoes.map(c =>
            c.id === id ? { ...cartao, id } : c
          ),
        }
      }));
      toast.success('Cartão atualizado');
    } catch (error) {
      console.error('Error updating cartao:', error);
      toast.error('Erro ao atualizar cartão');
    }
  };

  const deleteCartao = async (id: string) => {
    try {
      await supabaseApi.deleteCartao(id);

      setDadosPorMes(prev => ({
        ...prev,
        [mesAtualSelecionado]: {
          ...prev[mesAtualSelecionado],
          cartoes: prev[mesAtualSelecionado].cartoes.filter(c => c.id !== id),
        }
      }));
      toast.success('Cartão removido');
    } catch (error) {
      console.error('Error deleting cartao:', error);
      toast.error('Erro ao remover cartão');
    }
  };

  // Gastos Variáveis
  const addGastoVariavel = async (gasto: Omit<GastoVariavel, 'id'>) => {
    if (!userId) {
      toast.error('Usuário não autenticado');
      return;
    }
    try {
      const newGasto = await supabaseApi.createGastoVariavel({
        nome: gasto.nome,
        valor: gasto.valor,
        mes_ano: mesAtualSelecionado,
        user_id: userId,
      });

      setDadosPorMes(prev => ({
        ...prev,
        [mesAtualSelecionado]: {
          ...prev[mesAtualSelecionado],
          gastosVariaveis: [...prev[mesAtualSelecionado].gastosVariaveis, newGasto],
        }
      }));
      toast.success('Gasto adicionado');
    } catch (error) {
      console.error('Error adding gasto variavel:', error);
      toast.error('Erro ao adicionar gasto');
    }
  };

  const updateGastoVariavel = async (id: string, gasto: Omit<GastoVariavel, 'id'>) => {
    try {
      const updated = await supabaseApi.updateGastoVariavel(id, {
        nome: gasto.nome,
        valor: gasto.valor,
      });

      setDadosPorMes(prev => ({
        ...prev,
        [mesAtualSelecionado]: {
          ...prev[mesAtualSelecionado],
          gastosVariaveis: prev[mesAtualSelecionado].gastosVariaveis.map(g =>
            g.id === id ? updated : g
          ),
        }
      }));
      toast.success('Gasto atualizado');
    } catch (error) {
      console.error('Error updating gasto variavel:', error);
      toast.error('Erro ao atualizar gasto');
    }
  };

  const deleteGastoVariavel = async (id: string) => {
    try {
      await supabaseApi.deleteGastoVariavel(id);

      setDadosPorMes(prev => ({
        ...prev,
        [mesAtualSelecionado]: {
          ...prev[mesAtualSelecionado],
          gastosVariaveis: prev[mesAtualSelecionado].gastosVariaveis.filter(g => g.id !== id),
        }
      }));
      toast.success('Gasto removido');
    } catch (error) {
      console.error('Error deleting gasto variavel:', error);
      toast.error('Erro ao remover gasto');
    }
  };

  // Metas
  const addMeta = async (meta: Omit<Meta, 'id'>) => {
    if (!userId) {
      toast.error('Usuário não autenticado');
      return;
    }
    try {
      const newMeta = await supabaseApi.createMeta({
        ...meta,
        mes_ano: mesAtualSelecionado,
        user_id: userId,
      });

      setDadosPorMes(prev => ({
        ...prev,
        [mesAtualSelecionado]: {
          ...prev[mesAtualSelecionado],
          metas: [...prev[mesAtualSelecionado].metas, newMeta],
        }
      }));
      toast.success('Meta adicionada');
    } catch (error) {
      console.error('Error adding meta:', error);
      toast.error('Erro ao adicionar meta');
    }
  };

  const deleteMeta = async (id: string) => {
    try {
      await supabaseApi.deleteMeta(id);

      setDadosPorMes(prev => ({
        ...prev,
        [mesAtualSelecionado]: {
          ...prev[mesAtualSelecionado],
          metas: prev[mesAtualSelecionado].metas.filter(m => m.id !== id),
        }
      }));
      toast.success('Meta removida');
    } catch (error) {
      console.error('Error deleting meta:', error);
      toast.error('Erro ao remover meta');
    }
  };

  const updateSalario = async (valor: number) => {
    if (!userId) {
      toast.error('Usuário não autenticado');
      return;
    }
    try {
      await supabaseApi.updateSalario(mesAtualSelecionado, userId, valor);

      setDadosPorMes(prev => ({
        ...prev,
        [mesAtualSelecionado]: {
          ...prev[mesAtualSelecionado],
          salario: valor,
        }
      }));
      toast.success('Salário atualizado');
    } catch (error) {
      console.error('Error updating salario:', error);
      toast.error('Erro ao atualizar salário');
    }
  };

  // Função para obter próximo mês
  const getProximoMes = (mesAtual: string): string => {
    const [ano, mes] = mesAtual.split('-').map(Number);
    const proximaData = new Date(ano, mes); // mes é 0-indexed, então mes = próximo mês
    return `${proximaData.getFullYear()}-${String(proximaData.getMonth() + 1).padStart(2, '0')}`;
  };

  // Adiciona gasto com cartão parcelado
  const addGastoComCartao = async (gastoNome: string, valorTotal: number, despesaId: string, cartaoId: string, numeroParcelas: number = 1) => {
    if (!userId) {
      toast.error('Usuário não autenticado');
      return;
    }
    try {
      const valorParcela = valorTotal / numeroParcelas;
      let mesCorrente = mesAtualSelecionado;

      for (let parcela = 1; parcela <= numeroParcelas; parcela++) {
        const nomeParcela = numeroParcelas > 1
          ? `${gastoNome} (${parcela}/${numeroParcelas}x)`
          : gastoNome;

        // Ensure month exists in state
        if (!dadosPorMes[mesCorrente]) {
          setDadosPorMes(prev => ({
            ...prev,
            [mesCorrente]: {
              mesAno: mesCorrente,
              despesasFixas: [],
              cartoes: [],
              gastosVariaveis: [],
              metas: [],
              salario: 7200,
            }
          }));
        }

        // Create gasto
        await supabaseApi.createGastoVariavel({
          nome: nomeParcela,
          valor: valorParcela,
          mes_ano: mesCorrente,
          user_id: userId,
        });

        // Update despesa fixa
        if (despesaId) {
          const despesa = despesasFixas.find(d => d.id === despesaId);
          if (despesa) {
            await supabaseApi.updateDespesaFixa(despesaId, {
              ...despesa,
              valor: Math.max(0, despesa.valor - valorParcela),
            });
          }
        }

        // Update cartão
        if (cartaoId) {
          const cartao = cartoes.find(c => c.id === cartaoId);
          if (cartao) {
            await supabaseApi.updateCartao(cartaoId, {
              ...cartao,
              valor: cartao.valor + valorParcela,
            });
          }
        }

        mesCorrente = getProximoMes(mesCorrente);
      }

      toast.success('Gasto parcelado adicionado');
      // Reload current month
      await loadMonthData(mesAtualSelecionado, userId);
    } catch (error) {
      console.error('Error adding gasto com cartao:', error);
      toast.error('Erro ao adicionar gasto parcelado');
    }
  };

  // Adiciona nova categoria
  const addCategoria = (categoria: string) => {
    if (categoria && !categorias.includes(categoria)) {
      setCategorias([...categorias, categoria]);
    }
  };

  // Adiciona relatório exportado
  const addRelatorioExportado = async (relatorio: Omit<RelatorioExportado, 'id'>) => {
    if (!userId) {
      toast.error('Usuário não autenticado');
      return;
    }
    try {
      const newRelatorio = await supabaseApi.createRelatorio({
        dataExportacao: relatorio.dataExportacao,
        periodo: relatorio.periodo,
        totalDespesas: relatorio.totalDespesas,
        totalReceitas: relatorio.totalReceitas,
        saldo: relatorio.saldo,
        userId,
      });

      setRelatoriosExportados([newRelatorio, ...relatoriosExportados]);
      toast.success('Relatório exportado com sucesso');
    } catch (error) {
      console.error('Error adding relatorio:', error);
      toast.error('Erro ao exportar relatório');
    }
  };

  // Atualizar ano selecionado
  const handleSetAnoSelecionado = (ano: number) => {
    setAnoSelecionadoInterno(ano);
    const mesAtualReal = getMesAtualKey();
    const [anoAtualReal] = mesAtualReal.split('-').map(Number);

    if (ano === anoAtualReal) {
      setMesAtualSelecionadoInterno(mesAtualReal);
    } else {
      setMesAtualSelecionadoInterno(`${ano}-01`);
    }
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
        isLoading,
        userId,
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
