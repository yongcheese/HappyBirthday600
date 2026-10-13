import * as T from 'three';
import { galleryPhotos } from './content.js?v=20261013-birthday02';
const v=a=>new T.Vector3(...a);
const smooth=t=>t*t*t*(t*(t*6-15)+10);
// Timed physical viewpoints. Each photograph gets an uninterrupted 2 s hold.
// One uninterrupted movement connects photo poses; no aisle-facing reset key.
export function createTour({mobile,aspect}) {
 const baseFov=mobile?53:46;
 const fitFov=Math.max(baseFov,T.MathUtils.radToDeg(2*Math.atan(1.99/(2*5.1*aspect*.78))));
 const distance=Math.max(3.1,Math.min(5.1,1.99/(2*Math.tan(T.MathUtils.degToRad(fitFov/2))*aspect*.78)));
 const keys=[],stops=[];
 function key(time,position,target,photo=-1,fov=baseFov){
  const pos=v(position),q=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().lookAt(pos,v(target),new T.Vector3(0,1,0)));
  keys.push({time,position:pos,quaternion:q,photo,fov});
 }
 key(0,mobile?[7,5.3,32]:[10,5.5,24],mobile?[0,2.7,1]:[0,2.5,1],-1,mobile?66:46);
 key(2.8,[.6,1.85,10],[0,1.8,0]);
 key(4.2,[0,1.85,5.7],[0,1.85,-1]);
 let time=4.2;
 galleryPhotos.forEach((photo,index)=>{
  // Follow adjacent photos along the same wall; turn only at the end of each pair.
  time+=index?(galleryPhotos[index-1].side===photo.side?1.7:2.2):1.15;
  const position=[photo.side*(2.988-distance),1.94,photo.z];
  const target=[photo.side*2.988,1.94,photo.z];
  key(time,position,target,index,fitFov);
  const start=time;time+=2;key(time,position,target,index,fitFov);
  stops.push({...photo,index,start,end:time,time:(start+time)/2});
 });
 const galleryEnd=time;time+=1.15;key(time,[0,1.85,-1.25],[0,1.7,-5.6],-1,mobile?62:46);
 time+=1.45;key(time,mobile?[0,1.95,-1.8]:[0,1.45,-3.13],mobile?[0,1.0,-4.7]:[0,.89,-4.48],-1,mobile?68:46);
 const duration=time;
 return {duration,stops:stops.map(s=>({...s,progress:s.time/duration})),sample(progress){
  const t=T.MathUtils.clamp(progress,0,1)*duration;let i=0;while(i<keys.length-2&&t>keys[i+1].time)i++;
  const a=keys[i],b=keys[i+1],u=smooth(T.MathUtils.clamp((t-a.time)/(b.time-a.time),0,1));
  return {position:a.position.clone().lerp(b.position,u),quaternion:a.quaternion.clone().slerp(b.quaternion,u),fov:T.MathUtils.lerp(a.fov,b.fov,u),photo:a.photo===b.photo?a.photo:-1,stage:t<4.2?'garden':t<=galleryEnd?'gallery':'letter',opening:1-smooth(Math.min(1,t/4.2))};
 }};
}
