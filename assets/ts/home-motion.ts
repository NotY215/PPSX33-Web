// Typed source for the scroll-driven homepage scene. Runtime build is served from home-motion.js.
type SceneShape = SVGElement;
type SceneStep = HTMLElement;
type SceneNodes = { triangle: SceneShape; square: SceneShape; cross: SceneShape; controller: SceneShape };
const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const smoothStep = (value: number): number => value * value * (3 - 2 * value);
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
  if (Object.values(nodes).some(node => !node)) return;
  const progress = root.querySelector<HTMLElement>('.motion-progress-track i');
  const counter = root.querySelector<HTMLElement>('.motion-counter');
  let active = -1;
  const update = (): void => {
    const midpoint = window.scrollY + window.innerHeight * .5;
    let current = 0;
    steps.forEach((step, index) => { if (midpoint >= step.offsetTop) current = index; });
    if (current !== active) {
      active = current;
      steps.forEach((step, index) => step.classList.toggle('is-active', index === current));
      if (counter) counter.textContent = `${String(current).padStart(2, '0')} / 06`;
    }
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${clamp01(max > 0 ? window.scrollY / max : 0) * 100}%`;
    }
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialisePPSX33Scene, { once: true });
else initialisePPSX33Scene();
