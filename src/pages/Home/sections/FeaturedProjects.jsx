import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { A11y, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import Button from '../../../components/ui/Button'
import ProjectCard from '../../../components/ui/ProjectCard'
import { projects } from '../../../data/projects'

const FeaturedProjects = () => {
  const featuredProjects = projects.filter((project) => project.featured)

  return (
    <section className="">
      <div className="pp-container">
        <div className="pp-sec-head-row">
          <div>
            <p className="pp-section-eyebrow">Projects</p>
            <h2>Selected Builds</h2>
          </div>
          <div className="hidden md:flex">
            <Button to="/projects" variant="secondary">See Projects</Button>
          </div>
        </div>

        <div className="space-y-5 md:space-y-0">
          <div className="relative">
            <Swiper
              className="pp-projects-swiper"
              modules={[Navigation, A11y]}
              spaceBetween={16}
              slidesPerView={1}
              preventInteractionOnTransition
              navigation={{
                prevEl: '.pp-projects-slider-prev',
                nextEl: '.pp-projects-slider-next',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 2.2,
                },
                991: {
                  slidesPerView: 2.5,
                },
                1025: {
                  slidesPerView: 3,
                },
              }}
            >
              {featuredProjects.map((project) => (
                <SwiperSlide
                  key={project.id}
                  style={{ display: 'flex', height: 'auto' }}
                >
                  <ProjectCard project={project} className="w-full" />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="mt-5 flex items-center justify-between gap-4 md:justify-end">
              <Button className="flex-1 md:hidden" to="/projects" variant="secondary">See Projects</Button>
              <div className="flex gap-2 md:gap-3">
                <button
                  type="button"
                  className="cursor-pointer pp-projects-slider-nav pp-projects-slider-prev grid size-[42px] place-items-center border border-secondary-text text-secondary-text transition hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white"
                  aria-label="Previous project"
                >
                  <RiArrowLeftLine size={20} />
                </button>
                <button
                  type="button"
                  className="cursor-pointer pp-projects-slider-nav pp-projects-slider-next grid size-[42px] place-items-center border border-secondary-text text-secondary-text transition hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white"
                  aria-label="Next project"
                >
                  <RiArrowRightLine size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProjects

