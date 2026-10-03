import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollSmoother, ScrollTrigger } from '../../utils/gsap.config.js'

const SmoothScroll = ({ children }) => {
  const location = useLocation()

  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.1,
      smoothTouch: 0.6,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    })

    return () => smoother.kill()
  }, [])

  useEffect(() => {
    const smoother = ScrollSmoother.get()

    if (smoother) {
      smoother.scrollTo(0, false)
      smoother.refresh()
    } else {
      window.scrollTo(0, 0)
    }

    ScrollTrigger.refresh()
  }, [location.pathname])

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content" className="min-h-[100dvh] flex flex-col">
        {children}
      </div>
    </div>
  )
}

export default SmoothScroll
