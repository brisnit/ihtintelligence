import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowDownRight, ArrowLeft, ArrowUpRight, CalendarCheck, ClipboardList, Eye, FileSearch, HeartPulse, Lightbulb, MessageSquare, MessageSquareHeart, Mic, Minus, NotebookPen, Plus, Scale, ScanLine, Sparkles, Target, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { COACH_NAME, DEFAULT_MAYA_MESSAGE, fmtDate, maya, mayaAttendance, mayaCheckIns, mayaCoachNotes, mayaScans, mayaWeight, members, missingScanWeeks, TODAY } from '../../data/fixtures'
import { nowLabel, useStore } from '../../state/store'
import { Drawer, Seg, SimNotice, useTour } from '../../components/ui'
import { AttendanceBars, LineChart } from '../../components/LineChart'

export function MemberProfile() {
  const { s, goStaff } = useStore()
  if (s.profileId !== 'maya') return <LiteProfile id={s.profileId} />
  return (
    <>
      <button className="btn ghost sm" onClick={() => goStaff('members')} style={{ marginBottom: 14 }}>
        <ArrowLeft size={15} /> Members
      </button>
      <ProfileHeader />
      <Summary />
      <div className="section split">
        <BodyComp />
        <Outlook />
      </div>
      <div className="section split">
        <div className="stack">
          <Attendance />
          <CheckIns />
        </div>
        <div className="stack">
          <Timeline />
          <CoachNotes />
        </div>
      </div>
    </>
  )
}

function ProfileHeader() {
  const latest = mayaScans[mayaScans.length - 1]
  return (
    <div className="card pad-lg" style={{ marginBottom: 16 }}>
      <div className="row" style={{ gap: 16, alignItems: 'flex-start' }}>
        <div className="avatar lg">{maya.initials}</div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div className="eyebrow">Member profile</div>
          <h1 style={{ fontSize: 38, marginTop: 4 }}>{maya.name}</h1>
          <p className="muted" style={{ marginTop: 6 }}><Target size={15} className="aqua" /> {maya.goal}</p>
        </div>
      </div>
      <hr className="divider" />
      <div className="g4" style={{ gap: 14 }}>
        <div><span className="lbl">Program</span>{maya.program}<div className="faint small">8 of 8 weeks complete · {fmtDate(maya.startDate)} – {fmtDate(maya.endDate)}</div></div>
        <div><span className="lbl">Coach</span>{maya.coach}<div className="faint small">Progress review {fmtDate(maya.progressReview.date)}</div></div>
        <div><span className="lbl">Latest scan</span>{fmtDate(latest.date, true)}<div className="faint small">InBody {latest.id}</div></div>
        <div>
          <span className="lbl">Data coverage</span>
          <div className="small" style={{ color: 'var(--amber)' }}><AlertTriangle size={13} /> Week 6 scan not recorded</div>
          <div className="small" style={{ color: 'var(--amber)' }}><AlertTriangle size={13} /> No grip/strength test on file</div>
        </div>
      </div>
    </div>
  )
}

