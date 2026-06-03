import { useFinance } from '../context/FinanceContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthCarouselProps {
  pageTitle: string;
}

export function MonthCarousel({ pageTitle }: MonthCarouselProps) {
  const { mesAtualSelecionado, setMesAtualSelecionado, salario, despesasFixas, cartoes, gastosVariaveis, metas, anoSelecionado } = useFinance();

  // Calcular saldo disponível
  const totalDespesas = despesasFixas.reduce((sum, d) => sum + d.valor, 0) +
    cartoes.reduce((sum, c) => sum + c.valor, 0) +
    gastosVariaveis.reduce((sum, g) => sum + g.valor, 0) +
    metas.reduce((sum, m) => sum + m.valorMensal, 0);
  const saldo = salario - totalDespesas;

  // Formatar mês para exibição
  const formatarMes = (mesAno: string) => {
    const [ano, mes] = mesAno.split('-');
    const data = new Date(parseInt(ano), parseInt(mes) - 1);
    return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  // Navegar para mês anterior
  const mesAnterior = () => {
    const [ano, mes] = mesAtualSelecionado.split('-').map(Number);
    let novoAno = ano;
    let novoMes = mes - 1;

    // Se estiver em janeiro, voltar para dezembro do ano anterior
    if (novoMes < 1) {
      novoMes = 12;
      novoAno = ano - 1;
    }

    const novoMesKey = `${novoAno}-${String(novoMes).padStart(2, '0')}`;
    setMesAtualSelecionado(novoMesKey);
  };

  // Navegar para próximo mês
  const proximoMes = () => {
    const [ano, mes] = mesAtualSelecionado.split('-').map(Number);
    let novoAno = ano;
    let novoMes = mes + 1;

    // Se estiver em dezembro, avançar para janeiro do próximo ano
    if (novoMes > 12) {
      novoMes = 1;
      novoAno = ano + 1;
    }

    const novoMesKey = `${novoAno}-${String(novoMes).padStart(2, '0')}`;
    setMesAtualSelecionado(novoMesKey);
  };

  // Verificar se pode navegar
  const [anoAtual, mesNumAtual] = mesAtualSelecionado.split('-').map(Number);

  // Sempre pode avançar (para ver gastos futuros/parcelas)
  const podeProximoMes = true;

  // Sempre pode voltar
  const podeMesAnterior = true;

  // Cor do background baseada no saldo
  const bgGradient = saldo >= 0
    ? 'from-purple-600 via-purple-500 to-violet-600'
    : 'from-red-600 via-red-500 to-pink-600';

  return (
    <div className={`bg-gradient-to-br ${bgGradient} rounded-b-[2.5rem] shadow-xl`}>
      {/* Page Title */}
      <div className="text-center pt-6 pb-3">
        <h1 className="text-white text-lg font-semibold">{pageTitle}</h1>
      </div>

      {/* Month and Balance */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={mesAnterior}
            disabled={!podeMesAnterior}
            className={`p-2 rounded-full transition-all duration-200 ${
              podeMesAnterior
                ? 'text-white hover:bg-white/10 backdrop-blur-sm'
                : 'text-white/30 cursor-not-allowed'
            }`}
            aria-label="Mês anterior"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="text-center flex-1">
            <h2 className="text-white text-sm font-medium mb-2 opacity-90">
              {formatarMes(mesAtualSelecionado)}
            </h2>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl px-6 py-3 border border-white/20">
              <p className="text-xs text-white/80 mb-1">Saldo Disponível</p>
              <p className="font-bold text-white text-3xl tracking-tight">
                {saldo < 0 ? '- ' : ''}R$ {Math.abs(saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <button
            onClick={proximoMes}
            disabled={!podeProximoMes}
            className={`p-2 rounded-full transition-all duration-200 ${
              podeProximoMes
                ? 'text-white hover:bg-white/10 backdrop-blur-sm'
                : 'text-white/30 cursor-not-allowed'
            }`}
            aria-label="Próximo mês"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}