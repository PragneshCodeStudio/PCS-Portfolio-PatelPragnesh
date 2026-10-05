import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from '../../../utils/gsap.config.js'

const useExperienceTimelineAnimation = (sectionRef) => {
  useLayoutEffect(() => {
    const section = sectionRef.current
    let media
    let iconCard

    if (!section) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const track = section.querySelector('[data-experience-track]')
      const lineTrack = section.querySelector('[data-experience-line]')
      const lineFill = section.querySelector('[data-experience-line-fill]')
      const iconCol = section.querySelector('[data-experience-icon-col]')
      iconCard = section.querySelector('[data-experience-icon-card]')
      const cards = gsap.utils.toArray('[data-experience-card]', section)
      const iconTrace = section.querySelector('[data-experience-icon-trace]')
      const iconFill = section.querySelector('[data-experience-icon-fill]')
      const drawPaths = gsap.utils.toArray('[data-experience-draw-path]', section)
      const steps = cards
        .map((card) => card.querySelector('[data-experience-step]'))
        .filter(Boolean)
      const drawPathLengths = drawPaths.map((path) => path.getTotalLength())
      let stepProgressPoints = []

      // Prepare SVG stroke paths for scroll-driven draw animation.
      drawPaths.forEach((path, index) => {
        const length = drawPathLengths[index]

        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
      })

      // traceProgress draws the outline; fillProgress fades in the solid icon after tracing.
      const updateIconTrace = (traceProgress = 0, fillProgress = 0) => {
        const normalizedTraceProgress = gsap.utils.clamp(0, 1, traceProgress)
        const normalizedFillProgress = gsap.utils.clamp(0, 1, fillProgress)

        if (iconTrace) {
          gsap.set(iconTrace, {
            autoAlpha: normalizedTraceProgress > 0.001 ? 1 : 0,
          })
        }

        if (iconFill) {
          gsap.set(iconFill, {
            autoAlpha: normalizedFillProgress,
          })
        }

        drawPaths.forEach((path, index) => {
          const length = drawPathLengths[index]

          gsap.set(path, {
            strokeDashoffset: length * (1 - normalizedTraceProgress),
          })
        })
      }

      const getTraceProgress = (timelineProgress = 0) => {
        const firstStepPoint = stepProgressPoints[0] ?? 0
        // Complete stroke early so the user sees the finished icon before unpin.
        const completePoint = 0.8

        if (timelineProgress <= firstStepPoint) {
          return 0
        }

        return gsap.utils.clamp(
          0,
          1,
          (timelineProgress - firstStepPoint) / Math.max(completePoint - firstStepPoint, 0.001),
        )
      }

      const getFillProgress = (timelineProgress = 0) => {
        // Fill begins only after the stroke trace is complete.
        const fillStartPoint = 0.8
        const fillEndPoint = 0.95

        if (timelineProgress <= fillStartPoint) {
          return 0
        }

        return gsap.utils.clamp(
          0,
          1,
          (timelineProgress - fillStartPoint) / Math.max(fillEndPoint - fillStartPoint, 0.001),
        )
      }

      updateIconTrace(0, 0)

      media = gsap.matchMedia()

      media.add('(min-width: 1024px)', () => {
        if (!track || !iconCard || !iconCol) return

        const updateIconPosition = (self) => {
          const travel = Math.max(iconCol.offsetHeight - iconCard.offsetHeight, 0)
          const availableScroll = Math.max(ScrollTrigger.maxScroll(window) - self.start, 0)
          const scrollRange = Math.min(travel, availableScroll)
          const progress = scrollRange > 0
            ? gsap.utils.clamp(0, 1, (self.scroll() - self.start) / scrollRange)
            : 1

          gsap.set(iconCard, { y: -travel * (1 - progress) })
        }

        const positionTrigger = ScrollTrigger.create({
          trigger: track,
          start: 'top top+=120',
          end: 'max',
          invalidateOnRefresh: true,
          onUpdate: updateIconPosition,
          onRefresh: updateIconPosition,
        })

        updateIconPosition(positionTrigger)
      })

      media.add('(max-width: 1023px)', () => {
        updateIconTrace(1, 1)

        return () => {
          updateIconTrace(0, 0)
        }
      })

      if (lineTrack && lineFill && track && steps.length > 1) {
        const syncLineBounds = () => {
          const trackRect = track.getBoundingClientRect()
          const firstStepRect = steps[0].getBoundingClientRect()
          const lastStepRect = steps[steps.length - 1].getBoundingClientRect()
          const firstCenter = firstStepRect.top + (firstStepRect.height / 2) - trackRect.top
          const lastCenter = lastStepRect.top + (lastStepRect.height / 2) - trackRect.top

          lineTrack.style.top = `${firstCenter}px`
          lineTrack.style.height = `${Math.max(lastCenter - firstCenter, 0)}px`
        }

        const getStepProgressPoints = () => {
          syncLineBounds()

          const lineRect = lineTrack.getBoundingClientRect()
          const lineTop = lineRect.top
          const lineHeight = lineRect.height || 1

          return steps.map((step) => {
            const stepRect = step.getBoundingClientRect()
            const stepCenter = stepRect.top + (stepRect.height / 2)

            return gsap.utils.clamp(0, 1, (stepCenter - lineTop) / lineHeight)
          })
        }

        stepProgressPoints = getStepProgressPoints()

        const updateActiveSteps = (progress = 0, scrollPosition = 0) => {
          const atPageEnd = scrollPosition >= ScrollTrigger.maxScroll(window) - 1
          const normalizedProgress = atPageEnd ? 1 : gsap.utils.clamp(0, 1, progress)
          const activeIndex = stepProgressPoints.reduce((latestIndex, point, index) => (
            normalizedProgress > 0.001 && normalizedProgress + 0.001 >= point ? index : latestIndex
          ), -1)

          steps.forEach((step, index) => {
            step.classList.toggle(
              'pp-active',
              index <= activeIndex,
            )
          })

          updateIconTrace(
            getTraceProgress(normalizedProgress),
            getFillProgress(normalizedProgress),
          )
          gsap.set(iconCard, { scale: 1 })
        }

        const lineTween = gsap.fromTo(lineFill, {
          scaleY: 0,
        }, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: track || section,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
            onLeave: () => updateActiveSteps(1),
            onUpdate: (self) => updateActiveSteps(self.progress, self.scroll()),
            onRefresh: (self) => {
              stepProgressPoints = getStepProgressPoints()
              updateActiveSteps(self.progress, self.scroll())
            },
          },
        })

        updateActiveSteps(lineTween.scrollTrigger?.progress || 0, lineTween.scrollTrigger?.scroll() || 0)
      }
    }, section)

    return () => {
      media?.revert()
      ctx.revert()

      if (iconCard) {
        gsap.set(iconCard, { clearProps: 'all' })
      }

      ScrollTrigger.refresh()
    }
  }, [sectionRef])
}

export default useExperienceTimelineAnimation
