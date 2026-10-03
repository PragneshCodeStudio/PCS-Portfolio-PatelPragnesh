export const runAfterPageReveal = (run) => {
  let timer

  const cleanup = () => {
    window.clearTimeout(timer)
    window.removeEventListener('pp:splash-complete', check)
    window.removeEventListener('pp:page-transition-complete', check)
  }

  const check = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      const covered = document.querySelector('.pp-splash-screen')
        || document.documentElement.classList.contains('pp-page-transition-running')

      if (!covered) {
        cleanup()
        run()
      }
    }, 120)
  }

  window.addEventListener('pp:splash-complete', check)
  window.addEventListener('pp:page-transition-complete', check)
  check()

  return cleanup
}
