import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { A11y, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import Card from '../../../components/ui/Card'
import Tag from '../../../components/ui/Tag'
import { skills } from '../../../data/skills'

const Skills = () => {
  return (
    <section className="">
      <div className="pp-container">
        <div className="pp-sec-head-row">
          <div>
            <p className="pp-section-eyebrow">Skills</p>
            <h2>What I Work With</h2>
          </div>
        </div>

        <div className="relative">
          <Swiper
            className="pp-skills-swiper !pb-[1px]"
            modules={[Navigation, A11y]}
            spaceBetween={16}
            slidesPerView={1}
            preventInteractionOnTransition
            navigation={{
              prevEl: '.pp-skills-slider-prev',
              nextEl: '.pp-skills-slider-next',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 2,
              },
              991: {
                slidesPerView: 2.5,
              },
              1025: {
                slidesPerView: 3,
              },
            }}
          >
            {skills.map((skill) => (
              <SwiperSlide
                key={skill.id}
                style={{ display: 'flex', height: 'auto' }}
              >
                <Card className="flex w-full flex-col">
                  <h3>{skill.name}</h3>
                  <p className="mt-3 mb-5 text-secondary-text">{skill.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {skill.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-5 flex justify-end">
            <div className="flex gap-2 md:gap-3">
              <button
                type="button"
                className="cursor-pointer pp-skills-slider-nav pp-skills-slider-prev grid size-[42px] place-items-center border border-secondary-text text-secondary-text transition hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white"
                aria-label="Previous skill"
              >
                <RiArrowLeftLine size={20} />
              </button>
              <button
                type="button"
                className="cursor-pointer pp-skills-slider-nav pp-skills-slider-next grid size-[42px] place-items-center border border-secondary-text text-secondary-text transition hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white"
                aria-label="Next skill"
              >
                <RiArrowRightLine size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills

