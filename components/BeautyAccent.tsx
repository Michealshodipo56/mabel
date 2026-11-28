import type {SVGProps} from 'react';

/** Original beauty-tool emblems, intentionally avoiding generic sparkle/star glyphs. */
export function BeautyAccent({kind='brush',className=''}:{kind?:'brush'|'mirror'|'polish';className?:string}){
 const svgProps:SVGProps<SVGSVGElement>={viewBox:'0 0 96 96',fill:'none',stroke:'currentColor',strokeWidth:2.7,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':true};
 return <span className={'beauty-accent '+className} aria-hidden="true">
  {kind==='brush'?
  <svg {...svgProps}>
   <path d="M26 76 64 38" strokeWidth="5"/><path d="m61 39 9-9 8 8-9 9"/><path d="M70 30c-2-11 5-20 17-23 2 12-3 22-11 29" fill="currentColor" fillOpacity=".22"/>
   <path d="M20 76a10 10 0 0 0 13 0" strokeWidth="4"/><path d="M12 44c4-9 11-14 21-16M16 54c7-8 14-10 20-10" strokeWidth="1.8" opacity=".65"/>
  </svg>:
  kind==='mirror'?
  <svg {...svgProps}>
   <rect x="17" y="10" width="62" height="68" rx="31" strokeWidth="3.2"/><path d="M27 44a21 21 0 0 1 21-21M39 68c-6-2-10-5-13-10" opacity=".65"/><path d="M48 78v12M35 90h26" strokeWidth="3.2"/>
   <path d="M62 28c4 7 6 14 5 19" opacity=".5"/>
  </svg>:
  <svg {...svgProps}>
   <rect x="25" y="38" width="46" height="45" rx="9" strokeWidth="3.3"/><path d="M37 38V22h22v16M41 22V12h14v10" strokeWidth="3.3"/><path d="M37 49v23" strokeWidth="4.5" opacity=".6"/><path d="M49 49v13" strokeWidth="3" opacity=".6"/><path d="M48 20v-7" strokeWidth="2"/>
  </svg>}
 </span>;
}
