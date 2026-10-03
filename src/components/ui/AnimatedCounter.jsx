import { useEffect, useMemo, useRef } from 'react'
import { gsap } from '../../utils/gsap.config.js'

const parseCounterValue = (value) => {
  const text = String(value)
  const match = text.match(/^(\d+)(.*)$/)

  if (!match) {
    return { target: 0, suffix: text, isNumeric: false }
  }

  return {
    target: Number(match[1]),
    targetText: match[1],
    suffix: match[2],
    isNumeric: true,
  }
}

const AnimatedCounter = ({
  value,
  duration = 2.6,
  delay = 0.2,
  ease = 'power3.out',
  rootMargin = '0px 0px -12% 0px',
}) => {
  const { target, targetText = '', suffix, isNumeric } = useMemo(() => parseCounterValue(value), [value])
  const elementRef = useRef(null)
  const reelRefs = useRef([])
  const hasStartedRef = useRef(false)
  const isVisibleRef = useRef(false)
  const reels = useMemo(() => {
    if (!isNumeric) {
      return []
    }

    return targetText.split('').map((digit, index) => {
      const values = []
      const cycles = 2 + index

      for (let cycle = 0; cycle < cycles; cycle += 1) {
        for (let number = 0; number <= 9; number += 1) {
          values.push(number)
        }
      }

      values.push(Number(digit))

      return values
    })
  }, [isNumeric, targetText])

  useEffect(() => {
    const element = elementRef.current
    const reelElements = reelRefs.current.filter(Boolean)
    let observer
    let startTimer

    if (!element) {
      return undefined
    }

    if (!isNumeric) {
      return undefined
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      reelElements.forEach((reel) => {
        gsap.set(reel, {
          y: `-${Number(reel.dataset.rollDistance || 0)}em`,
        })
      })
      return undefined
    }

    gsap.set(reelElements, { y: '0em' })

    const runCounter = () => {
      if (hasStartedRef.current || !isVisibleRef.current) {
        return
      }

      hasStartedRef.current = true

      reelElements.forEach((reel, index) => {
        const rollDistance = Number(reel.dataset.rollDistance || 0)

        gsap.to(reel, {
          y: `-${rollDistance}em`,
          duration: duration + (index * 0.18),
          delay: delay + (index * 0.08),
          ease,
        })
      })
    }

    const isPageCovered = () => (
      document.querySelector('.pp-splash-screen')
      || document.documentElement.classList.contains('pp-page-transition-running')
    )

    const startWhenPageIsVisible = () => {
      window.clearTimeout(startTimer)
      startTimer = window.setTimeout(() => {
        if (!isPageCovered()) {
          runCounter()
        }
      }, 120)
    }

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        const [entry] = entries

        if (entry?.isIntersecting) {
          isVisibleRef.current = true
          startWhenPageIsVisible()
          observer.disconnect()
        }
      }, { rootMargin, threshold: 0.35 })

      observer.observe(element)
    } else {
      isVisibleRef.current = true
    }

    window.addEventListener('pp:splash-complete', startWhenPageIsVisible)
    window.addEventListener('pp:page-transition-complete', startWhenPageIsVisible)
    startWhenPageIsVisible()

    return () => {
      window.clearTimeout(startTimer)
      observer?.disconnect()
      window.removeEventListener('pp:splash-complete', startWhenPageIsVisible)
      window.removeEventListener('pp:page-transition-complete', startWhenPageIsVisible)
      gsap.killTweensOf(reelElements)
    }
  }, [delay, duration, ease, isNumeric, rootMargin, target, value])

  if (!isNumeric) {
    return <span aria-label={String(value)}>{value}</span>
  }

  return (
    <span
      ref={elementRef}
      className="inline-flex items-baseline whitespace-nowrap [font-variant-numeric:tabular-nums]"
      aria-label={String(value)}
    >
      <span className="inline-flex items-baseline" aria-hidden="true">
        {reels.map((digits, index) => (
          <span
            key={`${targetText}-${index}`}
            className="inline-block h-[1em] overflow-hidden align-bottom leading-none"
          >
            <span
              ref={(node) => {
                if (node) {
                  reelRefs.current[index] = node
                }
              }}
              className="flex flex-col leading-none will-change-transform"
              data-roll-distance={digits.length - 1}
            >
              {digits.map((digit, digitIndex) => (
                <span
                  key={`${index}-${digitIndex}`}
                  className="block h-[1em] leading-none text-center"
                >
                  {digit}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  )
}

export default AnimatedCounter
