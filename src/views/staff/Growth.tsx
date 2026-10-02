import { useState } from 'react'
import { Ban, CheckCircle2, CircleDashed, Lock, Megaphone, Newspaper, PartyPopper, ShieldCheck, Target, TrendingUp, ArrowRight } from 'lucide-react'
import { cohort, COHORT_RANGE, members } from '../../data/fixtures'
import { useStore } from '../../state/store'
import { Drawer, SimNotice } from '../../components/ui'

const DIGEST = `October progress digest (draft)

This month the studio logged 1,180 sessions across 146 members. 31 members completed a progress review, and 19 hit a goal they set at intake.

Highlights to share with members:
• New Saturday 8 AM strength block opens Oct 10.
• Progress reviews now include a walkthrough of your InBody trends.
• Quick check-ins are optional. Skip any time.

Individual results vary. Numbers above are studio-wide totals.`

export function Growth() {
  const { s, set, goStaff, toast } = useStore()
  const [digestOpen, setDigestOpen] = useState(false)
  const [digest, setDigest] = useState(DIGEST)
  const [testimonialFor, setTestimonialFor] = useState<string | null>(null)

  const due = members.filter((m) => m.tags.includes('review'))
  const celebrate = members.filter((m) => m.tags.includes('celebrate'))
  const storyRows = cohort.filter((r) => r.program === 'Body Composition Foundations' && r.goal === 'Body composition' && r.bfChange !== null && r.completed)
  const sorted = storyRows.map((r) => r.bfChange!).sort((a, b) => a - b)
  const med = sorted[Math.floor(sorted.length / 2)]
  const improved = storyRows.filter((r) => r.bfChange! < 0).length

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Growth</div>
        <h1 style={{ marginTop: 8 }}>Retention and responsible marketing</h1>
        <p>Turn member progress into timely conversations and honest stories, with permission and with limits stated.</p>
      </div>

      <div className="grid g2">
        <div className="card">
          <div className="card-head"><h3><Target size={18} className="aqua" /> Due for a progress conversation</h3><span className="pill">{due.length} members</span></div>
          <div className="stack-sm">
            {due.map((m) => (
              <div key={m.id} className="row between record" style={{ padding: '10px 12px' }}>
                <span className="small"><b>{m.name}</b><br /><span className="faint">{m.reason}</span></span>
                <button className="btn ghost sm" onClick={() => goStaff('profile', m.id)}>Open <ArrowRight size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3><PartyPopper size={18} style={{ color: 'var(--amber)' }} /> Milestones worth celebrating</h3><span className="pill">{celebrate.length} members</span></div>
          <div className="stack-sm">
            {celebrate.map((m) => (
              <div key={m.id} className="row between record" style={{ padding: '10px 12px' }}>
                <span className="small"><b>{m.name}</b><br /><span className="faint">{m.reason}</span></span>
                <button className="btn ghost sm" onClick={() => toast(`Celebration note drafted for ${m.name.split(' ')[0]} in ${m.coach}’s queue. Demo only, nothing sent.`)}>Draft note</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3><Newspaper size={18} className="aqua" /> Monthly member progress digest</h3>{s.digestSaved ? <span className="pill sim">Demo draft saved</span> : <span className="pill">Draft</span>}</div>
          <p className="small muted">Auto-assembled from studio totals each month. Staff edit and approve before anything goes out.</p>
          <pre className="why-box" style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--body)', maxHeight: 160, overflow: 'hidden', marginTop: 12 }}>{digest}</pre>
          <button className="btn primary" style={{ marginTop: 12 }} onClick={() => setDigestOpen(true)}>Review & edit digest</button>
        </div>

        <div className="card">
          <div className="card-head"><h3><Megaphone size={18} className="aqua" /> Aggregate outcome story</h3><span className={`pill ${s.storyStatus === 'in-review' ? 'sky' : ''}`}>{s.storyStatus === 'in-review' ? 'With owner for review' : 'Draft for review'}</span></div>
          <div className="record" style={{ padding: 18, background: 'linear-gradient(160deg, #0d2420, #08120f)' }}>
            <div className="eyebrow" style={{ fontSize: 11 }}>Marketing preview · synthetic</div>
            <p className="head" style={{ fontSize: 26, marginTop: 8, textTransform: 'uppercase' }}>{improved} of {storyRows.length} members lowered their body fat</p>
            <p className="small muted" style={{ marginTop: 6 }}>Among members who completed Body Composition Foundations and had a baseline and final InBody scan. Median change {med.toFixed(1)} percentage points.</p>
            <p className="xs faint" style={{ marginTop: 10 }}>Sample: n = {storyRows.length} · Period: {COHORT_RANGE} · Individual results vary. Not a guarantee of results. Members without a final scan are not included.</p>
          </div>
          <button className="btn" style={{ marginTop: 12 }} disabled={s.storyStatus === 'in-review'} onClick={() => { set({ storyStatus: 'in-review' }); toast('Submitted to owner for review (demo). Nothing was published.') }}>
            {s.storyStatus === 'in-review' ? <><CheckCircle2 size={15} /> Submitted for review</> : 'Submit for owner review'}
          </button>
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2>Member stories</h2><span className="small faint"><ShieldCheck size={14} className="aqua" /> Testimonials require explicit permission</span></div>
        <div className="card" style={{ padding: 0 }}>
          {members.slice(0, 8).map((m) => {
            const requested = s.consentRequested.includes(m.id)
            const drafted = s.testimonialDrafted.includes(m.id)
            return (
              <div key={m.id} className="member-row" style={{ cursor: 'default', gridTemplateColumns: '40px minmax(0,1fr) auto' }}>
                <div className="avatar">{m.initials}</div>
                <div>
                  <b className="small">{m.name}</b>
                  <div className="xs">
                    {m.consent === 'granted' && <span className="aqua"><CheckCircle2 size={12} /> Story consent on file · intake form</span>}
                    {m.consent === 'not-requested' && <span className="faint"><CircleDashed size={12} /> {requested ? 'Permission request prepared (demo, not sent)' : 'Consent not requested'}</span>}
                    {m.consent === 'declined' && <span style={{ color: 'var(--rose)' }}><Ban size={12} /> Declined, do not ask again</span>}
                  </div>
                </div>
                <div>
                  {m.consent === 'granted' && (
                    <button className="btn sm" onClick={() => setTestimonialFor(m.id)}>{drafted ? 'Edit testimonial draft' : 'Draft testimonial'}</button>
                  )}
                  {m.consent === 'not-requested' && (
                    <button className="btn ghost sm" disabled={requested} onClick={() => { set({ consentRequested: [...s.consentRequested, m.id] }); toast('Permission request prepared for coach review. Demo only.') }}>
                      {requested ? 'Prepared' : 'Ask permission'}
                    </button>
                  )}
                  {m.consent === 'declined' && <button className="btn ghost sm" disabled><Lock size={13} /> Locked</button>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="section">
        <div className="card dashed">
          <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
            <TrendingUp size={22} className="faint" style={{ flex: 'none' }} />
            <div>
              <div className="row"><h3 className="faint">Acquisition & campaign ROI</h3><span className="pill">Future capability</span></div>
              <p className="small muted" style={{ marginTop: 6 }}>Requires campaign, lead, and revenue data. Not estimated from attendance or scan data. Available only once marketing attribution is connected and validated.</p>
            </div>
          </div>
        </div>
      </div>

      <Drawer open={digestOpen} onClose={() => setDigestOpen(false)} eyebrow="Monthly digest" title="October progress digest" footer={
        <>
          <button className="btn ghost" onClick={() => setDigest(DIGEST)}>Restore draft</button>
          <button className="btn primary" onClick={() => { set({ digestSaved: true }); toast('Demo digest saved. Nothing was sent.'); setDigestOpen(false) }}>Approve & save</button>
        </>
      }>
        <textarea className="field" style={{ minHeight: 320 }} value={digest} onChange={(e) => setDigest(e.target.value)} aria-label="Digest text" />
        <p className="xs faint">Only studio-wide totals. No individual member data appears in the digest.</p>
      </Drawer>

      <TestimonialDrawer id={testimonialFor} onClose={() => setTestimonialFor(null)} />
    </>
  )
}

function TestimonialDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { s, set } = useStore()
  const m = members.find((x) => x.id === id)
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  if (!m) return null
  const value = text || `“When I started at IHT my goal was ${m.goal.toLowerCase()}. ${m.reason}. The coaches made the work feel personal.” — ${m.name.split(' ')[0]} ${m.name.split(' ')[1][0]}.`
  return (
    <Drawer open={!!id} onClose={() => { setSaved(false); setText(''); onClose() }} eyebrow="Testimonial draft" title={m.name} footer={
      saved ? <button className="btn primary" onClick={() => { setSaved(false); setText(''); onClose() }}>Done</button> :
        <button className="btn primary" onClick={() => { set({ testimonialDrafted: [...new Set([...s.testimonialDrafted, m.id])] }); setSaved(true) }}>Save draft for member approval</button>
    }>
      <div className="pill aqua"><CheckCircle2 size={13} /> Story consent on file · intake form</div>
      <textarea className="field" style={{ minHeight: 160 }} value={value} onChange={(e) => setText(e.target.value)} disabled={saved} />
      <p className="xs faint">The member approves the final wording before any use. No health claims or guaranteed results.</p>
      {saved && <SimNotice><b>Demo draft saved. Nothing was sent or published.</b></SimNotice>}
    </Drawer>
  )
}
