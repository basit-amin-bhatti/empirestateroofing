'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export function RoofingScrollScene() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const page = scene?.parentElement;
    if (!scene || !page) return;
    const sections = Array.from(page.querySelectorAll<HTMLElement>('.services-section, .process-section, .areas-section'));
    if (!sections.length) return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width: 980px), (pointer: coarse)');
    const visible = new Set<Element>();
    let frame = 0;
    let start = 0;
    let distance = 1;
    let viewport = 0;

    const paint = () => {
      frame = 0;
      if (document.hidden) return;
      const progress = reducedMotion.matches ? .4 : Math.min(1, Math.max(0, (scrollY + viewport * .4 - start) / distance));
      // One camera path runs from the ridge/work area toward the shingle courses.
      // Dark sections simply conceal it; the next light section reveals its next angle.
      const mobile = compact.matches;
      scene.style.setProperty('--roof-pan-x', `${mobile ? 0 : -48 + progress * 96}px`);
      scene.style.setProperty('--roof-pan-y', `${mobile ? 12 - progress * 24 : 42 - progress * 84}px`);
      scene.style.setProperty('--roof-yaw', `${mobile ? 0 : -3 + progress * 6}deg`);
      scene.style.setProperty('--roof-pitch', `${mobile ? 0 : 2 - progress * 4}deg`);
      scene.style.setProperty('--roof-zoom', `${mobile ? 1.08 : 1.13 + Math.sin(progress * Math.PI) * .08}`);
      scene.style.setProperty('--roof-detail-x', `${mobile ? 0 : 28 - progress * 56}px`);
      scene.style.setProperty('--roof-detail-y', `${mobile ? 0 : 20 - progress * 40}px`);
    };
    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(paint);
    };
    const measure = () => {
      start = sections[0].getBoundingClientRect().top + scrollY;
      const end = sections[sections.length - 1].getBoundingClientRect().bottom + scrollY;
      distance = Math.max(1, end - start);
      viewport = scene.clientHeight;
      schedule();
    };
    const onScroll = () => { if (visible.size && !reducedMotion.matches) schedule(); };
    const onPreference = () => { cancelAnimationFrame(frame); frame = 0; measure(); };
    const intersection = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      scene.dataset.visible = String(visible.size > 0);
      if (visible.size) schedule();
    });
    for (const section of sections) intersection.observe(section);
    const resize = new ResizeObserver(measure);
    resize.observe(page);
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    document.addEventListener('visibilitychange', onPreference);
    reducedMotion.addEventListener('change', onPreference);
    compact.addEventListener('change', onPreference);

    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', onPreference);
      reducedMotion.removeEventListener('change', onPreference);
      compact.removeEventListener('change', onPreference);
    };
  }, []);

  return (
    <div ref={sceneRef} className="roof-scroll-scene" aria-hidden="true">
      <div className="roof-scroll-camera">
        <Image src="/roofing-hero.jpg" alt="" fill sizes="100vw" className="roof-scroll-photo" />
      </div>
      <div className="roof-scroll-foreground"><div className="roof-scroll-courses" /><div className="roof-scroll-gutter" /></div>
      <div className="roof-scroll-daylight" />
    </div>
  );
}
