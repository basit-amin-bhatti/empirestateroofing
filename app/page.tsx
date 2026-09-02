'use client';

import { FormEvent, useState } from 'react';
import {
  ArrowRight, BadgeCheck, Bot, CheckCircle2, ChevronRight, ClipboardCheck,
  CloudRain, Droplets, Hammer, HardHat, Headphones, House, Mail, MapPin,
  MessageSquareText, Mic, Phone, Search, ShieldCheck, Sparkles, Star, Timer, Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';

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
  const [submitted, setSubmitted] = useState(false);
  const [agentMode, setAgentMode] = useState<'idle' | 'call' | 'text'>('idle');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main>
      <header className="site-header">
        <div className="shell nav-wrap">
          <a href="#top" className="brand" aria-label="Empire State Roofing Co. home">
            <span className="brand-mark" aria-hidden="true">ES</span>
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
        <img className="hero-image" src="https://images.pexels.com/photos/33404248/pexels-photo-33404248.jpeg?auto=compress&cs=tinysrgb&w=1800" alt="Professional roofer installing shingles on a residential roof" />
        <div className="hero-shade" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><ShieldCheck size={17} aria-hidden="true" /> Protecting New York since 2008</p>
            <h1>A stronger roof.<br /><em>A safer home.</em></h1>
            <p className="hero-lede">Expert roof repair, replacement, and installation across NYC and the surrounding region—done right, without the runaround.</p>
            <div className="hero-actions"><a className="button button-large" href="#contact">Get a Free Roof Inspection <ArrowRight size={18} aria-hidden="true" /></a><a className="phone-link" href={phoneHref}><span><Phone size={19} aria-hidden="true" /></span><span><small>Talk to a roofer</small>(212) 555-0173</span></a></div>
            <div className="hero-notes"><span><CheckCircle2 size={16} /> No-obligation inspection</span><span><CheckCircle2 size={16} /> Fast local response</span></div>
          </div>

          <aside className="ai-agent-card" aria-labelledby="ai-agent-title">
            <div className="agent-card-header">
              <span className="agent-icon"><Bot size={22} aria-hidden="true" /></span>
              <span className="agent-status"><i aria-hidden="true" /> Available 24/7</span>
            </div>
            <div className="agent-card-copy">
              <p>Instant roofing help</p>
              <h2 id="ai-agent-title">Talk to Our AI<br />Roofing Assistant</h2>
              <span>Ask a question, describe an issue, or get help scheduling your free inspection.</span>
            </div>

            <div className={`agent-embed-slot ${agentMode !== 'idle' ? 'is-active' : ''}`} aria-live="polite">
              <div className="agent-signal" aria-hidden="true">
                <span /><span /><span /><span /><span />
              </div>
              <span className="agent-slot-icon"><Mic size={18} aria-hidden="true" /></span>
              <div>
                <strong>{agentMode === 'call' ? 'Voice agent selected' : agentMode === 'text' ? 'Text agent selected' : 'AI agent embed area'}</strong>
                <small>{agentMode === 'idle' ? 'Ready for your ElevenLabs widget' : 'Connect your ElevenLabs agent here'}</small>
              </div>
            </div>

            <div className="agent-actions">
              <Button type="button" className="agent-button agent-call" aria-pressed={agentMode === 'call'} onClick={() => setAgentMode('call')}>
                <Headphones size={17} aria-hidden="true" /> Call AI Agent
              </Button>
              <Button type="button" variant="outline" className="agent-button agent-text" aria-pressed={agentMode === 'text'} onClick={() => setAgentMode('text')}>
                <MessageSquareText size={17} aria-hidden="true" /> Text AI Agent
              </Button>
            </div>
            <p className="agent-embed-note"><Sparkles size={12} aria-hidden="true" /> ElevenLabs embed-ready placeholder</p>
          </aside>
        </div>
      </section>

      <section className="trust-bar" aria-label="Company highlights"><div className="shell trust-grid">
        <div><strong>18</strong><span>Years of<br />experience</span></div><div><strong>5</strong><span>NYC boroughs<br />covered</span></div><div><strong>4</strong><span>Major service<br />regions</span></div><div className="trust-statement"><ShieldCheck size={28} /><span><strong>Built for New York weather.</strong> Backed by local experience.</span></div>
      </div></section>

      <section className="section services-section" id="services"><div className="shell">
        <div className="section-heading split-heading"><div><p className="kicker">Complete roofing care</p><h2>Everything your roof needs.<br /><em>One trusted team.</em></h2></div><p>From a stubborn leak to a full replacement, we bring the experience, communication, and care your property deserves.</p></div>
        <div className="service-grid">{services.map(({ icon: Icon, title, text }, index) => <article className="service-card" key={title}><div className="card-top"><span className="icon-box"><Icon size={24} /></span><span className="card-number">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p><a href="#contact">Request an inspection <ChevronRight size={15} /></a></article>)}</div>
      </div></section>

      <section className="section why-section" id="about"><div className="shell why-grid">
        <div className="why-visual"><div className="roof-pattern" aria-hidden="true" /><div className="experience-seal"><strong>18</strong><span>Years protecting<br />local properties</span></div></div>
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
        <div className="form-card">{submitted ? <div className="success-message" role="status"><CheckCircle2 /><h3>Thanks—we’ve got your request.</h3><p>A member of our roofing team will be in touch shortly to schedule your free inspection.</p><button type="button" onClick={() => setSubmitted(false)}>Send another request</button></div> : <form onSubmit={handleSubmit}>
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
        <div><a href="#top" className="brand footer-brand"><span className="brand-mark">ES</span><span><strong>Empire State</strong><small>Roofing Co.</small></span></a><p>Dependable roofing expertise for New York City and the surrounding region since 2008.</p></div>
        <div><h3>Services</h3>{services.slice(0, 5).map((service) => <a key={service.title} href="#services">{service.title}</a>)}</div><div><h3>Company</h3><a href="#about">Why choose us</a><a href="#reviews">Reviews</a><a href="#areas">Service areas</a><a href="#contact">Free inspection</a></div><div><h3>Contact</h3><a href={phoneHref}>(212) 555-0173</a><a href="mailto:info@empirestateroofing.com">info@empirestateroofing.com</a><p>NYC · Long Island<br />Westchester · Northern NJ</p></div>
      </div><div className="shell footer-bottom"><span>© 2026 Empire State Roofing Co. All rights reserved.</span><span>Established 2008</span></div></footer>

      <a className="mobile-call" href={phoneHref}><Phone size={18} /> Call (212) 555-0173</a>
    </main>
  );
}
