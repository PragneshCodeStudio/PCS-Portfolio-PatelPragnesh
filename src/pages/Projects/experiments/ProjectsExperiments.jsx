import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { A11y, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { codePenUser, experiments } from '../../../data/experiments.js'

const LivePen = ({ title, src }) => {
  return (
    <iframe
      title={`${title} CodePen demo`}
      src={src}
      className="absolute inset-0 block size-full bg-card-bg"
      allowFullScreen
    />
  )
}

const ExperimentSlide = ({ experiment, isActive, isAdjacent, onSelect }) => {
  const [previewFailed, setPreviewFailed] = useState(false)
  const penUrl = `https://codepen.io/${codePenUser}/pen/${experiment.slug}`
  const screenshotUrl = `${penUrl}/image/large.png`
  const embedUrl = `https://codepen.io/${codePenUser}/embed/${experiment.slug}?file=false&theme-id=-3`

  return (
    <div
      className={`relative border-box p-[1px] mx-auto transition-[width,opacity] duration-500 ease-out motion-reduce:transition-none ${
        isActive ? 'w-full opacity-100' : 'opacity-50'
      }`}
    >
      <div className="relative aspect-[4/6] overflow-hidden md:aspect-video">
        {previewFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-card-bg px-6 text-center">
            <span className="text-xs font-semibold uppercase text-accent">CodePen</span>
            <span className="max-w-md font-heading text-xl font-bold uppercase text-primary-text sm:text-2xl">
              {experiment.title}
            </span>
          </div>
        ) : (
          <img
            src={screenshotUrl}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setPreviewFailed(true)}
            className="absolute inset-0 size-full object-cover"
          />
        )}

        {isActive && <LivePen title={experiment.title} src={embedUrl} />}

        {!isActive && (
          <button
            type="button"
            aria-label={`Show ${experiment.title}`}
            title={`Show ${experiment.title}`}
            tabIndex={isAdjacent ? 0 : -1}
            onClick={onSelect}
            className="absolute inset-0 size-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent"
          />
        )}
      </div>
    </div>
  )
}

const ProjectsExperiments = () => {
  const swiperRef = useRef(null)
  const pendingNavigationRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const moveSlider = (move) => {
    const swiper = swiperRef.current
    if (!swiper || swiper.destroyed || swiper.animating || pendingNavigationRef.current) return

    // Loop selections start on the next frame; guard that gap too.
    pendingNavigationRef.current = true
    move(swiper)
    requestAnimationFrame(() => {
      pendingNavigationRef.current = false
    })
  }

  return (
    <section aria-labelledby="projects-experiments-title">
      <div className="pp-container">
        <div className="pp-sec-head text-center">
          <p className="pp-section-eyebrow">Creative Lab</p>
          <h2 id="projects-experiments-title">Motion Experiments</h2>
          <p className="mt-3 text-secondary-text">
            Small animation and interaction studies built on CodePen.
          </p>
        </div>
      </div>

      <Swiper
        modules={[A11y, Keyboard]}
        centeredSlides
        loop
        keyboard={{ enabled: true, onlyInViewport: true }}
        slidesPerView="auto"
        spaceBetween={24}
        speed={500}
        preventInteractionOnTransition
        watchSlidesProgress
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSlideChangeTransitionEnd={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full !px-[20px] md:!px-[24px] lg:!px-[10%] xl:!px-[20%]"
      >
        {experiments.map((experiment, index) => (
          <SwiperSlide
            key={experiment.slug}
            className="flex items-center justify-center"
          >
            {({ isActive, isPrev, isNext }) => (
              <ExperimentSlide
                experiment={experiment}
                isActive={isActive}
                isAdjacent={isPrev || isNext}
                onSelect={() => moveSlider((swiper) => swiper.slideToLoop(index))}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-8 md:mt-5 flex items-center justify-center gap-5">
        <button
          type="button"
          aria-label="Previous experiment"
          title="Previous experiment"
          onClick={() => moveSlider((swiper) => swiper.slidePrev())}
          className="grid size-[42px] cursor-pointer place-items-center border border-secondary-text text-secondary-text transition hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <span
          aria-live="polite"
          aria-label={`Experiment ${activeIndex + 1} of ${experiments.length}`}
          className="min-w-16 text-center font-body text-sm font-semibold tabular-nums text-secondary-text"
        >
          {String(activeIndex + 1).padStart(2, '0')} / {String(experiments.length).padStart(2, '0')}
        </span>
        <button
          type="button"
          aria-label="Next experiment"
          title="Next experiment"
          onClick={() => moveSlider((swiper) => swiper.slideNext())}
          className="grid size-[42px] cursor-pointer place-items-center border border-secondary-text text-secondary-text transition hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

export default ProjectsExperiments