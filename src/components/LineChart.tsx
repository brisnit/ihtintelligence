import { useLayoutEffect, useRef, useState } from 'react'

export interface Pt { x: number; y: number; label?: string }
export interface Series {
  name: string
  points: Pt[]
  dashed?: boolean
  color?: string
  showDots?: boolean
}

interface Props {
  series: Series[]
  height?: number
  xTicks: { x: number; label: string }[]
  yDomain?: [number, number]
  unit: string
  decimals?: number
  /** x position where the scenario region begins (shaded). */
  scenarioFrom?: number
  ariaLabel: string
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    if (!ref.current) return
    setW(Math.max(240, ref.current.clientWidth))
    const ro = new ResizeObserver(([e]) => setW(Math.max(240, e.contentRect.width)))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

export function LineChart({ series, height = 240, xTicks, yDomain, unit, decimals = 1, scenarioFrom, ariaLabel }: Props) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const m = { t: 16, r: 18, b: 30, l: 44 }
  const all = series.flatMap((s) => s.points)
  const xs = all.map((p) => p.x)
  const ys = all.map((p) => p.y)
  const x0 = Math.min(...xs, ...xTicks.map((t) => t.x))
  const x1 = Math.max(...xs, ...xTicks.map((t) => t.x))
  let [y0, y1] = yDomain ?? [Math.min(...ys), Math.max(...ys)]
  if (!yDomain) {
    const pad = (y1 - y0) * 0.25 || 1
    y0 -= pad
    y1 += pad
  }
  const iw = width - m.l - m.r
  const ih = height - m.t - m.b
  const sx = (x: number) => m.l + ((x - x0) / (x1 - x0 || 1)) * iw
  const sy = (y: number) => m.t + (1 - (y - y0) / (y1 - y0 || 1)) * ih
  const yTicks = Array.from({ length: 4 }, (_, i) => y0 + ((y1 - y0) * i) / 3)

