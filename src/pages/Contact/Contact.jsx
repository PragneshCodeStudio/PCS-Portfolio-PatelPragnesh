import { profile, socialLinks } from '../../data/profile'
import Button from '../../components/ui/Button'

const Contact = () => (
  <>
    <section className="flex pp-first-sec min-h-[calc(100svh-356px)] md:min-h-[calc(100svh-288px)] lg:min-h-[calc(100svh-266px)] items-center justify-center">
      <div className="pp-container text-center">
        <p className="pp-section-eyebrow flex flex-row flex-wrap justify-center">Available for Frontend & Web Design Roles</p>
        <h1 className="contact-title">
          Let's Build Something <br/> Great Together
        </h1>
        <p className="mx-auto mt-6 max-w-[540px] md:max-w-[640px] text-secondary-text sm:text-lg">Full-time roles, freelance projects, and collaborations are welcome. Reach me by email or connect through the profiles below.</p>

        <div className="mt-9">
          <Button href={`mailto:${profile.email}`}>
            {profile.email}
          </Button>
        </div>

        <nav aria-label="Professional profiles" className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
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
