// The mockup loaded these from CDNs as globals; main.js reads them off window.
// Imported before ./main.js so they exist when its IIFEs run.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

Object.assign(window, { gsap, ScrollTrigger, Lenis });
