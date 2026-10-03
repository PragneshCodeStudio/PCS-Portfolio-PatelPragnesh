import { projects } from '../../../data/projects'

export const columnSettings = [
  { direction: 'down', duration: 36, offset: 0.08 },
  { direction: 'up', duration: 40, offset: 0.39 },
  { direction: 'down', duration: 38, offset: 0.63 },
]

const curatedProjectIds = [
  'neon-signs-depot', 'nirvi-collection', 'eye-shield',
  'smooth-web', 'macro-optics', 'adam-x',
  'weeday', 'sona-mistry', '3d-web',
  'alpha-padel', 'weemush', 'alyn',
]

const projectById = new Map(projects.map((project) => [project.id, project]))
const curatedIdSet = new Set(curatedProjectIds)
const orderedProjects = [
  ...curatedProjectIds.map((id) => projectById.get(id)).filter(Boolean),
  ...projects.filter((project) => !curatedIdSet.has(project.id)),
]

const distributeProjects = (projectList) => {
  const columns = [[], [], []]
  const fullRows = Math.floor(projectList.length / 3)

  projectList.slice(0, fullRows * 3).forEach((project, index) => {
    columns[index % 3].push(project)
  })

  // One leftover goes to the center; two go to the outer columns.
  if (projectList.length % 3 === 1) {
    columns[1].push(projectList[fullRows * 3])
  } else if (projectList.length % 3 === 2) {
    columns[0].push(projectList[fullRows * 3])
    columns[2].push(projectList[fullRows * 3 + 1])
  }

  return columns
}

export const heroProjectColumns = distributeProjects(orderedProjects)
