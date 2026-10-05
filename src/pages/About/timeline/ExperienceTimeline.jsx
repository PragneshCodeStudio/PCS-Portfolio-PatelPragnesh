import { useRef } from 'react'
import Card from '../../../components/ui/Card'
import Tag from '../../../components/ui/Tag'
import { BrandOutlineTraceIcon } from '../../../assets/icons'
import { experience } from '../../../data/experience'
import useExperienceTimelineAnimation from './useExperienceTimelineAnimation'

const ExperienceTimeline = () => {
  const timelineRef = useRef(null)

  useExperienceTimelineAnimation(timelineRef)

  return (
    <section ref={timelineRef}>
      <div className="pp-container">
        <div className="mb-8">
          <p className="pp-section-eyebrow">Experience</p>
          <h2>Work Journey</h2>
        </div>

        <div className="relative" data-experience-track="">
          <div className="absolute left-[18px] top-0 z-0 hidden w-[2px] bg-border-strong md:block" data-experience-line="">
            <span
              className="block h-full w-full origin-top scale-y-0 bg-accent"
              data-experience-line-fill=""
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_193px]">
            <div className="space-y-4">
              {experience.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 md:grid-cols-[38px_1fr]"
                  data-experience-card=""
                >
                  <div className="relative z-10 hidden md:flex">
                    <span className="pp-experience-step" data-experience-step="">
                      {String(item.id).padStart(2, '0')}
                    </span>
                  </div>

                  <Card as="div" className="bg-card-bg">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <Tag>{item.duration}</Tag>
                      {item.phase && <Tag className="bg-elevated-bg">{item.phase}</Tag>}
                      {item.current && <Tag className="border-success text-success">Current</Tag>}
                    </div>
                    <h3>{item.role}</h3>
                    <p className="mt-1 text-secondary-text">{item.company}</p>
                    {item.companyNote && (
                      <p className="mt-1 text-sm text-muted-text">{item.companyNote}</p>
                    )}
                    <p className="mt-4 text-secondary-text">{item.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </Card>
                </article>
              ))}
            </div>

            <div className="pp-iconMorph-col relative hidden lg:flex lg:min-h-full lg:flex-col lg:justify-end" data-experience-icon-col="">
              <Card
                as="div"
                padding="lg"
                className="flex aspect-square w-full items-center justify-center bg-card-bg will-change-transform"
                data-experience-icon-card=""
              >
                <BrandOutlineTraceIcon className="size-full max-h-[260px] max-w-[260px]" />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExperienceTimeline
