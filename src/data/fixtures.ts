// All data in this file is synthetic and fictional. No real members are represented.

export const TODAY = '2026-10-02'
export const COACH_NAME = 'Coach Elena'

export type Source = 'Mindbody' | 'InBody' | 'Intake form' | 'Wellness survey' | 'Coach note' | 'Quick check-in' | 'Studio scale'

// ---------- Maya Chen: primary demo member ----------

export const maya = {
  id: 'maya',
  name: 'Maya Chen',
  initials: 'MC',
  goal: 'Improve body composition and feel stronger',
  goalDetail: 'Lower body fat while building strength. Wants to feel confident lifting heavier in the back squat and deadlift.',
  program: 'Body Composition Foundations',
  durationWeeks: 8,
  startDate: '2026-08-03',
  endDate: '2026-09-27',
  coach: COACH_NAME,
  plannedPerWeek: 3,
  memberSince: '2026-07-28',
  nextSession: { date: '2026-10-05', time: '6:30 AM', type: 'Strength · Lower body', coach: COACH_NAME },
  progressReview: { date: '2026-10-07', time: '7:30 AM', type: '8-week progress review', coach: COACH_NAME },
}

export interface WeightPoint { week: number; date: string; lb: number }
// Weekly studio-scale weigh-ins. Flat at ~168 lb for the last three weeks.
export const mayaWeight: WeightPoint[] = [
  { week: 0, date: '2026-08-03', lb: 172.0 },
  { week: 1, date: '2026-08-10', lb: 171.4 },
  { week: 2, date: '2026-08-17', lb: 170.6 },
  { week: 3, date: '2026-08-24', lb: 169.9 },
  { week: 4, date: '2026-08-31', lb: 169.0 },
  { week: 5, date: '2026-09-07', lb: 168.2 },
  { week: 6, date: '2026-09-14', lb: 168.1 },
  { week: 7, date: '2026-09-21', lb: 168.4 },
  { week: 8, date: '2026-09-28', lb: 168.0 },
]

export interface ScanPoint { week: number; date: string; weightLb: number; bodyFatPct: number; smmLb: number; id: string }
// InBody scans planned every two weeks. The week-6 scan was not recorded.
export const mayaScans: ScanPoint[] = [
  { id: 'IB-2208', week: 0, date: '2026-08-03', weightLb: 172.0, bodyFatPct: 32.0, smmLb: 61.2 },
  { id: 'IB-2291', week: 2, date: '2026-08-17', weightLb: 170.6, bodyFatPct: 31.3, smmLb: 61.5 },
  { id: 'IB-2377', week: 4, date: '2026-08-31', weightLb: 169.0, bodyFatPct: 30.4, smmLb: 61.8 },
  { id: 'IB-2560', week: 8, date: '2026-09-28', weightLb: 168.0, bodyFatPct: 29.0, smmLb: 62.4 },
]
export const missingScanWeeks = [6]

export interface AttendanceWeek { week: number; weekOf: string; planned: number; completed: number }
// 12/12 in weeks 1–4, 9/12 in weeks 5–8.
export const mayaAttendance: AttendanceWeek[] = [
  { week: 1, weekOf: '2026-08-03', planned: 3, completed: 3 },
  { week: 2, weekOf: '2026-08-10', planned: 3, completed: 3 },
  { week: 3, weekOf: '2026-08-17', planned: 3, completed: 3 },
  { week: 4, weekOf: '2026-08-24', planned: 3, completed: 3 },
  { week: 5, weekOf: '2026-08-31', planned: 3, completed: 3 },
  { week: 6, weekOf: '2026-09-07', planned: 3, completed: 2 },
  { week: 7, weekOf: '2026-09-14', planned: 3, completed: 2 },
  { week: 8, weekOf: '2026-09-21', planned: 3, completed: 2 },
]

