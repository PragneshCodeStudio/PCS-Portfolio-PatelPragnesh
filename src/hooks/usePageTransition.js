import { useContext } from 'react'
import { TransitionNavigationContext } from '../context/transitionNavigationContext'

export const usePageTransition = () => {
  const context = useContext(TransitionNavigationContext)

  if (!context) {
    throw new Error('usePageTransition must be used inside PageTransitionProvider')
  }

  return context
}
