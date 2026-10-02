import { useState } from 'react'
import { CalendarPlus, ClipboardCheck, ScanLine, ShieldCheck } from 'lucide-react'
import { maya } from '../../data/fixtures'
import { useStore } from '../../state/store'
import { Drawer, SimNotice } from '../../components/ui'

const WEEK = [
  { day: 'Mon', date: 'Oct 5', items: ['6:30 AM · Strength · Lower body'] },
  { day: 'Tue', date: 'Oct 6', items: ['Recovery walk, 20–30 min (on your own)'] },
  { day: 'Wed', date: 'Oct 7', items: ['6:30 AM · Strength · Upper body', '7:30 AM · Progress review'] },
  { day: 'Thu', date: 'Oct 8', items: [] },
  { day: 'Fri', date: 'Oct 9', items: ['6:30 AM · Conditioning + core'] },
  { day: 'Sat', date: 'Oct 10', items: ['Optional · 8:00 AM Mobility'] },
  { day: 'Sun', date: 'Oct 11', items: [] },
]
const SLOTS = [
  { day: 'Tue', date: 'Oct 6', time: '12:15 PM', type: 'Strength · Full body', spots: 3 },
  { day: 'Wed', date: 'Oct 7', time: '5:30 PM', type: 'Strength · Upper body', spots: 5 },
  { day: 'Thu', date: 'Oct 8', time: '6:30 AM', type: 'Conditioning', spots: 2 },
  { day: 'Sat', date: 'Oct 10', time: '8:00 AM', type: 'Mobility', spots: 6 },
]

export function MemberPlan() {
  const { s, set } = useStore()
  const [open, setOpen] = useState(false)
  const [pick, setPick] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const close = () => { setOpen(false); setDone(false); setPick(null) }

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Plan</div>
        <h1 style={{ marginTop: 8 }}>Your week</h1>
        <p>Approved by {maya.coach}. Your coach adjusts the plan with you. Nothing here changes automatically.</p>
      </div>

      <div className="row between" style={{ marginBottom: 12 }}>
        <span className="pill sim"><ShieldCheck size={12} /> Illustrative, coach-approved schedule</span>
        <button className="btn primary" onClick={() => setOpen(true)}><CalendarPlus size={16} /> Book a session</button>
      </div>

      <div className="week">
        {WEEK.map((d) => {
          const holds = s.bookings.filter((b) => b.day === d.day)
          return (
            <div key={d.day} className={`day ${d.items.some((i) => /AM|PM/.test(i) && !i.startsWith('Optional')) ? 'train' : ''} ${holds.length ? 'hold' : ''}`}>
              <div className="row between"><b className="head" style={{ fontSize: 18 }}>{d.day}</b><span className="xs faint">{d.date}</span></div>
              {d.items.length === 0 && holds.length === 0 && <span className="xs faint">Rest</span>}
              {d.items.map((i) => <span key={i} className="xs" style={{ color: i.includes('review') ? 'var(--sky)' : 'var(--ink-2)' }}>{i}</span>)}
              {holds.map((h) => <span key={h.time} className="xs" style={{ color: 'var(--amber)' }}>{h.time} · {h.type} (demo booking)</span>)}
            </div>
          )
        })}
      </div>

      <div className="card hi" style={{ marginTop: 16 }}>
        <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap', gap: 14 }}>
          <ClipboardCheck size={24} className="aqua" style={{ flex: 'none' }} />
          <div>
            <span className="lbl">Upcoming progress review</span>
            <h3 style={{ marginTop: 4 }}>Wednesday, Oct 7 · {maya.progressReview.time} with {maya.coach}</h3>
            <p className="small muted" style={{ marginTop: 6 }}>You’ll look at your 8-week scans together, talk about how training has felt, and set your focus for the next block.</p>
            <p className="small" style={{ marginTop: 8 }}><ScanLine size={14} className="aqua" /> Tip: scan at a similar time of day as your earlier scans so readings compare fairly.</p>
          </div>
        </div>
      </div>

      <Drawer open={open} onClose={close} eyebrow="Book a session" title="Available sessions" footer={
        done ? <button className="btn primary" onClick={close}>Done</button> : (
          <>
            <button className="btn ghost" onClick={close}>Cancel</button>
            <button className="btn primary" disabled={pick === null} onClick={() => {
              const sl = SLOTS[pick!]
              set({ bookings: [...s.bookings.filter((b) => !(b.day === sl.day && b.time === sl.time)), { day: sl.day, time: sl.time, type: sl.type }] })
              setDone(true)
            }}>Confirm booking</button>
          </>
        )
      }>
        <p className="small muted">In a real rollout, booking stays in Mindbody. This sheet only illustrates the handoff.</p>
        <div className="stack-sm">
          {SLOTS.map((sl, i) => (
            <button key={i} className="slot" aria-pressed={pick === i} onClick={() => !done && setPick(i)}>
              <b>{sl.day}, {sl.date} · {sl.time}</b>
              <span className="small muted">{sl.type} · {sl.spots} spots (sample)</span>
            </button>
          ))}
        </div>
        {done && pick !== null && (
          <SimNotice><b>Demo booking only.</b> {SLOTS[pick].day} {SLOTS[pick].time} is shown on your week as a demo hold. Nothing was booked in Mindbody.</SimNotice>
        )}
      </Drawer>
    </>
  )
}
