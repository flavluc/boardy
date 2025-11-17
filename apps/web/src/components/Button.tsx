import clsx from 'clsx'
import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type Variant = 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type Props = {
  variant?: Variant
  size?: Size
} & ButtonHTMLAttributes<HTMLButtonElement>

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs))

const sizeCls: Record<Size, string> = {
  sm: 'text-sm px-2 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
}

const variantCls: Record<Variant, string> = {
  solid: 'bg-black text-white hover:bg-black/90 disabled:bg-black/20 disabled:text-white/60',
  outline: 'border border-black/20 hover:bg-black/5 disabled:opacity-50',
  ghost: 'hover:bg-black/5 disabled:opacity-50',
}

export const Button = ({ variant = 'solid', size = 'md', className, children, ...rest }: Props) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black/30 cursor-pointer',
        variantCls[variant],
        sizeCls[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