function Summary() {
  const { s } = useStore()
  const [evidence, setEvidence] = useState(false)
  const [draft, setDraft] = useState(false)
  const evTour = useTour('evidence-btn')
  const drTour = useTour('draft-btn')
  const ci = s.checkIns[0]
  return (
    <div className="card hi pad-lg">
      <div className="card-head">
        <div>
          <span className="pill aqua"><Sparkles size={13} /> AI summary · prepared for coach</span>
          <p style={{ fontSize: 19, marginTop: 14, lineHeight: 1.45, maxWidth: 820 }}>
            The scale has been steady recently, while body composition measurements have improved. Maya’s recent check-in suggests she may not recognize that progress.
          </p>
          {ci && (
            <p className="small aqua" style={{ marginTop: 8 }}>
              <Sparkles size={13} /> Updated today: Maya’s quick check-in reports energy {ci.energy}/5{ci.note ? ` and notes “${ci.note}”` : ''}.
            </p>
          )}
        </div>
      </div>
      <div className="fact-grid">
        <div className="fact observed">
          <h4><Eye size={14} /> Observed</h4>
          <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
            <li>Scale weight ≈ 168 lb for the last three weigh-ins.</li>
            <li>Body fat 32.0% → 29.0%; skeletal muscle 61.2 → 62.4 lb.</li>
            <li>9 of 12 planned sessions in weeks 5–8 (12 of 12 in weeks 1–4).</li>
            <li>Check-in: “I’m frustrated that the scale stopped moving.”</li>
          </ul>
        </div>
        <div className="fact possible">
          <h4><Lightbulb size={14} /> Possible explanation</h4>
          <p className="small">Gaining muscle while losing fat can keep scale weight steady. A busy stretch at work (coach note, Sep 23) may explain missed Wednesday sessions. These are interpretations to confirm with Maya.</p>
        </div>
        <div className="fact action">
          <h4><ArrowRight size={14} /> Suggested action</h4>
          <p className="small">Walk through her scan at the Oct 7 progress review. Ask how she’s feeling and whether a different Wednesday time would help.</p>
        </div>
      </div>
      <div className="row" style={{ marginTop: 18 }}>
        <span {...evTour} style={{ display: 'inline-flex' }}>
          <button className="btn" onClick={() => setEvidence(true)}><FileSearch size={16} /> Show the evidence</button>
        </span>
        <span {...drTour} style={{ display: 'inline-flex' }}>
          <button className="btn primary" onClick={() => setDraft(true)}><MessageSquareHeart size={16} /> Draft encouragement</button>
        </span>
        {s.mayaSavedAt && <span className="pill sim">Demo draft saved {s.mayaSavedAt} · not sent</span>}
      </div>
      <EvidenceDrawer open={evidence} onClose={() => setEvidence(false)} />
      <DraftDrawer open={draft} onClose={() => setDraft(false)} />
    </div>
  )
}

function EvidenceDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { s } = useStore()
  const first = mayaScans[0]
  const last = mayaScans[mayaScans.length - 1]
  return (
    <Drawer open={open} onClose={onClose} eyebrow="Show the evidence" title="Records behind this insight" footer={<button className="btn primary" onClick={onClose}>Done</button>}>
      <p className="small muted">Every insight links to source records. These are synthetic demo records, shown as they would appear from each system.</p>
      {s.checkIns.map((c) => (
        <Rec key={c.id} icon={HeartPulse} sys="Quick check-in · new" id={c.id} date={fmtDate(c.date)} highlight>
          Energy {c.energy}/5 · Recovery {c.recovery}/5 · Soreness {c.soreness}/5{c.note && <><br />“{c.note}”</>}
        </Rec>
      ))}
      <Rec icon={ScanLine} sys="InBody" id={last.id} date={fmtDate(last.date, true)}>
        Weight {last.weightLb} lb · Body fat {last.bodyFatPct}% · SMM {last.smmLb} lb
      </Rec>
      <Rec icon={ScanLine} sys="InBody" id={first.id} date={fmtDate(first.date, true)}>
        Baseline: Weight {first.weightLb} lb · Body fat {first.bodyFatPct}% · SMM {first.smmLb} lb
      </Rec>
      <Rec icon={Scale} sys="Studio scale log" id="weekly weigh-ins" date="Sep 14 – Sep 28">
        {mayaWeight.slice(-3).map((w) => `${fmtDate(w.date)}: ${w.lb.toFixed(1)} lb`).join(' · ')}
      </Rec>
      <Rec icon={CalendarCheck} sys="Mindbody" id="attendance" date="Aug 3 – Sep 27">
        Weeks 1–4: 12 of 12 planned · Weeks 5–8: 9 of 12 planned (missed Wednesdays Sep 9, 16, 23)
      </Rec>
      <Rec icon={MessageSquare} sys="Wellness survey" id="WS-152" date="Sep 29">
        Energy 3/5 · Recovery 3/5 · “I’m frustrated that the scale stopped moving.”
      </Rec>
      <Rec icon={NotebookPen} sys="Coach note" id="CN-58" date="Sep 23">
        “Mentioned a busy stretch at work. Missed Wednesday sessions recently.”
      </Rec>
      <div className="why-box">
        <b>Not used:</b> no medical data, no inferred diagnoses. Missing: week 6 scan. The insight would still hold without it.
      </div>
    </Drawer>
  )
}

function Rec({ icon: Icon, sys, id, date, children, highlight }: { icon: LucideIcon; sys: string; id: string; date: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="record" style={highlight ? { borderColor: 'var(--aqua-line)' } : undefined}>
      <div className="record-top">
        <span><Icon size={13} /> {sys} · {id}</span>
        <span>{date}</span>
      </div>
      <div className="small">{children}</div>
    </div>
  )
}

function DraftDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { s, set } = useStore()
  const [saved, setSaved] = useState(false)
  const close = () => { setSaved(false); onClose() }
  return (
    <Drawer open={open} onClose={close} eyebrow="Draft encouragement" title="Message to Maya" footer={
      saved ? <button className="btn primary" onClick={close}>Done</button> : (
        <>
          <button className="btn ghost" onClick={() => set({ mayaDraft: DEFAULT_MAYA_MESSAGE })}>Restore suggestion</button>
          <button className="btn primary" disabled={!s.mayaDraft.trim()} onClick={() => { set({ mayaSavedAt: nowLabel() }); setSaved(true) }}>Approve & save message</button>
        </>
      )
    }>
      <p className="small muted">Drafted from her scan, weigh-ins, and check-in. You decide what to say. Edit freely.</p>
      <textarea className="field" style={{ minHeight: 160 }} value={s.mayaDraft} onChange={(e) => set({ mayaDraft: e.target.value })} disabled={saved} aria-label="Message draft" />
      <div className="row xs faint">
        <span>From: {COACH_NAME}</span><span>·</span><span>Channel: member app (demo)</span><span>·</span><span>{s.mayaDraft.length} characters</span>
      </div>
      {saved ? (
        <SimNotice><b>Demo message saved. Nothing was sent.</b><br /><span className="small">Switch to the Member view → Coach to see how Maya would receive it.</span></SimNotice>
      ) : (
        <div className="why-box">Coaches approve every message. The AI never contacts members directly and does not give medical advice.</div>
      )}
    </Drawer>
  )
}

type Metric = 'bf' | 'smm' | 'weight'
const METRICS: Record<Metric, { label: string; unit: string; good: 'down' | 'up' | 'none' }> = {
  bf: { label: 'Body fat', unit: '%', good: 'down' },
  smm: { label: 'Skeletal muscle mass', unit: 'lb', good: 'up' },
  weight: { label: 'Weight', unit: 'lb', good: 'none' },
}

function seriesFor(m: Metric) {
  if (m === 'weight') return mayaWeight.map((w) => ({ x: w.week, y: w.lb, label: fmtDate(w.date) }))
  return mayaScans.map((sc) => ({ x: sc.week, y: m === 'bf' ? sc.bodyFatPct : sc.smmLb, label: `${fmtDate(sc.date)} · ${sc.id}` }))
}
const weekTicks = (max: number) => Array.from({ length: max / 2 + 1 }, (_, i) => ({ x: i * 2, label: i === 0 ? 'Start' : `Wk ${i * 2}` }))

function BodyComp() {
  const [m, setM] = useState<Metric>('bf')
  const pts = seriesFor(m)
  const base = pts[0].y
  const cur = pts[pts.length - 1].y
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>Body composition</h2>
          <p className="faint small" style={{ marginTop: 4 }}>{m === 'weight' ? 'Weekly studio-scale weigh-ins' : 'InBody scans · planned every 2 weeks'}</p>
        </div>
        <Seg label="Metric" value={m} onChange={setM} options={[{ v: 'bf', l: 'Body fat' }, { v: 'smm', l: 'Muscle' }, { v: 'weight', l: 'Weight' }]} />
      </div>
      <div className="g3" style={{ gap: 10, marginBottom: 14 }}>
        <Tile label="Baseline · Aug 3" value={`${base.toFixed(1)} ${METRICS[m].unit}`} />
        <Tile label="Latest · Sep 28" value={`${cur.toFixed(1)} ${METRICS[m].unit}`} />
        <Tile label="Change" value={`${cur - base > 0 ? '+' : ''}${(cur - base).toFixed(1)} ${METRICS[m].unit}`} delta={cur - base} good={METRICS[m].good} />
      </div>
      <LineChart ariaLabel={`${METRICS[m].label} over eight weeks`} unit={METRICS[m].unit} series={[{ name: METRICS[m].label, points: pts }]} xTicks={weekTicks(8)} />
      {m !== 'weight' && (
        <p className="xs" style={{ color: 'var(--amber)', marginTop: 8 }}><AlertTriangle size={12} /> Week {missingScanWeeks.join(', ')} scan not recorded. The line connects available scans only.</p>
      )}
      {m === 'weight' && <p className="xs faint" style={{ marginTop: 8 }}>Weight has stayed within 0.4 lb since week 5.</p>}
    </div>
  )
}

