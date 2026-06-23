import type { ReactNode } from 'react'
import { classNames } from '../../utils/classNames'
import { Button } from './Button'

interface ModalProps {
  children: ReactNode
  className?: string
  isOpen: boolean
  onClose: () => void
  title: string
}

export function Modal({ children, className, isOpen, onClose, title }: ModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <section
        aria-modal="true"
        className={classNames(
          'w-full max-w-lg rounded-lg bg-white p-6 shadow-lg',
          className,
        )}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <Button onClick={onClose} variant="secondary">
            닫기
          </Button>
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </div>
  )
}
