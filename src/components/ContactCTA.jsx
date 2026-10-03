import Button from './ui/Button'
import { profile } from '../data/profile'

const ContactCTA = ({ showProjects = false }) => {
  return (
    <section>
      <div className="pp-container">
        <div className="grid gap-4 lg:gap-8 md:grid-cols-[0.9fr_1.1fr] lg:grid-cols-[0.8fr_1.2fr] xl:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="pp-section-eyebrow">Contact</p>
            <h2>Open To Professional Conversations</h2>
          </div>
          <div>
            <p className="text-secondary-text">
              I am currently not taking freelance projects, but I am open to design conversations,
              portfolio feedback, collaboration, and relevant frontend or web design opportunities.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {showProjects ? (
                <>
                  <Button to="/projects">See Projects</Button>
                  <Button to="/contact" variant="secondary">Contact With Me</Button>
                </>
              ) : (
                <>
                  <Button to="/contact">Connect With Me</Button>
                  <Button href={`mailto:${profile.email}`} variant="secondary">Email Directly</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactCTA
