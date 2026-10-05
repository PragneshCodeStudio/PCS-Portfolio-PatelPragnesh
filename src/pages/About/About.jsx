import { aboutHeroStats, profileDetails } from '../../data/about'
import GeometricScanHero from './portrait/GeometricScanHero'
import ExperienceTimeline from './timeline/ExperienceTimeline'
import AnimatedCounter from '../../components/ui/AnimatedCounter'
import ContactCTA from '../../components/ContactCTA'
import Card from '../../components/ui/Card'

const About = () => {
  return (
    <>
      <section className="pp-first-sec overflow-hidden xl:min-h-[100dvh] flex items-center">
        <div className="pp-container">
          <div className="flex flex-col-reverse gap-4 lg:flex-row lg:items-stretch">
            <Card
              as="div"
              padding="md"
              className="flex min-w-0 flex-1 flex-col gap-10 bg-card-bg"
            >
              <div>
                <p className="pp-section-eyebrow">About Me</p>
                <h1 className="text-5xl sm:text-6xl xl:text-7xl">Patel Pragnesh</h1>
                <p className="mt-5 max-w-[680px] text-secondary-text">
                  I turn visual concepts into responsive websites and interfaces, with experience in WordPress, GSAP, and React app UI alongside a MERN team.
                </p>
              </div>
              <div className='h-full flex flex-col'>
                <p className="pp-section-eyebrow text-xs tracking-widest">Highlights That Matter</p>
                <div className="grid gap-4 sm:grid-cols-2 h-full">
                  {aboutHeroStats.map((stat) => {
                    const StatIcon = stat.Icon

                    return (
                      <div key={stat.label} className="group relative min-w-0 overflow-hidden bg-main-bg py-4 md:py-6 pl-4 md:pl-6 pr-16 flex items-center">
                        <StatIcon
                          className="absolute right-4 top-5 size-9 text-card-bg transition duration-300 group-hover:text-accent"
                          strokeWidth={1.25}
                          aria-hidden="true"
                        />
                        <div className="relative z-10">
                          <h2>
                            <AnimatedCounter value={stat.value} />
                          </h2>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-text">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>

            <div className="relative mx-auto flex w-full lg:max-w-[300px] flex-col md:flex-row lg:flex-col gap-4 lg:mx-0">
              <GeometricScanHero />

              <Card
                as="div"
                padding="md"
                className="flex flex-col gap-4 w-full md:max-w-1/2 lg:max-w-full"
              >

                {profileDetails.map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-text">
                      {label}
                    </p>
                    <p className="mt-1 font-medium text-primary-text">{value}</p>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      </section>

      <ExperienceTimeline />

      <ContactCTA showProjects />
    </>
  )
}

export default About
