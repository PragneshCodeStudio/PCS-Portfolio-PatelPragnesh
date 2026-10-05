import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiCloseLine, RiMenu3Line } from 'react-icons/ri'
import { ExternalLink } from 'lucide-react'
import siteLog from '../../assets/images/brand/Site-Logo-Light.svg'
import siteLogoFallback from '../../assets/images/brand/Site-Logo-Light.webp'
import Button from '../ui/Button'
import ImageWithFallback from '../ui/ImageWithFallback'
import { usePageTransition } from '../../hooks/usePageTransition'

import { profile } from '../../data/profile'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const location = useLocation()
  const { navigateWithTransition } = usePageTransition()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false)
      }
    }

    document.body.style.overflow = isDrawerOpen ? 'hidden' : ''
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDrawerOpen])

  const navLinks = [
    { label: 'Home',       path: '/' },
    { label: 'About',      path: '/about' },
    { label: 'Projects',   path: '/projects' },
    { label: 'Contact',    path: '/contact' },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleNavigation = (event, path, label) => {
    event.preventDefault()
    setIsDrawerOpen(false)

    if (location.pathname === path) {
      return
    }

    navigateWithTransition(path, label)
  }

  return (
    <header className={`pp-navbar border-b border-b-border py-4 fixed top-0 left-0 w-full z-[999] bg-main-bg ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="pp-container">
        <div className="inner-wrap gap-4 flex items-center justify-between">
          <div className="pp-first-col w-full max-w-[156px] md:max-w-[172px]">
            <Link
              to="/"
              className="navbar__logo"
              onClick={(event) => handleNavigation(event, '/', 'Home')}
            >
              <ImageWithFallback src={siteLog} fallbackSrc={siteLogoFallback} alt="PP" />
            </Link>
          </div>
          <div className="pp-middle-col min-w-0">
            <div className="pp-menu-bar hidden overflow-x-auto md:block">
              <nav className="pp-navbar-links flex min-w-max gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={(event) => handleNavigation(event, link.path, link.label)}
                    className={`pp-navbar-link font-medium whitespace-nowrap py-1 text-sm lg:text-base  ${isActive(link.path) ? 'pp-active-link' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="hidden shrink-0 md:block">
            <Button
              href={profile.resumeUrl}
              variant="secondary"
              className="px-3 lg:px-4"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View resume (opens in a new tab)"
            >
              Resume <ExternalLink size={16} aria-hidden="true" />
            </Button>
          </div>
          <button
            type="button"
            className="grid size-10 place-items-center border-box text-primary-text transition md:hidden"
            aria-label={isDrawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isDrawerOpen}
            onClick={() => setIsDrawerOpen((current) => !current)}
          >
            {isDrawerOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 top-[76px] z-0 bg-main-bg/70 transition duration-300 md:hidden ${
          isDrawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
        onClick={() => setIsDrawerOpen(false)}
      />
      <aside
        className={`fixed right-0 top-[76px] z-10 h-[calc(100dvh-76px)] w-[min(330px,calc(100vw-32px))] border-l border-border bg-section-bg px-6 py-4 transition duration-300 md:hidden ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isDrawerOpen}
      >
        <nav className="flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={(event) => handleNavigation(event, link.path, link.label)}
              className={`pp-navbar-link py-2 font-heading text-[24px] font-bold uppercase tracking-[0.08em] ${
                isActive(link.path) ? 'pp-active-link' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button
            href={profile.resumeUrl}
            variant="secondary"
            className="mt-5 w-full"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View resume (opens in a new tab)"
            onClick={() => setIsDrawerOpen(false)}
          >
            Resume <ExternalLink size={16} aria-hidden="true" />
          </Button>
        </nav>
      </aside>
    </header>
  )
}

export default Header
