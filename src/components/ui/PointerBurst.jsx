import { useEffect, useRef, useState } from 'react'

const BURST_FALLBACK_DURATION = 2000
const MAX_POINTER_TRAVEL = 10
const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  'label',
  'summary',
  '[role="button"]',
  '[role="link"]',
  '[contenteditable="true"]',
  '[data-pointer-burst-ignore]',
].join(',')

const isInteractiveTarget = (target) => target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR))

const FIREWORK_COLORS = [
  '#f6c453',
  '#ffd166',
  '#f6c453',
  '#ffb347',
  '#f6c453',
  '#73c7f5',
  '#f6c453',
  '#ffd166',
  '#ff744f',
  '#f6c453',
  '#f2f2f2',
  '#ffd166',
]

const FIREWORK_PARTICLES = Array.from({ length: 12 }, (_, index) => {
  const angle = -90 + index * 30
  const radians = (angle * Math.PI) / 180
  const controlX = 50 + Math.cos(radians) * 28
  const controlY = 50 + Math.sin(radians) * 28
  const endX = 50 + Math.cos(radians) * 42
  const endY = 50 + Math.sin(radians) * 42 + 16

  return {
    path: `M 50 50 Q ${controlX} ${controlY} ${endX} ${endY}`,
    color: FIREWORK_COLORS[index],
    endX,
    endY,
  }
})

const createStarPath = (centerX, centerY, radius = 7) => {
  const inner = radius * 0.25
  return `M ${centerX} ${centerY - radius} L ${centerX + inner} ${centerY - inner} L ${centerX + radius} ${centerY} L ${centerX + inner} ${centerY + inner} L ${centerX} ${centerY + radius} L ${centerX - inner} ${centerY + inner} L ${centerX - radius} ${centerY} L ${centerX - inner} ${centerY - inner} Z`
}

const createFireworkStars = () => {
  const particleIndices = FIREWORK_PARTICLES.map((_, index) => index)

  for (let index = particleIndices.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[particleIndices[index], particleIndices[randomIndex]] = [particleIndices[randomIndex], particleIndices[index]]
  }

  return particleIndices.slice(0, 5).map((particleIndex, index) => {
    const particle = FIREWORK_PARTICLES[particleIndex]
    const directionX = particle.endX - 50
    const directionY = particle.endY - 50
    const directionLength = Math.hypot(directionX, directionY)
    const normalizedX = directionX / directionLength
    const normalizedY = directionY / directionLength
    const starGap = 9 + Math.random() * 7
    const sideOffset = (Math.random() - 0.5) * 8
    const starX = particle.endX + normalizedX * starGap - normalizedY * sideOffset
    const starY = particle.endY + normalizedY * starGap + normalizedX * sideOffset

    return {
      path: createStarPath(starX, starY, 5.5 + Math.random() * 2),
      color: particle.color,
      delay: 205 + index * 20 + Math.random() * 45,
    }
  })
}

const PointerBurst = () => {
  const [bursts, setBursts] = useState([])
  const activePointersRef = useRef(new Map())
  const timersRef = useRef(new Set())
  const nextIdRef = useRef(0)

  const removeBurst = (id) => {
    setBursts((current) => current.filter((burst) => burst.id !== id))
  }

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const activePointers = activePointersRef.current
    const timers = timersRef.current

    const handlePointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      if (isInteractiveTarget(event.target)) return

      activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      })
    }

    const handlePointerUp = (event) => {
      const start = activePointers.get(event.pointerId)
      activePointers.delete(event.pointerId)

      if (!start || reducedMotion.matches || isInteractiveTarget(event.target)) return

      const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y)
      if (distance > MAX_POINTER_TRAVEL) return

      const id = nextIdRef.current
      nextIdRef.current += 1

      setBursts((current) => [
        ...current.slice(-9),
        { id, x: event.clientX, y: event.clientY, stars: createFireworkStars() },
      ])

      const timer = window.setTimeout(() => {
        setBursts((current) => current.filter((burst) => burst.id !== id))
        timers.delete(timer)
      }, BURST_FALLBACK_DURATION)

      timers.add(timer)
    }

    const handlePointerCancel = (event) => {
      activePointers.delete(event.pointerId)
    }

    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })
    window.addEventListener('pointercancel', handlePointerCancel, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerCancel)
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
      activePointers.clear()
    }
  }, [])

  return (
    <div className="pp-pointer-burst-layer" aria-hidden="true">
      {bursts.map((burst) => (
        <svg
          key={burst.id}
          className="pp-pointer-burst"
          style={{ left: burst.x, top: burst.y }}
          width="44"
          height="44"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {FIREWORK_PARTICLES.map((particle, index) => (
            <path
              key={index}
              className="pp-firework-trail"
              d={particle.path}
              pathLength="100"
              style={{ '--pp-firework-color': particle.color }}
              onAnimationEnd={
                index === FIREWORK_PARTICLES.length - 1
                  ? (event) => {
                      if (event.animationName === 'pp-pointer-firework-fade') removeBurst(burst.id)
                    }
                  : undefined
              }
            />
          ))}
          {burst.stars.map((star, index) => (
            <path
              key={`star-${index}`}
              className="pp-firework-star"
              d={star.path}
              style={{
                '--pp-firework-color': star.color,
                '--pp-star-delay': `${star.delay}ms`,
              }}
            />
          ))}
        </svg>
      ))}
    </div>
  )
}

export default PointerBurst
