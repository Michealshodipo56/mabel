import {NextResponse} from 'next/server';
import {sendAppointment} from '@/lib/booking-mail';
import {treatments,quoteTreatments} from '@/lib/catalog';
export const runtime='nodejs';

export async function POST(req:Request){
 try{
  const size=Number(req.headers.get('content-length')||0);
  if(size>16000)return NextResponse.json({error:'Request too large.'},{status:413});
  const b:unknown=await req.json();
  if(!b||typeof b!=='object'||Array.isArray(b))return NextResponse.json({error:'Invalid request.'},{status:400});
  const body=b as Record<string,unknown>;
  if(body.website)return NextResponse.json({ok:true});
  const ids=Array.isArray(body.treatmentIds)?body.treatmentIds.filter((v):v is string=>typeof v==='string'):[];
  const selected=[...new Set(ids)];
  if(ids.length>40||selected.length===0||selected.length>15||selected.some(id=>!treatments.some(t=>t.id===id)))return NextResponse.json({error:'Choose one or more valid treatments.'},{status:400});
  const name=String(body.name||'').trim(),email=String(body.email||'').trim(),phone=String(body.phone||'').trim();
  const date=String(body.date||''),time=String(body.time||''),notes=String(body.notes||'').trim();
  if(!name||name.length>120||!/^\+?[0-9 ()-]{7,22}$/.test(phone)||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||notes.length>1500)
   return NextResponse.json({error:'Please check your contact information.'},{status:400});
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return NextResponse.json({error:'Please choose a valid date and time.'},{status:400});
  const dateAsUTC=new Date(date+'T00:00:00Z');
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Lagos',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  if(!Number.isFinite(dateAsUTC.getTime())||dateAsUTC.toISOString().slice(0,10)!==date||date<today)return NextResponse.json({error:'Please choose today or a later date.'},{status:400});
  const quote=quoteTreatments(selected);
  await sendAppointment({name,email,phone,date,time,notes,quote});
  return NextResponse.json({ok:true,message:'Appointment request delivered to the studio. Await their confirmation.'});
 }catch(e){
  const config=e instanceof Error&&e.message==='MAIL_NOT_CONFIGURED';
  console.error('Appointment email delivery failed',config?'Mail not configured':'Mail service unavailable');
  return NextResponse.json({error:config?'Booking email is not configured yet. Please contact the studio directly.':'We could not deliver this request. Please try again later.'},{status:503});
 }
}
