import type { HTMLAttributes } from 'react'
import { classNames } from '../../utils/classNames'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'gray' | 'green' | 'red' | 'teal'
}

const toneClassNames = {
  gray: 'bg-slate-100 text-slate-700',
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  teal: 'bg-teal-50 text-teal-700',
}

export function Badge({ className, tone = 'gray', ...props }: BadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex rounded px-2 py-1 text-xs font-semibold',
        toneClassNames[tone],
        className,
      )}
      {...props}
    />
  )
}
