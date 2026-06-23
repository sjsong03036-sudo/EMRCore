import type { HTMLAttributes } from 'react'
import { classNames } from '../../utils/classNames'

export function LoadingSpinner({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-label="로딩 중"
      className={classNames(
        'h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-teal-700',
        className,
      )}
      role="status"
      {...props}
    />
  )
}
