import { Link, useLocation } from 'react-router-dom'
import siteLogo from '../../assets/images/brand/Site-Logo-Light.svg'
import siteLogoFallback from '../../assets/images/brand/Site-Logo-Light.webp'
import ImageWithFallback from '../ui/ImageWithFallback'
import { usePageTransition } from '../../hooks/usePageTransition'
import { profile, socialLinks } from '../../data/profile'

const footerNavLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Contact', path: '/contact' },
]

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const location = useLocation()
  const { navigateWithTransition } = usePageTransition()

  const handleNavigation = (event, path, label) => {
    event.preventDefault()
    navigateWithTransition(path, label)
  }

  return (
    <footer className="border-t border-border mt-auto">
      <div className="pp-container">
        <div className="grid gap-10 border-b border-border py-10 md:grid-cols-[1fr_1.1fr] md:items-start">
          <div>
            <Link
              to="/"
              className="inline-flex w-full max-w-[156px] md:max-w-[172px]"
              aria-label={`${profile.name} home`}
              onClick={(event) => handleNavigation(event, '/', 'Home')}
            >
              <ImageWithFallback
                src={siteLogo}
                fallbackSrc={siteLogoFallback}
                alt={profile.name}
                className="w-full"
              />
            </Link>
            <p className="mt-5 max-w-[440px] text-secondary-text">
              I design and build responsive websites and interfaces, combining visual design, React, WordPress, and motion.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end" aria-label="Footer navigation">
            {footerNavLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={(event) => handleNavigation(event, link.path, link.label)}
                className={`pp-navbar-link font-body text-sm font-semibold text-secondary-text transition hover:text-accent ${location.pathname === link.path ? 'pp-active-link' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col-reverse gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-secondary-text">
            Copyright {currentYear} {profile.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-body text-sm font-semibold text-secondary-text transition hover:text-accent"
              >
                <link.Icon aria-hidden="true" className="size-4 shrink-0" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
