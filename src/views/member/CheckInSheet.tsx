import { useEffect, useState } from 'react'
import { Mic } from 'lucide-react'
import { TODAY } from '../../data/fixtures'
import { useStore } from '../../state/store'
import { Drawer } from '../../components/ui'

const VOICE_SAMPLE = 'Feeling better this week. Legs were a little sore after Monday but good. Still a bit bummed about the scale, but excited to see my scan on Wednesday.'

const SCALES = [
  { key: 'energy', label: 'Energy', lo: 'Drained', hi: 'Energized' },
  { key: 'recovery', label: 'Recovery', lo: 'Run down', hi: 'Fully recovered' },
  { key: 'soreness', label: 'Soreness', lo: 'None', hi: 'Very sore' },
] as const
type Key = (typeof SCALES)[number]['key']

export function CheckInSheet() {
  const { s, set, toast } = useStore()
  const [vals, setVals] = useState<Record<Key, number | null>>({ energy: null, recovery: null, soreness: null })
  const [note, setNote] = useState('')
  const [voice, setVoice] = useState(false)

  useEffect(() => {
    if (s.checkInOpen) {
      const prev = s.checkIns[0]
      setVals(prev ? { energy: prev.energy, recovery: prev.recovery, soreness: prev.soreness } : { energy: null, recovery: null, soreness: null })
      setNote(prev?.note ?? '')
      setVoice(prev?.voice ?? false)
    }
  }, [s.checkInOpen])

  const close = () => set({ checkInOpen: false })
  const ready = vals.energy !== null && vals.recovery !== null && vals.soreness !== null

  const save = () => {
    const entry = { id: 'QC-301', date: TODAY, energy: vals.energy!, recovery: vals.recovery!, soreness: vals.soreness!, note: note.trim() || undefined, source: 'Quick check-in' as const, isNew: true, voice }
    set({ checkIns: [entry], checkInOpen: false })
    toast('Check-in saved. Coach Elena’s view of your profile is updated (demo).')
  }

  return (
    <Drawer open={s.checkInOpen} onClose={close} center eyebrow="Quick check-in · optional" title="How are you feeling?" footer={
      <>
        <button className="btn ghost" onClick={() => { close(); toast('Skipped. No problem, check in whenever it’s useful.') }}>Skip</button>
        <button className="btn primary" disabled={!ready} onClick={save}>Save check-in</button>
      </>
    }>
      <p className="small muted">Tap once per row. About 15 seconds. No streaks, no daily requirement.</p>
      {SCALES.map((sc) => (
        <div key={sc.key}>
          <div className="row between small" style={{ marginBottom: 6 }}><b>{sc.label}</b><span className="xs faint">1 {sc.lo} · 5 {sc.hi}</span></div>
          <div className="tap-scale" role="radiogroup" aria-label={sc.label}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} role="radio" aria-checked={vals[sc.key] === n} aria-pressed={vals[sc.key] === n} onClick={() => setVals({ ...vals, [sc.key]: n })}>
                <b>{n}</b>{n === 1 ? sc.lo : n === 5 ? sc.hi.split(' ')[0] : ''}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div>
        <div className="row between small" style={{ marginBottom: 6 }}>
          <b>Note <span className="faint">(optional)</span></b>
          <button className="btn sm" onClick={() => { setNote(VOICE_SAMPLE); setVoice(true) }}>
            <Mic size={14} /> Demo voice note
          </button>
        </div>
        <textarea className="field" style={{ minHeight: 90 }} placeholder="Anything your coach should know?" value={note} onChange={(e) => { setNote(e.target.value); setVoice(false) }} />
        {voice && <p className="xs" style={{ color: 'var(--amber)', marginTop: 6 }}><Mic size={12} /> Demo voice note: prerecorded sample transcript. No microphone was used.</p>}
      </div>
    </Drawer>
  )
}
