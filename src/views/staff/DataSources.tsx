import { AlertTriangle, BellOff, CheckCircle2, ClipboardCheck, Copy, Database, FlaskConical, Inbox, Layers, Link2Off, ListChecks, RefreshCw, ShieldCheck, Sparkles, UserCheck } from 'lucide-react'
import { dataSources, futureSources } from '../../data/fixtures'
import { useStore } from '../../state/store'

const PRINCIPLES = [
  { i: Database, t: 'Existing tools remain the primary systems. Mindbody, InBody, and forms stay where they are.' },
  { i: Copy, t: 'Known information is not entered twice. Records are read, not retyped.' },
  { i: Inbox, t: 'Insights arrive automatically. No prompting an AI.' },
  { i: ListChecks, t: 'Staff see a short, prioritized queue instead of another dashboard.' },
  { i: ClipboardCheck, t: 'Every insight includes its evidence and a next action.' },
  { i: Sparkles, t: 'Optional quick check-ins fill only meaningful gaps.' },
  { i: UserCheck, t: 'Coaches approve every message and training change.' },
  { i: RefreshCw, t: 'New information updates the shared member picture for staff and member.' },
  { i: BellOff, t: 'Snoozing and dismissing reduce notification fatigue.' },
]

export function DataSources() {
  const { toast } = useStore()
  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Data</div>
        <h1 style={{ marginTop: 8 }}>An intelligence layer over existing systems</h1>
        <p>Proposed sources, shown with sample data. Availability and integration methods must be confirmed with each vendor before anything is built.</p>
      </div>

      <div className="grid g2">
        {dataSources.map((d) => (
          <div className="card" key={d.name}>
            <div className="card-head">
              <div>
                <span className="lbl">{d.system}</span>
                <h3 style={{ marginTop: 4 }}>{d.name}</h3>
              </div>
              <span className="pill sim"><FlaskConical size={12} /> Demo source</span>
            </div>
            <p className="small muted">{d.provides}</p>
            <div className="g2" style={{ gap: 10, marginTop: 14 }}>
              <div className="metric-tile"><span className="lbl">Last sample update</span><div className="small" style={{ marginTop: 4 }}>{d.lastSample}</div></div>
              <div className="metric-tile"><span className="lbl">Records available</span><div className="small" style={{ marginTop: 4 }}>{d.records}</div></div>
            </div>
            <div className="stack-sm small" style={{ marginTop: 14 }}>
              {d.missing.map((x) => <span key={x} style={{ color: 'var(--amber)' }}><AlertTriangle size={13} /> Missing: <span className="muted">{x}</span></span>)}
              {d.matching.map((x) => <span key={x} style={{ color: 'var(--sky)' }}><Link2Off size={13} /> Matching: <span className="muted">{x}</span></span>)}
              {d.missing.length + d.matching.length === 0 && <span className="aqua"><CheckCircle2 size={13} /> No issues in sample</span>}
            </div>
            <button className="btn ghost sm" style={{ marginTop: 12 }} onClick={() => toast(`${d.system}: sample data refreshed locally. No external connection was made.`)}>
              <RefreshCw size={14} /> Refresh sample
            </button>
          </div>
        ))}
        <div className="card" style={{ background: 'var(--bg-2)' }}>
          <ShieldCheck size={22} className="aqua" />
          <h3 style={{ marginTop: 10 }}>Integration status</h3>
          <p className="small muted" style={{ marginTop: 6 }}>Nothing in this prototype is connected live. Methods to confirm include Mindbody’s API access tier, InBody export options (LookinBody), and where intake and survey forms currently live. Member consent and data retention policies come first.</p>
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2><Layers size={20} className="faint" /> Future layers</h2><span className="small faint">Not operational · shown for roadmap discussion</span></div>
        <div className="grid g4">
          {futureSources.map((f) => (
            <div key={f.name} className="card dashed" style={{ opacity: 0.75 }}>
              <span className="pill">Future · not connected</span>
              <h3 className="faint" style={{ marginTop: 10 }}>{f.name}</h3>
              <p className="small faint" style={{ marginTop: 6 }}>{f.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2>Invisible by design</h2></div>
        <div className="principles">
          {PRINCIPLES.map((p) => (
            <div key={p.t} className="principle"><p.i size={17} /> {p.t}</div>
          ))}
        </div>
      </div>
    </>
  )
}
