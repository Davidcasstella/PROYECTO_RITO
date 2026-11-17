import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registrar los plugins una sola vez. Importar GSAP siempre desde aquí, no desde 'gsap'.
gsap.registerPlugin(useGSAP, ScrollTrigger)

export { gsap, ScrollTrigger, useGSAP }