  // Hover snaps to the nearest x that has data.
  const uniqX = [...new Set(xs)].sort((a, b) => a - b)
  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const r = (e.target as SVGRectElement).getBoundingClientRect()
    const px = e.clientX - r.left + m.l
    let best = uniqX[0]
    for (const x of uniqX) if (Math.abs(sx(x) - px) < Math.abs(sx(best) - px)) best = x
    setHover(best)
  }
  const hoverPts = hover === null ? [] : series.map((s) => ({ s, p: s.points.find((p) => p.x === hover) })).filter((h) => h.p)

  return (
    <div className="chart-wrap" ref={ref} style={{ minHeight: height }}>
      {width > 0 && <svg width={width} height={height} role="img" aria-label={ariaLabel}>
        {scenarioFrom !== undefined && (
          <>
            <rect x={sx(scenarioFrom)} y={m.t} width={Math.max(0, sx(x1) - sx(scenarioFrom))} height={ih} fill="rgba(9,252,210,0.035)" />
            <text x={sx(scenarioFrom) + 8} y={m.t + 12} fill="#7f918c" fontSize="11" fontWeight="600" letterSpacing="0.06em">
              ILLUSTRATIVE SCENARIO
            </text>
            <line x1={sx(scenarioFrom)} x2={sx(scenarioFrom)} y1={m.t} y2={m.t + ih} stroke="#2a443d" strokeDasharray="3 4" />
          </>
        )}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={m.l} x2={width - m.r} y1={sy(t)} y2={sy(t)} stroke="#1a2b27" />
            <text x={m.l - 8} y={sy(t) + 4} textAnchor="end" fill="#7f918c" fontSize="11" className="num">
              {t.toFixed(t >= 100 ? 0 : decimals)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t.x} x={sx(t.x)} y={height - 8} textAnchor="middle" fill="#7f918c" fontSize="11">
            {t.label}
          </text>
        ))}
        {series.map((s) => {
          const d = s.points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x)},${sy(p.y)}`).join(' ')
          const c = s.color ?? '#09FCD2'
          return (
            <g key={s.name}>
              <path d={d} fill="none" stroke={c} strokeWidth={2} strokeDasharray={s.dashed ? '6 6' : undefined} strokeLinecap="round" strokeLinejoin="round" opacity={s.dashed ? 0.85 : 1} />
              {s.showDots !== false &&
                s.points.map((p) => (
                  <circle key={p.x} cx={sx(p.x)} cy={sy(p.y)} r={s.dashed ? 3 : 4.5} fill={s.dashed ? '#101B18' : c} stroke={s.dashed ? c : '#101B18'} strokeWidth={2} />
                ))}
            </g>
          )
        })}
        {hover !== null && (
          <line x1={sx(hover)} x2={sx(hover)} y1={m.t} y2={m.t + ih} stroke="#3c5a52" strokeWidth={1} />
        )}
        {hoverPts.map(({ s, p }) => (
          <circle key={s.name} cx={sx(p!.x)} cy={sy(p!.y)} r={6} fill="none" stroke={s.color ?? '#09FCD2'} strokeWidth={2} />
        ))}
        <rect x={m.l} y={m.t} width={iw} height={ih} fill="transparent" onPointerMove={onMove} onPointerLeave={() => setHover(null)} />
      </svg>}
      {hover !== null && hoverPts.length > 0 && (
        <div className="chart-tip" style={{ left: sx(hover), top: Math.min(...hoverPts.map((h) => sy(h.p!.y))) - 10 }}>
          {hoverPts.map(({ s, p }) => (
            <div key={s.name}>
              <span className="faint">{p!.label ?? s.name}</span>{' '}
              <b className="num">
                {p!.y.toFixed(decimals)} {unit}
              </b>
              {s.dashed && <span className="faint"> · scenario</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function AttendanceBars({ data, height = 180 }: { data: { label: string; planned: number; completed: number; sub?: string }[]; height?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const m = { t: 10, r: 8, b: 30, l: 28 }
  const max = Math.max(...data.map((d) => d.planned), 1)
  const iw = width - m.l - m.r
  const ih = height - m.t - m.b
  const bw = iw / data.length
  const barW = Math.min(34, bw * 0.6)
  const sy = (v: number) => m.t + ih - (v / max) * ih
  return (
    <div className="chart-wrap" ref={ref} style={{ minHeight: height }}>
      {width > 0 && <svg width={width} height={height} role="img" aria-label="Sessions completed versus planned per week">
        {Array.from({ length: max + 1 }, (_, i) => (
          <g key={i}>
            <line x1={m.l} x2={width - m.r} y1={sy(i)} y2={sy(i)} stroke="#1a2b27" />
            <text x={m.l - 8} y={sy(i) + 4} textAnchor="end" fill="#7f918c" fontSize="11">{i}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = m.l + bw * i + bw / 2
          return (
            <g key={i} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
              <rect x={m.l + bw * i} y={m.t} width={bw} height={ih} fill="transparent" />
              <rect x={cx - barW / 2} y={sy(d.planned)} width={barW} height={ih - (sy(d.planned) - m.t)} rx={4} fill="none" stroke="#2a443d" strokeWidth={1.5} strokeDasharray="3 3" />
              {d.completed > 0 && <rect x={cx - barW / 2 + 2} y={sy(d.completed) + 2} width={barW - 4} height={Math.max(0, sy(0) - sy(d.completed) - 2)} rx={4} fill={d.completed < d.planned ? '#06b89a' : '#09FCD2'} />}
              <text x={cx} y={height - 10} textAnchor="middle" fill={hover === i ? '#fff' : '#7f918c'} fontSize="11">{d.label}</text>
            </g>
          )
        })}
      </svg>}
      {hover !== null && (
        <div className="chart-tip" style={{ left: m.l + bw * hover + bw / 2, top: sy(data[hover].planned) - 6 }}>
          <b>{data[hover].completed} of {data[hover].planned}</b> <span className="faint">sessions{data[hover].sub ? ` · ${data[hover].sub}` : ''}</span>
        </div>
      )}
    </div>
  )
}
