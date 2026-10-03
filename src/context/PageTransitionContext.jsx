import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageTransition from '../components/layout/PageTransition'
import { TransitionNavigationContext } from './transitionNavigationContext'

const routeLabels = {
  '/': 'Home',
  '/about': 'About',
  '/projects': 'Projects',
  '/contact': 'Contact',
}

export const PageTransitionProvider = ({ children }) => {
  const [transitionLabel, setTransitionLabel] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navigateWithTransition = useCallback((path, label) => {
    if (!path || location.pathname === path || isAnimating) {
      return
    }

    setTransitionLabel(label || routeLabels[path] || 'Loading')
    setIsAnimating(true)

    window.setTimeout(() => {
      navigate(path)
      setIsAnimating(false)
    }, 1200)
  }, [isAnimating, location.pathname, navigate])

  return (
    <TransitionNavigationContext.Provider value={{ navigateWithTransition, routeLabels }}>
      <PageTransition label={transitionLabel} isAnimating={isAnimating} />
      {children}
    </TransitionNavigationContext.Provider>
  )
}