export interface CheckIn {
  id: string
  date: string
  energy: number // 1–5
  recovery: number // 1–5
  soreness: number // 1–5 (higher = more sore)
  note?: string
  source: Source
  isNew?: boolean
  voice?: boolean
}
export const mayaCheckIns: CheckIn[] = [
  { id: 'WS-101', date: '2026-08-07', energy: 4, recovery: 4, soreness: 3, source: 'Wellness survey', note: 'Excited to get started.' },
  { id: 'WS-114', date: '2026-08-21', energy: 4, recovery: 4, soreness: 3, source: 'Wellness survey' },
  { id: 'WS-129', date: '2026-09-04', energy: 4, recovery: 3, soreness: 2, source: 'Wellness survey', note: 'Squats are feeling stronger.' },
  { id: 'WS-141', date: '2026-09-18', energy: 3, recovery: 3, soreness: 2, source: 'Wellness survey' },
  { id: 'WS-152', date: '2026-09-29', energy: 3, recovery: 3, soreness: 2, source: 'Wellness survey', note: 'I’m frustrated that the scale stopped moving.' },
]

export interface CoachNote { id: string; date: string; author: string; text: string }
export const mayaCoachNotes: CoachNote[] = [
  { id: 'CN-31', date: '2026-08-05', author: COACH_NAME, text: 'Good movement quality. Hip hinge pattern solid; working toward goblet squat to 35 lb.' },
  { id: 'CN-44', date: '2026-09-02', author: COACH_NAME, text: 'Back squat working sets moved from 65 to 85 lb across the block. Visibly more confident.' },
  { id: 'CN-58', date: '2026-09-23', author: COACH_NAME, text: 'Mentioned a busy stretch at work. Missed Wednesday sessions recently.' },
]

// ---------- Members list ----------

export type MemberTag = 'followup' | 'review' | 'celebrate'
export interface MemberSummary {
  id: string
  name: string
  initials: string
  goal: string
  program: string
  coach: string
  lastVisit: string
  latestScan: string | null
  tags: MemberTag[]
  reason: string
  attendance4wk: string
  consent: 'granted' | 'not-requested' | 'declined'
}

