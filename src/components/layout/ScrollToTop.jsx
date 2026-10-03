import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollSmoother } from '../../utils/gsap.config.js'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const smoother = ScrollSmoother.get()

    if (smoother) {
      smoother.scrollTo(0, false)
      return
    }

    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
