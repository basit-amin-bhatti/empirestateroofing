'use client';

import { useEffect, useRef } from 'react';

// Decorative motion never owns a click, focus, scroll position, or React render.
export function useRoofingDepth() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preference = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 981px) and (prefers-reduced-motion: no-preference)');
    let release = () => {};

    const configure = () => {
      release();
      if (!preference.matches) return;

      const hero = root.querySelector<HTMLElement>('.hero');
      const surfaces = Array.from(root.querySelectorAll<HTMLElement>('.roofing-assistant-card, .service-card, .why-visual, .problem-grid article, .process-grid article, .review-grid blockquote, .area-list > div'));
      const dispose: (() => void)[] = [];
      const pending = new Map<HTMLElement, { x: number; y: number }>();
      let frame = 0;
      let heroVisible = true;
      let sceneX = 0;
      let sceneY = 0;

      const paint = () => {
        frame = 0;
        if (document.hidden) return;
        for (const [surface, point] of pending) {
          surface.style.setProperty('--depth-pitch', `${(-point.y * 1.5).toFixed(2)}deg`);
          surface.style.setProperty('--depth-yaw', `${(point.x * 1.8).toFixed(2)}deg`);
          surface.style.setProperty('--light-x', `${50 + point.x * 35}%`);
          surface.style.setProperty('--light-y', `${50 + point.y * 35}%`);
        }
        pending.clear();
        if (hero && heroVisible) {
          hero.style.setProperty('--scene-x', `${(sceneX * 10).toFixed(2)}px`);
          hero.style.setProperty('--scene-y', `${(sceneY * 7).toFixed(2)}px`);
          hero.style.setProperty('--scene-scroll', `${Math.min(24, Math.max(0, -hero.getBoundingClientRect().top * .045)).toFixed(2)}px`);
        }
      };
      const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(paint); };
      const normalize = (value: number) => Math.max(-1, Math.min(1, value));

      for (const surface of surfaces) {
        let bounds: DOMRect | null = null;
        const enter = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse') return;
          bounds = surface.getBoundingClientRect();
          surface.dataset.depthActive = 'true';
        };
        const move = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse' || !bounds) return;
          pending.set(surface, {
            x: normalize((event.clientX - bounds.left) / bounds.width * 2 - 1),
            y: normalize((event.clientY - bounds.top) / bounds.height * 2 - 1),
          });
          schedule();
        };
        const reset = () => {
          bounds = null;
          pending.delete(surface);
          delete surface.dataset.depthActive;
          for (const variable of ['--depth-pitch', '--depth-yaw', '--light-x', '--light-y']) surface.style.removeProperty(variable);
        };
        surface.addEventListener('pointerenter', enter);
        surface.addEventListener('pointermove', move, { passive: true });
        surface.addEventListener('pointerleave', reset);
        dispose.push(() => {
          surface.removeEventListener('pointerenter', enter);
          surface.removeEventListener('pointermove', move);
          surface.removeEventListener('pointerleave', reset);
          reset();
        });
      }

      const moveScene = (event: PointerEvent) => {
        if (!hero || event.pointerType !== 'mouse') return;
        const bounds = hero.getBoundingClientRect();
        sceneX = normalize((event.clientX - bounds.left) / bounds.width * 2 - 1);
        sceneY = normalize((event.clientY - bounds.top) / bounds.height * 2 - 1);
        schedule();
      };
      const resetScene = () => { sceneX = 0; sceneY = 0; schedule(); };
      const scrollScene = () => { if (heroVisible) schedule(); };
      const observer = new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; });
      if (hero) observer.observe(hero);
      hero?.addEventListener('pointermove', moveScene, { passive: true });
      hero?.addEventListener('pointerleave', resetScene);
      window.addEventListener('scroll', scrollScene, { passive: true });
      window.addEventListener('blur', resetScene);
      release = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        for (const cleanup of dispose) cleanup();
        hero?.removeEventListener('pointermove', moveScene);
        hero?.removeEventListener('pointerleave', resetScene);
        window.removeEventListener('scroll', scrollScene);
        window.removeEventListener('blur', resetScene);
        for (const variable of ['--scene-x', '--scene-y', '--scene-scroll']) hero?.style.removeProperty(variable);
      };
    };

    configure();
    preference.addEventListener('change', configure);
    return () => { release(); preference.removeEventListener('change', configure); };
  }, []);

  return rootRef;
}
