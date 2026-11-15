// Typed source for the scroll-driven homepage scene.
// Runtime is served from assets/js/home-motion.js (GSAP + ScrollTrigger when available).

type SceneShape = SVGElement;
type SceneStep = HTMLElement;

interface SceneNodes {
  triangle: SceneShape;
  square: SceneShape;
  cross: SceneShape;
  controller: SceneShape;
}

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const smoothStep = (value: number): number => value * value * (3 - 2 * value);

declare global {
  interface Window {
    gsap?: {
      registerPlugin: (...plugins: unknown[]) => void;
      set: (targets: unknown, vars: Record<string, unknown>) => void;
      to: (targets: unknown, vars: Record<string, unknown>) => unknown;
      fromTo: (targets: unknown, from: Record<string, unknown>, to: Record<string, unknown>) => unknown;
      timeline: (vars?: Record<string, unknown>) => {
        to: (targets: unknown, vars: Record<string, unknown>, position?: string | number) => unknown;
      };
    };
    ScrollTrigger?: {
      create: (vars: Record<string, unknown>) => unknown;
      refresh: () => void;
    };
  }
}

function initialisePPSX33Scene(): void {
  const root = document.querySelector<HTMLElement>('[data-home-motion]');
  if (!root) return;

  const steps = Array.from(root.querySelectorAll<SceneStep>('.motion-step'));
  const svg = root.querySelector<SVGSVGElement>('.motion-svg');
  if (!svg || steps.length !== 7) return;

  const nodes: SceneNodes = {
    triangle: svg.querySelector<SceneShape>('.shape-triangle')!,
    square: svg.querySelector<SceneShape>('.shape-square')!,
    cross: svg.querySelector<SceneShape>('.shape-cross')!,
    controller: svg.querySelector<SceneShape>('.shape-controller')!
  };

  if (Object.values(nodes).some((node) => !node)) return;

  const progress = root.querySelector<HTMLElement>('.motion-progress-track i');
  const counter = root.querySelector<HTMLElement>('.motion-counter');
  const footer = document.querySelector<HTMLElement>('[data-home-footer]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let active = -1;

  const activate = (index: number): void => {
    if (index === active) return;
    active = index;
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    if (counter) counter.textContent = `${String(index).padStart(2, '0')} / 06`;
  };

  const setProgress = (ratio: number): void => {
    if (progress) progress.style.width = `${clamp01(ratio) * 100}%`;
  };

  // The production path uses GSAP (loaded via CDN in index.html).
  // This typed source documents the intended narrative beats:
  // 1. Triangle travels across intro text then drops into section 1.
  // 2. Meets square; orbits / rotates along square edges.
  // 3. Square + triangle rotate and flip together.
  // 4. Cross appears; shapes converge and drop toward the controller.
  // 5. Shapes settle into the PS controller pad.
  // 6. "PPSX33 Welcomes you" performs 3D zoom-in + brightness rise.
  // 7. Further scroll past the continue area redirects to /About/.

  const updateFallback = (): void => {
    const midpoint = window.scrollY + window.innerHeight * 0.5;
    let current = 0;
    steps.forEach((step, index) => {
      if (midpoint >= step.offsetTop) current = index;
    });
    activate(current);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(max > 0 ? window.scrollY / max : 0);

    if (reduce) return;

    const w = window.innerWidth;
    const y = midpoint;
    const t = clamp01((y - steps[1].offsetTop) / window.innerHeight);
    const q = clamp01((y - steps[2].offsetTop) / window.innerHeight);
    const c = clamp01((y - steps[3].offsetTop) / window.innerHeight);
    const p2 = clamp01((y - steps[4].offsetTop) / window.innerHeight);

    const place = (el: SceneShape, x: number, yPos: number, r: number, s: number, o: number): void => {
      el.style.opacity = String(o);
      el.style.transform = `translate3d(${x}px,${yPos}px,0) rotate(${r}deg) scale(${s})`;
    };

    place(nodes.triangle, (1 - smoothStep(t)) * -w * 0.26, 0, 380 * t, 1, 1 - p2 * 0.95);
    place(nodes.square, (1 - smoothStep(q)) * w * 0.26, 0, 380 * q, 1, q * (1 - p2 * 0.95));
    place(nodes.cross, (1 - smoothStep(c)) * -w * 0.2, 0, 450 * c, 1, c * (1 - p2 * 0.95));
    place(nodes.controller, 0, (1 - smoothStep(p2)) * 110, 0, 0.95 + p2 * 0.05, p2);
  };

  window.addEventListener('scroll', updateFallback, { passive: true });
  window.addEventListener('resize', updateFallback, { passive: true });
  updateFallback();

  // Redirect only after the visitor reaches the welcome/continue area and the page end.
  let leaving = false;
  const redirectAtEnd = (): void => {
    if (reduce || leaving || !footer) return;
    const remaining = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    if (remaining < 28 && window.scrollY > steps[5].offsetTop) {
      leaving = true;
      location.assign('/About/');
    }
  };
  window.addEventListener('scroll', redirectAtEnd, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialisePPSX33Scene, { once: true });
} else {
  initialisePPSX33Scene();
}
