import clsx from 'clsx'
import {
  Children,
  createContext,
  isValidElement,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react'

type TabsContext = {
  value: string
  setValue(v: string): void
  idBase: string
}

type TabsProps = {
  defaultValue?: string
  value?: string
  onValueChange?(v: string): void
  children: ReactNode
}

type TabsListProps = {
  children: ReactNode
}

type TabsTriggerProps = {
  value: string
  children: ReactNode
}

const Ctx = createContext<TabsContext | null>(null)
const useTabs = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Tabs.* must be used within <Tabs>')
  return ctx
}

export function Tabs({ defaultValue, value: controlled, onValueChange, children }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? '')
  const isControlled = controlled != null
  const value = isControlled ? controlled! : internal
  const setValue = (v: string) => (isControlled ? onValueChange?.(v) : setInternal(v))
  const idBase = useId()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ctx = useMemo(() => ({ value, setValue, idBase }), [value, idBase])

  return (
    <Ctx.Provider value={ctx}>
      <div className="grid gap-3">{children}</div>
    </Ctx.Provider>
  )
}

Tabs.List = function List({ children }: TabsListProps) {
  const { value, setValue } = useTabs()
  const items = Children.toArray(children).filter(
    isValidElement
  ) as ReactElement<TabsTriggerProps>[]

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const current = items.findIndex((el) => el.props.value === value)
    if (current < 0) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setValue(items[(current + 1) % items.length].props.value)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setValue(items[(current - 1 + items.length) % items.length].props.value)
    }
  }

  return (
    <div role="tablist" className="flex gap-2" onKeyDown={onKeyDown}>
      {children}
    </div>
  )
}

Tabs.Trigger = function Trigger({ value, children }: TabsTriggerProps) {
  const { value: active, setValue, idBase } = useTabs()
  const selected = active === value
  const id = `${idBase}-tab-${value}`

  return (
    <button
      id={id}
      role="tab"
      aria-selected={selected}
      aria-controls={`${idBase}-panel-${value}`}
      className={clsx(
        'rounded-lg px-3 py-1.5 border',
        selected ? 'bg-black text-white' : 'border-black/20 hover:bg-black/5'
      )}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  )
}

Tabs.Panel = function Panel({ value, children }: { value: string; children: ReactNode }) {
  const { value: active, idBase } = useTabs()
  const hidden = active !== value
  return (
    <div
      id={`${idBase}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`${idBase}-tab-${value}`}
      hidden={hidden}
      className="rounded-lg border p-4"
    >
      {!hidden && children}
    </div>
  )
}
