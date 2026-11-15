(() => {
  'use strict';

  const boot = () => {
    const root = document.querySelector('[data-home-motion]');
    if (!root) return;

    const steps = [...root.querySelectorAll('.motion-step')];
    const svg = root.querySelector('.motion-svg');
    const triangle = svg?.querySelector('.shape-triangle');
    const square = svg?.querySelector('.shape-square');
    const cross = svg?.querySelector('.shape-cross');
    const pad = svg?.querySelector('.shape-controller');
    const counter = root.querySelector('.motion-counter');
    const bar = root.querySelector('.motion-progress-track i');
    const footer = document.querySelector('[data-home-footer]');

    if (!svg || steps.length !== 7 || !triangle || !square || !cross || !pad) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

    const activate = (index) => {
      steps.forEach((s, i) => s.classList.toggle('is-active', i === index));
      if (counter) counter.textContent = String(index).padStart(2, '0') + ' / 06';
    };

    const setProgress = (ratio) => {
      if (bar) bar.style.width = Math.max(0, Math.min(100, ratio * 100)) + '%';
    };

    // Wait for GSAP + ScrollTrigger when available so first paint stays stable on slow networks / mobile.
    const runGsap = () => {
      if (!window.gsap || !window.ScrollTrigger || reduce) return false;

      const gsap = window.gsap;
      const ST = window.ScrollTrigger;
      gsap.registerPlugin(ST);

      const shapes = [triangle, square, cross, pad];
      gsap.set(shapes, { transformOrigin: '50% 50%', force3D: true, transformPerspective: 900 });

      // Start states: triangle already slightly visible so the intro feels alive; others wait off-stage.
      gsap.set(triangle, {
        x: -Math.min(innerWidth * 0.32, 420),
        y: -120,
        rotation: -42,
        scale: 0.48,
        autoAlpha: 0.15,
        rotationY: 0,
        rotationX: 0
      });
      gsap.set(square, {
        x: Math.min(innerWidth * 0.34, 440),
        y: 130,
        rotation: -55,
        scale: 0.4,
        autoAlpha: 0,
        rotationY: 0,
        rotationX: 0
      });
      gsap.set(cross, {
        x: -Math.min(innerWidth * 0.3, 380),
        y: -70,
        rotation: 110,
        scale: 0.42,
        autoAlpha: 0,
        rotationY: 0,
        rotationX: 0
      });
      gsap.set(pad, {
        y: 160,
        rotationX: 55,
        rotationY: -12,
        scale: 0.5,
        autoAlpha: 0
      });

      // Longer scroll distance so each narrative beat has room on both desktop and mobile.
      const scrollLength = () => Math.round(innerHeight * (isTouch ? 6.2 : 5.6));

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => '+=' + scrollLength(),
          scrub: isTouch ? 0.85 : 1.15,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

      // 0 → 1  Triangle enters, travels across the intro text, then drops into the first content section.
      tl.to(triangle, {
        x: 0,
        y: -40,
        rotation: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 1.05
      }, 0)
        .to(triangle, {
          x: -Math.min(innerWidth * 0.14, 180),
          y: Math.min(innerHeight * 0.1, 90),
          rotation: 165,
          scale: 0.72,
          duration: 0.7
        }, 1.05);

      // 1 → 2  Triangle approaches the square; square appears; triangle orbits / rotates along the square edges.
      tl.to(square, {
        x: 0,
        y: 0,
        rotation: 360,
        scale: 1,
        autoAlpha: 1,
        duration: 0.95
      }, 1.55)
        .to(triangle, {
          x: 70,
          y: -10,
          rotation: 320,
          scale: 0.78,
          duration: 0.55
        }, 1.55)
        // Orbit-like motion around the square.
        .to(triangle, {
          x: 0,
          y: 55,
          rotation: 450,
          scale: 0.7,
          duration: 0.45
        }, 2.1)
        .to(triangle, {
          x: -65,
          y: 0,
          rotation: 540,
          scale: 0.74,
          duration: 0.4
        }, 2.55);

      // 2 → 3  Square + triangle rotate and flip together, then drop toward the next section.
      tl.to([triangle, square], {
        rotationY: 180,
        rotation: '+=180',
        scale: 0.68,
        duration: 0.65
      }, 2.95)
        .to([triangle, square], {
          x: 0,
          y: 40,
          rotationX: 25,
          duration: 0.4
        }, 3.4);

      // Cross arrives; the three shapes meet and spin.
      tl.to(cross, {
        x: 0,
        y: 0,
        rotation: 450,
        scale: 1,
        autoAlpha: 1,
        duration: 0.9
      }, 3.55)
        .to([triangle, square, cross], {
          rotation: '+=270',
          rotationY: 0,
          rotationX: 0,
          scale: 0.62,
          duration: 0.55
        }, 4.2)
        .to([triangle, square, cross], {
          x: 0,
          y: -30,
          scale: 0.38,
          autoAlpha: 0.05,
          duration: 0.7
        }, 4.75);

      // 4 → 5  Shapes drop into the PlayStation controller pad; controller settles and softens.
      tl.to(pad, {
        y: 0,
        rotationX: 0,
        rotationY: 0,
        rotation: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 1.05
      }, 4.85)
        .to(pad, {
          scale: 0.92,
          autoAlpha: 0.22,
          duration: 0.55
        }, 5.9);

      // Welcome copy brightness / scale driven by the same timeline for cohesion.
      tl.to('.welcome-copy', {
        scale: 1.06,
        filter: 'brightness(1.75)',
        duration: 1.0
      }, 5.85);

      // Step activation tied to section visibility (works on resize / orientation change).
      steps.forEach((step, index) => {
        ST.create({
          trigger: step,
          start: 'top 62%',
          end: 'bottom 38%',
          onEnter: () => activate(index),
          onEnterBack: () => activate(index)
        });
      });

      // Dedicated 3D zoom + brightness for the welcome headline.
      const welcome = steps[5];
      const welcomeText = welcome?.querySelector('h2');
      if (welcomeText) {
        gsap.fromTo(
          welcomeText,
          {
            z: -320,
            scale: 0.42,
            autoAlpha: 0.12,
            filter: 'brightness(0.4)',
            transformPerspective: 1000
          },
          {
            z: 0,
            scale: 1,
            autoAlpha: 1,
            filter: 'brightness(1.75)',
            ease: 'power3.out',
            scrollTrigger: {
              trigger: welcome,
              start: 'top 72%',
              end: 'center 42%',
              scrub: 1
            }
          }
        );
      }

      // Progress bar follows overall page scroll (including footer).
      const updateBar = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        setProgress(max > 0 ? scrollY / max : 0);
      };
      addEventListener('scroll', updateBar, { passive: true });
      updateBar();

      ST.create({
        trigger: footer || steps[6],
        start: 'bottom bottom',
        onEnter: () => setProgress(1)
      });

      // Keep layout correct after fonts / images / orientation changes.
      const refresh = () => ST.refresh();
      addEventListener('resize', refresh, { passive: true });
      addEventListener('orientationchange', () => setTimeout(refresh, 180));
      if (document.fonts?.ready) document.fonts.ready.then(refresh);
      ST.refresh();

      return true;
    };

    // Native fallback when GSAP is blocked, slow, or reduced-motion is preferred.
    const runFallback = () => {
      if (reduce) {
        steps.forEach((s) => s.classList.add('is-active'));
        activate(0);
      }

      const place = (el, x, y, r, s, o) => {
        el.style.opacity = String(o);
        el.style.transform =
          'translate3d(' + x + 'px,' + y + 'px,0) rotate(' + r + 'deg) scale(' + s + ')';
      };

      const smooth = (v) => v * v * (3 - 2 * v);

      const update = () => {
        const y = scrollY + innerHeight * 0.5;
        let active = 0;
        steps.forEach((s, i) => {
          if (y >= s.offsetTop) active = i;
        });
        activate(active);

        const max = document.documentElement.scrollHeight - innerHeight;
        setProgress(max > 0 ? scrollY / max : 0);

        if (reduce) return;

        const w = innerWidth;
        const t = Math.max(0, Math.min(1, (y - steps[1].offsetTop) / innerHeight));
        const q = Math.max(0, Math.min(1, (y - steps[2].offsetTop) / innerHeight));
        const c = Math.max(0, Math.min(1, (y - steps[3].offsetTop) / innerHeight));
        const p2 = Math.max(0, Math.min(1, (y - steps[4].offsetTop) / innerHeight));

        place(triangle, (1 - smooth(t)) * -w * 0.26, 0, 380 * t, 1, 1 - p2 * 0.95);
        place(square, (1 - smooth(q)) * w * 0.26, 0, 380 * q, 1, q * (1 - p2 * 0.95));
        place(cross, (1 - smooth(c)) * -w * 0.2, 0, 450 * c, 1, c * (1 - p2 * 0.95));
        place(pad, 0, (1 - smooth(p2)) * 110, 0, 0.95 + p2 * 0.05, p2);
      };

      addEventListener('scroll', update, { passive: true });
      addEventListener('resize', update, { passive: true });
      update();
    };

    // Prefer GSAP; fall back after a short wait if the CDN is slow or blocked.
    if (!runGsap()) {
      let attempts = 0;
      const poll = setInterval(() => {
        attempts += 1;
        if (runGsap() || attempts > 12) {
          clearInterval(poll);
          if (!window.gsap || reduce) runFallback();
        }
      }, 120);
      // Immediate fallback so the page is never blank.
      if (reduce) runFallback();
      else setTimeout(() => {
        if (!window.ScrollTrigger) runFallback();
      }, 1600);
    }

    // Redirect only after the visitor has reached the final welcome / continue area and scrolled to the bottom.
    // Keeps the shared footer readable instead of cutting the page short.
    let leaving = false;
    const redirectAtEnd = () => {
      if (reduce || leaving || !footer) return;
      const remaining = document.documentElement.scrollHeight - (scrollY + innerHeight);
      if (remaining < 28 && scrollY > steps[5].offsetTop) {
        leaving = true;
        location.assign('/About/');
      }
    };
    addEventListener('scroll', redirectAtEnd, { passive: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
