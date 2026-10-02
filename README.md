# IHT Intelligence: concept prototype

**See progress. Act earlier. Keep climbing.**

A frontend-only, interactive concept demo of an intelligence layer for IHT FACTOR (downtown San Diego). It shows how signals already spread across Mindbody, InBody, intake forms, wellness surveys, and coach notes could become a short, evidence-backed action queue for staff and a motivating progress view for members.

> Concept demo · Synthetic data · Illustrative forecasts
> No backend, authentication, integrations, live AI, or real member information. Every booking, message, and connection is simulated and labeled as such.

## Run it

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview    # http://localhost:4173
```

Demo state lives in `sessionStorage`, so an accidental reload mid-meeting keeps your place. **Reset demo** (top bar) restores the starting state.

## Three-minute meeting script

Click **Start guided demo** in the top bar. The panel walks through these steps and highlights each target:

1. **Staff → Today.** Three prioritized cards. Maya's follow-up is first.
2. **Maya's profile.** The AI summary separates *Observed / Possible explanation / Suggested action*. Open **Show the evidence**.
3. **Draft encouragement.** Edit the message, then approve it. You'll see "Demo message saved. Nothing was sent."
4. **Switch to Member.** Maya sees "Your progress goes beyond the scale."
5. **Quick check-in.** Tap energy, recovery, and soreness. Optionally add the **Demo voice note**, then save.
6. **Back to Staff.** The check-in appears on Maya's timeline, the AI summary, and the insight's "Why am I seeing this?".
7. **Outcomes.** Cohort results with sample size, period, coverage, and an **Insufficient-data example**.

Also worth showing: the **Outlook** scenario slider on Maya's profile (solid = measured, dashed = illustrative), **Snooze/Dismiss** on Today, consent-gated testimonials on **Growth**, and the "Demo source" labels on **Data**.

## What's inside

| Area | Highlights |
| --- | --- |
| Staff · Today | Prioritized insight queue: what changed, why it matters, next action, sources, "Why am I seeing this?", plus assign, snooze, dismiss, and restore |
| Staff · Member profile | Maya Chen: goal, body-comp trends, attendance, check-ins, coach notes, source timeline, missing-data flags, evidence drawer, editable draft, scenario outlook |
| Staff · Members | 12 fictional members, search, and filters for Needs follow-up, Progress review due, Celebrating progress, and All |
| Staff · Outcomes | Synthetic cohort (n=90) aggregated live by program, goal, and duration. Shows n, date range, coverage, causation caveat, and an insufficient-data state below n=10 |
| Staff · Growth | Progress conversations, milestones, monthly digest draft, aggregate story preview, consent status, and ROI marked as a future capability |
| Staff · Data | Proposed sources labeled "Demo source", sample stats, missing and matching issues, future layers, "Invisible by design" principles |
| Member | Today, Progress (5 charts + timeframe), Plan (simulated booking), Coach (message + reply), optional quick check-in |

## Stack

React 19, TypeScript, Vite, and lucide-react icons. Charts are hand-built SVG. All data is in `src/data/fixtures.ts`, so staff and member views read the same records.

```
src/
  data/fixtures.ts        synthetic data (Maya's series, members, cohort, sources)
  state/store.tsx         demo state, navigation, toasts, reset
  components/             UI primitives, charts, guided tour
  views/staff/            Today, MemberProfile, MembersList, Outcomes, Growth, DataSources
  views/member/           Today, Progress, Plan, Coach, CheckInSheet
```

## Guardrails reflected in the UI

- Forecasts are labeled "Illustrative scenario, not a validated prediction". The prototype shows no success probabilities or confidence scores.
- Jordan's card is framed as a coach conversation, not a diagnosis or an automated program change.
- Cohort results state that association does not establish causation and show coverage for every metric.
- Members never see internal tags. Testimonials require consent on file.
- Campaign ROI is not inferred from attendance or scan data.

Brand: IHT FACTOR logo from ihtfactor.com, with Rajdhani and Inter. Aqua `#09FCD2` on `#050B0A`.
