'use client';
import Link from 'next/link';
import {ArrowUpRight,ChevronLeft,ChevronRight,MoveDownRight} from 'lucide-react';
import {useEffect,useRef,useState} from 'react';
import {services} from '@/lib/data';

const heroLooks=[
{label:'01 / THE CANVAS',word:'BEAUTY',image:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1900&q=90',description:'Beauty, on your own terms.'},
{label:'02 / THE DETAIL',word:'ARTISTRY',image:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1900&q=90',description:'Every look tells a story.'},
{label:'03 / THE MOMENT',word:'BECOMING',image:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1900&q=90',description:'This moment belongs to you.'}
];
export function MotionIn({children,className=''}:{children:React.ReactNode,className?:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const node=ref.current;if(!node)return;const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){node.classList.add('at-visible');observer.unobserve(node)}}},{threshold:.12});observer.observe(node);return()=>observer.disconnect()},[]);
 return <div ref={ref} className={'at-reveal '+className}>{children}</div>
}
export function ScrollMeter(){const [progress,setProgress]=useState(0);useEffect(()=>{let frame=0;const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const h=document.documentElement.scrollHeight-window.innerHeight;setProgress(h>0?window.scrollY/h*100:0)})};window.addEventListener('scroll',update,{passive:true});update();return()=>{window.removeEventListener('scroll',update);cancelAnimationFrame(frame)}},[]);return <div className="at-scroll-meter" aria-hidden="true" style={{width:progress+'%'}}/>}
export function BeautyCursor(){
 const [point,setPoint]=useState<{x:number,y:number}|null>(null);
 useEffect(()=>{if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;let raf=0;const move=(e:PointerEvent)=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>setPoint({x:e.clientX,y:e.clientY}))};window.addEventListener('pointermove',move,{passive:true});return()=>{window.removeEventListener('pointermove',move);cancelAnimationFrame(raf)}},[]);
 return point?<div aria-hidden="true" className="at-cursor-aura" style={{left:point.x,top:point.y}}/>:null;
}
export function BeautyHero(){
 const [active,setActive]=useState(0),[paused,setPaused]=useState(false);
 useEffect(()=>{if(paused)return;const timer=window.setInterval(()=>setActive(v=>(v+1)%heroLooks.length),6500);return()=>window.clearInterval(timer)},[paused]);
 return <div className="at-hero-campaign" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
   <div className="at-hero-photo-stack">{heroLooks.map((look,i)=><div key={look.label} aria-hidden="true" className={'at-hero-slide '+(i===active?'is-active':'')} style={{backgroundImage:'url('+look.image+')'}}/>)}</div>
   <div className="at-hero-orbit" aria-hidden="true"><span>OJUEWA • BEAUTY ATELIER • OJUEWA •</span></div>
   <div className="at-hero-side-label" aria-hidden="true">ARTISTRY / IN MOTION</div>
   <div className="at-hero-headline"><span className="at-hero-kicker">A DIFFERENT KIND OF BEAUTY EXPERIENCE</span><h1><span>THE ART</span><em>of</em><span className="at-hero-word" key={heroLooks[active].word}>{heroLooks[active].word}</span></h1><div className="at-hero-bottom-line"><span>{heroLooks[active].description}</span><Link href="/book" className="at-hero-cta">ENTER THE ATELIER <ArrowUpRight size={20}/></Link></div></div>
   <div className="at-hero-switch"><span>{heroLooks[active].label}</span><div><button aria-label="Previous campaign image" onClick={()=>setActive(v=>(v+heroLooks.length-1)%heroLooks.length)}><ChevronLeft size={19}/></button><button aria-label="Next campaign image" onClick={()=>setActive(v=>(v+1)%heroLooks.length)}><ChevronRight size={19}/></button></div></div>
 </div>
}
export function LookSelector(){
 const [active,setActive]=useState(0),[direction,setDirection]=useState(1);
 const s=services[active];
 const select=(i:number)=>{setDirection(i>=active?1:-1);setActive(i)};
 return <div className="at-selector">
   <div className="at-selector-rail" role="tablist" aria-label="Beauty service collections">
    {services.map((item,i)=><button key={item.id} type="button" id={'beauty-tab-'+item.id} role="tab" aria-selected={i===active} aria-controls="beauty-panel" className={i===active?'is-selected':''} onClick={()=>select(i)}><span>0{i+1}.</span><strong>{item.name}</strong><ArrowUpRight size={20}/></button>)}
   </div>
   <div className="at-selector-stage" id="beauty-panel" role="tabpanel" aria-labelledby={'beauty-tab-'+s.id}>
    <div className="at-selector-image" key={s.id} style={{backgroundImage:'url('+s.image+')','--slide-direction':direction} as React.CSSProperties}/>
    <span className="at-stage-vertical">THE OJUEWA COLLECTION</span>
    <div className="at-stage-sticker" aria-hidden="true">Made<br/>for you ✳</div>
    <div className="at-stage-foot"><span>{s.label}</span><span>0{active+1} / 04</span></div>
   </div>
   <div className="at-selector-story"><span className="at-small-label">THE EXPERIENCE / 0{active+1}</span><h3 key={s.intro}>{s.intro}</h3><p>{s.description}</p><Link href={'/book?service='+s.id} className="at-select-book">MAKE IT YOURS <MoveDownRight size={22}/></Link></div>
 </div>
}
