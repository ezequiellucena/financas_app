import { useFinance } from '../context/FinanceContext';

export function Vencimentos() {
  const { despesasFixas, cartoes } = useFinance();

  // Combine all items with due dates
  const allVencimentos = [
    ...despesasFixas.map(d => ({ tipo: 'Despesa Fixa', nome: d.nome, valor: d.valor, vencimento: d.vencimento })),
    ...cartoes.map(c => ({ tipo: 'Cartão', nome: c.apelido, valor: c.valor, vencimento: c.vencimento }))
  ].sort((a, b) => parseInt(a.vencimento) - parseInt(b.vencimento));

  return (
    <div className="space-y-4">
      <div className="bg-card backdrop-blur-xl rounded-3xl p-4 shadow-xl shadow-primary/5 border border-border/50">
        <h3 className="font-semibold text-card-foreground mb-3">Todos os Vencimentos</h3>
        {allVencimentos.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 text-sm">Nenhum vencimento cadastrado</p>
        ) : (
          <div className="space-y-2">
            {allVencimentos.map((item, idx) => (
              <div
                key={idx}
                className="p-3 border border-border/50 rounded-2xl hover:bg-accent"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-card-foreground text-sm">{item.nome}</p>
                    <p className="text-xs text-muted-foreground">{item.tipo} • Vence dia {item.vencimento}</p>
                  </div>
                  <p className="font-semibold text-card-foreground text-sm">
                    R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}