import Button from '../../../components/ui/Button'

const AboutPreview = () => {
  return (
    <section>
      <div className="pp-container">
        <div className="grid gap-4 lg:gap-8 md:grid-cols-[0.9fr_1.1fr] lg:grid-cols-[0.8fr_1.2fr] items-center">
          <div>
            <p className="pp-section-eyebrow">About</p>
            <h2>The Designer <br  /> Behind the code</h2>
          </div>
          <div>
            <p className="text-secondary-text">
              Over the last five years, I have grown from learning the basics to handling advanced frontend design work with confidence. My focus is to create clean, responsive, and polished web experiences that feel useful, reliable, and alive.
            </p>
            <div className="mt-6 hidden md:flex">
              <Button to="/about" variant="secondary">View About</Button>
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full md:hidden" to="/about" variant="secondary">View About</Button>
      </div>
    </section>
  )
}

export default AboutPreview
