import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../../../components/ui/Button'
import FormField from '../../../components/ui/FormField'
import ProjectCard from '../../../components/ui/ProjectCard'
import Select from '../../../components/ui/Select'
import { projects } from '../../../data/projects'
import { gsap } from '../../../utils/gsap.config.js'

const PROJECTS_PER_PAGE = 6

const interleaveByCategory = (projectList) => {
  const groups = new Map()

  projectList.forEach((project) => {
    const category = project.category || 'Other'
    if (!groups.has(category)) groups.set(category, [])
    groups.get(category).push(project)
  })

  const ordered = []
  const maxGroupLength = Math.max(0, ...Array.from(groups.values(), (group) => group.length))

  for (let index = 0; index < maxGroupLength; index += 1) {
    groups.forEach((group) => {
      if (group[index]) ordered.push(group[index])
    })
  }

  return ordered
}

const mixedProjects = interleaveByCategory(projects)

const ProjectsGallery = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const resultsRef = useRef(null)
  const categories = useMemo(() => (
    ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))]
  ), [])
  const filteredProjects = activeCategory === 'All'
    ? mixedProjects
    : projects.filter((project) => project.category === activeCategory)
  const pageCount = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  const pageStart = (currentPage - 1) * PROJECTS_PER_PAGE
  const visibleProjects = filteredProjects.slice(pageStart, pageStart + PROJECTS_PER_PAGE)

  useLayoutEffect(() => {
    const cards = resultsRef.current?.children
    if (!cards?.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const tween = gsap.fromTo(cards,
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power2.out',
        clearProps: 'opacity,visibility,transform',
      },
    )

    return () => tween.revert()
  }, [activeCategory, currentPage])

  const handleCategoryChange = (event) => {
    setActiveCategory(event.target.value)
    setCurrentPage(1)
  }

  const goToPage = (page) => {
    if (page < 1 || page > pageCount || page === currentPage) return

    setCurrentPage(page)
  }

  return (
    <section>
      <div className="pp-container">
        <div className="pp-sec-head-row">
          <div>
            <p className="pp-section-eyebrow">Project Gallery</p>
            <h2>All Projects</h2>
          </div>

          <div className="flex gap-3 flex-row sm:items-center">
            <FormField
              id="project-category-filter"
              label="Filter projects by category"
              labelHidden
              className="flex-1 min-w-[138px]"
            >
              <Select
                id="project-category-filter"
                value={activeCategory}
                onChange={handleCategoryChange}
                options={categories}
              />
            </FormField>
            <Button to="/contact">Let’s Talk</Button>
          </div>
        </div>

        <p className="mb-4 text-sm text-secondary-text" role="status">
          Showing {filteredProjects.length === 0 ? 0 : pageStart + 1}
          {'-'}{Math.min(pageStart + PROJECTS_PER_PAGE, filteredProjects.length)} of {filteredProjects.length} projects
        </p>

        <div ref={resultsRef} id="project-results" className="grid gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} showAction />
          ))}
        </div>

        {pageCount > 1 && (
          <nav aria-label="Project gallery pages" className="mt-8 md:mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              aria-label="Previous page"
              title="Previous page"
              aria-controls="project-results"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="grid size-10 cursor-pointer place-items-center border border-secondary-text text-secondary-text transition hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
                aria-controls="project-results"
                onClick={() => goToPage(page)}
                className={`grid size-10 cursor-pointer place-items-center border font-body text-sm font-semibold transition ${currentPage === page
                    ? 'border-accent bg-accent text-white'
                    : 'border-secondary-text text-secondary-text hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              aria-label="Next page"
              title="Next page"
              aria-controls="project-results"
              disabled={currentPage === pageCount}
              onClick={() => goToPage(currentPage + 1)}
              className="grid size-10 cursor-pointer place-items-center border border-secondary-text text-secondary-text transition hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>
    </section>
  )
}

export default ProjectsGallery

