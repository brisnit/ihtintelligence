import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useStore } from '../state/store'
import { TOUR_STEPS } from './tourSteps'

export function Tour() {
  const { s, set } = useStore()
  const step = s.tourStep

  useEffect(() => {
    if (step === null) return
    const st = TOUR_STEPS[step]
    set((p) => ({
      role: st.role,
      staffView: st.staffView ?? p.staffView,
      memberView: st.memberView ?? p.memberView,
      profileId: st.staffView === 'profile' ? 'maya' : p.profileId,
    }))
    const t = setTimeout(() => {
      document.querySelector(`[data-tour="${st.target}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)
    return () => clearTimeout(t)
  }, [step, set])

  if (step === null) return null
  const st = TOUR_STEPS[step]
  const last = step === TOUR_STEPS.length - 1
  return (
    <div className="tour" role="dialog" aria-label="Guided demo">
      <div className="row between">
        <span className="eyebrow">Guided demo · {step + 1} of {TOUR_STEPS.length}</span>
        <button className="btn ghost icon" style={{ padding: 4 }} onClick={() => set({ tourStep: null })} aria-label="Exit guided demo">
          <X size={18} />
        </button>
      </div>
      <div className="tour-steps" aria-hidden>
        {TOUR_STEPS.map((_, i) => (
          <i key={i} className={i <= step ? 'on' : ''} />
        ))}
      </div>
      <h3 style={{ fontSize: 21 }}>{st.title}</h3>
      <p className="muted small" style={{ marginTop: 6 }}>{st.body}</p>
      <div className="row between" style={{ marginTop: 12 }}>
        <button className="btn ghost sm" disabled={step === 0} onClick={() => set({ tourStep: step - 1 })}>
          <ChevronLeft size={16} /> Back
        </button>
        <button className="btn primary sm" onClick={() => set({ tourStep: last ? null : step + 1 })}>
          {last ? 'Finish' : 'Next'} {!last && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  )
}
