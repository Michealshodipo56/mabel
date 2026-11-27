import {NextResponse} from 'next/server';
export const runtime='nodejs';
export function GET(){
  const configured=Boolean(process.env.OJUEWA_SUBMISSION_WEBHOOK_URL&&process.env.OJUEWA_SUBMISSION_WEBHOOK_TOKEN);
  return NextResponse.json({status:'ok',submissions:configured?'configured':'not_configured'},{headers:{'Cache-Control':'no-store'}});
}
