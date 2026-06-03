import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { CurrencyInput } from './CurrencyInput';

interface CadastrarGastoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CadastrarGastoModal({ isOpen, onClose }: CadastrarGastoModalProps) {
  const { despesasFixas, cartoes, addGastoComCartao, addGastoVariavel } = useFinance();

  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    despesaId: '',
    formaPagamento: '', // 'cartao' ou 'pix'
    tipoCartao: '', // 'debito' ou 'credito'
    cartaoId: '',
    numeroParcelas: '1'
  });

  const mostrarNome = !formData.despesaId;
  const mostrarTipoCartao = formData.formaPagamento === 'cartao';
  const mostrarParcelas = formData.formaPagamento === 'cartao' && formData.tipoCartao === 'credito';
  const mostrarQualCartao = formData.formaPagamento === 'cartao';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determinar o nome do gasto
    let nomeGasto = formData.nome;
    if (formData.despesaId) {
      const despesa = despesasFixas.find(d => d.id === formData.despesaId);
      nomeGasto = despesa?.nome || '';
    }

    if (!nomeGasto || !formData.valor) {
      toast.error('Preencha o nome e o valor do gasto');
      return;
    }

    const valorTotal = parseFloat(formData.valor);
    const numeroParcelas = parseInt(formData.numeroParcelas) || 1;

    // Verificar se selecionou despesa e validar saldo
    if (formData.despesaId) {
      const despesa = despesasFixas.find(d => d.id === formData.despesaId);
      const valorParcela = valorTotal / numeroParcelas;

      if (despesa && valorParcela > despesa.valor) {
        toast.error(`Valor da parcela (R$ ${valorParcela.toFixed(2)}) excede o saldo disponível em ${despesa.nome}`);
        return;
      }
    }

    // Verificar se forma de pagamento é cartão mas não selecionou qual cartão
    if (formData.formaPagamento === 'cartao' && !formData.cartaoId) {
      toast.error('Selecione qual cartão usar');
      return;
    }

    // Se selecionou despesa ou cartão, processa com parcelamento
    if (formData.despesaId || formData.cartaoId) {
      addGastoComCartao(nomeGasto, valorTotal, formData.despesaId, formData.cartaoId, numeroParcelas);

      if (numeroParcelas > 1) {
        const valorParcela = valorTotal / numeroParcelas;
        toast.success(`Gasto parcelado em ${numeroParcelas}x de R$ ${valorParcela.toFixed(2)}!`);
      } else {
        toast.success('Gasto cadastrado!');
      }
    } else {
      // Se não selecionou, apenas adiciona como gasto variável
      addGastoVariavel({ nome: nomeGasto, valor: valorTotal });
      toast.success('Gasto cadastrado em "Outros"!');
    }

    setFormData({ nome: '', valor: '', despesaId: '', formaPagamento: '', tipoCartao: '', cartaoId: '', numeroParcelas: '1' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-card backdrop-blur-xl w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card backdrop-blur-xl border-b border-border px-4 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-card-foreground">Cadastrar Gasto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary/20 rounded-2xl transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 1. Debitar de qual despesa (Opcional) */}
          <div>
            <label className="block text-sm text-foreground mb-1">Debitar de qual despesa? (Opcional)</label>
            <p className="text-xs text-muted-foreground mb-2">
              Se não preencher, o gasto será cadastrado na categoria "Outros"
            </p>
            <select
              value={formData.despesaId}
              onChange={(e) => {
                setFormData({ ...formData, despesaId: e.target.value, nome: '' });
              }}
              className="w-full px-3 py-2 border border-border/50 rounded-2xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground"
            >
              <option value="">Não debitar de despesa</option>
              {despesasFixas.map((despesa) => (
                <option key={despesa.id} value={despesa.id}>
                  {despesa.nome} - R$ {despesa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} disponível
                </option>
              ))}
            </select>
            {formData.despesaId && (
              <p className="text-xs text-muted-foreground mt-1">
                O valor será deduzido desta despesa
              </p>
            )}
          </div>

          {/* 2. Nome do Gasto (ocultar se despesa selecionada) */}
          {mostrarNome && (
            <div>
              <label className="block text-sm text-foreground mb-2">Nome do Gasto</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Supermercado, Restaurante"
                className="w-full px-3 py-2 border border-border/50 rounded-2xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground placeholder-muted-foreground/60"
                required
              />
            </div>
          )}

          {/* 3. Valor */}
          <div>
            <label className="block text-sm text-foreground mb-2">Valor</label>
            <CurrencyInput
              value={formData.valor}
              onChange={(value) => setFormData({ ...formData, valor: value })}
              placeholder="R$ 0,00"
              className="w-full px-3 py-2 border border-border/50 rounded-2xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground placeholder-muted-foreground/60"
            />
          </div>

          {/* 4. Forma de Pagamento */}
          <div>
            <label className="block text-sm text-foreground mb-2">Forma de Pagamento (Opcional)</label>
            <select
              value={formData.formaPagamento}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  formaPagamento: e.target.value,
                  tipoCartao: '',
                  cartaoId: '',
                  numeroParcelas: '1'
                });
              }}
              className="w-full px-3 py-2 border border-border/50 rounded-2xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground"
            >
              <option value="">Selecione a forma de pagamento</option>
              <option value="pix">PIX</option>
              <option value="cartao">Cartão</option>
            </select>
          </div>

          {/* 5. Tipo de Cartão (débito/crédito) - aparece se forma = cartão */}
          {mostrarTipoCartao && (
            <div>
              <label className="block text-sm text-foreground mb-2">Tipo de Cartão</label>
              <select
                value={formData.tipoCartao}
                onChange={(e) => {
                  setFormData({ ...formData, tipoCartao: e.target.value, numeroParcelas: '1' });
                }}
                className="w-full px-3 py-2 border border-border/50 rounded-2xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground"
              >
                <option value="">Selecione o tipo</option>
                <option value="debito">Débito</option>
                <option value="credito">Crédito</option>
              </select>
            </div>
          )}

          {/* 6. Número de Parcelas - aparece se tipo = crédito */}
          {mostrarParcelas && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <label className="block text-sm text-foreground mb-2">Número de Parcelas</label>
              <select
                value={formData.numeroParcelas}
                onChange={(e) => setFormData({ ...formData, numeroParcelas: e.target.value })}
                className="w-full px-3 py-2 border border-border/50 rounded-2xl bg-card backdrop-blur-xl text-card-foreground mb-2"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                  <option key={n} value={n}>
                    {n}x {n > 1 && formData.valor ?
                      `de R$ ${(parseFloat(formData.valor) / n).toFixed(2)}` :
                      '(à vista)'}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                {parseInt(formData.numeroParcelas) > 1 ? (
                  <>
                    <strong>Parcelamento:</strong> O valor será dividido em {formData.numeroParcelas} meses consecutivos
                    {formData.despesaId && ', debitando da despesa selecionada'}
                    {formData.cartaoId && ', adicionando ao cartão'}.
                  </>
                ) : (
                  'Pagamento à vista no mês atual'
                )}
              </p>
            </div>
          )}

          {/* 7. Pagar com qual cartão? - aparece se forma = cartão */}
          {mostrarQualCartao && (
            <div>
              <label className="block text-sm text-foreground mb-2">Pagar com qual cartão?</label>
              <select
                value={formData.cartaoId}
                onChange={(e) => {
                  setFormData({ ...formData, cartaoId: e.target.value });
                }}
                className="w-full px-3 py-2 border border-border/50 rounded-2xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground"
              >
                <option value="">Selecione o cartão</option>
                {cartoes.map((cartao) => (
                  <option key={cartao.id} value={cartao.id}>
                    {cartao.apelido} - R$ {cartao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
              {formData.cartaoId && (
                <p className="text-xs text-muted-foreground mt-1">
                  O valor será adicionado à fatura deste cartão
                </p>
              )}
            </div>
          )}

          <div className="pt-4 space-y-2">
            <button
              type="submit"
              className="w-full px-4 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all duration-200 font-medium"
            >
              Cadastrar Gasto
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-3 bg-secondary text-foreground rounded-2xl hover:bg-secondary/40 transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}