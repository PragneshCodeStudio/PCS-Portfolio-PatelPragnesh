import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, MorphSVGPlugin)

export { gsap, ScrollTrigger, ScrollSmoother, MorphSVGPlugin }
