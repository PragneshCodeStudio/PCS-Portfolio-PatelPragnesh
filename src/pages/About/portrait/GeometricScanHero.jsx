import { createElement, useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  AudioLines,
  Binary,
  Blocks,
  Bomb,
  BotMessageSquare,
  Car,
  Cctv,
  ChartPie,
  CircleDashed,
  ClockFading,
  Code,
  CodeXml,
  Compass,
  Component as ComponentIcon,
  Container,
  Disc,
  Eject,
  Flame,
  HatGlasses,
  Infinity as InfinityIcon,
  LayoutDashboard,
  LayoutGrid,
  LensConvex,
  Loader,
  Locate,
  Menu,
  Minimize,
  Omega,
  Orbit,
  PaintRoller,
  Pyramid,
  Radius,
  Rainbow,
  Shapes,
  Shell,
  Sparkle,
  Sparkles,
  Star,
  Stone,
  SwatchBook,
  Utensils,
  Workflow,
  Zap,
} from 'lucide-react'
import aboutHeroImage from '../../../assets/images/profile/scan-pic.webp'
import './GeometricScanHero.css'
import { FACE_SCAN_CONFIG } from './faceScan.config.js'
import { GEOMETRIC_SCAN_CONFIG } from './geometricScan.config.js'

const ICON_COMPONENTS = {
  menu: Menu,
  sparkles: Sparkles,
  'layout-dashboard': LayoutDashboard,
  loader: Loader,
  star: Star,
  zap: Zap,
  'layout-grid': LayoutGrid,
  flame: Flame,
  sparkle: Sparkle,
  workflow: Workflow,
  car: Car,
  blocks: Blocks,
  'audio-lines': AudioLines,
  'bot-message-square': BotMessageSquare,
  'chart-pie': ChartPie,
  utensils: Utensils,
  component: ComponentIcon,
  'hat-glasses': HatGlasses,
  'clock-fading': ClockFading,
  minimize: Minimize,
  container: Container,
  pyramid: Pyramid,
  radius: Radius,
  activity: Activity,
  disc: Disc,
  eject: Eject,
  infinity: InfinityIcon,
  shell: Shell,
  stone: Stone,
  compass: Compass,
  locate: Locate,
  cctv: Cctv,
  'swatch-book': SwatchBook,
  omega: Omega,
  'lens-convex': LensConvex,
  orbit: Orbit,
  bomb: Bomb,
  shapes: Shapes,
  binary: Binary,
  code: Code,
  'code-xml': CodeXml,
  'paint-roller': PaintRoller,
  rainbow: Rainbow,
  'circle-dashed': CircleDashed,
}

const getIconName = (row, column) => {
  const icons = GEOMETRIC_SCAN_CONFIG.grid.icons
  const index = Math.abs((row * 7 + column * 13) % icons.length)
  return icons[index]
}

const createGridCells = (columns, rows) => Array.from({ length: columns * rows }, (_, index) => {
  const row = Math.floor(index / columns)
  const column = index % columns
  const iconName = getIconName(row, column)
  const Icon = ICON_COMPONENTS[iconName]

  return {
    Icon,
    iconName,
    key: `${row}-${column}-${iconName}`,
    animationClass: `pp-geo-icon-${iconName}`,
    delay: ((row * 37 + column * 23) % 1800) / 1000,
    accent: (row * 5 + column * 11) % 13 === 0,
  }
})

const easeInOutSine = (progress) => -(Math.cos(Math.PI * progress) - 1) / 2

const GeometricScanHero = () => {
  const frameRef = useRef(null)
  const [gridSize, setGridSize] = useState({ columns: 1, rows: 1 })
  const gridCells = useMemo(
    () => createGridCells(gridSize.columns, gridSize.rows),
    [gridSize.columns, gridSize.rows],
  )

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return undefined

    const updateGridSize = () => {
      const styles = window.getComputedStyle(frame)
      const cellSize = parseFloat(styles.getPropertyValue('--pp-geometric-cell-size'))
      const gap = parseFloat(styles.getPropertyValue('--pp-geometric-grid-gap'))
      const width = parseFloat(styles.width) - parseFloat(styles.borderLeftWidth) - parseFloat(styles.borderRightWidth)
      const height = parseFloat(styles.height) - parseFloat(styles.borderTopWidth) - parseFloat(styles.borderBottomWidth)

      // Overscan by partial cells so centering never leaves an empty edge strip.
      const columns = Math.max(1, Math.ceil((width + gap) / (cellSize + gap)))
      const rows = Math.max(1, Math.ceil((height + gap) / (cellSize + gap)))
      setGridSize((current) => (
        current.columns === columns && current.rows === rows ? current : { columns, rows }
      ))
    }

    const observer = new ResizeObserver(updateGridSize)
    observer.observe(frame)
    // Cell-size breakpoints can change even when the frame width stays the same.
    window.addEventListener('resize', updateGridSize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateGridSize)
    }
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationFrame = 0
    const startTime = performance.now()

    const updateScanProgress = (time) => {
      const cycleProgress = (
        (time - startTime) % FACE_SCAN_CONFIG.timing.duration
      ) / FACE_SCAN_CONFIG.timing.duration
      const rawProgress = prefersReducedMotion
        ? 1
        : 1 - Math.abs(cycleProgress * 2 - 1)
      const progress = prefersReducedMotion ? 1 : easeInOutSine(rawProgress)

      frame.style.setProperty('--pp-geometric-scan-progress', `${progress * 100}%`)
      frame.style.setProperty('--pp-geometric-scan-progress-number', progress)
      animationFrame = window.requestAnimationFrame(updateScanProgress)
    }

    animationFrame = window.requestAnimationFrame(updateScanProgress)

    return () => {
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div
      ref={frameRef}
      className="pp-geometric-scan-frame border-box max-w-full md:max-w-1/2 lg:max-w-[530px] w-full"
      style={{
        '--pp-geometric-mask-image': `url(${aboutHeroImage})`,
        '--pp-geometric-grid-columns': gridSize.columns,
        '--pp-geometric-grid-rows': gridSize.rows,
      }}
    >
      <img
        src={aboutHeroImage}
        alt="Patel Pragnesh geometric scan portrait"
        className="pp-geometric-scan-portrait"
        loading="eager"
        decoding="async"
      />

      <div className="pp-geometric-scan-icon-mask" aria-hidden="true">
        <div className="pp-geometric-scan-grid">
          {gridCells.map(({ Icon, iconName, key, animationClass, delay, accent }) => (
            <span
              key={key}
              className={`pp-geometric-scan-cell ${animationClass} ${accent ? 'pp-geo-icon-accent' : ''}`}
              style={{ '--pp-geometric-icon-delay': `${delay}s` }}
            >
              {createElement(Icon, { 'aria-hidden': true, strokeWidth: 1.8 })}
              <span className="sr-only">{iconName}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="pp-geometric-scan-line" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

export default GeometricScanHero