export const members: MemberSummary[] = [
  { id: 'maya', name: 'Maya Chen', initials: 'MC', goal: 'Body composition & strength', program: 'Body Composition Foundations', coach: COACH_NAME, lastVisit: '2026-09-30', latestScan: '2026-09-28', tags: ['followup', 'review'], reason: 'Scale steady while scan shows progress; attendance below earlier pattern', attendance4wk: '9 of 12', consent: 'not-requested' },
  { id: 'jordan', name: 'Jordan Reyes', initials: 'JR', goal: 'Half-marathon strength support', program: 'Performance Hybrid', coach: 'Coach Malik', lastVisit: '2026-10-01', latestScan: '2026-09-14', tags: ['followup'], reason: 'Self-reported recovery below their usual baseline', attendance4wk: '11 of 12', consent: 'granted' },
  { id: 'alex', name: 'Alex Kim', initials: 'AK', goal: 'Build a consistent routine', program: 'Strength Foundations', coach: COACH_NAME, lastVisit: '2026-10-01', latestScan: '2026-09-10', tags: ['celebrate'], reason: 'Attendance goal met four consecutive weeks', attendance4wk: '12 of 12', consent: 'granted' },
  { id: 'priya', name: 'Priya Natarajan', initials: 'PN', goal: 'Return to lifting post-injury', program: 'Strength Foundations', coach: 'Coach Malik', lastVisit: '2026-09-29', latestScan: '2026-09-01', tags: ['review'], reason: '12-week progress review due next week', attendance4wk: '10 of 12', consent: 'not-requested' },
  { id: 'marcus', name: 'Marcus Bell', initials: 'MB', goal: 'Increase lean mass', program: 'Body Composition Foundations', coach: COACH_NAME, lastVisit: '2026-09-30', latestScan: '2026-09-25', tags: ['celebrate'], reason: 'Skeletal muscle mass up across three consecutive scans', attendance4wk: '11 of 12', consent: 'granted' },
  { id: 'sofia', name: 'Sofia Alvarez', initials: 'SA', goal: 'More energy for daily life', program: 'Strength Foundations', coach: 'Coach Malik', lastVisit: '2026-09-18', latestScan: '2026-08-20', tags: ['followup'], reason: 'No visit in 14 days; previously visited twice weekly', attendance4wk: '4 of 8', consent: 'not-requested' },
  { id: 'devon', name: 'Devon Carter', initials: 'DC', goal: 'Sport performance (soccer)', program: 'Performance Hybrid', coach: 'Coach Malik', lastVisit: '2026-10-01', latestScan: null, tags: ['review'], reason: 'No baseline scan on file; review needs a starting point', attendance4wk: '12 of 12', consent: 'declined' },
  { id: 'hannah', name: 'Hannah Brooks', initials: 'HB', goal: 'Body composition', program: 'Body Composition Foundations', coach: COACH_NAME, lastVisit: '2026-09-30', latestScan: '2026-09-26', tags: [], reason: '—', attendance4wk: '11 of 12', consent: 'not-requested' },
  { id: 'luis', name: 'Luis Ortega', initials: 'LO', goal: 'Strength for hiking season', program: 'Strength Foundations', coach: COACH_NAME, lastVisit: '2026-09-28', latestScan: '2026-09-15', tags: ['celebrate'], reason: 'Hit personal deadlift goal set at intake', attendance4wk: '10 of 12', consent: 'granted' },
  { id: 'taylor', name: 'Taylor Nguyen', initials: 'TN', goal: 'Feel stronger and sleep better', program: 'Strength Foundations', coach: 'Coach Malik', lastVisit: '2026-09-24', latestScan: '2026-09-03', tags: ['followup', 'review'], reason: 'Check-in mentions poor sleep two weeks running', attendance4wk: '8 of 12', consent: 'not-requested' },
  { id: 'sam', name: 'Sam Whitfield', initials: 'SW', goal: 'General fitness', program: 'Body Composition Foundations', coach: COACH_NAME, lastVisit: '2026-10-01', latestScan: '2026-09-22', tags: [], reason: '—', attendance4wk: '9 of 12', consent: 'not-requested' },
  { id: 'renee', name: 'Renee Okafor', initials: 'RO', goal: 'Mobility and strength at 60+', program: 'Strength Foundations', coach: COACH_NAME, lastVisit: '2026-09-30', latestScan: '2026-09-12', tags: ['review', 'celebrate'], reason: 'Completed first 12-week block; review due', attendance4wk: '12 of 12', consent: 'granted' },
]

// ---------- Staff "Today" insights ----------

export type InsightId = 'maya' | 'jordan' | 'alex'
export interface Insight {
  id: InsightId
  memberId: string
  priority: number
  kind: 'Follow-up suggested' | 'Check in' | 'Celebrate'
  title: string
  whatChanged: string
  whyItMatters: string
  action: string
  sources: { label: string; date: string }[]
  why: string[]
}

