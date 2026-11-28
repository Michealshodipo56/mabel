import {formatNaira,type Treatment, type TreatmentCategory} from '@/lib/catalog';
type Quote={chosen:Treatment[];knownTotal:number;isComplete:boolean};
type Booking={name:string;email:string;phone:string;date:string;time:string;notes:string;quote:Quote};
const escapeHTML=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));

export async function sendAppointment(booking:Booking){
 const key=process.env.RESEND_API_KEY?.trim();
 const to=process.env.OJUEWA_BOOKING_EMAIL?.trim();
 const from=process.env.OJUEWA_FROM_EMAIL?.trim();
 if(!key||!to||!from||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from))throw new Error('MAIL_NOT_CONFIGURED');
 const {name,phone,email,date,time,notes,quote}=booking;
 const rows=quote.chosen.map(s=>'<tr><td style="padding:10px;border-bottom:1px solid #eee">'+escapeHTML(s.name)+(s.confirmed?'':' (availability unverified)')+'</td><td style="padding:10px;border-bottom:1px solid #eee">'+escapeHTML(formatNaira(s.priceNgn))+'</td></tr>').join('');
 const total=quote.isComplete?formatNaira(quote.knownTotal):'Final price pending shop confirmation'+(quote.knownTotal>0?' (known subtotal: '+formatNaira(quote.knownTotal)+')':'');
 const html='<div style="font-family:Arial,sans-serif;max-width:680px;color:#351e30"><h1 style="font-family:Georgia,serif">New OJUEWA beauty booking request</h1><p><strong>Customer:</strong> '+escapeHTML(name)+'</p><p><strong>Phone:</strong> '+escapeHTML(phone)+'</p><p><strong>Email:</strong> '+escapeHTML(email)+'</p><p><strong>Preferred date:</strong> '+escapeHTML(date)+'</p><p><strong>Preferred time (Africa/Lagos):</strong> '+escapeHTML(time)+'</p><h2>Selected treatments</h2><table style="border-collapse:collapse;width:100%">'+rows+'</table><p><strong>Quote: '+escapeHTML(total)+'</strong></p><p><strong>Notes:</strong> '+escapeHTML(notes||'None')+'</p><p style="font-size:12px">This is an appointment request, not a confirmed reservation. Rates and availability must be confirmed by the studio.</p></div>';
 const text=['New OJUEWA appointment request','Customer: '+name,'Phone: '+phone,'Email: '+email,'Preferred date: '+date,'Preferred time (Nigeria): '+time,'Treatments:',...quote.chosen.map(s=>'- '+s.name+' — '+formatNaira(s.priceNgn)+(s.confirmed?'':' (availability unverified)')),'Quote: '+total,'Notes: '+(notes||'None'),'Appointment not confirmed.'].join('\n');
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:email,subject:'New OJUEWA booking request — '+date+' '+time,html,text}),cache:'no-store',signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw new Error('MAIL_DELIVERY_FAILED');
}
