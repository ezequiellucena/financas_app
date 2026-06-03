import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { toast } from 'sonner';
import { CurrencyInput } from './CurrencyInput';

export function Poupanca() {
  const { metas, addMeta, deleteMeta } = useFinance();

  const [formData, setFormData] = useState({
    descricao: '',
    valorTotal: '',
    valorMensal: ''
  });

  const totalPoupancaMensal = metas.reduce((sum, meta) => sum + meta.valorMensal, 0);
  const totalPoupancaAcumulado = metas.reduce((sum, meta) => sum + meta.valorTotal, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.descricao || !formData.valorTotal || !formData.valorMensal) {
      toast.error('Preencha todos os campos');
      return;
    }

    addMeta({
      descricao: formData.descricao,
      valorTotal: parseFloat(formData.valorTotal),
      valorMensal: parseFloat(formData.valorMensal)
    });

    toast.success('Meta adicionada');
    setFormData({ descricao: '', valorTotal: '', valorMensal: '' });
  };

  return (
    <div className="space-y-4">
      {/* Total */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card backdrop-blur-xl rounded-3xl p-4 shadow-xl shadow-primary/5 border border-border/50">
          <h3 className="text-xs text-muted-foreground mb-1">Mensal</h3>
          <p className="text-2xl font-semibold text-green-600">
            R$ {totalPoupancaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-card backdrop-blur-xl rounded-3xl p-4 shadow-xl shadow-primary/5 border border-border/50">
          <h3 className="text-xs text-muted-foreground mb-1">Meta Total</h3>
          <p className="text-2xl font-semibold text-primary">
            R$ {totalPoupancaAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card backdrop-blur-xl rounded-3xl p-4 shadow-xl shadow-primary/5 border border-border/50">
        <h3 className="font-semibold text-card-foreground mb-3">Adicionar Meta</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-foreground mb-1">Descrição da Meta</label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Viagem de férias"
              className="w-full px-3 py-2 border border-border/50 rounded-xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground placeholder-muted-foreground/60 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-foreground mb-1">Valor Total da Meta</label>
            <CurrencyInput
              value={formData.valorTotal}
              onChange={(value) => setFormData({ ...formData, valorTotal: value })}
              placeholder="R$ 5.000,00"
              className="w-full px-3 py-2 border border-border/50 rounded-xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground placeholder-muted-foreground/60 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">Objetivo final que deseja alcançar</p>
          </div>

          <div>
            <label className="block text-xs text-foreground mb-1">Valor Mensal</label>
            <CurrencyInput
              value={formData.valorMensal}
              onChange={(value) => setFormData({ ...formData, valorMensal: value })}
              placeholder="R$ 500,00"
              className="w-full px-3 py-2 border border-border/50 rounded-xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground placeholder-muted-foreground/60 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">Valor que será descontado do salário mensalmente</p>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 text-sm"
          >
            Adicionar Meta
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-card backdrop-blur-xl rounded-3xl p-4 shadow-xl shadow-primary/5 border border-border/50">
        <h3 className="font-semibold text-card-foreground mb-3">Metas Cadastradas</h3>
        {metas.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 text-sm">Nenhuma meta cadastrada</p>
        ) : (
          <div className="space-y-2">
            {metas.map((meta) => (
              <div
                key={meta.id}
                className="p-3 border border-border/50 rounded-2xl hover:bg-accent/60 backdrop-blur-sm"
              >
                <div className="mb-2">
                  <p className="font-medium text-card-foreground text-sm">{meta.descricao}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Meta Total</p>
                      <p className="font-semibold text-primary text-sm">
                        R$ {meta.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-muted-foreground">Por Mês</p>
                      <p className="font-semibold text-green-600 text-sm">
                        R$ {meta.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-600 h-full transition-all duration-300"
                        style={{ width: `${Math.min((meta.valorMensal / meta.valorTotal) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.ceil(meta.valorTotal / meta.valorMensal)} meses para completar
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    deleteMeta(meta.id);
                    toast.success('Meta removida');
                  }}
                  className="w-full px-3 py-1.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-200 text-xs"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}