export const insights: Insight[] = [
  {
    id: 'maya',
    memberId: 'maya',
    priority: 1,
    kind: 'Follow-up suggested',
    title: 'Help Maya see the progress she’s making.',
    whatChanged: 'Scale weight has stayed near 168 lb for three weeks, while her latest InBody scan shows lower body fat and higher skeletal muscle mass. Attendance is 9 of 12 planned sessions over the last four weeks.',
    whyItMatters: 'Her latest check-in says she is frustrated the scale stopped moving. Seeing the fuller picture may help her stay motivated through a plateau.',
    action: 'Review progress',
    sources: [
      { label: 'InBody scan IB-2560', date: '2026-09-28' },
      { label: 'Studio scale log', date: '2026-09-28' },
      { label: 'Mindbody attendance', date: '2026-09-27' },
      { label: 'Wellness survey WS-152', date: '2026-09-29' },
    ],
    why: [
      'Scale weight changed by less than 0.5 lb across the last three weekly weigh-ins.',
      'Latest scan: body fat 29.0% (from 32.0%), skeletal muscle mass 62.4 lb (from 61.2 lb).',
      'Attendance moved from 12 of 12 (weeks 1–4) to 9 of 12 (weeks 5–8).',
      'Her check-in note mentions frustration with the scale.',
      'Ranked first because three signals point to the same conversation, and her progress review is in five days.',
    ],
  },
  {
    id: 'jordan',
    memberId: 'jordan',
    priority: 2,
    kind: 'Check in',
    title: 'Check in with Jordan before the next session.',
    whatChanged: 'Jordan’s last two self-reported recovery scores are lower than their usual baseline.',
    whyItMatters: 'A quick conversation before tomorrow’s session gives the coach context. This is a prompt to ask, not a diagnosis or a change to their program.',
    action: 'Review check-in',
    sources: [
      { label: 'Wellness survey WS-150', date: '2026-09-30' },
      { label: 'Wellness survey WS-139', date: '2026-09-23' },
      { label: 'Mindbody booking', date: '2026-10-03' },
    ],
    why: [
      'Recovery averaged about 4.3 of 5 over the prior eight check-ins; the last two were 2 and 3.',
      'Jordan has a session booked tomorrow at 7:00 AM.',
      'The coach decides whether and how to adjust training. No automated change is suggested.',
    ],
  },
  {
    id: 'alex',
    memberId: 'alex',
    priority: 3,
    kind: 'Celebrate',
    title: 'Celebrate Alex’s consistency.',
    whatChanged: 'Alex has completed their attendance goal of three sessions per week for four consecutive weeks.',
    whyItMatters: 'Building a consistent routine was Alex’s intake goal. Recognizing it reinforces the habit.',
    action: 'Draft congratulations',
    sources: [
      { label: 'Mindbody attendance', date: '2026-09-27' },
      { label: 'Intake form goal', date: '2026-06-15' },
    ],
    why: [
      'Intake goal: “Build a consistent routine — 3 sessions a week.”',
      'Completed 3 of 3 planned sessions in each of the last four weeks.',
      'No recent celebration message is logged for Alex.',
    ],
  },
]

export const DEFAULT_MAYA_MESSAGE =
  'Hi Maya, your latest scan shows progress that the scale alone doesn’t capture. Let’s review it together at your next session and talk about how you’re feeling.'
export const DEFAULT_ALEX_MESSAGE =
  'Alex, four straight weeks of hitting your three-session goal. That’s exactly the routine you told us you wanted to build. Proud of you. Let’s keep it rolling.'

export const jordanRecovery = [
  { date: '2026-08-05', v: 4 }, { date: '2026-08-12', v: 4 }, { date: '2026-08-19', v: 5 }, { date: '2026-08-26', v: 4 },
  { date: '2026-09-02', v: 4 }, { date: '2026-09-09', v: 4 }, { date: '2026-09-12', v: 4 }, { date: '2026-09-16', v: 5 },
  { date: '2026-09-23', v: 3 }, { date: '2026-09-30', v: 2 },
]

// ---------- Outcomes: synthetic cohort ----------

