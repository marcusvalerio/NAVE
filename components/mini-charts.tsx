"use client"
import { motion } from "framer-motion"

/* ── Anel de progresso fino, estilo "Activity" ── */
export function RingMetric({ value, max, size = 68, stroke = 7, color = "#4F7DFF" }: { value: number; max: number; size?: number; stroke?: number; color?: string }) {
  const pct = Math.min(1, max > 0 ? value / max : 0)
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
        />
      </svg>
    </div>
  )
}

/* ── Sparkline de linha, estilo "Weight" ── */
export function SparklineMetric({ data, width = 70, height = 32, color = "#4F7DFF" }: { data: number[]; width?: number; height?: number; color?: string }) {
  if (data.length < 2) return <div style={{ width, height }} />
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(" ")

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <motion.polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </svg>
  )
}

/* ── Barras verticais, estilo "Sleep" ── */
export function BarsMetric({ values, width = 78, height = 40, color = "#4F7DFF", highlightIndex }: { values: number[]; width?: number; height?: number; color?: string; highlightIndex?: number }) {
  const max = Math.max(...values, 1)
  const gap = 4
  const barWidth = (width - gap * (values.length - 1)) / values.length

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap, height, width }}>
      {values.map((v, i) => {
        const h = Math.max(3, (v / max) * height)
        const active = i === highlightIndex
        return (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: h }}
            transition={{ duration: 0.5, delay: i * 0.04, ease: "easeOut" }}
            style={{
              width: barWidth,
              borderRadius: 3,
              background: active ? color : "rgba(255,255,255,0.16)",
            }}
          />
        )
      })}
    </div>
  )
}
