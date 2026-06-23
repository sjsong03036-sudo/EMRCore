import type { HTMLAttributes, ReactNode } from 'react'
import { classNames } from '../../utils/classNames'

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  action?: ReactNode
  description?: string
  title: string
}

export function EmptyState({
  action,
  className,
  description,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={classNames(
        'rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center',
        className,
      )}
      {...props}
    >
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
