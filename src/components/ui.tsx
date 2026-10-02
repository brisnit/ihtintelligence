import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle2, FlaskConical, X } from 'lucide-react'
import { useStore } from '../state/store'
import { TOUR_STEPS } from './tourSteps'

export function Logo({ compact = false }: { compact?: boolean }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="logo-wrap">
      {failed ? (
        <div className="logo-fallback">IHT FACTOR</div>
      ) : (
        <span className="logo-plate" style={{ display: 'inline-block' }}>
          <img className="logo-img" src="/iht-logo.png" alt="IHT FACTOR" onError={() => setFailed(true)} />
        </span>
      )}
      {!compact && (
        <div className="logo-sub">
          <b>Intelligence</b>
        </div>
      )}
    </div>
  )
}

export function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  center = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: ReactNode
  children: ReactNode
  footer?: ReactNode
  center?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className={`drawer${center ? ' center' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="drawer-head">
          <div>
            {eyebrow && <div className="eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>}
            <h2 style={{ fontSize: 24 }}>{title}</h2>
          </div>
          <button className="btn ghost icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </div>
    </>
  )
}

export function SimNotice({ children }: { children: ReactNode }) {
  return (
    <div className="confirm" role="status">
      <FlaskConical size={18} />
      <div>{children}</div>
    </div>
  )
}

export function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <CheckCircle2 size={18} />
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  )
}

export function Seg<T extends string>({ value, options, onChange, label }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.v} aria-pressed={value === o.v} onClick={() => onChange(o.v)}>
          {o.l}
        </button>
      ))}
    </div>
  )
}

/** Marks an element as a guided-demo highlight target. */
export function useTour(id: string) {
  const { s } = useStore()
  const active = s.tourStep !== null && TOUR_STEPS[s.tourStep]?.target === id
  return { 'data-tour-active': active ? 'true' : undefined, 'data-tour': id } as const
}