export function Tile({ label, value, delta, good }: { label: string; value: string; delta?: number; good?: 'down' | 'up' | 'none' }) {
  let note = null
  if (delta !== undefined) {
    const improved = good === 'down' ? delta < 0 : good === 'up' ? delta > 0 : false
    const Icon = Math.abs(delta) < 0.05 ? Minus : delta < 0 ? ArrowDownRight : ArrowUpRight
    note = <span className={`delta ${improved ? '' : 'neutral'}`}><Icon size={14} /> {improved ? 'Toward goal' : good === 'none' ? 'For context' : 'Watch'}</span>
  }
  return (
    <div className="metric-tile">
      <span className="lbl">{label}</span>
      <div className="v" style={{ marginTop: 6 }}>{value}</div>
      {note}
    </div>
  )
}

/** Illustrative only: assumes progress scales with sessions/week with gentle diminishing returns. Not a validated model. */
function scenario(metric: 'bf' | 'smm', perWeek: number) {
  const last = mayaScans[mayaScans.length - 1]
  const start = metric === 'bf' ? last.bodyFatPct : last.smmLb
  const perSession = metric === 'bf' ? -0.11 : 0.045
  const out = [{ x: 8, y: start }]
  let v = start
  for (let k = 1; k <= 6; k++) {
    v += perSession * perWeek * Math.pow(0.92, k)
    out.push({ x: 8 + k, y: +v.toFixed(2) })
  }
  return out
}

function Outlook() {
  const [perWeek, setPerWeek] = useState(3)
  const [metric, setMetric] = useState<'bf' | 'smm'>('bf')
  const hist = seriesFor(metric)
  const scen = useMemo(() => scenario(metric, perWeek), [metric, perWeek])
  const unit = metric === 'bf' ? '%' : 'lb'
  const domain: [number, number] = metric === 'bf' ? [26, 33] : [60.5, 63.5]
  const pattern = perWeek === 3 ? 'her planned pattern' : perWeek < 3 ? 'fewer sessions than planned' : 'more sessions than planned'
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>Outlook</h2>
          <span className="pill sim" style={{ marginTop: 8 }}>Illustrative scenario, not a validated prediction</span>
        </div>
        <Seg label="Scenario metric" value={metric} onChange={setMetric} options={[{ v: 'bf', l: 'Body fat' }, { v: 'smm', l: 'Muscle' }]} />
      </div>
      <p style={{ fontSize: 16 }}>If Maya returns to her planned attendance pattern, her progress trend may continue.</p>
      <div className="scenario-box" style={{ marginTop: 14 }}>
        <div className="row between">
          <label htmlFor="perweek" className="small">Scenario: sessions per week</label>
          <b className="num aqua" style={{ fontFamily: 'var(--head)', fontSize: 22 }}>{perWeek}</b>
        </div>
        <input id="perweek" className="range" type="range" min={1} max={4} step={1} value={perWeek} onChange={(e) => setPerWeek(+e.target.value)} />
        <div className="row between xs faint"><span>1</span><span>2 · recent</span><span>3 · planned</span><span>4</span></div>
      </div>
      <div style={{ marginTop: 14 }}>
        <LineChart
          ariaLabel="Historical measurements and illustrative scenario"
          unit={unit}
          yDomain={domain}
          scenarioFrom={8}
          series={[
            { name: 'Measured', points: hist },
            { name: 'Scenario', points: scen.map((p) => ({ ...p, label: `Wk ${p.x} scenario` })), dashed: true },
          ]}
          xTicks={[{ x: 0, label: 'Start' }, { x: 4, label: 'Wk 4' }, { x: 8, label: 'Wk 8' }, { x: 11, label: 'Wk 11' }, { x: 14, label: 'Wk 14' }]}
        />
        <div className="legend" style={{ marginTop: 8 }}>
          <span><i className="sw" /> Measured (InBody)</span>
          <span><i className="sw dash" /> Scenario at {perWeek}/week</span>
        </div>
      </div>
      <p className="xs faint" style={{ marginTop: 10 }}>
        Showing {pattern}. A simple illustration that scales Maya’s own weeks 1–8 trend by attendance, with tapering gains. It ignores nutrition, sleep, and measurement variability. Use it to frame a conversation, not to promise a result.
      </p>
    </div>
  )
}

