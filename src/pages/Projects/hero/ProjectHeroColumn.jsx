import { useCallback, useLayoutEffect, useRef } from 'react'
import { gsap } from '../../../utils/gsap.config.js'

const ProjectTile = ({ project, interactive, eager }) => {
  const content = (
    <>
      <div className="aspect-video w-full overflow-hidden bg-section-bg">
        <img
          src={project.image}
          alt=""
          className="size-full object-contain"
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
      <span className="block truncate px-2 py-2 font-body text-xs font-semibold text-primary-text lg:px-3 lg:text-sm">
        {project.title}
      </span>
    </>
  )

  const classes = `block min-w-0 overflow-hidden border border-border bg-card-bg${interactive
    ? ' transition-colors duration-200 hover:border-accent focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
    : ''}`

  if (!interactive) {
    return <div className={classes}>{content}</div>
  }

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
      aria-label={`Open ${project.title} project in a new tab`}
    >
      {content}
    </a>
  )
}

const ProjectHeroColumn = ({ projectOrder, settings, interactive, reducedMotion }) => {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const tweenRef = useRef(null)
  const visibleRef = useRef(false)
  const pointerInsideRef = useRef(false)
  const focusInsideRef = useRef(false)

  const syncPlayback = useCallback(() => {
    if (!tweenRef.current) return

    if (
      visibleRef.current
      && document.visibilityState === 'visible'
      && !pointerInsideRef.current
      && !focusInsideRef.current
    ) {
      tweenRef.current.resume()
    } else {
      tweenRef.current.pause()
    }
  }, [])

  useLayoutEffect(() => {
    if (reducedMotion || !viewportRef.current || !trackRef.current) return undefined

    const tween = gsap.fromTo(
      trackRef.current,
      { yPercent: settings.direction === 'down' ? -50 : 0 },
      {
        yPercent: settings.direction === 'down' ? 0 : -50,
        duration: settings.duration * (projectOrder.length / 4),
        repeat: -1,
        ease: 'none',
      },
    )
    tween.progress(settings.offset)
    tweenRef.current = tween
    syncPlayback()

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
      syncPlayback()
    }, { threshold: 0.05 })

    observer.observe(viewportRef.current)
    document.addEventListener('visibilitychange', syncPlayback)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      tween.kill()
      tweenRef.current = null
      visibleRef.current = false
      pointerInsideRef.current = false
      focusInsideRef.current = false
    }
  }, [projectOrder.length, reducedMotion, settings, syncPlayback])

  useLayoutEffect(() => {
    if (!interactive || !viewportRef.current) return undefined

    const viewport = viewportRef.current
    const links = viewport.querySelectorAll('a')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const visible = entry.intersectionRatio >= 0.5
        entry.target.tabIndex = visible ? 0 : -1
        entry.target.setAttribute('aria-hidden', String(!visible))
      })
    }, { root: viewport, threshold: [0, 0.5] })

    links.forEach((link) => {
      link.tabIndex = -1
      link.setAttribute('aria-hidden', 'true')
      observer.observe(link)
    })

    return () => observer.disconnect()
  }, [interactive, reducedMotion])

  const pauseColumn = () => {
    pointerInsideRef.current = true
    syncPlayback()
  }

  const resumeColumn = () => {
    pointerInsideRef.current = false
    syncPlayback()
  }

  const pauseForFocus = () => {
    focusInsideRef.current = true
    syncPlayback()
  }

  const resumeAfterFocus = (event) => {
    if (event.currentTarget.contains(event.relatedTarget)) return
    focusInsideRef.current = false
    syncPlayback()
  }

  return (
    <div
      ref={viewportRef}
      className="min-h-0 min-w-0 overflow-hidden"
      onMouseEnter={interactive && !reducedMotion ? pauseColumn : undefined}
      onMouseLeave={interactive && !reducedMotion ? resumeColumn : undefined}
      onFocusCapture={interactive && !reducedMotion ? pauseForFocus : undefined}
      onBlurCapture={interactive && !reducedMotion ? resumeAfterFocus : undefined}
    >
      <div ref={trackRef}>
        {[0, 1].slice(0, reducedMotion ? 1 : 2).map((copy) => (
          <div key={copy} className="flex flex-col gap-2 pb-2 lg:gap-3 lg:pb-3">
            {projectOrder.map((project, index) => (
              <ProjectTile
                key={`${project.id}-${index}`}
                project={project}
                interactive={interactive}
                eager={copy === 0 && index < 3}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectHeroColumn
