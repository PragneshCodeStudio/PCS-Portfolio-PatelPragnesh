import { useLayoutEffect, useRef } from 'react'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import Tag from '../../../components/ui/Tag'
import { experience } from '../../../data/experience'
import { gsap, ScrollTrigger } from '../../../utils/gsap.config.js'

const Experience = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    let media

    if (!section) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('[data-home-experience-card]', section)
      const fills = gsap.utils.toArray('[data-home-experience-fill]', section)

      const updateProgress = (progress = 0) => {
        const normalizedProgress = gsap.utils.clamp(0, 1, progress)
        const activeCardIndex = normalizedProgress > 0.001
          ? Math.min(
            cards.length - 1,
            Math.floor(normalizedProgress * cards.length),
          )
          : -1

        cards.forEach((card, index) => {
          card.classList.toggle('pp-active', index <= activeCardIndex)
        })

        fills.forEach((fill, index) => {
          const fillCount = fills.length || 1
          const segmentStart = index / fillCount
          const segmentProgress = gsap.utils.clamp(
            0,
            1,
            (normalizedProgress - segmentStart) * fillCount,
          )

          gsap.set(fill, { scaleX: segmentProgress })
        })
      }

      updateProgress(0)

      media = gsap.matchMedia()

      media.add('(min-width: 768px)', () => {
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'center 40%',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => updateProgress(self.progress),
          onLeave: () => updateProgress(1),
          onEnterBack: (self) => updateProgress(self.progress),
          onRefresh: (self) => updateProgress(self.progress),
        })

        return () => {
          trigger.kill()
        }
      })

      media.add('(max-width: 767px)', () => {
        updateProgress(1)

        return () => {
          updateProgress(0)
        }
      })
    }, section)

    return () => {
      media?.revert()
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <section ref={sectionRef}>
      <div className="pp-container" data-home-experience-stage="">

        <div className="pp-sec-head-row">
          <div>
            <p className="pp-section-eyebrow">Experience</p>
            <h2>Work Journey</h2>
          </div>
          <div className="hidden md:flex">
            <Button to="/about" variant="secondary">View Journey</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
            {experience.map((item, index) => (
              <div key={item.id} className="relative flex min-w-0 items-stretch">
                <Card
                  className="pp-home-experience-card flex flex-1 flex-col transition duration-500"
                  data-home-experience-card=""
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Tag className="">{item.duration}</Tag>
                    {item.phase && <Tag className="bg-elevated-bg ">{item.phase}</Tag>}
                    {item.current && <Tag className="border-success  text-success">Current</Tag>}
                  </div>
                  <h3>{item.role}</h3>
                  <p className="mt-1 text-secondary-text">{item.company}</p>
                  {item.companyNote && (
                    <p className="mt-1 text-sm text-muted-text">{item.companyNote}</p>
                  )}
                </Card>
                {index < experience.length - 1 && (
                  <span
                    className={`absolute left-full top-1/2 z-0 hidden h-[1px] w-4 -translate-y-1/2 bg-border-strong md:block ${
                      index === 1 ? 'md:hidden xl:block' : ''
                    }`}
                  >
                    <span
                      className="block h-full origin-left scale-x-0 bg-accent"
                      data-home-experience-fill=""
                    />
                  </span>
                )}
              </div>
            ))}
          </div>
          <Button className="w-full md:hidden" to="/about" variant="secondary">View Journey</Button>
        </div>
      </div>
    </section>
  )
}

export default Experience
