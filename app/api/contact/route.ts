import {NextResponse} from 'next/server';
import {saveSubmission} from '@/lib/submissions';
export const runtime='nodejs';
export async function POST(req:Request){
  try {
    if(Number(req.headers.get('content-length')||0)>16000) return NextResponse.json({error:'Request is too large.'},{status:413});
    const b=await req.json();
    if(b===null||typeof b!=='object'||Array.isArray(b)) return NextResponse.json({error:'Invalid request.'},{status:400});
    if(b.website) return NextResponse.json({ok:true});
    const name=String(b.name||'').trim(),email=String(b.email||'').trim(),message=String(b.message||'').trim();
    if(!name||name.length>120||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||message.length<5||message.length>3000) return NextResponse.json({error:'Enter your name, a valid email and a message.'},{status:400});
    await saveSubmission({kind:'contact',name,email,message});
    return NextResponse.json({ok:true});
  }catch(error){
    const unconfigured=error instanceof Error&&error.message==='SUBMISSION_NOT_CONFIGURED';
    console.error('Contact submission failed:',unconfigured?'Delivery not configured':'Delivery unavailable');
    return NextResponse.json({error:unconfigured?'Online contact messages are not yet enabled. Please contact the studio directly.':'Unable to send your message right now. Please try again.'},{status:503});
  }
}
