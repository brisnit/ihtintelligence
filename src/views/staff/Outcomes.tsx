import { useMemo, useState } from 'react'
import { AlertTriangle, BarChart3, CalendarRange, Info, Users } from 'lucide-react'
import { cohort, COHORT_RANGE, MIN_SAMPLE } from '../../data/fixtures'
import type { CohortRecord, Program, StartGoal } from '../../data/fixtures'
import { useTour } from '../../components/ui'

const median = (a: number[]) => {
  if (!a.length) return NaN
  const s = [...a].sort((x, y) => x - y)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0)
const MIN_METRIC = 8

export function Outcomes() {
  const [program, setProgram] = useState<'all' | Program>('all')
  const [goal, setGoal] = useState<'all' | StartGoal>('all')
  const [duration, setDuration] = useState<'all' | '8' | '12'>('all')
  const tour = useTour('outcomes-head')

  const rows = useMemo(
    () => cohort.filter((r) => (program === 'all' || r.program === program) && (goal === 'all' || r.goal === goal) && (duration === 'all' || String(r.duration) === duration)),
    [program, goal, duration],
  )
  const n = rows.length
  const insufficient = n < MIN_SAMPLE

  const showExample = () => { setProgram('Performance Hybrid'); setGoal('Energy & recovery'); setDuration('8') }

  return (
    <>
      <div className="page-head" {...tour}>
        <div className="eyebrow">Outcomes</div>
        <h1 style={{ marginTop: 8 }}>What members are achieving</h1>
        <p>A synthetic cohort view built from the same records coaches already use. Every result shows its sample, period, and gaps.</p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="g4" style={{ alignItems: 'end' }}>
          <Select label="Program" value={program} onChange={(v) => setProgram(v as typeof program)} options={['all', 'Body Composition Foundations', 'Strength Foundations', 'Performance Hybrid']} />
          <Select label="Starting goal" value={goal} onChange={(v) => setGoal(v as typeof goal)} options={['all', 'Body composition', 'Strength', 'Energy & recovery']} />
          <Select label="Duration" value={duration} onChange={(v) => setDuration(v as typeof duration)} options={['all', '8', '12']} fmt={(o) => (o === 'all' ? 'All durations' : `${o} weeks`)} />
          <button className="btn" onClick={showExample}><AlertTriangle size={15} /> Insufficient-data example</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16, padding: 14 }}>
        <div className="row" style={{ gap: 18 }}>
          <span className="small"><Users size={14} className="aqua" /> <b>n = {n}</b> members</span>
          <span className="small"><CalendarRange size={14} className="aqua" /> {COHORT_RANGE}</span>
          <span className="small"><BarChart3 size={14} className="aqua" /> Scan coverage {pct(rows.filter((r) => r.bfChange !== null).length, n)}% · Survey coverage {pct(rows.filter((r) => r.energyChange !== null).length, n)}%</span>
          <span className="pill sim">Synthetic cohort</span>
        </div>
      </div>

      {insufficient ? (
        <div className="card dashed pad-lg" style={{ textAlign: 'center' }}>
          <AlertTriangle size={28} style={{ color: 'var(--amber)' }} />
          <h2 style={{ marginTop: 10 }}>Insufficient data</h2>
          <p className="muted" style={{ marginTop: 8, maxWidth: 560, marginInline: 'auto' }}>
            Only {n} member{n === 1 ? '' : 's'} match these filters. At least {MIN_SAMPLE} are needed before showing a cohort result, so a few individuals don’t look like a trend. Widen the filters or wait for more completions.
          </p>
          <button className="btn" style={{ marginTop: 16 }} onClick={() => { setProgram('all'); setGoal('all'); setDuration('all') }}>Reset filters</button>
        </div>
      ) : (
        <Results rows={rows} />
      )}

      <div className="card" style={{ marginTop: 16 }}>
        <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
          <Info size={18} className="aqua" style={{ flex: 'none', marginTop: 2 }} />
          <div className="small muted">
            <b style={{ color: 'var(--ink)' }}>How to read this.</b> These are observed changes among members who were measured. They do not show that IHT training caused the outcome. Members who attend more may differ in other ways (schedule, nutrition, prior experience). Members without follow-up measurements are excluded from each metric, which can bias results upward. Individual results vary.
          </div>
        </div>
      </div>
    </>
  )
}

function Select({ label, value, onChange, options, fmt }: { label: string; value: string; onChange: (v: string) => void; options: string[]; fmt?: (o: string) => string }) {
  return (
    <label className="stack-sm" style={{ gap: 6 }}>
      <span className="lbl">{label}</span>
      <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{fmt ? fmt(o) : o === 'all' ? `All ${label.toLowerCase()}s` : o}</option>)}
      </select>
    </label>
  )
}

