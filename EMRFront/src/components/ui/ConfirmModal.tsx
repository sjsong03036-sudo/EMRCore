import { Button } from './Button'
import { Modal } from './Modal'

interface ConfirmModalProps {
  confirmLabel?: string
  description: string
  isConfirming?: boolean
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

export function ConfirmModal({
  confirmLabel = '확인',
  description,
  isConfirming = false,
  isOpen,
  onClose,
  onConfirm,
  title,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button disabled={isConfirming} onClick={onClose} variant="secondary">
          취소
        </Button>
        <Button isLoading={isConfirming} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
