## 5) Modal (Portal + focus trap-lite + Escape/backdrop)

Goal: create an accessible modal you can reuse everywhere.

onstraints:

- renders in a portal
- closes on Escape and on backdrop click
- returns focus to trigger (basic focus management)

## Solution

```tsx
// components/Modal.tsx
import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose(): void
  title: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previouslyFocused = document.activeElement as HTMLElement | null
    ref.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 grid place-items-center"
      onMouseDown={(e) => {
        // close when clicking backdrop only
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        ref={ref}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-xl bg-white p-4 shadow-xl outline-none"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
```

## Explanation

Why this is good

- Portals avoid stacking-context issues.
- Keyboard, focus, and backdrop behavior handled.
- Minimal yet production-viable.

## Notes:
