import {db} from '@/lib/db';

export type AppointmentSubmission = {
  kind:'appointment'; name:string; phone:string; email:string;
  services:string[]; details:Record<string,string>; date:string; time:string; notes:string
};
export type ContactSubmission = {kind:'contact';name:string;email:string;message:string};
export type Submission = AppointmentSubmission | ContactSubmission;

/**
 * Production requires a secure, persistent webhook receiver. The app only
 * reports success once the remote endpoint acknowledges a request.
 * Local SQLite is deliberately limited to development and local builds.
 */
export async function saveSubmission(data:Submission):Promise<void> {
  const endpoint=process.env.OJUEWA_SUBMISSION_WEBHOOK_URL?.trim();
  const token=process.env.OJUEWA_SUBMISSION_WEBHOOK_TOKEN?.trim();
  if(endpoint) {
    if(!token || token.length<24) throw new Error('SUBMISSION_NOT_CONFIGURED');
    let url:URL;
    try { url=new URL(endpoint) } catch { throw new Error('SUBMISSION_NOT_CONFIGURED') }
    if(url.protocol!=='https:' || url.username || url.password) throw new Error('SUBMISSION_NOT_CONFIGURED');
    const response=await fetch(url,{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
      body:JSON.stringify(data),cache:'no-store',signal:AbortSignal.timeout(12000)
    });
    if(!response.ok) throw new Error('SUBMISSION_DELIVERY_FAILED');
    return;
  }
  if(process.env.NODE_ENV==='production') throw new Error('SUBMISSION_NOT_CONFIGURED');
  if(data.kind==='appointment') {
    db().prepare('INSERT INTO appointments (name,phone,email,services,details,preferred_date,preferred_time,notes) VALUES (?,?,?,?,?,?,?,?)')
      .run(data.name,data.phone,data.email,JSON.stringify(data.services),JSON.stringify(data.details),data.date,data.time,data.notes);
  } else {
    db().prepare('INSERT INTO inquiries (name,email,message) VALUES (?,?,?)')
      .run(data.name,data.email,data.message);
  }
}
