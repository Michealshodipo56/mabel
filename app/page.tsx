import Link from 'next/link';
import {ArrowDownRight,ArrowUpRight,MoveUpRight} from 'lucide-react';
import {BeautyHero,LookSelector,MotionIn,ScrollMeter,BeautyCursor} from '@/components/AtelierExperience';
import {BeautyAccent} from '@/components/BeautyAccent';
import {gallery,services} from '@/lib/data';
import './atelier.css';

export default function Home(){
return <div className="atelier-site">
<ScrollMeter/><BeautyCursor/>
<section className="at-hero" id="top">
 <div className="at-hero-grain" aria-hidden="true"/>
 <div className="at-hero-top"><span>INDEPENDENT BEAUTY ATELIER</span><span className="at-top-index">NIGERIA &nbsp; / &nbsp; EST. IN ARTISTRY</span></div>
 <BeautyHero/>
 <div className="at-hero-footer"><span>NOT A NEW FACE. A NEW FEELING.</span><a href="#discover" aria-label="Explore the atelier">SCROLL TO DISCOVER <ArrowDownRight size={19}/></a><span>01 — 06</span></div>
</section>

<section className="at-manifesto" id="discover">
 <MotionIn className="at-manifesto-mark"><span>THE OJUEWA POINT OF VIEW</span><BeautyAccent kind="brush" className="at-beauty-mark" /></MotionIn>
 <MotionIn><h2>We don’t do<br/><em>ordinary</em> beauty<span className="at-period">.</span></h2></MotionIn>
 <div className="at-manifesto-bottom"><span>01 / THE MANIFESTO</span><MotionIn><p>Your face, your mood, your occasion. Makeup, hair, nails and care, made personal. Beauty isn’t a template. It’s a language—and you get to write it.</p></MotionIn></div>
</section>

<section className="at-look-lab" id="experiences">
 <div className="at-section-index"><span>02 / THE BEAUTY LAB</span><span>TOUCH. SWITCH. EXPLORE.</span></div>
 <div className="at-lab-heading"><MotionIn><h2>Pick your<br/><em>kind of magic.</em></h2></MotionIn><p>Not a menu you scroll past. A collection to play with. Find the beauty experience that feels like you.</p></div>
 <LookSelector/>
</section>

<section className="at-inbetween">
 <div className="at-inbetween-image at-photo" style={{backgroundImage:"url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85')"}} role="img" aria-label="Beauty artistry reference photograph"/>
 <div className="at-inbetween-type" aria-hidden="true">ART<br/><i>IS</i><br/>YOU.</div>
 <div className="at-inbetween-label"><span>THE DETAILS MAKE THE DIFFERENCE</span><span>03 / A CLOSER LOOK</span></div>
</section>

<section className="at-craft">
 <div className="at-section-index"><span>04 / THE PROCESS</span><span>THE ART OF THE DETAILS</span></div>
 <div className="at-craft-header"><MotionIn><h2>It’s in the<br/><em>little things.</em></h2></MotionIn><p>Great beauty is a collection of deliberate little decisions. Here are the disciplines we celebrate.</p></div>
 <div className="at-craft-rows">
 {services.map((s,i)=><Link href={'/services/'+s.id} className="at-craft-row" key={s.id}><span className="at-craft-count">0{i+1}</span><div className="at-craft-name"><h3>{s.name}</h3><span>{s.label}</span></div><span className="at-craft-hover-photo" style={{backgroundImage:'url('+s.image+')'}} aria-hidden="true"/><ArrowUpRight size={30}/></Link>)}
 </div>
</section>

<section className="at-portfolio">
 <div className="at-section-index"><span>05 / THE VISUAL DIARY</span><span>AN EDITORIAL MOODBOARD</span></div>
 <div className="at-portfolio-head"><MotionIn><h2>Looks to<br/><em>live for.</em></h2></MotionIn><Link href="/gallery" className="at-circle-link" aria-label="Explore full beauty gallery"><ArrowUpRight size={30}/></Link></div>
 <div className="at-portfolio-gallery">
 {gallery.slice(0,3).map((look,i)=><Link href={'/book?service='+look.category} key={look.id} className={'at-portfolio-item at-item-'+i}><div className="at-portfolio-image at-photo" style={{backgroundImage:'url('+look.image+')'}}/><div className="at-portfolio-caption"><span>0{i+1} / {look.category.toUpperCase()}</span><strong>{look.title}</strong><MoveUpRight size={20}/></div></Link>)}
 </div>
 <p className="at-reference-disclaimer">Editorial reference photography for inspiration. Authentic OJUEWA client work will be added with permission.</p>
</section>

<section className="at-appointment">
 <div className="at-appointment-decor" aria-hidden="true"><BeautyAccent kind="mirror" className="at-appointment-emblem" /></div>
 <div className="at-section-index"><span>06 / YOUR MOMENT</span><span>MAKE IT PERSONAL</span></div>
 <MotionIn><h2>Let’s make<br/>something <em>beautiful.</em></h2></MotionIn>
 <p>One beauty session, entirely yours. Tell us what you’re dreaming of; we’ll take it from there.</p>
 <Link className="at-book-pill" href="/book">CREATE YOUR BEAUTY SESSION <ArrowUpRight size={22}/></Link>
 <div className="at-appointment-bottom"><span>OJUEWA — THE ART OF BECOMING</span><a href="#top">BACK TO TOP ↑</a></div>
</section>
</div>
}
