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
  direction = 'up',
  startOnMount = false,
  onComplete,
}) => {
  const { target, targetText = '', suffix, isNumeric } = useMemo(() => parseCounterValue(value), [value])
  const isDownward = direction === 'down'
  const elementRef = useRef(null)
  const reelRefs = useRef([])
  const hasStartedRef = useRef(false)
  const isVisibleRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
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

      return isDownward ? values.reverse() : values
    })
  }, [isDownward, isNumeric, targetText])

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

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

    hasStartedRef.current = false
    isVisibleRef.current = false

    const getRollOffset = (reel) => `-${Number(reel.dataset.rollDistance || 0)}em`
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      reelElements.forEach((reel) => {
        gsap.set(reel, {
          y: isDownward ? '0em' : getRollOffset(reel),
        })
      })
      onCompleteRef.current?.()
      return undefined
    }

    gsap.set(reelElements, {
      y: (_, reel) => isDownward ? getRollOffset(reel) : '0em',
    })

    const runCounter = () => {
      if (hasStartedRef.current || !isVisibleRef.current) {
        return
      }

      hasStartedRef.current = true
      let completedReels = 0

      reelElements.forEach((reel, index) => {
        gsap.to(reel, {
          y: isDownward ? '0em' : getRollOffset(reel),
          duration: duration + (index * 0.18),
          delay: delay + (index * 0.08),
          ease,
          onComplete: () => {
            completedReels += 1
            if (completedReels === reelElements.length) {
              onCompleteRef.current?.()
            }
          },
        })
      })
    }

    if (startOnMount) {
      isVisibleRef.current = true
      runCounter()
      return () => gsap.killTweensOf(reelElements)
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
  }, [delay, duration, ease, isDownward, isNumeric, rootMargin, startOnMount, target, value])

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
              style={isDownward ? { transform: `translateY(-${digits.length - 1}em)` } : undefined}
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
