// Typed source for assets/js/home-motion.js. Keep this dependency-free so the intro works without a build step.
type MotionElement = SVGElement & { style: CSSStyleDeclaration };
type MotionStep = HTMLElement & { offsetTop: number; offsetHeight: number };
type MotionScene = { root: HTMLElement; steps: MotionStep[]; reducedMotion: boolean };
const clampMotion = (value: number, min = 0, max = 1): number => Math.max(min, Math.min(max, value));
const smoothMotion = (value: number): number => value * value * (3 - 2 * value);
const lerpMotion = (from: number, to: number, amount: number): number => from + (to - from) * amount;
function bootPPSX33Motion(): void {
  const root = document.querySelector<HTMLElement>('[data-home-motion]');
  if (!root) return;
  const steps = Array.from(root.querySelectorAll<MotionStep>('.motion-step'));
  const svg = root.querySelector<SVGSVGElement>('.motion-svg');
  if (!svg || steps.length !== 7) return;
  const triangle = svg.querySelector<MotionElement>('.shape-triangle');
  const square = svg.querySelector<MotionElement>('.shape-square');
  const cross = svg.querySelector<MotionElement>('.shape-cross');
  const controller = svg.querySelector<MotionElement>('.shape-controller');
  const progress = root.querySelector<HTMLElement>('.motion-progress-track i');
  const counter = root.querySelector<HTMLElement>('.motion-counter');
  if (!triangle || !square || !cross || !controller || !progress || !counter) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame = 0;
  let active = -1;
  let navigated = false;
  const transform = (node: MotionElement, x: number, y: number, rotate: number, scale: number, opacity: number): void => {
    node.style.opacity = String(opacity);
    node.style.transform = `translate(${x}px,${y}px) rotate(${rotate}deg) scale(${scale})`;
  };
  const draw = (): void => {
    frame = 0;
    const viewport = innerHeight;
    const scroll = scrollY;
    let current = 0;
    let local = 0;
    steps.forEach((step, index) => {
      if (scroll + viewport * .52 >= step.offsetTop) current = index;
      if (scroll < step.offsetTop + step.offsetHeight && local === 0)
        local = clampMotion((scroll + viewport * .52 - step.offsetTop) / step.offsetHeight);
    });
    steps.forEach((step, index) => step.classList.toggle('is-active', index === current));
    if (current !== active) {
      active = current;
      counter.textContent = `${String(current).padStart(2, '0')} / 06`;
    }
    const maxScroll = document.documentElement.scrollHeight - viewport;
    progress.style.width = `${clampMotion(maxScroll > 0 ? scroll / maxScroll : 0) * 100}%`;
    const width = Math.max(300, Math.min(1000, innerWidth));
    const triangleT = smoothMotion(clampMotion((scroll + viewport * .5 - steps[1].offsetTop) / viewport));
    const squareT = smoothMotion(clampMotion((scroll + viewport * .5 - steps[2].offsetTop) / viewport));
    const crossT = smoothMotion(clampMotion((scroll + viewport * .5 - steps[3].offsetTop) / viewport));
    const controllerT = smoothMotion(clampMotion((scroll + viewport * .5 - steps[4].offsetTop) / viewport));
    const fade = 1 - smoothMotion(clampMotion((controllerT - .78) / .22));
    transform(triangle, lerpMotion(-width * .26, 0, triangleT), lerpMotion(-110, -8, triangleT), lerpMotion(-28, 0, triangleT), lerpMotion(.65, 1, triangleT), Math.max(0, 1 - controllerT) * fade);
    transform(square, lerpMotion(width * .28, 0, squareT), lerpMotion(100, 0, squareT), squareT * 540, lerpMotion(.55, 1, squareT), Math.max(0, squareT) * fade);
    transform(cross, lerpMotion(-width * .18, 0, crossT), lerpMotion(-10, 0, crossT), lerpMotion(90, 450, crossT), lerpMotion(.55, 1, crossT), Math.max(0, crossT) * fade);
    const welcomeT = clampMotion((scroll + viewport * .5 - steps[5].offsetTop) / viewport);\n    transform(controller, 0, lerpMotion(100, 0, controllerT), lerpMotion(-12, 0, controllerT), lerpMotion(.65, 1, controllerT), controllerT * (1 - smoothMotion(welcomeT)));
    if (!reducedMotion && current === 6 && local > .58 && !navigated) {
      navigated = true;
      location.assign('/About/');
    }
  };
  const schedule = (): void => { if (!frame) frame = requestAnimationFrame(draw); };
  if (reducedMotion) {
    steps.forEach(step => step.classList.add('is-active'));
    transform(triangle, 0, 0, 0, 1, 0);
    transform(square, 0, 0, 0, 1, 0);
    transform(cross, 0, 0, 0, 1, 0);
    transform(controller, 0, 0, 0, 1, 1);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(root);
  schedule();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootPPSX33Motion, { once: true });
else bootPPSX33Motion();