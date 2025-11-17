## 1) Reusable Button (variants, sizes, polymorphic)

Goal: build a single Button component that covers 90% of buttons you’ll need.

Constraints:

- supports variant: 'solid' | 'outline' | 'ghost'
- supports size: 'sm' | 'md' | 'lg'
- passes through native button props
- disables correctly and is keyboard-accessible

## Solution

```tsx
// components/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

type Variant = 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type Props = {
  variant?: Variant
  size?: Size
} & ButtonHTMLAttributes<HTMLButtonElement>

const sizeCls: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
}

const variantCls: Record<Variant, string> = {
  solid: 'bg-black text-white hover:bg-black/90 disabled:bg-black/20 disabled:text-white/60',
  outline: 'border border-black/20 hover:bg-black/5 disabled:opacity-50',
  ghost: 'hover:bg-black/5 disabled:opacity-50',
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'solid', size = 'md', className, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-black/30',
        sizeCls[size],
        variantCls[variant],
        className
      )}
      {...rest}
    />
  )
})
```

## Explanation

Why this is good

- One prop-driven component avoids bespoke buttons.
- Proper disabled styling and focus ring covers a11y.
- forwardRef keeps it usable in forms, tooltips, etc.

## Notes:

- define type Props for your components
- you can use union types to define possible values for your pros, making it strict and having autocomplete
- you can use intersection types to combine props from other components
- for components that wraps html elements it's a good practive to intersect with native element props:
  - ButtonHTMLAttributes<HTMLButtonElement>
  - InputHTMLAttributes<HTMLInputElement>
  - TextareaHTMLAttributes<HTMLTextAreaElement>
  - etc
- (...inputs: (string | undefined)[]): takes all parameters and collects them as array
- flex layout: make its children flexible items, allowing to set direction, alignment, spacing, etc
- you can call forwardRef to pass ref to function components children

```ts
export const Button =
  forwardRef<HTMLButtonElement, Props>(
    function Button(props, ref) {
      return (
        <button
          ref={ref}
```