export type Program = 'Body Composition Foundations' | 'Strength Foundations' | 'Performance Hybrid'
export type StartGoal = 'Body composition' | 'Strength' | 'Energy & recovery'
export interface CohortRecord {
  program: Program
  goal: StartGoal
  duration: 8 | 12
  bfChange: number | null
  smmChange: number | null
  attendancePct: number
  energyChange: number | null
  goalProgress: 'met' | 'partial' | 'not-yet' | 'unknown'
  completed: boolean
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildCohort(): CohortRecord[] {
  const rnd = mulberry32(42)
  const out: CohortRecord[] = []
  const groups: [Program, StartGoal, 8 | 12, number][] = [
    ['Body Composition Foundations', 'Body composition', 8, 22],
    ['Body Composition Foundations', 'Body composition', 12, 14],
    ['Body Composition Foundations', 'Energy & recovery', 8, 6],
    ['Strength Foundations', 'Strength', 8, 12],
    ['Strength Foundations', 'Strength', 12, 16],
    ['Strength Foundations', 'Energy & recovery', 12, 9],
    ['Performance Hybrid', 'Strength', 12, 7],
    ['Performance Hybrid', 'Energy & recovery', 8, 4],
  ]
  for (const [program, goal, duration, n] of groups) {
    for (let i = 0; i < n; i++) {
      const att = Math.round(55 + rnd() * 45)
      const effect = (att / 100) * (duration / 8)
      const hasScan = rnd() > (program === 'Performance Hybrid' ? 0.55 : 0.18)
      const hasSurvey = rnd() > 0.3
      const bf = hasScan ? +(-(0.6 + rnd() * 3.2) * effect + (rnd() - 0.5) * 0.8).toFixed(1) : null
      const smm = hasScan ? +((0.2 + rnd() * 1.6) * effect + (rnd() - 0.5) * 0.4).toFixed(1) : null
      const en = hasSurvey ? +((rnd() * 1.6 - 0.2) * (att / 100)).toFixed(1) : null
      const r = rnd()
      const completed = r > 0.12
      const goalProgress: CohortRecord['goalProgress'] = !hasSurvey && !hasScan ? 'unknown' : r > 0.55 ? 'met' : r > 0.25 ? 'partial' : 'not-yet'
      out.push({ program, goal, duration, bfChange: bf, smmChange: smm, attendancePct: att, energyChange: en, goalProgress, completed })
    }
  }
  return out
}
export const cohort = buildCohort()
export const COHORT_RANGE = 'Jan 5 – Sep 27, 2026'
export const MIN_SAMPLE = 10

// ---------- Data sources ----------

export interface DataSource {
  name: string
  system: string
  provides: string
  lastSample: string
  records: string
  missing: string[]
  matching: string[]
}
export const dataSources: DataSource[] = [
  { name: 'Attendance & bookings', system: 'Mindbody', provides: 'Visits, bookings, cancellations, membership type', lastSample: '2026-10-01 · 6:00 AM', records: '4,812 visits · 146 members', missing: ['Class type missing on 3% of visits'], matching: ['2 members have duplicate client IDs'] },
  { name: 'Body composition', system: 'InBody', provides: 'Weight, body fat %, skeletal muscle mass, segmental lean', lastSample: '2026-09-30 · 7:45 PM', records: '611 scans · 128 members', missing: ['18 members have no baseline scan'], matching: ['9 scans matched by name + date only (no member ID)'] },
  { name: 'Intake forms & goals', system: 'Intake form', provides: 'Starting goals, history, preferences, consent', lastSample: '2026-09-29 · 3:10 PM', records: '146 forms', missing: ['Goal field blank on 7 forms', 'Testimonial consent not asked before Mar 2026'], matching: [] },
  { name: 'Wellness check-ins', system: 'Survey + quick check-in', provides: 'Energy, recovery, soreness, free-text notes', lastSample: '2026-10-01 · 8:20 PM', records: '1,204 responses · 97 members', missing: ['49 members have not responded in 30+ days (expected — optional)'], matching: [] },
  { name: 'Coach observations', system: 'Coach notes', provides: 'Session notes, load progressions, context', lastSample: '2026-10-01 · 7:05 PM', records: '2,377 notes', missing: ['Notes are free text; load data inconsistent'], matching: ['Notes stored per coach; 4 coaches use different templates'] },
]
export const futureSources = [
  { name: 'Wearables', detail: 'Sleep, resting heart rate, daily activity — member opt-in only.' },
  { name: 'Session measurements', detail: 'Sets, reps, and loads recorded during training.' },
  { name: 'Force & velocity sensors', detail: 'Bar speed, jump metrics, power output.' },
  { name: 'Marketing attribution', detail: 'Lead source, campaign, conversion, revenue.' },
]

// ---------- helpers ----------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export function fmtDate(iso: string, withYear = false) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}${withYear ? `, ${y}` : ''}`
}
export function fmtDay(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return DAYS[new Date(y, m - 1, d).getDay()]
}
export function daysAgo(iso: string) {
  const a = new Date(TODAY + 'T12:00:00').getTime()
  const b = new Date(iso + 'T12:00:00').getTime()
  const n = Math.round((a - b) / 86400000)
  if (n <= 0) return 'Today'
  if (n === 1) return 'Yesterday'
  return `${n} days ago`
}
