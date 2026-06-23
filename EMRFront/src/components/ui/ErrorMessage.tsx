import type { HTMLAttributes } from 'react'
import { classNames } from '../../utils/classNames'

interface ErrorMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  message: string
}

export function ErrorMessage({ className, message, ...props }: ErrorMessageProps) {
  return (
    <p
      className={classNames(
        'rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700',
        className,
      )}
      role="alert"
      {...props}
    >
      {message}
    </p>
  )
}
