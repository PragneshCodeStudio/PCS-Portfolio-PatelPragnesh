import Button from '../../../components/ui/Button'
import ImageWithFallback from '../../../components/ui/ImageWithFallback'
import heroImage from '../../../assets/images/profile/hero-pragnesh-generated.png'
import heroPlaceholderImage from '../../../assets/images/placeholders/placeholder-4_5.webp'

const Hero = () => {
  return (
    <section className="pp-first-sec relative flex items-center overflow-hidden xl:min-h-[calc(100svh-80px)] 2xl:min-h-[100svh]">
      <div className="pp-container relative flex flex-wrap md:flex-nowrap flex-col-reverse md:flex-row items-center gap-6 lg:gap-8 xl:gap-10">
        <div className="pp-info-col w-full max-w-full md:max-w-[55%] lg:max-w-[60%]">
          <p className="pp-section-eyebrow">
            Creative Web Designer
          </p>
          <h1 className="max-w-[900px]">
            Patel <br/> Pragnesh
          </h1>
          <p className="mt-6 max-w-[650px] lg:text-lg text-secondary-text">
            I design and build responsive, animated websites with a sharp eye for layout, interaction, and brand feel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/projects">See Projects</Button>
            <Button to="/contact" variant="secondary">Connect</Button>
          </div>
        </div>
        <div className="pp-img-col relative mx-auto w-full max-w-full md:max-w-[45%] lg:max-w-[35%] 2xl:max-w-[36%] p-5">
          <div className="pointer-events-none absolute border border-border inset-0" />
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 border-r-2 border-t-2 border-accent" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 border-b-2 border-l-2 border-accent" />
          <ImageWithFallback
            src={heroImage}
            fallbackSrc={heroPlaceholderImage}
            alt="Patel Pragnesh working on a laptop"
            className="relative aspect-[4/5] w-full border border-border object-cover object-center"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
