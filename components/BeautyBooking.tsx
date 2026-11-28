'use client';
import {useEffect,useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,Check,Clock3,Plus,Minus} from 'lucide-react';
import {formatNaira,quoteTreatments,treatmentCategories,treatments, type TreatmentCategory} from '@/lib/catalog';

const firstDate=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Lagos',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function BeautyBooking(){
 const [selected,setSelected]=useState<string[]>([]);
 const [category,setCategory]=useState<TreatmentCategory|'all'>('all');
 const [step,setStep]=useState(0);
 const [form,setForm]=useState({name:'',phone:'',email:'',date:'',time:'',notes:'',website:''});
 const [message,setMessage]=useState('');
 const [busy,setBusy]=useState(false);
 useEffect(()=>{const requested=new URLSearchParams(window.location.search).get('service');if(!requested)return;
 const exact=treatments.find(t=>t.id===requested);
 const categoryMatch=treatmentCategories.find(t=>t.id===requested);
 if(exact){setSelected([exact.id]);setCategory(exact.category)}
 else if(categoryMatch){setCategory(categoryMatch.id)}
 },[]);
 const quote=useMemo(()=>quoteTreatments(selected),[selected]);
 const filtered=treatments.filter(t=>category==='all'||t.category===category);
 const set=(key:keyof typeof form,value:string)=>setForm(prev=>({...prev,[key]:value}));
 const toggle=(id:string)=>setSelected(prev=>prev.includes(id)?prev.filter(s=>s!==id):[...prev,id]);
 async function send(e:React.FormEvent){e.preventDefault();if(!selected.length||!form.date||!form.time)return;
 setBusy(true);setMessage('');
 try{
 const response=await fetch('/api/appointments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,treatmentIds:selected})});
 const json=await response.json();if(!response.ok)throw new Error(json.error||'Unable to submit the request');
 setMessage('Your appointment request has been sent to the studio. It is not confirmed until the team replies.');setStep(3);
 }catch(error){setMessage(error instanceof Error?error.message:'Unable to send the request.')}finally{setBusy(false)}
 }
 return <div className="bb-shell">
 <div className="bb-progress" aria-label="Booking progress">{['01 SELECT SERVICES','02 PICK YOUR TIME','03 YOUR DETAILS'].map((label,i)=><span className={step>=i?'active':''} key={label}>{label}</span>)}</div>
 {step===3?<div className="bb-success" role="status"><Check size={34}/><h2>Request received.</h2><p>{message}</p><button className="bb-dark" onClick={()=>{setStep(0);setSelected([]);setForm({name:'',phone:'',email:'',date:'',time:'',notes:'',website:''})}}>START ANOTHER REQUEST</button></div>:
 <form onSubmit={send}>
 {step===0&&<><div className="bb-title"><h2>Choose your <em>treatments.</em></h2><p>Build a session with as many services as you like. Unconfirmed offerings and prices are clearly marked.</p></div>
 <div className="bb-layout"><div><div className="bb-filters" aria-label="Filter treatments"><button type="button" className={category==='all'?'active':''} onClick={()=>setCategory('all')}>ALL</button>{treatmentCategories.map(c=><button type="button" key={c.id} className={category===c.id?'active':''} onClick={()=>setCategory(c.id)}>{c.name.toUpperCase()}</button>)}</div>
 <div className="bb-choices">{filtered.map(t=><button type="button" key={t.id} aria-pressed={selected.includes(t.id)} onClick={()=>toggle(t.id)} className={'bb-choice '+(selected.includes(t.id)?'chosen':'')}><span className="bb-choice-control">{selected.includes(t.id)?<Check size={18}/>:<Plus size={18}/>}</span><span className="bb-choice-content"><strong>{t.name}</strong><small>{t.description}{!t.confirmed?' · Please confirm availability':''}</small></span><span className="bb-choice-price">{formatNaira(t.priceNgn)}</span></button>)}</div></div>
 <aside className="bb-summary"><span className="bb-overline">YOUR BEAUTY SESSION</span><h3>{selected.length} {selected.length===1?'treatment':'treatments'}</h3>{quote.chosen.length?<div className="bb-summary-items">{quote.chosen.map(t=><div key={t.id}><span>{t.name}</span><span>{formatNaira(t.priceNgn)}</span><button aria-label={'Remove '+t.name} type="button" onClick={()=>toggle(t.id)}><Minus size={14}/></button></div>)}</div>:<p>Select your favourite services to begin.</p>}<div className="bb-total"><span>{quote.isComplete?'TOTAL':'KNOWN SUBTOTAL'}</span><strong>{quote.isComplete?formatNaira(quote.knownTotal):quote.knownTotal>0?formatNaira(quote.knownTotal):'Awaiting prices'}</strong></div><p className="bb-note">Prices, service availability and the final total must be confirmed by OJUEWA before your booking is accepted.</p><button className="bb-dark" type="button" disabled={!selected.length} onClick={()=>setStep(1)}>CHOOSE DATE & TIME <ArrowRight size={19}/></button></aside></div></>}
 {step===1&&<div className="bb-step-panel"><span className="bb-overline">MAKE IT YOUR MOMENT</span><h2>When works <em>for you?</em></h2><p>Choose a preferred date and time. This is a request, not a live available slot.</p><div className="bb-fields"><label>Preferred date<input type="date" min={firstDate()} value={form.date} onChange={e=>set('date',e.target.value)} required/></label><label>Preferred time<input type="time" value={form.time} onChange={e=>set('time',e.target.value)} required/></label></div><div className="bb-preview"><Clock3 size={21}/><span>{selected.length} selected services · {quote.isComplete?formatNaira(quote.knownTotal):'Final price to be confirmed'}</span></div><div className="bb-buttons"><button className="bb-back" type="button" onClick={()=>setStep(0)}><ArrowLeft size={18}/> BACK</button><button className="bb-dark" disabled={!form.date||!form.time} type="button" onClick={()=>setStep(2)}>CONTINUE <ArrowRight size={19}/></button></div></div>}
 {step===2&&<div className="bb-step-panel"><span className="bb-overline">JUST ONE LAST THING</span><h2>Tell us <em>about you.</em></h2><p>We’ll send these details to the studio so they can respond to your appointment request.</p><div className="bb-fields"><label>Full name<input required value={form.name} maxLength={120} onChange={e=>set('name',e.target.value)} placeholder="Your full name"/></label><label>Phone number<input required type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+234 ..."/></label><label>Email address<input required type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com"/></label><label className="bb-notes">Notes / desired look<textarea value={form.notes} maxLength={1500} rows={4} onChange={e=>set('notes',e.target.value)} placeholder="Tell us about the look, occasion, or any questions"/></label><label className="honeypot">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>set('website',e.target.value)}/></label></div><div className="bb-review"><strong>REVIEW YOUR REQUEST</strong>{quote.chosen.map(s=><div key={s.id}><span>{s.name}</span><span>{formatNaira(s.priceNgn)}</span></div>)}<div><span>Preferred appointment</span><span>{form.date} · {form.time} (Nigeria time)</span></div><div><b>{quote.isComplete?'Total':'Known subtotal'}</b><b>{quote.isComplete?formatNaira(quote.knownTotal):'Final price pending'}</b></div><p>Submitting sends an appointment enquiry, not a confirmed reservation or payment.</p></div>{message&&<p className="bb-error" role="alert">{message}</p>}<div className="bb-buttons"><button className="bb-back" type="button" onClick={()=>setStep(1)}><ArrowLeft size={18}/> BACK</button><button disabled={busy} className="bb-dark" type="submit">{busy?'SENDING REQUEST…':'SEND BOOKING REQUEST'} <ArrowRight size={19}/></button></div></div>}
 </form>}
 </div>
}
