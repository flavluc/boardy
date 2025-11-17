import clsx from 'clsx'
import { forwardRef, InputHTMLAttributes, useId } from 'react'

type Props = {
  label: string
  description?: string
  error?: string
  requiredMark?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label, description, error, requiredMark = true, id, className, ...rest },
  ref
) {
  const autoId = useId()
  const inputId = id ?? `tf-${autoId}`
  const descId = description ? `${inputId}-desc` : undefined
  const errId = error ? `${inputId}-err` : undefined

  return (
    <div className="grid gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
        {rest.required && requiredMark ? <span className="text-red-600"> *</span> : null}
      </label>

      <input
        id={inputId}
        ref={ref}
        className={clsx(
          'border rounded-lg px-3 py-2 outline-none',
          error ? 'border-red-600' : 'border-black/20',
          className
        )}
        {...rest}
      />

      {description && (
        <p id={descId} className="text-xs text-black/60">
          {description}
        </p>
      )}
      {error && (
        <p id={errId} className="text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  )
})

export default TextField