function Attendance() {
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>Attendance</h2>
          <p className="faint small" style={{ marginTop: 4 }}>Mindbody · sessions completed vs. planned (3/week)</p>
        </div>
        <span className="pill amber"><CalendarCheck size={13} /> 9 of 12 · last 4 weeks</span>
      </div>
      <AttendanceBars data={mayaAttendance.map((a) => ({ label: `Wk ${a.week}`, planned: a.planned, completed: a.completed, sub: `week of ${fmtDate(a.weekOf)}` }))} />
      <div className="legend" style={{ marginTop: 6 }}>
        <span><i className="sw box" /> Completed</span>
        <span><i className="sw outline" style={{ borderStyle: 'dashed' }} /> Planned</span>
      </div>
      <p className="small muted" style={{ marginTop: 10 }}>Weeks 1–4: 12 of 12. Weeks 5–8: 9 of 12, all three misses on Wednesdays.</p>
    </div>
  )
}

function CheckIns() {
  const { s } = useStore()
  const all = [...s.checkIns, ...[...mayaCheckIns].reverse()]
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>Wellness check-ins</h2>
          <p className="faint small" style={{ marginTop: 4 }}>Self-reported, 1–5. Optional; gaps are expected.</p>
        </div>
      </div>
      <div className="table-scroll">
        <table className="table">
          <thead><tr><th>Date</th><th>Energy</th><th>Recovery</th><th>Soreness</th><th>Note</th></tr></thead>
          <tbody>
            {all.map((c) => (
              <tr key={c.id} style={c.isNew ? { background: 'var(--new-row)' } : undefined}>
                <td className="num" style={{ whiteSpace: 'nowrap' }}>{fmtDate(c.date)}{c.isNew && <span className="aqua xs"> · new</span>}</td>
                <td className="num">{c.energy}</td>
                <td className="num">{c.recovery}</td>
                <td className="num">{c.soreness}</td>
                <td className="small muted">{c.voice && <Mic size={12} />} {c.note ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface TLItem { date: string; sort: number; icon: LucideIcon; title: string; detail?: string; kind?: 'new' | 'missing' }

function Timeline() {
  const { s } = useStore()
  const [all, setAll] = useState(false)
  const tour = useTour('timeline')
  const items: TLItem[] = [
    ...s.checkIns.map((c, i) => ({ date: c.date, sort: 1e9 - i, icon: HeartPulse, title: 'Quick check-in from Maya', detail: `Energy ${c.energy}/5 · Recovery ${c.recovery}/5 · Soreness ${c.soreness}/5${c.note ? ` · “${c.note}”` : ''}`, kind: 'new' as const })),
    ...s.replies.map((r, i) => ({ date: TODAY, sort: 1e9 - 50 - i, icon: MessageSquare, title: 'Maya replied to coach message', detail: `“${r.text}” (demo, ${r.at})`, kind: 'new' as const })),
    ...(s.mayaSavedAt ? [{ date: TODAY, sort: 1e9 - 100, icon: MessageSquareHeart, title: 'Encouragement message approved (demo)', detail: `Saved ${s.mayaSavedAt}. Nothing was sent.`, kind: 'new' as const }] : []),
    { date: '2026-09-30', sort: 20260930, icon: CalendarCheck, title: 'Attended Strength · Upper body', detail: 'Mindbody visit' },
    { date: '2026-09-29', sort: 20260929, icon: MessageSquare, title: 'Wellness survey WS-152', detail: 'Energy 3 · Recovery 3 · “I’m frustrated that the scale stopped moving.”' },
    { date: '2026-09-28', sort: 20260928, icon: ScanLine, title: 'InBody scan IB-2560', detail: 'Body fat 29.0% · SMM 62.4 lb · Weight 168.0 lb' },
    { date: '2026-09-27', sort: 20260927, icon: CalendarCheck, title: 'Week 8 attendance: 2 of 3', detail: 'Missed Wed Sep 23 · Mindbody' },
    { date: '2026-09-23', sort: 20260923, icon: NotebookPen, title: 'Coach note CN-58', detail: 'Busy stretch at work.' },
    { date: '2026-09-18', sort: 20260918, icon: MessageSquare, title: 'Wellness survey WS-141', detail: 'Energy 3 · Recovery 3' },
    { date: '2026-09-14', sort: 20260914, icon: AlertTriangle, title: 'Week 6 InBody scan not recorded', detail: 'Missing data · no action needed', kind: 'missing' as const },
    { date: '2026-08-31', sort: 20260831, icon: ScanLine, title: 'InBody scan IB-2377', detail: 'Body fat 30.4% · SMM 61.8 lb' },
    { date: '2026-08-17', sort: 20260817, icon: ScanLine, title: 'InBody scan IB-2291', detail: 'Body fat 31.3% · SMM 61.5 lb' },
    { date: '2026-08-03', sort: 20260803, icon: ScanLine, title: 'Baseline InBody scan IB-2208', detail: 'Body fat 32.0% · SMM 61.2 lb · Weight 172.0 lb' },
    { date: '2026-07-28', sort: 20260728, icon: ClipboardList, title: 'Intake form completed', detail: 'Goal: improve body composition and feel stronger' },
  ].sort((a, b) => b.sort - a.sort)
  const shown = all ? items : items.slice(0, 7)
  return (
    <div className="card" {...tour}>
      <div className="card-head">
        <div>
          <h2>Timeline</h2>
          <p className="faint small" style={{ marginTop: 4 }}>Source records, newest first. Shared with the member app.</p>
        </div>
      </div>
      <div className="timeline">
        {shown.map((it, i) => (
          <div key={i} className={`tl-item ${it.kind ?? ''}`}>
            <div className="tl-dot"><it.icon size={14} /></div>
            <div>
              <div className="row between" style={{ gap: 6 }}>
                <b className="small">{it.title}</b>
                <span className="xs faint">{it.date === TODAY ? 'Today' : fmtDate(it.date)}</span>
              </div>
              {it.detail && <div className="small muted">{it.detail}</div>}
            </div>
          </div>
        ))}
      </div>
      <button className="btn ghost sm" onClick={() => setAll(!all)}>{all ? 'Show recent only' : `Show all ${items.length} records`}</button>
    </div>
  )
}

function CoachNotes() {
  const { toast } = useStore()
  const [notes, setNotes] = useState(mayaCoachNotes)
  const [text, setText] = useState('')
  return (
    <div className="card">
      <div className="card-head">
        <h2>Coach notes</h2>
      </div>
      <div className="stack-sm">
        {[...notes].reverse().map((n) => (
          <div key={n.id} className="record">
            <div className="record-top"><span>{n.author}</span><span>{fmtDate(n.date)}</span></div>
            <div className="small">{n.text}</div>
          </div>
        ))}
      </div>
      <div className="row" style={{ marginTop: 12, flexWrap: 'nowrap' }}>
        <input className="field" placeholder="Add a note (stays in this demo)" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn icon" aria-label="Add note" disabled={!text.trim()} onClick={() => { setNotes([...notes, { id: `CN-${Date.now()}`, date: TODAY, author: COACH_NAME, text }]); setText(''); toast('Note added to this demo session.') }}><Plus size={18} /></button>
      </div>
    </div>
  )
}

function LiteProfile({ id }: { id: string }) {
  const { goStaff } = useStore()
  const m = members.find((x) => x.id === id) ?? members[0]
  return (
    <>
      <button className="btn ghost sm" onClick={() => goStaff('members')} style={{ marginBottom: 14 }}><ArrowLeft size={15} /> Members</button>
      <div className="card pad-lg">
        <div className="row" style={{ gap: 16 }}>
          <div className="avatar lg">{m.initials}</div>
          <div>
            <div className="eyebrow">Member profile</div>
            <h1 style={{ fontSize: 36, marginTop: 4 }}>{m.name}</h1>
            <p className="muted"><Target size={14} className="aqua" /> {m.goal}</p>
          </div>
        </div>
        <hr className="divider" />
        <div className="g4">
          <div><span className="lbl">Program</span>{m.program}</div>
          <div><span className="lbl">Coach</span>{m.coach}</div>
          <div><span className="lbl">Last visit</span>{fmtDate(m.lastVisit)}</div>
          <div><span className="lbl">Latest scan</span>{m.latestScan ? fmtDate(m.latestScan) : <span style={{ color: 'var(--amber)' }}><AlertTriangle size={13} /> No scan on file</span>}</div>
        </div>
        {m.reason !== '—' && <div className="why-box" style={{ marginTop: 16 }}><b className="aqua">Why this member surfaced:</b> {m.reason}. Attendance last 4 weeks: {m.attendance4wk}.</div>}
      </div>
      <div className="card dashed" style={{ marginTop: 16 }}>
        <p className="muted">This concept demo includes a fully detailed profile for Maya Chen. Other members show summary records only.</p>
        <button className="btn primary" style={{ marginTop: 12 }} onClick={() => goStaff('profile', 'maya')}>Open Maya’s profile</button>
      </div>
    </>
  )
}