function Results({ rows }: { rows: CohortRecord[] }) {
  const n = rows.length
  const bf = rows.flatMap((r) => (r.bfChange === null ? [] : [r.bfChange]))
  const smm = rows.flatMap((r) => (r.smmChange === null ? [] : [r.smmChange]))
  const en = rows.flatMap((r) => (r.energyChange === null ? [] : [r.energyChange]))
  const att = rows.map((r) => r.attendancePct)
  const goals = { met: 0, partial: 0, 'not-yet': 0, unknown: 0 }
  rows.forEach((r) => goals[r.goalProgress]++)
  const completed = rows.filter((r) => r.completed).length

  const hi = rows.filter((r) => r.attendancePct >= 80 && r.bfChange !== null).map((r) => r.bfChange!)
  const lo = rows.filter((r) => r.attendancePct < 80 && r.bfChange !== null).map((r) => r.bfChange!)

  return (
    <>
      <div className="grid g3">
        <MetricCard title="Body fat change" value={bf.length >= MIN_METRIC ? `${median(bf).toFixed(1)} pts` : null} sub="Median, baseline to final scan" measured={bf.length} n={n} note="Excludes members missing a final scan." />
        <MetricCard title="Skeletal muscle change" value={smm.length >= MIN_METRIC ? `${median(smm) > 0 ? '+' : ''}${median(smm).toFixed(1)} lb` : null} sub="Median, baseline to final scan" measured={smm.length} n={n} note="InBody estimates; hydration affects readings." />
        <MetricCard title="Attendance consistency" value={`${Math.round(median(att))}%`} sub="Median share of planned sessions completed" measured={n} n={n} note="From Mindbody visits. Cancellations counted as missed." />
        <MetricCard title="Self-reported energy" value={en.length >= MIN_METRIC ? `${median(en) > 0 ? '+' : ''}${median(en).toFixed(1)}` : null} sub="Median change on 1–5 scale, first vs. last check-in" measured={en.length} n={n} note="Optional surveys; responders may differ from non-responders." />
        <MetricCard title="Program completion" value={`${pct(completed, n)}%`} sub={`${completed} of ${n} completed their program`} measured={n} n={n} note="Completion = attended final week or progress review." />
        <div className="card">
          <h3>Progress against member goals</h3>
          <p className="faint xs" style={{ marginTop: 4 }}>Coach-recorded at progress review, against each member’s own intake goal</p>
          <div style={{ display: 'flex', gap: 2, height: 14, marginTop: 16, borderRadius: 6, overflow: 'hidden' }}>
            {([['met', '#09FCD2'], ['partial', '#06a88b'], ['not-yet', '#2a443d'], ['unknown', 'transparent']] as const).map(([k, c]) =>
              goals[k] ? <div key={k} title={`${k}: ${goals[k]}`} style={{ flex: goals[k], background: c, border: k === 'unknown' ? '1px dashed #3c5a52' : undefined, borderRadius: 3 }} /> : null,
            )}
          </div>
          <div className="stack-sm small" style={{ marginTop: 12 }}>
            <span className="row between"><span><i className="sw box" /> Goal met</span><b className="num">{goals.met}</b></span>
            <span className="row between"><span><i className="sw box" style={{ background: '#06a88b' }} /> Partial progress</span><b className="num">{goals.partial}</b></span>
            <span className="row between"><span><i className="sw box" style={{ background: '#2a443d' }} /> Not yet</span><b className="num">{goals['not-yet']}</b></span>
            <span className="row between faint"><span><i className="sw outline" style={{ borderStyle: 'dashed' }} /> Not recorded</span><b className="num">{goals.unknown}</b></span>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-head">
          <div>
            <h2>Attendance and body fat change</h2>
            <p className="faint small" style={{ marginTop: 4 }}>Observed association only. Median body fat change by attendance group.</p>
          </div>
        </div>
        {hi.length >= MIN_METRIC && lo.length >= MIN_METRIC ? (
          <div className="stack">
            <Bar label="≥ 80% of planned sessions" n={hi.length} v={median(hi)} max={Math.max(Math.abs(median(hi)), Math.abs(median(lo)))} color="#09FCD2" />
            <Bar label="< 80% of planned sessions" n={lo.length} v={median(lo)} max={Math.max(Math.abs(median(hi)), Math.abs(median(lo)))} color="#E9A23B" />
            <p className="xs faint">Members who attended more also tended to show larger reductions. This does not establish cause, and the groups may differ in other ways.</p>
          </div>
        ) : (
          <div className="why-box"><AlertTriangle size={14} style={{ color: 'var(--amber)' }} /> <b>Insufficient data</b> for this comparison: needs at least {MIN_METRIC} scanned members in each group (have {hi.length} and {lo.length}).</div>
        )}
      </div>
    </>
  )
}

function Bar({ label, n, v, max, color }: { label: string; n: number; v: number; max: number; color: string }) {
  return (
    <div>
      <div className="row between small"><span>{label} <span className="faint">· n = {n}</span></span><b className="num">{v.toFixed(1)} pts</b></div>
      <div className="bar-track" style={{ height: 12, marginTop: 6 }}><div className="bar-fill" style={{ width: `${(Math.abs(v) / (max || 1)) * 100}%`, background: color }} /></div>
    </div>
  )
}

function MetricCard({ title, value, sub, measured, n, note }: { title: string; value: string | null; sub: string; measured: number; n: number; note: string }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {value === null ? (
        <>
          <div className="stat-value" style={{ marginTop: 14, fontSize: 24, color: 'var(--amber)' }}><AlertTriangle size={20} /> Insufficient data</div>
          <div className="stat-label">Only {measured} of {n} members have this measurement (need {MIN_METRIC}).</div>
        </>
      ) : (
        <>
          <div className="stat-value" style={{ marginTop: 14 }}>{value}</div>
          <div className="stat-label">{sub}</div>
        </>
      )}
      <div style={{ marginTop: 12 }}>
        <div className="row between xs faint"><span>Coverage</span><span>{measured} of {n} ({pct(measured, n)}%)</span></div>
        <div className="bar-track" style={{ marginTop: 4, height: 5 }}><div className="bar-fill" style={{ width: `${pct(measured, n)}%`, opacity: 0.7 }} /></div>
      </div>
      <p className="xs faint" style={{ marginTop: 8 }}>{note}</p>
    </div>
  )
}
