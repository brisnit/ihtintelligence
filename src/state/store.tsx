import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { CheckIn, InsightId } from '../data/fixtures'
import { DEFAULT_ALEX_MESSAGE, DEFAULT_MAYA_MESSAGE } from '../data/fixtures'

export type Role = 'staff' | 'member'
export type StaffView = 'today' | 'members' | 'outcomes' | 'growth' | 'data' | 'profile'
export type MemberView = 'today' | 'progress' | 'plan' | 'coach'

export interface InsightStatus {
  status: 'active' | 'snoozed' | 'dismissed'
  assignedTo?: string
  reviewed?: boolean
}

export interface DemoState {
  role: Role
  staffView: StaffView
  profileId: string
  memberView: MemberView
  insights: Record<InsightId, InsightStatus>
  mayaDraft: string
  mayaSavedAt: string | null
  alexDraft: string
  alexSavedAt: string | null
  checkIns: CheckIn[]
  replies: { text: string; at: string }[]
  bookings: { day: string; time: string; type: string }[]
  digestSaved: boolean
  storyStatus: 'draft' | 'in-review'
  consentRequested: string[]
  testimonialDrafted: string[]
  checkInOpen: boolean
  tourStep: number | null
}

const initialState: DemoState = {
  role: 'staff',
  staffView: 'today',
  profileId: 'maya',
  memberView: 'today',
  insights: { maya: { status: 'active' }, jordan: { status: 'active' }, alex: { status: 'active' } },
  mayaDraft: DEFAULT_MAYA_MESSAGE,
  mayaSavedAt: null,
  alexDraft: DEFAULT_ALEX_MESSAGE,
  alexSavedAt: null,
  checkIns: [],
  replies: [],
  bookings: [],
  digestSaved: false,
  storyStatus: 'draft',
  consentRequested: [],
  testimonialDrafted: [],
  checkInOpen: false,
  tourStep: null,
}

export interface Toast { id: number; text: string }

interface Ctx {
  s: DemoState
  set: (patch: Partial<DemoState> | ((s: DemoState) => Partial<DemoState>)) => void
  reset: () => void
  toasts: Toast[]
  toast: (text: string) => void
  goStaff: (v: StaffView, profileId?: string) => void
  goMember: (v: MemberView) => void
  resetNonce: number
}

const StoreCtx = createContext<Ctx | null>(null)
const KEY = 'iht-intelligence-demo-v1'

function load(): DemoState {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) return { ...initialState, ...JSON.parse(raw), checkInOpen: false }
  } catch {
    /* storage unavailable: fall back to defaults */
  }
  return initialState
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<DemoState>(load)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [resetNonce, setResetNonce] = useState(0)
  const nextId = useRef(1)

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(s))
    } catch {
      /* ignore */
    }
  }, [s])

  const set = useCallback<Ctx['set']>((patch) => {
    setS((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }))
  }, [])

  const toast = useCallback((text: string) => {
    const id = nextId.current++
    // Show only the latest toast so rapid demo clicks never stack over the tour panel.
    setToasts([{ id, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800)
  }, [])

  const reset = useCallback(() => {
    setS(initialState)
    setResetNonce((n) => n + 1)
    window.scrollTo({ top: 0 })
    toast('Demo reset to its starting state.')
  }, [toast])

  const goStaff = useCallback((v: StaffView, profileId?: string) => {
    setS((p) => ({ ...p, role: 'staff', staffView: v, profileId: profileId ?? p.profileId }))
    window.scrollTo({ top: 0 })
  }, [])
  const goMember = useCallback((v: MemberView) => {
    setS((p) => ({ ...p, role: 'member', memberView: v }))
    window.scrollTo({ top: 0 })
  }, [])

  const value = useMemo(() => ({ s, set, reset, toasts, toast, goStaff, goMember, resetNonce }), [s, set, reset, toasts, toast, goStaff, goMember, resetNonce])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const c = useContext(StoreCtx)
  if (!c) throw new Error('useStore outside provider')
  return c
}

export function nowLabel() {
  const d = new Date()
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
