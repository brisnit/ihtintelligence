import { Activity, BarChart3, Moon, Sun, CalendarDays, Database, FlaskConical, Home, LineChart, MessageCircle, Play, RotateCcw, Sprout, User, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { StoreProvider, useStore } from './state/store'
import type { MemberView, StaffView } from './state/store'
import { Logo, Toasts } from './components/ui'
import { Tour } from './components/Tour'
import { useTheme } from './state/theme'
import { StaffToday } from './views/staff/StaffToday'
import { MemberProfile } from './views/staff/MemberProfile'
import { MembersList } from './views/staff/MembersList'
import { Outcomes } from './views/staff/Outcomes'
import { Growth } from './views/staff/Growth'
import { DataSources } from './views/staff/DataSources'
import { MemberToday } from './views/member/MemberToday'
import { MemberProgress } from './views/member/MemberProgress'
import { MemberPlan } from './views/member/MemberPlan'
import { MemberCoach } from './views/member/MemberCoach'
import { CheckInSheet } from './views/member/CheckInSheet'

const STAFF_NAV: { v: StaffView; l: string; i: LucideIcon }[] = [
  { v: 'today', l: 'Today', i: Home },
  { v: 'members', l: 'Members', i: Users },
  { v: 'outcomes', l: 'Outcomes', i: BarChart3 },
  { v: 'growth', l: 'Growth', i: Sprout },
  { v: 'data', l: 'Data', i: Database },
]
const MEMBER_NAV: { v: MemberView; l: string; i: LucideIcon }[] = [
  { v: 'today', l: 'Today', i: Home },
  { v: 'progress', l: 'Progress', i: LineChart },
  { v: 'plan', l: 'Plan', i: CalendarDays },
  { v: 'coach', l: 'Coach', i: MessageCircle },
]

function RoleSwitch() {
  const { s, set } = useStore()
  return (
    <div className="role-switch" role="group" aria-label="Choose view">
      <button aria-pressed={s.role === 'staff'} onClick={() => { set({ role: 'staff' }); window.scrollTo({ top: 0 }) }}>
        <Activity size={15} /> Staff
      </button>
      <button aria-pressed={s.role === 'member'} onClick={() => { set({ role: 'member' }); window.scrollTo({ top: 0 }) }}>
        <User size={15} /> Member
      </button>
    </div>
  )
}

function Shell() {
  const { s, set, reset, goStaff, goMember, resetNonce } = useStore()
  const staff = s.role === 'staff'
  const nav = staff ? STAFF_NAV : MEMBER_NAV
  const current = staff ? (s.staffView === 'profile' ? 'members' : s.staffView) : s.memberView
  const go = (v: string) => (staff ? goStaff(v as StaffView) : goMember(v as MemberView))

  const startTour = () => set({ tourStep: 0 })
  const { theme, toggle } = useTheme()

  let page
  if (staff) {
    page = {
      today: <StaffToday />,
      members: <MembersList />,
      outcomes: <Outcomes />,
      growth: <Growth />,
      data: <DataSources />,
      profile: <MemberProfile />,
    }[s.staffView]
  } else {
    page = { today: <MemberToday />, progress: <MemberProgress />, plan: <MemberPlan />, coach: <MemberCoach /> }[s.memberView]
  }

  return (
    <>
      <div className="demo-strip">
        <FlaskConical size={12} /> Concept demo · Synthetic data · Illustrative forecasts
      </div>
      <aside className="sidebar">
        <Logo />
        <RoleSwitch />
        <nav className="nav" aria-label={staff ? 'Staff navigation' : 'Member navigation'}>
          {nav.map((n) => (
            <button key={n.v} className="nav-btn" aria-current={current === n.v ? 'page' : undefined} onClick={() => go(n.v)}>
              <n.i size={19} /> {n.l}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="faint xs" style={{ padding: '0 4px' }}>
            {staff ? 'Signed in as Coach Elena (demo)' : 'Viewing as Maya Chen (fictional)'}
          </div>
        </div>
      </aside>
      <header className="topbar">
        <Logo compact />
        <div className="topbar-spacer hide-mobile" />
        <div className="show-mobile topbar-spacer" />
        <div className="hide-mobile"><span className="faint small">{staff ? 'Staff workspace' : 'Member app'}</span></div>
        <div className="topbar-actions">
          <div className="show-mobile"><RoleSwitch /></div>
          <button className="btn sm primary" onClick={startTour} aria-label="Start guided demo">
            <Play size={15} /> <span className="hide-mobile">Start guided demo</span>
          </button>
          <button className="btn sm theme-btn" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />} <span className="hide-mobile lbl-theme">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <button className="btn sm" onClick={reset} aria-label="Reset demo">
            <RotateCcw size={15} /> <span className="hide-mobile">Reset demo</span>
          </button>
        </div>
      </header>
      <main className="main" key={`${s.role}-${s.staffView}-${s.memberView}-${s.profileId}-${resetNonce}`}>
        {page}
      </main>
      <nav className="bottom-nav" aria-label={staff ? 'Staff navigation' : 'Member navigation'}>
        {nav.map((n) => (
          <button key={n.v} aria-current={current === n.v ? 'page' : undefined} onClick={() => go(n.v)}>
            <n.i size={21} />
            {n.l}
          </button>
        ))}
      </nav>
      <CheckInSheet />
      <Tour />
      <Toasts />
    </>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
