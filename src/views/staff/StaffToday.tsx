import { useState } from 'react'
import { AlarmClock, ArrowRight, CalendarCheck, ChevronDown, ChevronUp, Eye, FileText, Lightbulb, PartyPopper, RotateCcw, Sparkles, Target, UserPlus, Users, X, HeartHandshake } from 'lucide-react'
import { insights, fmtDate, jordanRecovery, members } from '../../data/fixtures'
import type { Insight, InsightId } from '../../data/fixtures'
import { nowLabel, useStore } from '../../state/store'
import { Drawer, SimNotice, useTour } from '../../components/ui'
import { LineChart } from '../../components/LineChart'

const KIND_ICON = { 'Follow-up suggested': HeartHandshake, 'Check in': UserPlus, Celebrate: PartyPopper }
const KIND_TONE = { 'Follow-up suggested': 'aqua', 'Check in': 'sky', Celebrate: 'amber' } as const

export function StaffToday() {
  const { s, set, toast, goStaff } = useStore()
  const active = insights.filter((i) => s.insights[i.id].status === 'active')
  const parked = insights.filter((i) => s.insights[i.id].status !== 'active')
  const [jordanOpen, setJordanOpen] = useState(false)
  const [alexOpen, setAlexOpen] = useState(false)

  const restore = (id: InsightId) => {
    set((p) => ({ insights: { ...p.insights, [id]: { ...p.insights[id], status: 'active' } } }))
    toast('Insight restored to today’s queue.')
  }

  const count = active.length
  const words = ['No', 'One', 'Two', 'Three']

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Friday, October 2</div>
        <h1 style={{ marginTop: 8 }}>Good morning, Coach.</h1>
        <p>
          {count === 0
            ? 'You’re all caught up. New insights will arrive here automatically.'
            : `${words[count]} small action${count === 1 ? '' : 's'} could make a difference today.`}
        </p>
      </div>

      <div className="grid g3">
        {active.map((ins) => (
          <InsightCard key={ins.id} ins={ins} onAction={() => {
            if (ins.id === 'maya') {
              set((p) => ({ insights: { ...p.insights, maya: { ...p.insights.maya, reviewed: true } } }))
              goStaff('profile', 'maya')
            }
            if (ins.id === 'jordan') setJordanOpen(true)
            if (ins.id === 'alex') setAlexOpen(true)
          }} />
        ))}
        {count === 0 && (
          <div className="card dashed" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>
            <Sparkles className="aqua" />
            <h3 style={{ marginTop: 10 }}>Queue clear</h3>
            <p className="muted small" style={{ marginTop: 6 }}>Snoozed and dismissed items are listed below and can be restored.</p>
          </div>
        )}
      </div>

      {parked.length > 0 && (
        <div className="card" style={{ marginTop: 16, padding: 14 }}>
          <div className="small faint" style={{ marginBottom: 8 }}>Set aside today · keeps the queue short</div>
          <div className="stack-sm">
            {parked.map((p) => (
              <div className="row between" key={p.id}>
                <span className="small">
                  {s.insights[p.id].status === 'snoozed' ? <AlarmClock size={14} className="faint" /> : <X size={14} className="faint" />}{' '}
                  {p.title} <span className="faint">· {s.insights[p.id].status === 'snoozed' ? 'Snoozed until Monday' : 'Dismissed'}</span>
                </span>
                <button className="btn ghost sm" onClick={() => restore(p.id)}><RotateCcw size={14} /> Restore</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-head">
          <h2>Studio pulse</h2>
          <span className="faint small">Synthetic · week of Sep 28</span>
        </div>
        <div className="grid g4">
          <Metric icon={Users} value="146" label="Active members" note="+4 vs. last month" />
          <Metric icon={CalendarCheck} value="78%" label="Attendance consistency" note="Planned sessions completed, last 4 weeks" />
          <Metric icon={HeartHandshake} value="9" label="Members with follow-up suggested" note="3 surfaced today; rest batched by coach" />
          <Metric icon={Target} value="6" label="Progress reviews in next 14 days" note="2 missing a recent scan" />
        </div>
      </div>

      <JordanDrawer open={jordanOpen} onClose={() => setJordanOpen(false)} />
      <AlexDrawer open={alexOpen} onClose={() => setAlexOpen(false)} />
    </>
  )
}

function Metric({ icon: Icon, value, label, note }: { icon: typeof Users; value: string; label: string; note: string }) {
  return (
    <div className="card">
      <Icon size={18} className="faint" />
      <div className="stat-value" style={{ marginTop: 10 }}>{value}</div>
      <div className="stat-label">{label}</div>
      <div className="faint xs" style={{ marginTop: 6 }}>{note}</div>
    </div>
  )
}

function InsightCard({ ins, onAction }: { ins: Insight; onAction: () => void }) {
  const { s, set, toast } = useStore()
  const [whyOpen, setWhyOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const st = s.insights[ins.id]
  const tour = useTour(ins.id === 'maya' ? 'maya-card' : `card-${ins.id}`)
  const Icon = KIND_ICON[ins.kind]
  const newCheckIn = ins.id === 'maya' ? s.checkIns[0] : undefined

  const patch = (p: Partial<typeof st>) => set((prev) => ({ insights: { ...prev.insights, [ins.id]: { ...prev.insights[ins.id], ...p } } }))

  return (
    <article className={`card insight ${ins.priority === 1 ? 'hi' : ''}`} {...tour}>
      <div className="row between">
        <span className={`pill ${KIND_TONE[ins.kind]}`}><Icon size={13} /> {ins.kind}</span>
        <span className="rank">0{ins.priority}</span>
      </div>
      <h3>{ins.title}</h3>
      {newCheckIn && (
        <div className="new-flag"><Sparkles size={14} /> Updated with Maya’s quick check-in ({fmtDate(newCheckIn.date)})</div>
      )}
      <div className="kv">
        <div><Eye size={16} /><p className="small"><b>What changed</b>{ins.whatChanged}</p></div>
        <div><Lightbulb size={16} /><p className="small"><b>Why it matters</b>{ins.whyItMatters}</p></div>
        <div><ArrowRight size={16} /><p className="small"><b>Suggested next action</b>{ins.action}{ins.id === 'jordan' ? ' and ask how they’re feeling before training.' : ins.id === 'maya' ? ' with Maya, focusing on body composition.' : ' with a short note.'}</p></div>
      </div>
      <div className="sources">
        {ins.sources.map((src) => (
          <span key={src.label} className="source-chip">{src.label} · {fmtDate(src.date)}</span>
        ))}
      </div>
      <div>
        <button className="why-toggle" aria-expanded={whyOpen} onClick={() => setWhyOpen(!whyOpen)}>
          Why am I seeing this? {whyOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {whyOpen && (
          <div className="why-box" style={{ marginTop: 8 }}>
            Rules-based summary of demo records:
            <ul>
              {ins.why.map((w) => <li key={w}>{w}</li>)}
              {newCheckIn && (
                <li className="aqua">New: quick check-in today reports energy {newCheckIn.energy}/5, recovery {newCheckIn.recovery}/5{newCheckIn.note ? ` — “${newCheckIn.note}”` : ''}.</li>
              )}
            </ul>
          </div>
        )}
      </div>
      {st.assignedTo && <div className="small aqua"><UserPlus size={14} /> Assigned to {st.assignedTo}</div>}
      <div className="insight-actions">
        <button className="btn primary sm" onClick={onAction}>
          {ins.id === 'alex' ? <PartyPopper size={15} /> : ins.id === 'jordan' ? <FileText size={15} /> : <ArrowRight size={15} />} {ins.action}
        </button>
        <div style={{ position: 'relative' }}>
          <button className="btn ghost sm" onClick={() => setAssignOpen(!assignOpen)} aria-expanded={assignOpen}>Assign</button>
          {assignOpen && (
            <div className="card" style={{ position: 'absolute', bottom: '110%', left: 0, padding: 6, zIndex: 5, minWidth: 170 }}>
              {['Coach Elena (me)', 'Coach Malik', 'Front desk · Jess'].map((n) => (
                <button key={n} className="btn ghost sm block" style={{ justifyContent: 'flex-start' }} onClick={() => { patch({ assignedTo: n }); setAssignOpen(false); toast(`Assigned to ${n} in this demo.`) }}>{n}</button>
              ))}
            </div>
          )}
        </div>
        <button className="btn ghost sm" onClick={() => { patch({ status: 'snoozed' }); toast('Snoozed until Monday. It will return only if still relevant.') }}><AlarmClock size={14} /> Snooze</button>
        <button className="btn ghost sm" onClick={() => { patch({ status: 'dismissed' }); toast('Dismissed. Similar insights for this member will be quieter.') }}><X size={14} /> Dismiss</button>
      </div>
    </article>
  )
}

function JordanDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { set, toast } = useStore()
  const [note, setNote] = useState('Ask Jordan how sleep and their long runs have been this week. Keep tomorrow flexible depending on how they feel.')
  const jordan = members.find((m) => m.id === 'jordan')!
  return (
    <Drawer open={open} onClose={onClose} eyebrow="Check-in review" title="Jordan Reyes" footer={
      <>
        <button className="btn ghost" onClick={onClose}>Close</button>
        <button className="btn primary" onClick={() => { set((p) => ({ insights: { ...p.insights, jordan: { ...p.insights.jordan, assignedTo: 'Coach Malik', reviewed: true } } })); toast(`Conversation prompt saved for Coach Malik at ${nowLabel()}. Demo only.`); onClose() }}>Save prompt for coach</button>
      </>
    }>
      <p className="muted small">{jordan.goal} · {jordan.program} · {jordan.coach}</p>
      <div className="card" style={{ padding: 14 }}>
        <div className="small faint" style={{ marginBottom: 6 }}>Self-reported recovery (1–5), weekly survey</div>
        <LineChart
          ariaLabel="Jordan recovery scores"
          height={180}
          unit="/ 5"
          decimals={0}
          yDomain={[1, 5]}
          series={[{ name: 'Recovery', points: jordanRecovery.map((r, i) => ({ x: i, y: r.v, label: fmtDate(r.date) })) }]}
          xTicks={jordanRecovery.filter((_, i) => i % 3 === 0 || i === jordanRecovery.length - 1).map((r) => ({ x: jordanRecovery.indexOf(r), label: fmtDate(r.date) }))}
        />
        <p className="xs faint" style={{ marginTop: 6 }}>Usual baseline ≈ 4.3. Last two responses: 3 and 2.</p>
      </div>
      <div className="record">
        <div className="record-top"><span>Wellness survey WS-150</span><span>Sep 30</span></div>
        “Legs still heavy from Sunday’s long run. Not sleeping great.”
      </div>
      <div className="why-box">
        <b className="aqua">Coach conversation, not a diagnosis.</b> This prompt suggests asking, not prescribing. Any change to Jordan’s training is the coach’s decision.
      </div>
      <label className="small faint">Conversation prompt (editable)</label>
      <textarea className="field" value={note} onChange={(e) => setNote(e.target.value)} />
    </Drawer>
  )
}

function AlexDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { s, set } = useStore()
  const [saved, setSaved] = useState(false)
  return (
    <Drawer open={open} onClose={() => { setSaved(false); onClose() }} eyebrow="Draft congratulations" title="Alex Kim" footer={
      saved ? <button className="btn primary" onClick={() => { setSaved(false); onClose() }}>Done</button> : (
        <>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!s.alexDraft.trim()} onClick={() => { set({ alexSavedAt: nowLabel(), insights: { ...s.insights, alex: { ...s.insights.alex, reviewed: true } } }); setSaved(true) }}>Approve & save draft</button>
        </>
      )
    }>
      <div className="row">
        <span className="pill aqua"><CalendarCheck size={13} /> 4 weeks · 12 of 12 sessions</span>
        <span className="pill">Goal from intake: 3 sessions/week</span>
      </div>
      <label className="small faint">Message (edit before approving)</label>
      <textarea className="field" value={s.alexDraft} onChange={(e) => set({ alexDraft: e.target.value })} disabled={saved} />
      <p className="xs faint">Drafted from attendance records. The coach reviews tone and content before anything goes out.</p>
      {saved && <SimNotice><b>Demo message saved. Nothing was sent.</b></SimNotice>}
    </Drawer>
  )
}
