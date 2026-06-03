interface ConfirmDeleteModalProps {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ isOpen, itemName, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card backdrop-blur-xl rounded-2xl shadow-xl max-w-sm w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-3">
            Confirmar Exclusão
          </h3>
          <p className="text-foreground mb-6">
            Você deseja excluir <span className="font-medium">"{itemName}"</span>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-secondary text-foreground rounded-2xl hover:bg-secondary/40 transition-all duration-200"
            >
              Não
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-200"
            >
              Sim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}