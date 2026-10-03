import Button from './Button'
import Card from './Card'
import ImageWithFallback from './ImageWithFallback'
import Tag from './Tag'
import projectPlaceholderImage from '../../assets/images/placeholders/placeholder-16_9.webp'

const ProjectCard = ({ project, showAction = false, className = '' }) => {
  const isExternal = Boolean(project.url)
  const visibleTags = project.tags.filter((tag) => {
    const normalizedTag = tag.toLowerCase()
    const normalizedCategory = project.category?.toLowerCase()

    return normalizedCategory && normalizedTag.includes(normalizedCategory)
      ? false
      : true
  })

  return (
    <Card className={`group flex h-full cursor-pointer flex-col bg-card-bg ${className}`}>
      {isExternal && (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.title} website`}
          className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        />
      )}

      <div className="mb-5 overflow-hidden border border-border bg-section-bg">
        <ImageWithFallback
          src={project.image}
          fallbackSrc={projectPlaceholderImage}
          alt={`${project.title} website preview`}
          className="aspect-video w-full object-cover grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          <h3>{project.title}</h3>
          <p className="mt-3 text-secondary-text">{project.description}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.category && (
            <Tag className="border-accent text-accent">{project.category}</Tag>
          )}
          {visibleTags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        {showAction && (
          <div className="relative z-20 mt-6">
            <Button href={project.url} target="_blank" rel="noreferrer" variant="secondary">
              View Project
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ProjectCard
