import { useState } from 'react'
import { Info } from 'lucide-react'
import { fmtDate, maya, mayaAttendance, mayaCheckIns, mayaScans, mayaWeight } from '../../data/fixtures'
import { useStore } from '../../state/store'
import { Seg } from '../../components/ui'
import { AttendanceBars, LineChart } from '../../components/LineChart'
import type { Pt } from '../../components/LineChart'
import { Tile } from '../staff/MemberProfile'

type M = 'weight' | 'bf' | 'smm' | 'attendance' | 'energy'
type Range = '4' | 'all'

const dayOf = (iso: string) => Math.round((new Date(iso + 'T12:00:00').getTime() - new Date(maya.startDate + 'T12:00:00').getTime()) / 86400000)

const INFO: Record<M, { title: string; unit: string; source: string; good: 'up' | 'down' | 'none'; explain: string }> = {
  weight: { title: 'Weight', unit: 'lb', source: 'Studio scale · weekly', good: 'none', explain: 'Weight alone doesn’t show whether you’re losing fat or gaining muscle.' },
  bf: { title: 'Body fat', unit: '%', source: 'InBody scans', good: 'down', explain: 'Body fat percentage from your InBody scans.' },
  smm: { title: 'Skeletal muscle mass', unit: 'lb', source: 'InBody scans', good: 'up', explain: 'Estimated muscle you use to move and lift.' },
  attendance: { title: 'Attendance', unit: 'sessions', source: 'Bookings · Mindbody', good: 'up', explain: 'Sessions completed each week compared with your plan.' },
  energy: { title: 'Energy', unit: '/ 5', source: 'Your check-ins', good: 'up', explain: 'How energized you said you felt, 1 (low) to 5 (high).' },
}

export function MemberProgress() {
  const { s } = useStore()
  const [m, setM] = useState<M>('bf')
  const [range, setRange] = useState<Range>('all')
  const info = INFO[m]
  const minDay = range === '4' ? 28 : 0

  let pts: Pt[] = []
  let dates: string[] = []
  if (m === 'weight') {
    const w = mayaWeight.filter((x) => x.week * 7 >= minDay)
    pts = w.map((x) => ({ x: x.week * 7, y: x.lb, label: fmtDate(x.date) }))
    dates = w.map((x) => x.date)
  } else if (m === 'bf' || m === 'smm') {
    const sc = mayaScans.filter((x) => x.week * 7 >= minDay)
    pts = sc.map((x) => ({ x: x.week * 7, y: m === 'bf' ? x.bodyFatPct : x.smmLb, label: fmtDate(x.date) }))
    dates = sc.map((x) => x.date)
  } else if (m === 'energy') {
    const all = [...mayaCheckIns, ...[...s.checkIns].reverse()].filter((c) => dayOf(c.date) >= minDay)
    pts = all.map((c) => ({ x: dayOf(c.date), y: c.energy, label: fmtDate(c.date) }))
    dates = all.map((c) => c.date)
  }
  const att = mayaAttendance.filter((a) => (a.week - 1) * 7 >= minDay)
  const ticks = (range === '4' ? [28, 35, 42, 49, 56] : [0, 14, 28, 42, 56]).map((d) => ({ x: d, label: d === 0 ? 'Start' : `Wk ${d / 7}` }))
  if (m === 'energy' && pts.some((p) => p.x > 56)) ticks.push({ x: 63, label: 'Now' })

  const base = m === 'attendance' ? att.reduce((a, w) => a + w.completed, 0) : pts[0]?.y
  const cur = m === 'attendance' ? att.reduce((a, w) => a + w.planned, 0) : pts[pts.length - 1]?.y
  const fmt = (v: number) => (m === 'energy' ? v.toFixed(0) : v.toFixed(1))

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Progress</div>
        <h1 style={{ marginTop: 8 }}>Your trends</h1>
        <p>Look at the direction over several weeks rather than any single reading.</p>
      </div>
      <div className="row between" style={{ marginBottom: 14 }}>
        <Seg label="Choose chart" value={m} onChange={setM} options={[{ v: 'weight', l: 'Weight' }, { v: 'bf', l: 'Body fat' }, { v: 'smm', l: 'Muscle' }, { v: 'attendance', l: 'Attendance' }, { v: 'energy', l: 'Energy' }]} />
        <Seg label="Timeframe" value={range} onChange={setRange} options={[{ v: '4', l: 'Last 4 weeks' }, { v: 'all', l: 'Full program' }]} />
      </div>

      <div className="card pad-lg">
        <div className="card-head">
          <div>
            <h2>{info.title}</h2>
            <p className="faint small" style={{ marginTop: 4 }}>{info.source} · {info.explain}</p>
          </div>
        </div>
        {m === 'attendance' ? (
          <>
            <div className="g3" style={{ gap: 10, marginBottom: 14 }}>
              <Tile label="Completed" value={`${base} sessions`} />
              <Tile label="Planned" value={`${cur} sessions`} />
              <Tile label="Period" value={`${att.length} weeks`} />
            </div>
            <AttendanceBars data={att.map((a) => ({ label: `Wk ${a.week}`, planned: a.planned, completed: a.completed, sub: `week of ${fmtDate(a.weekOf)}` }))} />
            <div className="legend" style={{ marginTop: 6 }}><span><i className="sw box" /> Completed</span><span><i className="sw outline" style={{ borderStyle: 'dashed' }} /> Planned</span></div>
          </>
        ) : (
          <>
            <div className="g3" style={{ gap: 10, marginBottom: 14 }}>
              <Tile label={`${range === '4' ? 'Start of period' : 'Baseline'} · ${fmtDate(dates[0])}`} value={`${fmt(base)} ${info.unit}`} />
              <Tile label={`Current · ${fmtDate(dates[dates.length - 1])}`} value={`${fmt(cur)} ${info.unit}`} />
              <Tile label="Change" value={`${cur - base > 0 ? '+' : ''}${fmt(cur - base)} ${info.unit}`} delta={cur - base} good={info.good} />
            </div>
            <LineChart
              ariaLabel={`${info.title} trend`}
              unit={info.unit}
              decimals={m === 'energy' ? 0 : 1}
              yDomain={m === 'energy' ? [1, 5] : undefined}
              series={[{ name: info.title, points: pts }]}
              xTicks={ticks}
            />
            {(m === 'bf' || m === 'smm') && <p className="xs faint" style={{ marginTop: 8 }}>Scans every two weeks. The week-6 scan wasn’t recorded, so the line connects the scans you have.</p>}
          </>
        )}
        <div className="table-scroll" style={{ marginTop: 14 }}>
          <details>
            <summary className="small faint" style={{ cursor: 'pointer' }}>Show as table</summary>
            <table className="table" style={{ marginTop: 8 }}>
              <thead><tr><th>Date</th><th>{info.title}</th></tr></thead>
              <tbody>
                {m === 'attendance'
                  ? att.map((a) => <tr key={a.week}><td>Week of {fmtDate(a.weekOf)}</td><td className="num">{a.completed} of {a.planned}</td></tr>)
                  : pts.map((p, i) => <tr key={i}><td>{fmtDate(dates[i])}</td><td className="num">{fmt(p.y)} {info.unit}</td></tr>)}
              </tbody>
            </table>
          </details>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
          <Info size={18} className="aqua" style={{ flex: 'none', marginTop: 2 }} />
          <p className="small muted">Individual readings can vary with hydration, sleep, meals, and time of day. Trends over several measurements are more useful than any single number. Questions? Ask {maya.coach} at your next session.</p>
        </div>
      </div>
    </>
  )
}
