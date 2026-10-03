import { useEffect, useRef } from 'react'
import { gsap } from '../../utils/gsap.config.js'

const PageTransition = ({ label, isAnimating }) => {
  const panelRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!isAnimating || !panelRef.current) {
      return
    }

    document.documentElement.classList.add('pp-page-transition-running')

    const timeline = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove('pp-page-transition-running')
        window.dispatchEvent(new Event('pp:page-transition-complete'))
      },
    })

    gsap.set(panelRef.current, {
      y: '100%',
    })

    gsap.set(labelRef.current, {
      autoAlpha: 0,
      y: 50,
    })

    timeline
      .to(panelRef.current, {
        y: '0%',
        duration: 0.8,
        ease: 'expo.inOut',
      })
      .to(labelRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
      })
      .to(labelRef.current, {
        autoAlpha: 0,
        y: -40,
        duration: 0.4,
        delay: 0.2,
      })
      .to(panelRef.current, {
        y: '-100%',
        duration: 0.8,
        ease: 'expo.inOut',
      })

  }, [isAnimating])

  return (
    <div
      ref={panelRef}
      data-page-transition-panel=""
      className="pointer-events-none fixed inset-0 z-[9000] flex translate-y-full items-center justify-center bg-[#0f0f0f]"
      aria-hidden={!isAnimating}
    >
      <p
        ref={labelRef}
        className="font-heading text-4xl lg:text-6xl font-bold uppercase tracking-[0.14em] text-primary-text"
      >
        {label}
      </p>
    </div>
  )
}

export default PageTransition
