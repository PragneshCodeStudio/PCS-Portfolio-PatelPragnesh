import { useLayoutEffect, useRef, useState } from 'react'
import { BrandFavIconWhite } from '../../assets/icons'
import { gsap, ScrollSmoother } from '../../utils/gsap.config.js'

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true)
  const splashRef = useRef(null)
  const percentRef = useRef(null)

  useLayoutEffect(() => {
    const root = document.documentElement
    const body = document.body
    const scrollbarGap = window.innerWidth - root.clientWidth
    const previousRootOverflow = root.style.overflow
    const previousBodyOverflow = body.style.overflow
    const previousBodyPaddingRight = body.style.paddingRight
    const previousRootScrollbarGap = root.style.getPropertyValue('--pp-scrollbar-gap')

    root.style.setProperty('--pp-scrollbar-gap', `${scrollbarGap}px`)
    root.classList.add('pp-splash-scroll-lock')
    body.classList.add('pp-splash-scroll-lock')
    root.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.paddingRight = scrollbarGap > 0 ? `${scrollbarGap}px` : previousBodyPaddingRight

    const scrollKeys = new Set([
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'End',
      'Home',
      'PageDown',
      'PageUp',
      ' ',
    ])

    const preventScroll = (event) => {
      event.preventDefault()
    }

    const preventKeyboardScroll = (event) => {
      if (scrollKeys.has(event.key)) {
        event.preventDefault()
      }
    }

    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
    window.addEventListener('keydown', preventKeyboardScroll)
    document.addEventListener('wheel', preventScroll, { passive: false, capture: true })
    document.addEventListener('touchmove', preventScroll, { passive: false, capture: true })
    document.addEventListener('keydown', preventKeyboardScroll, { capture: true })

    const pauseSmoother = () => {
      const smoother = ScrollSmoother.get()

      if (smoother && typeof smoother.paused === 'function') {
        smoother.paused(true)
      }
    }

    pauseSmoother()
    const smootherPauseCall = gsap.delayedCall(0.05, pauseSmoother)
    let isUnlocked = false

    const unlockSplashScroll = () => {
      if (isUnlocked) {
        return
      }

      isUnlocked = true

      const smoother = ScrollSmoother.get()

      if (smoother && typeof smoother.paused === 'function') {
        smoother.paused(false)
      }

      smootherPauseCall.kill()
      root.classList.remove('pp-splash-scroll-lock')
      body.classList.remove('pp-splash-scroll-lock')
      root.style.overflow = previousRootOverflow
      body.style.overflow = previousBodyOverflow
      body.style.paddingRight = previousBodyPaddingRight

      if (previousRootScrollbarGap) {
        root.style.setProperty('--pp-scrollbar-gap', previousRootScrollbarGap)
      } else {
        root.style.removeProperty('--pp-scrollbar-gap')
      }

      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('keydown', preventKeyboardScroll)
      document.removeEventListener('wheel', preventScroll, { capture: true })
      document.removeEventListener('touchmove', preventScroll, { capture: true })
      document.removeEventListener('keydown', preventKeyboardScroll, { capture: true })
    }

    const ctx = gsap.context(() => {
      const progress = { value: 1 }
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          unlockSplashScroll()
          window.dispatchEvent(new Event('pp:splash-complete'))
          setIsVisible(false)
        },
      })

      timeline
        .set('.pp-splash-logo', { scale: 0.84, opacity: 0 })
        .set('.pp-splash-logo-doodle', { y: '0%' })
        .set('.pp-splash-percent', { opacity: 0, y: 8 })
        .to('.pp-splash-logo', {
          opacity: 1,
          scale: 1,
          duration: 1,
        })
        .to('.pp-splash-percent', {
          opacity: 1,
          y: 0,
          duration: 0.45,
        }, '+=0.10')
        .to('.pp-splash-logo-doodle', {
          y: '100%',
          duration: 1.75,
          ease: 'power2.inOut',
        }, '-=0.05')
        .to(progress, {
          value: 100,
          duration: 1.75,
          ease: 'power2.inOut',
          snap: { value: 1 },
          onUpdate: () => {
            if (percentRef.current) {
              percentRef.current.textContent = `${progress.value}%`
            }
          },
        }, '<')
        .to('.pp-splash-logo, .pp-splash-percent', {
          opacity: 0,
          y: -10,
          stagger: 0.06,
          duration: 0.65,
          ease: 'power2.in',
        }, '+=0.15')
        .to(splashRef.current, {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.inOut',
        }, '+=0.25')
    }, splashRef)

    return () => {
      unlockSplashScroll()
      ctx.revert()
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div
      ref={splashRef}
      className="pp-splash-screen fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-main-bg px-6"
      aria-label="Loading Patel Pragnesh portfolio"
      role="status"
    >
      <div className="relative flex w-full flex-col items-center">
        <div className="pp-splash-logo relative flex size-38 items-center justify-center overflow-hidden sm:size-42 md:size-46 lg:size-52">
          <div className="pp-splash-logo-doodle absolute inset-0 bg-white" />
          <BrandFavIconWhite className="size-full" />
        </div>

        <div className="mt-4 flex w-full max-w-64 flex-col items-center">
          <p
            ref={percentRef}
            className="pp-splash-percent font-heading text-2xl font-bold tracking-[0.12em] text-primary-text sm:text-3xl"
          >
            1%
          </p>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen
