import Button from './ui/Button'
import { profile } from '../data/profile'

const ContactCTA = ({ showProjects = false }) => {
  return (
    <section>
      <div className="pp-container">
        <div className="grid gap-4 lg:gap-8 md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[0.8fr_1.2fr] items-center">
          <div>
            <p className="pp-section-eyebrow">Contact</p>
            <h2>Open to Frontend & <br /> Web Design Roles</h2>
          </div>
          <div>
            <p className="text-secondary-text">
              I'm open to frontend and web design opportunities where I can contribute strong UI skills
              and continue growing with React. If my work fits your team, let's connect.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {showProjects ? (
                <>
                  <Button to="/projects">See Projects</Button>
                  <Button to="/contact" variant="secondary">Contact Me</Button>
                </>
              ) : (
                <>
                  <Button to="/contact">Contact Me</Button>
                  <Button href={`mailto:${profile.email}`} variant="secondary">Email Me</Button>
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
