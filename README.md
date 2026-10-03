# Patel Pragnesh Portfolio

A React and Vite portfolio with Tailwind CSS, GSAP, and Swiper.

## Development

```sh
npm install
npm run dev
```

## Checks and production build

```sh
npm run lint
npm run build
npm run preview
```

The production build is generated in `dist/`.

## Folder structure

```text
public/                          Static public files
references/                      Standalone reference demos
src/
  assets/
    fonts/
    icons/
    images/
      brand/
      profile/
      projects/
      placeholders/
  components/
    layout/                      Header, Footer, scroll, page transitions
    ui/                          Shared buttons, cards, and form controls
    ContactCTA.jsx               Contact section shared by Home and About
  pages/
    Home/
      Home.jsx
      sections/                  Hero, AboutPreview, Skills, Experience,
                                 FeaturedProjects, LogoMarquee
    About/
      About.jsx
      portrait/                  Geometric scan component, CSS, configuration
      timeline/                  Timeline component and animation hook
    Projects/
      Projects.jsx
      hero/                      Hero gallery components and configuration
      gallery/
      experiments/
    Contact/
      Contact.jsx
  data/
    profile.js
    about.js
    projects.js
    skills.js
    experience.js
    experiments.js
    logoMarquee.js
  context/                       Page transition state
  hooks/                         Shared hooks
  utils/                         GSAP configuration
  App.jsx                        Routes and application layout
  main.jsx                       Application entry
  index.css                      Tailwind theme, fonts, shared styles
```

Components used by one page live in that page's folder. Components used across pages live in `components/`.

## Updating portfolio data

| File | Content |
| --- | --- |
| `src/data/profile.js` | Name, email, resume URL, social links |
| `src/data/about.js` | About highlights and profile details |
| `src/data/projects.js` | Projects, categories, previews, links, featured selection |
| `src/data/skills.js` | Skill cards |
| `src/data/experience.js` | Work experience |
| `src/data/experiments.js` | CodePen username and experiment entries |
| `src/data/logoMarquee.js` | Tool logos and labels |

Projects use `category: 'Company'` or `category: 'Personal'` for gallery filtering and labels, and `featured: true` for the Home selection.

Project hero ordering and column animation settings are in `src/pages/Projects/hero/projectsHero.data.js`.

Page headings and paragraphs remain in their page or section JSX files. Put new project images in `src/assets/images/projects/` and import them in `src/data/projects.js`.

