// Typed source for the original PPSX33 homepage's entrance and console animations.
type GSAPLike = {
  to(target: Element | NodeListOf<Element>, vars: Record<string, unknown>): void;
  fromTo(target: Element | NodeListOf<Element>, from: Record<string, unknown>, to: Record<string, unknown>): void;
};
declare global { interface Window { gsap?: GSAPLike; } }
function initialisePPSX33Home(): void {
  const hero = document.querySelector<HTMLElement>('.ppsx-home-hero');
  if (!hero) return;
  const copy = hero.querySelector<HTMLElement>('.home-hero-copy');
  const art = hero.querySelector<HTMLElement>('.home-hero-art');
  const nodes = hero.querySelectorAll<HTMLElement>('.console-node');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  copy?.classList.add('is-ready');
  if (reduced) {
    if (art) { art.style.opacity = '1'; art.style.transform = 'none'; }
    return;
  }
  if (window.gsap) {
    if (art) window.gsap.to(art, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: .18 });
    window.gsap.fromTo(nodes, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .65, stagger: .16, ease: 'power2.out', delay: .65 });
    const screen = hero.querySelector<HTMLElement>('.console-screen');
    if (screen && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      hero.addEventListener('pointermove', event => {
        const bounds = hero.getBoundingClientRect();
        const pointer = event as PointerEvent;
        const x = (pointer.clientX - bounds.left) / bounds.width - .5;
        const y = (pointer.clientY - bounds.top) / bounds.height - .5;
        window.gsap?.to(screen, { rotateY: -7 + x * 5, rotateX: 3 - y * 4, duration: .45, ease: 'power2.out', overwrite: true });
      });
      hero.addEventListener('pointerleave', () => window.gsap?.to(screen, { rotateY: -7, rotateX: 3, duration: .7, ease: 'power3.out' }));
    }
  } else {
    if (art) { art.style.opacity = '1'; art.style.transform = 'none'; }
    nodes.forEach(node => { node.style.opacity = '1'; node.style.transform = 'none'; });
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialisePPSX33Home, { once: true });
else initialisePPSX33Home();
