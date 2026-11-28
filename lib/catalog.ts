/** Central editable treatment catalogue. All prices are intentionally null until the shop confirms them. */
export type TreatmentCategory='makeup'|'hair'|'nails'|'pedicure'|'lashes';
export type Treatment={id:string;category:TreatmentCategory;name:string;description:string;priceNgn:number|null;confirmed:boolean;durationMin:number|null};
export const treatmentCategories:{id:TreatmentCategory;name:string;description:string}[]=[
 {id:'makeup',name:'Makeup',description:'Everyday, occasion and bridal beauty'},
 {id:'hair',name:'Hair',description:'Hairstyling and installations'},
 {id:'nails',name:'Nails & Manicure',description:'Hand care and finished nail looks'},
 {id:'pedicure',name:'Pedicure',description:'Feet and nail care'},
 {id:'lashes',name:'Lashes',description:'Lash styling and enhancements'}
];
/** 'confirmed' means confirmed in the initial studio brief; later additions need verification. */
export const treatments:Treatment[]=[
 {id:'everyday-makeup',category:'makeup',name:'Everyday Makeup',description:'A polished, everyday beauty look.',priceNgn:null,confirmed:true,durationMin:null},
 {id:'soft-glam',category:'makeup',name:'Soft Glam Makeup',description:'Softly defined makeup for an occasion.',priceNgn:null,confirmed:true,durationMin:null},
 {id:'full-glam',category:'makeup',name:'Full Glam Makeup',description:'Statement makeup for an event or shoot.',priceNgn:null,confirmed:true,durationMin:null},
 {id:'bridal-makeup',category:'makeup',name:'Bridal Makeup',description:'A bridal look planned for your celebration.',priceNgn:null,confirmed:true,durationMin:null},
 {id:'hairstyling',category:'hair',name:'Hair Styling',description:'Hair styling tailored to your preference.',priceNgn:null,confirmed:true,durationMin:null},
 {id:'hair-installation',category:'hair',name:'Hair Installation',description:'Hair installation with styling details discussed during consultation.',priceNgn:null,confirmed:true,durationMin:null},
 {id:'hair-braiding',category:'hair',name:'Hair Braiding',description:'Braided hairstyles, subject to service confirmation.',priceNgn:null,confirmed:false,durationMin:null},
 {id:'classic-manicure',category:'nails',name:'Classic Manicure',description:'Nail shaping and manicure care.',priceNgn:null,confirmed:true,durationMin:null},
 {id:'nail-styling',category:'nails',name:'Nail Styling',description:'Finished nail looks to suit your style.',priceNgn:null,confirmed:true,durationMin:null},
 {id:'gel-manicure',category:'nails',name:'Gel Manicure',description:'Gel finish, subject to service confirmation.',priceNgn:null,confirmed:false,durationMin:null},
 {id:'nail-art',category:'nails',name:'Nail Art',description:'Decorative nail designs, subject to service confirmation.',priceNgn:null,confirmed:false,durationMin:null},
 {id:'classic-pedicure',category:'pedicure',name:'Pedicure',description:'Professional foot and nail care.',priceNgn:null,confirmed:true,durationMin:null},
 {id:'foot-care',category:'pedicure',name:'Foot Care',description:'Additional foot-care treatment, as discussed with the studio.',priceNgn:null,confirmed:true,durationMin:null},
 {id:'lash-installation',category:'lashes',name:'Eyelash Installation',description:'Lash application; please confirm the type and availability.',priceNgn:null,confirmed:false,durationMin:null},
 {id:'lash-refill',category:'lashes',name:'Lash Refill',description:'Maintenance for installed lashes; subject to confirmation.',priceNgn:null,confirmed:false,durationMin:null}
];
export function formatNaira(price:number|null){return price===null?'Price to be confirmed':new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(price)}
export function quoteTreatments(ids:string[]){const chosen=ids.map(id=>treatments.find(s=>s.id===id)).filter((s):s is Treatment=>Boolean(s));const knownTotal=chosen.reduce((sum,s)=>sum+(s.priceNgn??0),0);return {chosen,knownTotal,isComplete:chosen.length>0&&chosen.every(s=>s.priceNgn!==null)}}
