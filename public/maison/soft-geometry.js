import * as T from 'three';
// Compact, rounded stone profiles. Dimensions remain unchanged for existing sightlines.
export function softBox(width,height,depth,radius=.05){
 const bevel=Math.min(radius,Math.min(width,height,depth)*.24);
 const w=width-2*bevel,h=height-2*bevel,r=Math.min(radius,w*.45,h*.45);
 const s=new T.Shape();
 s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);
 s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);
 s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);
 s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
 const geo=new T.ExtrudeGeometry(s,{depth:depth-2*bevel,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,curveSegments:4,steps:1});
 geo.translate(0,0,-depth/2+bevel);return geo;
}
