import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../../utils/gsap.config.js'
import ProjectHeroColumn from './ProjectHeroColumn'
import { columnSettings, heroProjectColumns } from './projectsHero.data.js'
import { runAfterPageReveal } from './runAfterPageReveal'

const galleryTilt = { rotation: 8.9387, rotationY: -12.7249, rotationX: 8.9386 }
const horizontalReach = 0.3

const ProjectsHeroGallery = ({ mode, reducedMotion }) => {
  const interactive = mode === 'desktop'
  const viewportRef = useRef(null)
  const galleryRef = useRef(null)
  const moveXRef = useRef(null)
  const moveYRef = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion || !viewportRef.current || !galleryRef.current) return undefined

    const viewport = viewportRef.current
    const gallery = galleryRef.current
    let stopReveal
    const context = gsap.context(() => {
      gsap.set(gallery, {
        ...galleryTilt,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      })

      const reveal = gsap.fromTo(viewport,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', delay: 0.1, duration: 2, ease: 'power4.inOut', paused: true },
      )
      stopReveal = runAfterPageReveal(() => reveal.play())

      if (interactive) {
        moveXRef.current = gsap.quickTo(gallery, 'x', { duration: 0.85, ease: 'power2.out' })
        moveYRef.current = gsap.quickTo(gallery, 'y', { duration: 1.2, ease: 'power2.out' })
      }
    }, viewport)

    return () => {
      stopReveal?.()
      context.revert()
      moveXRef.current = null
      moveYRef.current = null
    }
  }, [interactive, reducedMotion])

  const moveGallery = (event) => {
    const viewport = viewportRef.current
    const gallery = galleryRef.current
    if (!viewport || !gallery) return

    const bounds = viewport.getBoundingClientRect()
    const xPos = (event.clientX - bounds.left) / bounds.width
    const yPos = (event.clientY - bounds.top) / bounds.height
    const maxX = Math.max((gallery.offsetWidth - viewport.clientWidth) / 2 - 10, 0)
    const maxY = Math.max((gallery.offsetHeight - viewport.clientHeight) / 2 - 10, 0)
    const horizontalProgress = Math.max(-1, Math.min(1, (0.5 - xPos) / (0.5 - horizontalReach)))
    const x = horizontalProgress * maxX
    const y = (1 - 2 * yPos) * maxY
    moveXRef.current?.(x)
    moveYRef.current?.(y)
  }

  const straightenGallery = () => {
    gsap.to(galleryRef.current, {
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
      duration: 3,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  const resetGallery = () => {
    moveXRef.current?.(0)
    moveYRef.current?.(0)
    gsap.to(galleryRef.current, {
      ...galleryTilt,
      duration: 3,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  return (
    <div
      ref={viewportRef}
      className="pp-gallery-col relative h-[clamp(480px,calc(100svh-80px),640px)] min-w-0 self-stretch overflow-hidden md:h-auto md:min-h-[340px] xl:min-h-[420px]"
      onMouseEnter={interactive && !reducedMotion ? straightenGallery : undefined}
      onMouseMove={interactive && !reducedMotion ? moveGallery : undefined}
      onMouseLeave={interactive && !reducedMotion ? resetGallery : undefined}
      aria-hidden={!interactive}
    >
      <div ref={galleryRef} className="absolute -inset-x-[16%] -inset-y-[20%] grid grid-cols-3 gap-2 lg:gap-3">
        {columnSettings.map((settings, columnIndex) => (
          <ProjectHeroColumn
            key={settings.direction + columnIndex}
            projectOrder={heroProjectColumns[columnIndex]}
            settings={settings}
            interactive={interactive}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[clamp(64px,7vw,120px)] bg-linear-to-r from-main-bg via-main-bg/75 to-transparent md:block"
      />
    </div>
  )
}

export default ProjectsHeroGallery

