import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../../utils/gsap.config.js'
import { logoMarqueeItems } from '../../../data/logoMarquee'

const LogoCard = ({ item }) => {
  const { Icon } = item

  return (
    <li className="pp-logo-marquee-card" aria-label={item.name}>
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="w-5 h-5 md:w-8 md:h-8"
          style={{ color: item.color }}
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid w-5 h-5 md:w-8 md:h-8 place-items-center border text-sm font-bold leading-none md:text-base"
          style={{ borderColor: item.color, color: item.color }}
        >
          {item.mark}
        </span>
      )}
      <span>{item.name}</span>
    </li>
  )
}

const LogoRow = ({
  items,
  direction = 'left',
  speed = 18,
  duplicate = 2,
  scrollSpeed = 6,
}) => {
  const marqueeRef = useRef(null)
  const tweenRef = useRef(null)
  const scrollTriggerRef = useRef(null)
  const scrollTimelineRef = useRef(null)
  const defaultTimeScaleRef = useRef(1)
  const activeTimeScaleRef = useRef(1)
  const lastScrollDirectionRef = useRef(null)

  useLayoutEffect(() => {
    const marquee = marqueeRef.current

    if (!marquee) {
      return undefined
    }

    const marqueeContent = marquee.querySelector('[data-marquee-collection-target]')
    const marqueeScroll = marquee.querySelector('[data-marquee-scroll-target]')

    if (!marqueeContent || !marqueeScroll) {
      return undefined
    }

    const marqueeSpeedAttr = parseFloat(marquee.dataset.marqueeSpeed)
    const marqueeDirectionAttr = marquee.dataset.marqueeDirection === 'right' ? 1 : -1
    const defaultTimeScale = -marqueeDirectionAttr
    const duplicateAmount = parseInt(marquee.dataset.marqueeDuplicate || 0, 10)
    const scrollSpeedAttr = parseFloat(marquee.dataset.marqueeScrollSpeed)
    const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1
    const marqueeSpeed = marqueeSpeedAttr
      * (marqueeContent.offsetWidth / window.innerWidth)
      * speedMultiplier

    marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`
    marqueeScroll.style.width = `${(scrollSpeedAttr * 2) + 100}%`

    if (duplicateAmount > 0) {
      const fragment = document.createDocumentFragment()

      for (let index = 0; index < duplicateAmount; index += 1) {
        const clone = marqueeContent.cloneNode(true)
        clone.setAttribute('data-marquee-clone', '')
        fragment.appendChild(clone)
      }

      marqueeScroll.appendChild(fragment)
    }

    const marqueeItems = marquee.querySelectorAll('[data-marquee-collection-target]')

    tweenRef.current = gsap.to(marqueeItems, {
      xPercent: -100,
      repeat: -1,
      duration: marqueeSpeed,
      ease: 'linear',
    }).totalProgress(0.5)

    gsap.set(marqueeItems, {
      xPercent: marqueeDirectionAttr === 1 ? 100 : -100,
    })

    defaultTimeScaleRef.current = defaultTimeScale
    activeTimeScaleRef.current = defaultTimeScale
    tweenRef.current.timeScale(defaultTimeScale)
    tweenRef.current.play()
    marquee.setAttribute('data-marquee-status', 'normal')

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        if (self.direction === lastScrollDirectionRef.current) {
          return
        }

        lastScrollDirectionRef.current = self.direction

        const currentTimeScale = self.direction === 1
          ? defaultTimeScaleRef.current
          : -defaultTimeScaleRef.current

        activeTimeScaleRef.current = currentTimeScale
        tweenRef.current?.timeScale(currentTimeScale)
        marquee.setAttribute('data-marquee-status', self.direction === 1 ? 'normal' : 'inverted')
      },
    })

    const scrollStart = marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr
    const scrollEnd = -scrollStart

    scrollTimelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: marquee,
        start: '0% 100%',
        end: '100% 0%',
        scrub: 0,
      },
    })

    scrollTimelineRef.current.fromTo(
      marqueeScroll,
      { x: `${scrollStart}vw` },
      { x: `${scrollEnd}vw`, ease: 'none' },
    )

    return () => {
      marquee.querySelectorAll('[data-marquee-clone]').forEach((clone) => clone.remove())
      scrollTimelineRef.current?.scrollTrigger?.kill()
      scrollTimelineRef.current?.kill()
      scrollTriggerRef.current?.kill()
      tweenRef.current?.kill()
      gsap.set(marqueeItems, { clearProps: 'transform' })
      gsap.set(marqueeScroll, { clearProps: 'marginLeft,width,transform' })
    }
  }, [])

  const pauseMarquee = () => {
    tweenRef.current?.pause()
  }

  const playMarquee = () => {
    tweenRef.current?.timeScale(activeTimeScaleRef.current).play()
  }

  return (
    <div
      ref={marqueeRef}
      className="pp-logo-marquee-mask"
      data-marquee-scroll-direction-target=""
      data-marquee-direction={direction}
      data-marquee-duplicate={duplicate}
      data-marquee-scroll-speed={scrollSpeed}
      data-marquee-speed={speed}
      onMouseEnter={pauseMarquee}
      onMouseLeave={playMarquee}
      onFocus={pauseMarquee}
      onBlur={playMarquee}
    >
      <div className="pp-logo-marquee-scroll" data-marquee-scroll-target="">
        <ul className="pp-logo-marquee-track" data-marquee-collection-target="">
          {items.map((item) => (
            <LogoCard item={item} key={item.name} />
          ))}
        </ul>
      </div>
    </div>
  )
}

const LogoMarquee = () => {
  const firstRow = logoMarqueeItems

  return (
    <section className="pp-logo-marquee-sec overflow-hidden py-5 md:py-10">
      <div className="space-y-4">
        <LogoRow items={firstRow} direction="left" />
        {/* <LogoRow items={secondRow} direction="right" /> */}
      </div>
    </section>
  )
}

export default LogoMarquee
