import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { CurrencyInput } from './CurrencyInput';
import { formatDateTime } from '../utils/dateFormatters';

export function GastosVariaveis() {
  const { gastosVariaveis, addGastoVariavel, updateGastoVariavel, deleteGastoVariavel, despesasFixas, cartoes, addGastoComCartao } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; nome: string }>({
    isOpen: false,
    id: '',
    nome: ''
  });

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

    if (editingId) {
      updateGastoVariavel(editingId, {
        nome: nomeGasto,
        valor: valorTotal
      });
      toast.success('Gasto atualizado');
      setEditingId(null);
      setFormData({ nome: '', valor: '', despesaId: '', formaPagamento: '', tipoCartao: '', cartaoId: '', numeroParcelas: '1' });
    } else {
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
    }
  };

  const handleEdit = (gasto: any) => {
    setFormData({
      nome: gasto.nome,
      valor: gasto.valor.toString(),
      despesaId: '',
      formaPagamento: '',
      tipoCartao: '',
      cartaoId: '',
      numeroParcelas: '1'
    });
    setEditingId(gasto.id);
  };

  const handleDeleteClick = (id: string, nome: string) => {
    setDeleteModal({ isOpen: true, id, nome });
  };

  const handleConfirmDelete = () => {
    deleteGastoVariavel(deleteModal.id);
    toast.success('Gasto excluído');
    setDeleteModal({ isOpen: false, id: '', nome: '' });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, id: '', nome: '' });
  };

  // Ordenar gastos do mais recente para o mais antigo
  const gastosOrdenados = [...gastosVariaveis].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="bg-card backdrop-blur-xl rounded-3xl p-4 shadow-xl shadow-primary/5 border border-border/50">
        <h3 className="font-semibold text-card-foreground mb-3">Cadastrar Novo Gasto</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 1. Debitar de qual despesa (Opcional) */}
          {!editingId && (
            <div>
              <label className="block text-xs text-foreground mb-1">Debitar de qual despesa? (Opcional)</label>
              <p className="text-xs text-muted-foreground mb-1">
                Se não preencher, o gasto será cadastrado na categoria "Outros"
              </p>
              <select
                value={formData.despesaId}
                onChange={(e) => {
                  setFormData({ ...formData, despesaId: e.target.value, nome: '' });
                }}
                className="w-full px-3 py-2 border border-border/50 rounded-xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground text-sm"
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
          )}

          {/* 2. Nome do Gasto (ocultar se despesa selecionada e não estiver editando) */}
          {(mostrarNome || editingId) && (
            <div>
              <label className="block text-xs text-foreground mb-1">Nome do Gasto</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Restaurante"
                className="w-full px-3 py-2 border border-border/50 rounded-xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground placeholder-muted-foreground/60 text-sm"
              />
            </div>
          )}

          {/* 3. Valor */}
          <div>
            <label className="block text-xs text-foreground mb-1">Valor</label>
            <CurrencyInput
              value={formData.valor}
              onChange={(value) => setFormData({ ...formData, valor: value })}
              placeholder="R$ 0,00"
              className="w-full px-3 py-2 border border-border/50 rounded-xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground placeholder-muted-foreground/60 text-sm"
            />
          </div>

          {!editingId && (
            <>
              {/* 4. Forma de Pagamento */}
              <div>
                <label className="block text-xs text-foreground mb-1">Forma de Pagamento (Opcional)</label>
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
                  className="w-full px-3 py-2 border border-border/50 rounded-xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground text-sm"
                >
                  <option value="">Selecione a forma de pagamento</option>
                  <option value="pix">PIX</option>
                  <option value="cartao">Cartão</option>
                </select>
              </div>

              {/* 5. Tipo de Cartão (débito/crédito) - aparece se forma = cartão */}
              {mostrarTipoCartao && (
                <div>
                  <label className="block text-xs text-foreground mb-1">Tipo de Cartão</label>
                  <select
                    value={formData.tipoCartao}
                    onChange={(e) => {
                      setFormData({ ...formData, tipoCartao: e.target.value, numeroParcelas: '1' });
                    }}
                    className="w-full px-3 py-2 border border-border/50 rounded-xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground text-sm"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="debito">Débito</option>
                    <option value="credito">Crédito</option>
                  </select>
                </div>
              )}

              {/* 6. Número de Parcelas - aparece se tipo = crédito */}
              {mostrarParcelas && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3">
                  <label className="block text-xs text-foreground mb-1">Número de Parcelas</label>
                  <select
                    value={formData.numeroParcelas}
                    onChange={(e) => setFormData({ ...formData, numeroParcelas: e.target.value })}
                    className="w-full px-3 py-2 border border-border/50 rounded-xl bg-card text-card-foreground text-sm mb-1"
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
                  <label className="block text-xs text-foreground mb-1">Pagar com qual cartão?</label>
                  <select
                    value={formData.cartaoId}
                    onChange={(e) => {
                      setFormData({ ...formData, cartaoId: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-border/50 rounded-xl bg-input-background/60 backdrop-blur-sm/60 backdrop-blur-sm text-foreground text-sm"
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
            </>
          )}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 text-sm"
            >
              {editingId ? 'Atualizar Gasto' : 'Cadastrar Gasto'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ nome: '', valor: '', despesaId: '', formaPagamento: '', tipoCartao: '', cartaoId: '', numeroParcelas: '1' });
                }}
                className="w-full mt-2 px-4 py-2 bg-secondary text-foreground rounded-xl hover:bg-secondary/40 transition-all duration-200 text-sm"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-card backdrop-blur-xl rounded-3xl p-4 shadow-xl shadow-primary/5 border border-border/50">
        <h3 className="font-semibold text-card-foreground mb-3">Gastos Cadastrados</h3>
        <div className="space-y-2">
          {gastosOrdenados.map((gasto) => (
            <div
              key={gasto.id}
              className="p-3 border border-border/50 rounded-2xl hover:bg-accent/60 backdrop-blur-sm"
            >
              <div className="mb-2">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-card-foreground text-sm flex-1">{gasto.nome}</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-card-foreground text-sm">
                      R$ {gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <button
                      onClick={() => handleDeleteClick(gasto.id, gasto.nome)}
                      className="p-1.5 text-red-600 hover:bg-red-500/5 rounded-xl transition-all duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(new Date(gasto.createdAt))}
                </p>
              </div>
              <button
                onClick={() => handleEdit(gasto)}
                className="w-full px-3 py-1.5 bg-secondary/10 text-foreground rounded-xl hover:bg-secondary/30 transition-all duration-200 text-xs"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.nome}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}