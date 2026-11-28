import {NextResponse} from 'next/server';
import {saveSubmission} from '@/lib/submissions';
import {services} from '@/lib/data';
export const runtime='nodejs';

export async function POST(req:Request) {
  try {
    if(Number(req.headers.get('content-length')||0)>16000) return NextResponse.json({error:'Request is too large.'},{status:413});
    const body=await req.json();
    if(body===null||typeof body!=='object'||Array.isArray(body)) return NextResponse.json({error:'Invalid request.'},{status:400});
    if(body.website) return NextResponse.json({ok:true});
    const name=String(body.name||'').trim();
    const phone=String(body.phone||'').trim();
    const email=String(body.email||'').trim();
    const date=String(body.date||'');
    const time=String(body.time||'');
    const notes=String(body.notes||'').trim();
    const selected:string[]=Array.isArray(body.services)
      ? [...new Set<string>((body.services as unknown[]).filter((s:unknown):s is string=>typeof s==='string'&&services.some(x=>x.id===s)))] : [];
    const details:Record<string,string>={};
    if(body.details&&typeof body.details==='object'&&!Array.isArray(body.details)){
      for(const s of services){
        const choice=body.details[s.id];
        if(typeof choice==='string'&&s.details.includes(choice)) details[s.id]=choice;
      }
    }
    if(!name||name.length>120||!/^[+]?[-0-9 ()]{7,22}$/.test(phone)||selected.length===0||notes.length>1500||email.length>254||(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return NextResponse.json({error:'Please check your contact details and selected services.'},{status:400});
    }
    const preferred=new Date(`${date}T${time}:00`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||!Number.isFinite(preferred.getTime())||preferred.toISOString().slice(0,10)!==date||date<new Date().toISOString().slice(0,10)){
      return NextResponse.json({error:'Please choose a valid future date and preferred time.'},{status:400});
    }
    await saveSubmission({kind:'appointment',name,phone,email,services:selected,details,date,time,notes});
    return NextResponse.json({ok:true,message:'Appointment request received. A booking is not confirmed until the studio responds.'});
  } catch(error) {
    const unconfigured=error instanceof Error&&error.message==='SUBMISSION_NOT_CONFIGURED';
    console.error('Appointment submission failed:',unconfigured?'Delivery not configured':'Delivery unavailable');
    return NextResponse.json({error:unconfigured?'Online appointment requests are not yet enabled. Please contact the studio directly.':'Unable to send the appointment request right now. Please try again.'},{status:503});
  }
}
