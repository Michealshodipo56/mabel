import type {Metadata} from 'next';
import {Header,Footer} from '@/components/SiteChrome';
import './globals.css';
import './interior.css';
export const metadata:Metadata={title:{default:'OJUEWA — Your Beauty. Our Artistry.',template:'%s | OJUEWA'},description:'Explore makeup artistry, hairstyling, manicures and pedicures at OJUEWA. Discover the beauty atelier and request your next appointment.',openGraph:{title:'OJUEWA — The Art of Becoming',description:'Your Beauty. Our Artistry.',type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/><main>{children}</main><Footer/></body></html>}
