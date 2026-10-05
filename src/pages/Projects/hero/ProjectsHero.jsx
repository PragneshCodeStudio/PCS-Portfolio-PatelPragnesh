import { useSyncExternalStore } from 'react'
import ProjectsHeroGallery from './ProjectsHeroGallery'

const subscribeToViewport = (callback) => {
  const tablet = window.matchMedia('(min-width: 768px)')
  const desktop = window.matchMedia('(min-width: 1281px)')
  tablet.addEventListener('change', callback)
  desktop.addEventListener('change', callback)

  return () => {
    tablet.removeEventListener('change', callback)
    desktop.removeEventListener('change', callback)
  }
}

const getViewportMode = () => {
  if (window.matchMedia('(min-width: 1281px)').matches) return 'desktop'
  if (window.matchMedia('(min-width: 768px)').matches) return 'tablet'
  return 'mobile'
}

const subscribeToReducedMotion = (callback) => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

const getReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ProjectsHero = () => {
  const mode = useSyncExternalStore(subscribeToViewport, getViewportMode, () => 'mobile')
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, () => true)

  return (
    <section className="pp-first-sec overflow-hidden !py-0 md:flex md:aspect-[16/10] lg:aspect-[16/9] xl:aspect-[16/8] md:flex-col md:!py-0">
      <div className="relative isolate grid flex-1 md:grid-cols-[45%_55%]">
        <div className="pp-info-col absolute inset-x-0 bottom-0 z-20 flex min-w-0 flex-col justify-center py-[var(--spacing-sec-space)] px-5 md:static md:z-auto md:pl-[max(5vw,calc(50vw_-_640px))] md:pr-6">
          <p className="pp-section-eyebrow">Selected Work</p>
          <h1 className="text-6xl md:text-5xl lg:text-7xl xl:text-8xl">Projects</h1>
          <p className="mt-5 max-w-[460px] text-secondary-text">
            Company and personal projects I designed and developed, from responsive websites to interactive frontend experiences.
          </p>
        </div>
        <ProjectsHeroGallery mode={mode} reducedMotion={reducedMotion} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[70%] bg-linear-to-t from-main-bg via-main-bg/95 via-50% to-transparent md:hidden"
        />
      </div>
    </section>
  )
}

export default ProjectsHero


