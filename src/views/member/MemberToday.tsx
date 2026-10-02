import { useState } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Award, CalendarClock, CheckCircle2, Dumbbell, HelpCircle, ScanLine, Scale, Smile, Target, Trophy } from 'lucide-react'
import { fmtDate, fmtDay, maya, mayaAttendance, mayaScans } from '../../data/fixtures'
import { useStore } from '../../state/store'
import { Drawer, useTour } from '../../components/ui'

export function MemberToday() {
  const { s, set, goMember } = useStore()
  const [how, setHow] = useState(false)
  const sumTour = useTour('member-summary')
  const ciTour = useTour('checkin-cta')
  const first = mayaScans[0]
  const last = mayaScans[mayaScans.length - 1]
  const recent = mayaAttendance.slice(-4)
  const done = recent.reduce((a, w) => a + w.completed, 0)
  const planned = recent.reduce((a, w) => a + w.planned, 0)
  const total = mayaAttendance.reduce((a, w) => a + w.completed, 0)
  const ci = s.checkIns[0]

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Hi, Maya</div>
        <h1 style={{ marginTop: 8 }}>Your progress goes beyond the scale.</h1>
      </div>

      <div className="card hi pad-lg" {...sumTour}>
        <p style={{ fontSize: 19, lineHeight: 1.45, maxWidth: 720 }}>
          Your latest scan shows <b className="aqua">lower body fat</b> and <b className="aqua">higher skeletal muscle mass</b> than your starting scan.
        </p>
        <div className="g3" style={{ gap: 12, marginTop: 18 }}>
          <Big icon={ArrowDownRight} label="Body fat" from={`${first.bodyFatPct.toFixed(1)}%`} to={`${last.bodyFatPct.toFixed(1)}%`} change={`${(last.bodyFatPct - first.bodyFatPct).toFixed(1)} pts`} />
          <Big icon={ArrowUpRight} label="Skeletal muscle" from={`${first.smmLb} lb`} to={`${last.smmLb} lb`} change={`+${(last.smmLb - first.smmLb).toFixed(1)} lb`} />
          <Big icon={Scale} label="Scale weight" from={`${first.weightLb.toFixed(0)} lb`} to={`${last.weightLb.toFixed(0)} lb`} change="Steady lately" neutral />
        </div>
        <p className="small muted" style={{ marginTop: 14 }}>
          When you build muscle while losing fat, the scale can stay still even as your body changes. Scans from {fmtDate(first.date)} and {fmtDate(last.date)}.
        </p>
        <button className="btn ghost sm" style={{ marginTop: 10, paddingLeft: 0 }} onClick={() => setHow(true)}><HelpCircle size={15} /> How do we know?</button>
      </div>

      <div className="grid g2" style={{ marginTop: 16 }}>
        <div className="card">
          <span className="lbl"><Target size={12} /> Your goal</span>
          <h3 style={{ marginTop: 6 }}>{maya.goal}</h3>
          <p className="small muted" style={{ marginTop: 6 }}>{maya.goalDetail}</p>
        </div>
        <div className="card">
          <span className="lbl"><CalendarClock size={12} /> Next session</span>
          <h3 style={{ marginTop: 6 }}>{fmtDay(maya.nextSession.date)}, {fmtDate(maya.nextSession.date)} · {maya.nextSession.time}</h3>
          <p className="small muted" style={{ marginTop: 6 }}>{maya.nextSession.type} with {maya.nextSession.coach}</p>
          <button className="btn sm" style={{ marginTop: 12 }} onClick={() => goMember('plan')}>View your week</button>
        </div>
        <div className="card">
          <span className="lbl"><Dumbbell size={12} /> Sessions</span>
          <div className="row" style={{ alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <span className="stat-value">{done}</span><span className="muted">of {planned} planned · last 4 weeks</span>
          </div>
          <div className="bar-track" style={{ marginTop: 12 }}><div className="bar-fill" style={{ width: `${(done / planned) * 100}%` }} /></div>
          <p className="small muted" style={{ marginTop: 10 }}>{total} sessions since you started on {fmtDate(maya.startDate)}.</p>
        </div>
        <div className="card">
          <span className="lbl"><Trophy size={12} /> Recent milestones</span>
          <div className="stack-sm small" style={{ marginTop: 10 }}>
            <span><Award size={15} className="aqua" /> Completed your 8-week program</span>
            <span><Award size={15} className="aqua" /> Back squat working sets: 65 → 85 lb</span>
            <span><Award size={15} className="aqua" /> Lowest body fat reading yet ({fmtDate(last.date)})</span>
          </div>
        </div>
      </div>

      <div className="grid g2" style={{ marginTop: 16 }}>
        <div className="card" style={{ borderColor: 'var(--aqua-line)' }}>
          <span className="lbl">One useful next step</span>
          <h3 style={{ marginTop: 6 }}>Your 8-week progress review is {fmtDay(maya.progressReview.date)}, {fmtDate(maya.progressReview.date)}.</h3>
          <p className="small muted" style={{ marginTop: 6 }}>{maya.coach} will walk through your scan with you. Bring any questions about how you’re feeling.</p>
          <button className="btn primary sm" style={{ marginTop: 12 }} onClick={() => goMember('plan')}>See review details <ArrowRight size={14} /></button>
        </div>
        <div className="card" {...ciTour}>
          <span className="lbl"><Smile size={12} /> Quick check-in · optional</span>
          {ci ? (
            <>
              <h3 style={{ marginTop: 6 }}><CheckCircle2 size={18} className="aqua" /> Thanks for checking in today</h3>
              <p className="small muted" style={{ marginTop: 6 }}>Energy {ci.energy}/5 · Recovery {ci.recovery}/5 · Soreness {ci.soreness}/5. Your coach will see this before your next session.</p>
              <button className="btn ghost sm" style={{ marginTop: 10, paddingLeft: 0 }} onClick={() => set({ checkInOpen: true })}>Update check-in</button>
            </>
          ) : (
            <>
              <h3 style={{ marginTop: 6 }}>How are you feeling this week?</h3>
              <p className="small muted" style={{ marginTop: 6 }}>About 15 seconds. Skip anytime. There are no streaks.</p>
              <button className="btn primary sm" style={{ marginTop: 12 }} onClick={() => set({ checkInOpen: true })}>Start check-in</button>
            </>
          )}
        </div>
      </div>

      <Drawer open={how} onClose={() => setHow(false)} eyebrow="How do we know?" title="Where this comes from" footer={<button className="btn primary" onClick={() => setHow(false)}>Got it</button>}>
        <p className="small muted">Your summary uses the same records your coach sees.</p>
        {[first, last].map((sc, i) => (
          <div key={sc.id} className="record">
            <div className="record-top"><span><ScanLine size={13} /> InBody scan · {i === 0 ? 'starting' : 'latest'}</span><span>{fmtDate(sc.date, true)}</span></div>
            <div className="small">Body fat {sc.bodyFatPct}% · Skeletal muscle {sc.smmLb} lb · Weight {sc.weightLb} lb</div>
          </div>
        ))}
        <div className="record">
          <div className="record-top"><span><Scale size={13} /> Studio scale · weekly</span><span>Sep 14 – 28</span></div>
          <div className="small">168.1 lb · 168.4 lb · 168.0 lb</div>
        </div>
        <div className="why-box">Single readings can vary with hydration, sleep, and time of day. Trends across several scans are more useful than any one number. This is not medical advice.</div>
      </Drawer>
    </>
  )
}

function Big({ icon: Icon, label, from, to, change, neutral }: { icon: typeof Scale; label: string; from: string; to: string; change: string; neutral?: boolean }) {
  return (
    <div className="metric-tile">
      <span className="lbl">{label}</span>
      <div className="v" style={{ marginTop: 6 }}>{to}</div>
      <div className="xs faint">from {from}</div>
      <span className={`delta ${neutral ? 'neutral' : ''}`} style={{ marginTop: 6 }}><Icon size={14} /> {change}</span>
    </div>
  )
}
