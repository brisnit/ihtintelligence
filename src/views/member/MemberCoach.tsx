import { useState } from 'react'
import { Info, Send } from 'lucide-react'
import { COACH_NAME } from '../../data/fixtures'
import { nowLabel, useStore } from '../../state/store'

const QUICK = ['Thanks, that helps!', 'Can we look at it Wednesday?', 'Honestly, I’ve been a bit discouraged.']

export function MemberCoach() {
  const { s, set, toast } = useStore()
  const [text, setText] = useState('')
  const send = (t: string) => {
    if (!t.trim()) return
    set({ replies: [...s.replies, { text: t.trim(), at: nowLabel() }] })
    setText('')
    toast('Demo reply saved locally. Nothing was sent.')
  }
  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Coach</div>
        <h1 style={{ marginTop: 8 }}>{COACH_NAME}</h1>
        <p>Messages from your coach. Your coach writes and approves every message.</p>
      </div>
      <div className="card pad-lg" style={{ maxWidth: 760 }}>
        <div className="row" style={{ marginBottom: 16 }}>
          <div className="avatar">EL</div>
          <div>
            <b>{COACH_NAME}</b>
            <div className="xs faint">Head coach · IHT FACTOR</div>
          </div>
          <span className="pill sim" style={{ marginLeft: 'auto' }}>Demo conversation</span>
        </div>
        <div className="stack" style={{ gap: 10 }}>
          <div className="bubble them">Great work on Monday. Those squats are moving well. See you Wednesday!<div className="xs faint" style={{ marginTop: 4 }}>Sep 28</div></div>
          <div className="bubble them">
            {s.mayaDraft}
            <div className="xs faint" style={{ marginTop: 4 }}>
              {s.mayaSavedAt ? `Today · approved by ${COACH_NAME} (demo, not sent)` : 'Preview of the coach’s draft · not yet approved'}
            </div>
          </div>
          {s.replies.map((r, i) => (
            <div key={i} className="bubble me">{r.text}<div className="xs faint" style={{ marginTop: 4 }}>{r.at} · demo, not sent</div></div>
          ))}
        </div>
        <div className="row" style={{ marginTop: 18, gap: 6 }}>
          {QUICK.map((q) => <button key={q} className="btn sm" onClick={() => send(q)}>{q}</button>)}
        </div>
        <form className="row" style={{ marginTop: 12, flexWrap: 'nowrap' }} onSubmit={(e) => { e.preventDefault(); send(text) }}>
          <input className="field" placeholder="Write a reply…" value={text} onChange={(e) => setText(e.target.value)} aria-label="Reply" />
          <button className="btn primary icon" type="submit" aria-label="Send reply (demo)" disabled={!text.trim()}><Send size={18} /></button>
        </form>
      </div>
      <p className="small faint" style={{ marginTop: 14, maxWidth: 760 }}>
        <Info size={13} /> IHT Intelligence helps your coach prepare. It isn’t a clinician and doesn’t give medical advice. For health concerns, talk to your healthcare provider.
      </p>
    </>
  )
}
