import type { InputHTMLAttributes } from 'react'
import { classNames } from '../../utils/classNames'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export function Input({ className, error, id, label, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        aria-invalid={error ? 'true' : undefined}
        className={classNames(
          'w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100',
          label && 'mt-2',
          error
            ? 'border-red-300 focus:border-red-600 focus:ring-red-100'
            : 'border-slate-300 focus:border-teal-600 focus:ring-teal-100',
          className,
        )}
        id={id}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
