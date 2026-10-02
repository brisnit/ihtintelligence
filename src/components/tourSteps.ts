import type { MemberView, Role, StaffView } from '../state/store'

export interface TourStep {
  title: string
  body: string
  target: string
  role: Role
  staffView?: StaffView
  memberView?: MemberView
}

export const TOUR_STEPS: TourStep[] = [
  {
    title: 'Staff notices Maya’s follow-up',
    body: 'No dashboard digging. The morning queue surfaces three small actions, each with evidence and a next step. Maya is first.',
    target: 'maya-card',
    role: 'staff',
    staffView: 'today',
  },
  {
    title: 'Open her profile and evidence',
    body: 'Facts are separated from interpretation. Tap “Show the evidence” to see the exact records behind the insight.',
    target: 'evidence-btn',
    role: 'staff',
    staffView: 'profile',
  },
  {
    title: 'Draft encouragement',
    body: 'AI prepares a draft. The coach edits and approves it. In this demo nothing is sent.',
    target: 'draft-btn',
    role: 'staff',
    staffView: 'profile',
  },
  {
    title: 'Switch to Maya’s view',
    body: 'Same data, member-friendly framing: progress beyond the scale, with no internal flags exposed.',
    target: 'member-summary',
    role: 'member',
    memberView: 'today',
  },
  {
    title: 'Submit a quick check-in',
    body: 'Optional, 10–15 seconds, no streaks. It fills a real gap: how Maya is feeling right now.',
    target: 'checkin-cta',
    role: 'member',
    memberView: 'today',
  },
  {
    title: 'Back to staff: the picture updates',
    body: 'Maya’s check-in now appears on her timeline and in the insight explanation. Nobody re-entered anything.',
    target: 'timeline',
    role: 'staff',
    staffView: 'profile',
  },
  {
    title: 'The wider opportunity',
    body: 'Across members, the same signals show cohort outcomes, with sample sizes, coverage, and honest limits.',
    target: 'outcomes-head',
    role: 'staff',
    staffView: 'outcomes',
  },
]
