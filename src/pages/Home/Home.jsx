import Hero from './sections/Hero'
import LogoMarquee from './sections/LogoMarquee'
import AboutPreview from './sections/AboutPreview'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import FeaturedProjects from './sections/FeaturedProjects'
import ContactCTA from '../../components/ContactCTA'

const Home = () => {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <AboutPreview />
      <Skills />
      <Experience />
      <FeaturedProjects />
      <ContactCTA />
    </>
  )
}

export default Home
