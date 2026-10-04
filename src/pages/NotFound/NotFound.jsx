import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AnimatedCounter from '../../components/ui/AnimatedCounter'
import { BrandFavIconWhite } from '../../assets/icons'
import { gsap } from '../../utils/gsap.config.js'
import './NotFound.css'

const NotFound = () => {
  const sectionRef = useRef(null)
  const revealRef = useRef(null)
  const logoTweenRef = useRef(null)
  const completedCountersRef = useRef(new Set())

  useLayoutEffect(() => {
    document.body.classList.add('pp-not-found-page')
    completedCountersRef.current.clear()
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(sectionRef.current.querySelectorAll('.pp-not-found-intro'), {
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
      })

      // Clear the fallback's pixel offset before animating percentages.
      logoTweenRef.current = gsap.fromTo(revealRef.current, { y: 0, yPercent: "-100" }, {
        y: 0,
        yPercent: 100,
        duration: 3,
        paused: true,
        ease: 'power1.inOut',
        repeat: -1,
        repeatDelay: 2,
        yoyo: false,
      })

      if (completedCountersRef.current.size === 2) {
        logoTweenRef.current.play()
      }

      return () => {
        logoTweenRef.current = null
      }
    })

    return () => {
      media.revert()
      document.body.classList.remove('pp-not-found-page')
    }
  }, [])

  const handleCounterComplete = (direction) => {
    if (completedCountersRef.current.has(direction)) {
      return
    }

    completedCountersRef.current.add(direction)
    if (completedCountersRef.current.size === 2) {
      logoTweenRef.current?.play()
    }
  }

  const renderNumber4 = (direction) => (
    <span className="inline-flex h-[127px] md:h-[180px] items-center overflow-hidden text-[127px] md:text-[200px] font-heading font-bold tracking-normal text-primary-text leading-[90%]">
      <AnimatedCounter
        value="4"
        delay={0}
        direction={direction}
        startOnMount
        onComplete={() => handleCounterComplete(direction)}
      />
    </span>
  )

  return (
    <main>
      <section
        ref={sectionRef}
        aria-labelledby="not-found-title"
        className="flex min-h-dvh flex-col items-center justify-center bg-main-bg px-5 py-10 text-center"
      >
        <div aria-hidden="true" className="pp-not-found-intro flex items-center gap-3 sm:gap-5 lg:gap-8">
          {renderNumber4('up')}
          <div className="relative size-[100px] shrink-0 overflow-hidden md:size-[152px] lg:size-39">
            <div
              ref={revealRef}
              className="absolute inset-0 bg-white"
              style={{ transform: 'translateY(100%)' }}
            />
            <BrandFavIconWhite className="relative size-full" />
          </div>
          {renderNumber4('down')}
        </div>

        <h1 id="not-found-title" className="pp-not-found-intro mt-7 mb-2 text-3xl tracking-normal sm:text-4xl lg:text-5xl">
          <span className="sr-only">Error 404: </span>Page Not Found
        </h1>
        <Link
          to="/"
          className="pp-not-found-intro inline-flex items-center gap-2 text-secondary-text transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Home
        </Link>
      </section>
    </main>
  )
}

export default NotFound
