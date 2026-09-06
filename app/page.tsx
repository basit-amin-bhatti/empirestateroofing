'use client';

import Image from 'next/image';
import Script from 'next/script';
import { createElement, SyntheticEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowRight, BadgeCheck, Bot, CheckCircle2, ChevronRight, ClipboardCheck,
  CloudRain, Droplets, Hammer, HardHat, Headphones, House, Mail, MapPin,
  Phone, Search, ShieldCheck, Sparkles, Star, Timer, Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { RoofAssembly } from '@/components/roof-assembly';
import { useRoofingDepth } from '@/hooks/use-roofing-depth';
import { RoofingScrollScene } from '@/components/roofing-scroll-scene';

const phoneHref = 'tel:+12125550173';

const services = [
  { icon: Wrench, title: 'Roof Repair', text: 'Fast, lasting repairs for leaks, storm damage, missing shingles, and worn flashing.' },
  { icon: House, title: 'Roof Replacement', text: 'Complete roof systems installed with proven materials and meticulous workmanship.' },
  { icon: HardHat, title: 'New Roof Installation', text: 'Smart roofing solutions for new construction, additions, and major renovations.' },
  { icon: Droplets, title: 'Gutter Installation & Repair', text: 'Seamless drainage that moves water away from your roof, walls, and foundation.' },
  { icon: Search, title: 'Inspections & Maintenance', text: 'Detailed assessments and preventive care that help extend the life of your roof.' },
  { icon: ClipboardCheck, title: 'Insurance Claim Assistance', text: 'Clear damage documentation and practical guidance throughout the claim process.' },
];

const problems = [
  { icon: Droplets, title: 'Leaks & water stains', text: 'Water finds the smallest opening. We trace the source—not just the visible symptom.' },
  { icon: CloudRain, title: 'Storm & wind damage', text: 'Loose shingles and lifted flashing can escalate quickly after a Northeast storm.' },
  { icon: Hammer, title: 'Aging or missing shingles', text: 'Curling, cracking, and bare spots signal that your roof needs professional attention.' },
];

const reviews = [
  { quote: 'The crew was clear, careful, and finished our roof repair before the next storm rolled in.', name: 'Maria R.', place: 'Queens, NY' },
  { quote: 'We knew exactly what needed attention and what could wait. No pressure—just honest guidance.', name: 'Daniel K.', place: 'Westchester, NY' },
  { quote: 'From inspection to cleanup, the entire replacement felt organized and professional.', name: 'Priya S.', place: 'Jersey City, NJ' },
];

export default function Home() {
  const depthRoot = useRoofingDepth();
  const [submitted, setSubmitted] = useState(false);
  const [agentCallActive, setAgentCallActive] = useState(false);
  const [agentSurfaceOpen, setAgentSurfaceOpen] = useState(false);
  const [agentWidget, setAgentWidget] = useState<HTMLElement | null>(null);
  const [agentSessionKey, setAgentSessionKey] = useState(0);
  const agentLaunchGeneration = useRef(0);
  const agentTrigger = useRef<HTMLButtonElement>(null);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function dismissRoofingAssistant() {
    agentLaunchGeneration.current += 1;
    setAgentSurfaceOpen(false);
    setAgentCallActive(false);
    setAgentSessionKey((key) => key + 1);
    agentTrigger.current?.focus();
  }

  useEffect(() => {
    if (!agentSurfaceOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissRoofingAssistant();
    };
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (agentWidget && !event.composedPath().includes(agentWidget)) dismissRoofingAssistant();
    };

    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('click', closeOnOutsideClick, true);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('click', closeOnOutsideClick, true);
    };
  }, [agentSurfaceOpen, agentWidget]);

  function launchRoofingAssistant() {
    const generation = ++agentLaunchGeneration.current;
    setAgentCallActive(true);
    setAgentSurfaceOpen(true);

    if (typeof window === 'undefined') return;

    const openAgentMode = (attempt = 0) => {
      if (generation !== agentLaunchGeneration.current) return;
      const widget = agentWidget;
      const shadowRoot = widget?.shadowRoot;
      const integrationStyle = shadowRoot?.querySelector<HTMLStyleElement>('style[data-empire-assistant-integration]');

      if (shadowRoot && !integrationStyle) {
        const style = document.createElement('style');
        style.dataset.empireAssistantIntegration = 'true';
        style.textContent = `
          .overlay { display: flex !important; align-items: center !important; justify-content: center !important; padding: 24px !important; }
          .overlay > * { width: min(560px, calc(100vw - 48px)) !important; max-width: calc(100vw - 48px) !important; height: auto !important; min-height: 0 !important; max-height: min(680px, calc(100vh - 48px)) !important; overflow: auto !important; }
          .overlay p:has(a[href*="elevenlabs.io"]) { display: none !important; }
          .empire-agent-close { position: fixed; top: max(18px, calc(50vh - 340px)); right: max(18px, calc((100vw - 560px) / 2 + 12px)); z-index: 2147483647; width: 32px; height: 32px; display: grid; place-items: center; padding: 0; border: 1px solid rgba(11,28,43,.16); border-radius: 50%; color: #0b1c2b; background: rgba(255,255,255,.94); box-shadow: 0 4px 14px rgba(0,0,0,.14); font: 500 24px/1 Arial, sans-serif; cursor: pointer; }
          .empire-agent-close:hover { background: #fff; transform: scale(1.04); }
          @media (max-width: 700px) { .overlay { padding: 12px !important; } .overlay > * { width: calc(100vw - 24px) !important; max-width: calc(100vw - 24px) !important; max-height: calc(100vh - 24px) !important; } .empire-agent-close { top: 18px; right: 18px; width: 30px; height: 30px; font-size: 22px; } }
        `;
        shadowRoot.append(style);

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'empire-agent-close';
        closeButton.setAttribute('aria-label', 'Close calling assistant');
        closeButton.textContent = '×';
        closeButton.addEventListener('click', dismissRoofingAssistant);
        shadowRoot.append(closeButton);

        shadowRoot.addEventListener('click', (event) => {
          if (event.target instanceof HTMLElement && event.target.classList.contains('overlay')) dismissRoofingAssistant();
        });
      }

      const buttons = widget?.shadowRoot ? Array.from(widget.shadowRoot.querySelectorAll<HTMLButtonElement>('button')) : [];
      const target = buttons.find((button) => {
        const label = `${button.getAttribute('aria-label') ?? ''} ${button.textContent ?? ''}`;
        return !button.disabled && !/close|end|dismiss/i.test(label) && /call|voice|talk/i.test(label);
      });

      if (target) {
        target.click();
        const style = widget?.shadowRoot?.querySelector<HTMLStyleElement>('style[data-empire-assistant-integration]');
        if (style && !style.textContent?.includes('rounded-compact-sheet')) {
          style.textContent += '\n.rounded-compact-sheet { display: none !important; }';
        }
      } else if (attempt < 20) {
        window.setTimeout(() => openAgentMode(attempt + 1), 150);
      }
    };

    void window.customElements.whenDefined('elevenlabs-convai').then(() => {
      window.setTimeout(openAgentMode, 80);
    });
  }

  return (
    <main ref={depthRoot} className="roofing-page">
      <RoofingScrollScene />
      <header className="site-header">
        <div className="shell nav-wrap">
          <a href="#top" className="brand" aria-label="Empire State Roofing Co. home">
            <span className="brand-mark" aria-hidden="true"><Image className="brand-logo-image" src="/empire-state-roofing-logo.png" alt="" width={1254} height={1254} priority /></span>
            <span><strong>Empire State</strong><small>Roofing Co.</small></span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#services">Services</a><a href="#about">Why Us</a><a href="#reviews">Reviews</a><a href="#areas">Service Areas</a>
          </nav>
          <a className="nav-phone" href={phoneHref}><Phone size={16} aria-hidden="true" /> (212) 555-0173</a>
          <a className="button button-small" href="#contact">Free Inspection</a>
        </div>
      </header>

      <section className="hero" id="top">
        <Image className="hero-image" src="/roofing-hero.jpg" alt="Professional roofer installing shingles on a residential roof" fill priority sizes="100vw" />
        <div className="hero-shade" />
        <div className="hero-roof-depth" aria-hidden="true"><div className="hero-roof-plane" /><div className="hero-roof-fascia" /></div>
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><ShieldCheck size={17} aria-hidden="true" /> Protecting New York since 2008</p>
            <h1>A stronger roof.<br /><em>A safer home.</em></h1>
            <p className="hero-lede">Expert roof repair, replacement, and installation across NYC and the surrounding region—done right, without the runaround.</p>
            <div className="hero-actions"><a className="button button-large" href="#contact">Get a Free Roof Inspection <ArrowRight size={18} aria-hidden="true" /></a><a className="phone-link" href={phoneHref}><span><Phone size={19} aria-hidden="true" /></span><span><small>Talk to a roofer</small>(212) 555-0173</span></a></div>
            <div className="hero-notes"><span><CheckCircle2 size={16} /> No-obligation inspection</span><span><CheckCircle2 size={16} /> Fast local response</span></div>
          </div>

          <aside className="roofing-assistant-card" aria-labelledby="roofing-assistant-title">
            <div className="agent-card-header">
              <span className="agent-icon"><Bot size={22} aria-hidden="true" /></span>
              <span className="agent-status"><i aria-hidden="true" /> Available 24/7</span>
            </div>
            <div className="agent-card-copy">
              <p>Instant roofing help</p>
              <h2 id="roofing-assistant-title">Talk to Our<br />Roofing Assistant</h2>
              <span>Ask a question, describe an issue, or get help scheduling your free inspection.</span>
            </div>

            <div className="agent-actions">
              <Button ref={agentTrigger} type="button" className="agent-button agent-call" aria-expanded={agentCallActive} onClick={launchRoofingAssistant}>
                <Headphones size={22} aria-hidden="true" /> <span className="agent-button-label">Call Mike — Our AI Roofing Assistant</span>
              </Button>
            </div>
            <p className="assistant-note"><Sparkles size={13} aria-hidden="true" /> AI Agent <span aria-hidden="true">•</span> Available 24/7</p>
          </aside>
        </div>
      </section>

            {createElement('elevenlabs-convai', {
              key: agentSessionKey,
              ref: setAgentWidget,
              className: 'elevenlabs-agent-embed',
              style: { display: agentSurfaceOpen ? 'block' : 'none' },
              'agent-id': 'agent_6501m1h5fcnje81a82sv5ym75x0y',
              'disable-banner': 'true',
              'dismissible': 'true',
              'action-text': 'Talk to Our Roofing Assistant',
              'start-call-text': 'Call Mike — Our AI Roofing Assistant',
              'end-call-text': 'End Conversation',
              'text-contents': JSON.stringify({
                main_label: 'Talk to Our Roofing Assistant',
                start_call: 'Call Mike — Our AI Roofing Assistant',
                end_call: 'End Conversation',
              }),
            })}
      <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" />

      <section className="trust-bar" aria-label="Company highlights"><div className="shell trust-grid">
        <div><strong>18</strong><span>Years of<br />experience</span></div><div><strong>5</strong><span>NYC boroughs<br />covered</span></div><div><strong>4</strong><span>Major service<br />regions</span></div><div className="trust-statement"><ShieldCheck size={28} /><span><strong>Built for New York weather.</strong> Backed by local experience.</span></div>
      </div></section>

      <section className="section services-section" id="services"><div className="shell">
        <div className="section-heading split-heading"><div><p className="kicker">Complete roofing care</p><h2>Everything your roof needs.<br /><em>One trusted team.</em></h2></div><p>From a stubborn leak to a full replacement, we bring the experience, communication, and care your property deserves.</p></div>
        <div className="service-grid">{services.map(({ icon: Icon, title, text }, index) => <article className="service-card" key={title}><div className="card-top"><span className="icon-box"><Icon size={24} /></span><span className="card-number">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p><a href="#contact">Request an inspection <ChevronRight size={15} /></a></article>)}</div>
      </div></section>

      <section className="section why-section" id="about"><div className="shell why-grid">
        <div className="why-visual"><div className="roof-pattern" aria-hidden="true" /><RoofAssembly /><div className="experience-seal"><strong>18</strong><span>Years protecting<br />local properties</span></div></div>
        <div className="why-copy"><p className="kicker light">Why Empire State Roofing</p><h2>Quality you can see.<br /><em>Confidence you can feel.</em></h2><p>Roofing is more than shingles and nails—it’s the system protecting everything below it. We treat every property like the investment it is.</p>
          <div className="why-points"><div><BadgeCheck /><span><strong>Seasoned local experience</strong><small>18 years solving the roofing issues Northeast properties face.</small></span></div><div><Search /><span><strong>Clear, honest assessments</strong><small>Photos, plain-language findings, and options that make sense.</small></span></div><div><Timer /><span><strong>Responsive from start to finish</strong><small>Reliable scheduling, proactive updates, and a tidy jobsite.</small></span></div><div><ShieldCheck /><span><strong>Work built to last</strong><small>Sound methods and materials chosen for long-term performance.</small></span></div></div>
          <a href="#contact" className="text-link">Schedule your free inspection <ArrowRight size={17} /></a>
        </div>
      </div></section>

      <section className="section problems-section"><div className="shell">
        <div className="section-heading centered"><p className="kicker">Don’t wait for a small issue to grow</p><h2>Common roofing problems,<br /><em>handled the right way.</em></h2></div>
        <div className="problem-grid">{problems.map(({ icon: Icon, title, text }) => <article key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="problem-cta"><div><strong>Not sure what’s happening up there?</strong><span>We’ll take a look and give you a straightforward answer.</span></div><a className="button" href="#contact">Get a Free Roof Inspection <ArrowRight size={17} /></a></div>
      </div></section>

      <section className="section process-section"><div className="shell">
        <div className="section-heading centered"><p className="kicker">Simple from the first call</p><h2>How it works</h2></div>
        <div className="process-grid"><article><span>01</span><div className="process-icon"><Phone /></div><h3>Reach out</h3><p>Call us or send the short form. We’ll learn what’s going on and schedule a convenient visit.</p></article><article><span>02</span><div className="process-icon"><Search /></div><h3>We inspect</h3><p>We assess your roof, document our findings, and explain the best next step clearly.</p></article><article><span>03</span><div className="process-icon"><Hammer /></div><h3>We make it right</h3><p>Approve the plan and our experienced crew handles the work with care from setup to cleanup.</p></article></div>
      </div></section>

      <section className="section reviews-section" id="reviews"><div className="shell">
        <div className="section-heading review-heading"><div><p className="kicker light">Homeowner experiences</p><h2>Trusted on the roof.<br /><em>Respected on the ground.</em></h2></div><p className="sample-note">Sample review layout—replace with verified customer feedback before public promotion.</p></div>
        <div className="review-grid">{reviews.map((review) => <blockquote key={review.name}><div className="stars" aria-label="Five stars">{[1,2,3,4,5].map((star) => <Star key={star} size={15} fill="currentColor" />)}</div><p>“{review.quote}”</p><footer><span>{review.name}</span><small>{review.place}</small></footer></blockquote>)}</div>
      </div></section>

      <section className="section areas-section" id="areas"><div className="shell areas-grid">
        <div><p className="kicker">Proudly serving the region</p><h2>Local experience,<br /><em>wide coverage.</em></h2><p>We understand the mix of row homes, brownstones, suburban properties, and commercial roofs across the New York metro area.</p><a className="text-link dark-link" href="#contact">Check availability in your area <ArrowRight size={17} /></a></div>
        <div className="area-list"><div><MapPin /><span><strong>New York City</strong><small>Manhattan · Brooklyn · Queens · The Bronx · Staten Island</small></span></div><div><MapPin /><span><strong>Long Island</strong><small>Nassau County · Western Suffolk County</small></span></div><div><MapPin /><span><strong>Westchester</strong><small>Southern and Central Westchester County</small></span></div><div><MapPin /><span><strong>Northern New Jersey</strong><small>Hudson · Bergen · Essex · Union counties</small></span></div></div>
      </div></section>

      <section className="contact-section" id="contact"><div className="shell contact-grid">
        <div className="contact-copy"><p className="kicker light">Free, no-pressure roof inspection</p><h2>Let’s protect what<br /><em>matters most.</em></h2><p>Tell us a little about your property and we’ll follow up to schedule your complimentary roof inspection.</p><div className="contact-details"><a href={phoneHref}><span><Phone /></span><div><small>Call us directly</small><strong>(212) 555-0173</strong></div></a><a href="mailto:info@empirestateroofing.com"><span><Mail /></span><div><small>Email our team</small><strong>info@empirestateroofing.com</strong></div></a></div></div>
        <div className="form-card">{submitted ? <output className="success-message"><CheckCircle2 /><h3>Thanks—we’ve got your request.</h3><p>A member of our roofing team will be in touch shortly to schedule your free inspection.</p><button type="button" onClick={() => setSubmitted(false)}>Send another request</button></output> : <form onSubmit={handleSubmit}>
          <div className="form-heading"><span>Free roof inspection</span><strong>No obligation. No pressure.</strong></div>
          <div className="field-grid"><div className="field"><Label htmlFor="name">Full name</Label><Input id="name" name="name" autoComplete="name" placeholder="Your name" required /></div><div className="field"><Label htmlFor="phone">Phone number</Label><Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(212) 555-0000" required /></div></div>
          <div className="field-grid"><div className="field"><Label htmlFor="email">Email address</Label><Input id="email" name="email" type="email" autoComplete="email" placeholder="you@email.com" required /></div><div className="field"><Label htmlFor="zip">ZIP code</Label><Input id="zip" name="zip" inputMode="numeric" autoComplete="postal-code" placeholder="10001" required /></div></div>
          <div className="field"><Label htmlFor="service">How can we help?</Label><NativeSelect id="service" name="service" className="form-select" defaultValue="" required><NativeSelectOption value="" disabled>Select a service</NativeSelectOption>{services.map((service) => <NativeSelectOption key={service.title} value={service.title}>{service.title}</NativeSelectOption>)}</NativeSelect></div>
          <div className="field"><Label htmlFor="message">Anything else we should know? <small>Optional</small></Label><Textarea id="message" name="message" placeholder="Tell us about leaks, storm damage, roof age, or timing…" /></div>
          <button className="button submit-button" type="submit">Request My Free Inspection <ArrowRight size={18} /></button><p className="privacy-note"><ShieldCheck size={13} /> Your information stays private and is only used to respond to your request.</p>
        </form>}</div>
      </div></section>

      <section className="final-cta"><div className="shell"><div><span className="icon-box inverted"><ShieldCheck /></span><h2>Your roof protects everything.<br /><em>Let us protect your roof.</em></h2><p>Start with a free, no-pressure inspection from a local team with 18 years of experience.</p></div><div className="final-actions"><a className="button button-large" href="#contact">Get a Free Roof Inspection <ArrowRight size={18} /></a><a href={phoneHref}><Phone size={18} /> (212) 555-0173</a></div></div></section>

      <footer className="site-footer"><div className="shell footer-main">
        <div><a href="#top" className="brand footer-brand" aria-label="Empire State Roofing Co. home"><span className="brand-mark" aria-hidden="true"><Image className="brand-logo-image" src="/empire-state-roofing-logo.png" alt="" width={1254} height={1254} /></span><span><strong>Empire State</strong><small>Roofing Co.</small></span></a><p>Dependable roofing expertise for New York City and the surrounding region since 2008.</p></div>
        <div><h3>Services</h3>{services.slice(0, 5).map((service) => <a key={service.title} href="#services">{service.title}</a>)}</div><div><h3>Company</h3><a href="#about">Why choose us</a><a href="#reviews">Reviews</a><a href="#areas">Service areas</a><a href="#contact">Free inspection</a></div><div><h3>Contact</h3><a href={phoneHref}>(212) 555-0173</a><a href="mailto:info@empirestateroofing.com">info@empirestateroofing.com</a><p>NYC · Long Island<br />Westchester · Northern NJ</p></div>
      </div><div className="shell footer-bottom"><span>© 2026 Empire State Roofing Co. All rights reserved.</span><span>Established 2008</span></div></footer>

      <a className="mobile-call" href={phoneHref}><Phone size={18} /> Call (212) 555-0173</a>
    </main>
  );
}
