import { profile, socialLinks } from '../../data/profile'
import Button from '../../components/ui/Button'

const Contact = () => (
  <>
    <section className="flex pp-first-sec min-h-[100dvh] items-center justify-center">
      <div className="pp-container text-center">
        <p className="pp-section-eyebrow flex flex-row flex-wrap justify-center">Frontend Developer & Web Designer</p>
        <h1>
          What if we <br/> worked together?
        </h1>
        <p className="mx-auto mt-6 max-w-[640px] text-secondary-text sm:text-lg">
          Hiring for a web design or frontend role? Reach me by email, <br /> or explore my profiles below.
        </p>

        <div className="mt-9">
          <Button href={`mailto:${profile.email}`}>
            {profile.email}
          </Button>
        </div>

        <nav aria-label="Professional profiles" className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-secondary-text hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <link.Icon aria-hidden="true" className="size-4 shrink-0" />
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  </>
)

export default Contact
