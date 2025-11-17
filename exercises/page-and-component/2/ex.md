## 2) TextField with label, description, error, and a11y

Goal: build a field that's accessible, flexible, and consistent.

Constraints:

- label connects to input via id/htmlFor
- forwards ref and supports all native input props

## Solution

```tsx
// components/TextField.tsx
import { forwardRef, InputHTMLAttributes, useId } from 'react'
import clsx from 'clsx'

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
```

## Explanation

Why this is good

- Centralizes error visuals and semantics.
- You’ll reuse it across all forms.

## Notes:
