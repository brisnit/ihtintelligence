import { useState } from 'react'
import { AlertTriangle, ChevronRight, HeartHandshake, PartyPopper, Search, Target } from 'lucide-react'
import { daysAgo, fmtDate, members } from '../../data/fixtures'
import type { MemberTag } from '../../data/fixtures'
import { useStore } from '../../state/store'
import { Seg } from '../../components/ui'

type Filter = 'followup' | 'review' | 'celebrate' | 'all'
const TAGS: Record<MemberTag, { l: string; cls: string; icon: typeof Target }> = {
  followup: { l: 'Follow-up suggested', cls: 'aqua', icon: HeartHandshake },
  review: { l: 'Progress review due', cls: 'sky', icon: Target },
  celebrate: { l: 'Celebrating progress', cls: 'amber', icon: PartyPopper },
}

export function MembersList() {
  const { goStaff } = useStore()
  const [q, setQ] = useState('')
  const [f, setF] = useState<Filter>('followup')
  const query = q.trim().toLowerCase()
  const list = members.filter(
    (m) => (f === 'all' || m.tags.includes(f)) && (!query || `${m.name} ${m.goal} ${m.program} ${m.coach}`.toLowerCase().includes(query)),
  )
  const count = (t: Filter) => (t === 'all' ? members.length : members.filter((m) => m.tags.includes(t)).length)

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Members</div>
        <h1 style={{ marginTop: 8 }}>Who could use a touchpoint</h1>
        <p>Filtered by what might help each person next. No scores or rankings of members.</p>
      </div>
      <div className="row" style={{ marginBottom: 14 }}>
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={16} className="faint" style={{ position: 'absolute', left: 14, top: 14 }} />
          <input className="field" style={{ paddingLeft: 40 }} placeholder="Search name, goal, program, or coach" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search members" />
        </div>
        <Seg
          label="Filter members"
          value={f}
          onChange={setF}
          options={[
            { v: 'followup', l: `Needs follow-up · ${count('followup')}` },
            { v: 'review', l: `Review due · ${count('review')}` },
            { v: 'celebrate', l: `Celebrating · ${count('celebrate')}` },
            { v: 'all', l: `All · ${count('all')}` },
          ]}
        />
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {list.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center' }} className="muted">
            No members match “{q}” in this filter. <button className="btn ghost sm" onClick={() => { setQ(''); setF('all') }}>Clear search</button>
          </div>
        )}
        {list.map((m) => (
          <button key={m.id} className="member-row" onClick={() => goStaff('profile', m.id)}>
            <div className="avatar">{m.initials}</div>
            <div style={{ minWidth: 0 }}>
              <div className="row" style={{ gap: 8 }}>
                <b>{m.name}</b>
                {m.tags.map((t) => {
                  const T = TAGS[t]
                  return <span key={t} className={`pill ${T.cls}`} style={{ padding: '2px 8px', fontSize: 11 }}><T.icon size={11} /> {T.l}</span>
                })}
              </div>
              <div className="small muted" style={{ marginTop: 2 }}>{m.goal}</div>
            </div>
            <div className="member-meta">
              <div><span className="lbl">Last visit</span>{daysAgo(m.lastVisit)}</div>
              <div><span className="lbl">Latest scan</span>{m.latestScan ? fmtDate(m.latestScan) : <span style={{ color: 'var(--amber)' }}><AlertTriangle size={12} /> None</span>}</div>
              <div><span className="lbl">Attendance · 4 wk</span>{m.attendance4wk}</div>
              <div className="row between reason-cell" style={{ flexWrap: 'nowrap' }}>
                <span><span className="lbl">Reason</span>{m.reason}</span>
                <ChevronRight size={18} className="faint" />
              </div>
            </div>
          </button>
        ))}
      </div>
      <p className="xs faint" style={{ marginTop: 10 }}>12 fictional members shown. Tags are suggestions for staff; members never see them.</p>
    </>
  )
}
