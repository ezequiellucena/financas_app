import { useFinance } from '../context/FinanceContext';
import { Download, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { formatDateTime } from '../utils/dateFormatters';

export function Relatorios() {
  const {
    despesasFixas,
    cartoes,
    gastosVariaveis,
    metas,
    salario,
    relatoriosExportados,
    addRelatorioExportado
  } = useFinance();

  const handleExportarExcel = () => {
    // Calcular totais
    const totalDespesasFixas = despesasFixas.reduce((sum, d) => sum + d.valor, 0);
    const totalCartoes = cartoes.reduce((sum, c) => sum + c.valor, 0);
    const totalGastosVariaveis = gastosVariaveis.reduce((sum, g) => sum + g.valor, 0);
    const totalPoupanca = metas.reduce((sum, m) => sum + m.valorMensal, 0);
    const totalDespesas = totalDespesasFixas + totalCartoes + totalGastosVariaveis + totalPoupanca;
    const saldo = salario - totalDespesas;

    // Criar workbook
    const wb = XLSX.utils.book_new();

    // Aba 1: Resumo
    const resumoData = [
      ['CONTROLE FINANCEIRO - RESUMO'],
      [''],
      ['Período', new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })],
      ['Data de Exportação', new Date().toLocaleString('pt-BR')],
      [''],
      ['RECEITAS'],
      ['Salário', salario],
      [''],
      ['DESPESAS'],
      ['Despesas Fixas', totalDespesasFixas],
      ['Cartões de Crédito', totalCartoes],
      ['Gastos Variáveis', totalGastosVariaveis],
      ['Poupança (Mensal)', totalPoupanca],
      ['Total de Despesas', totalDespesas],
      [''],
      ['SALDO', saldo],
    ];
    const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

    // Aba 2: Despesas Fixas
    const despesasFixasData = [
      ['DESPESAS FIXAS'],
      [''],
      ['Nome', 'Categoria', 'Vencimento', 'Valor'],
      ...despesasFixas.map(d => [d.nome, d.categoria, d.vencimento, d.valor])
    ];
    const wsDespesasFixas = XLSX.utils.aoa_to_sheet(despesasFixasData);
    XLSX.utils.book_append_sheet(wb, wsDespesasFixas, 'Despesas Fixas');

    // Aba 3: Cartões
    const cartoesData = [
      ['CARTÕES DE CRÉDITO'],
      [''],
      ['Apelido', 'Bandeira', 'Vencimento', 'Valor'],
      ...cartoes.map(c => [c.apelido, c.bandeira, c.vencimento, c.valor])
    ];
    const wsCartoes = XLSX.utils.aoa_to_sheet(cartoesData);
    XLSX.utils.book_append_sheet(wb, wsCartoes, 'Cartões');

    // Aba 4: Gastos Variáveis
    const gastosData = [
      ['GASTOS VARIÁVEIS (OUTROS)'],
      [''],
      ['Nome', 'Data/Hora', 'Valor'],
      ...gastosVariaveis.map(g => [
        g.nome,
        formatDateTime(new Date(g.createdAt)),
        g.valor
      ])
    ];
    const wsGastos = XLSX.utils.aoa_to_sheet(gastosData);
    XLSX.utils.book_append_sheet(wb, wsGastos, 'Gastos Variáveis');

    // Aba 5: Poupança
    if (metas.length > 0) {
      const poupancaData = [
        ['POUPANÇA'],
        [''],
        ['Descrição', 'Valor Total', 'Valor Mensal', 'Meses para Completar'],
        ...metas.map(m => [
          m.descricao,
          m.valorTotal,
          m.valorMensal,
          Math.ceil(m.valorTotal / m.valorMensal)
        ])
      ];
      const wsPoupanca = XLSX.utils.aoa_to_sheet(poupancaData);
      XLSX.utils.book_append_sheet(wb, wsPoupanca, 'Poupança');
    }

    // Gerar arquivo
    const fileName = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    // Adicionar ao histórico
    const periodo = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    addRelatorioExportado({
      dataExportacao: new Date(),
      periodo,
      totalDespesas,
      totalReceitas: salario,
      saldo
    });

    toast.success('Relatório exportado com sucesso!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-card-foreground">Relatórios</h2>

      {/* Botão de Exportar */}
      <div className="bg-card backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-primary/5 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-1">Exportar Relatório</h3>
            <p className="text-sm text-muted-foreground">
              Gere um relatório completo em Excel com todas as suas finanças
            </p>
          </div>
          <FileText size={40} className="text-green-600" />
        </div>

        <button
          onClick={handleExportarExcel}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all duration-200 font-medium"
        >
          <Download size={20} />
          Exportar para Excel
        </button>

        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-2xl">
          <p className="text-xs text-foreground">
            <strong>O relatório incluirá:</strong> Resumo financeiro, Despesas Fixas, Cartões,
            Gastos Variáveis e Poupança do mês atual
          </p>
        </div>
      </div>

      {/* Histórico de Exportações */}
      <div className="bg-card backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-primary/5 border border-border/50">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Histórico de Exportações</h3>

        {relatoriosExportados.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-muted-foreground text-sm">Nenhum relatório exportado ainda</p>
            <p className="text-muted-foreground text-xs mt-1">
              Exporte seu primeiro relatório usando o botão acima
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {relatoriosExportados.map((relatorio) => (
              <div
                key={relatorio.id}
                className="p-4 border border-border/50 rounded-2xl hover:bg-accent transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-card-foreground text-sm mb-1">
                      Relatório - {relatorio.periodo}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(new Date(relatorio.dataExportacao))}
                    </p>
                  </div>
                  <FileText size={20} className="text-green-600" />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-border/30">
                  <div>
                    <p className="text-xs text-muted-foreground">Receitas</p>
                    <p className="text-sm font-semibold text-green-600">
                      R$ {relatorio.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Despesas</p>
                    <p className="text-sm font-semibold text-red-600">
                      R$ {relatorio.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Saldo</p>
                    <p className={`text-sm font-semibold ${relatorio.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {Math.abs(relatorio.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}