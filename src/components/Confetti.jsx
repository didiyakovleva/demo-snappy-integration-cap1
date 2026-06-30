import { useMemo } from 'react'

const COLORS = ['#c8102e', '#004977', '#f2b705', '#1f7a3d', '#e87fae', '#0a7d52', '#f2752b']

/**
 * Lightweight one-shot confetti burst (CSS-only, no deps). Renders a fixed set
 * of pieces that fall once when the component mounts.
 */
export default function Confetti({ count = 44 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2.4 + Math.random() * 2,
        bg: COLORS[i % COLORS.length],
        w: 6 + Math.random() * 6,
        h: 9 + Math.random() * 8,
        drift: (Math.random() * 2 - 1) * 60,
        rot: 220 + Math.random() * 540,
        round: Math.random() > 0.7,
      })),
    [count],
  )

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: `${p.w}px`,
            height: `${p.h}px`,
            background: p.bg,
            borderRadius: p.round ? '50%' : '1px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--rot': `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  )
}
