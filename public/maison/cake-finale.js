import * as T from 'three';
import {mergeGeometries} from '../birthday-3d/vendor/BufferGeometryUtils.js';
// Sugar decorations stay editable here; reveal once, then leave the renderer idle.
export function create600Cake({root,x,z,cream,fruit}){
 const decor=new T.Group();decor.name='600 birthday cake';decor.position.set(x,1.28,z);decor.visible=false;root.add(decor);
 const materials={};const material=(name,color,r=.68)=>materials[name]??=new T.MeshStandardMaterial({name,color,roughness:r});
 const charcoal=material('Cat chocolate','#303638'),pink=material('Peach sugar','#eaa493'),mint=material('Mint sugar','#9bbdb4'),white=material('Sugar cream','#fff6e5'),gold=material('Honey sugar','#d7ac63'),eye=material('Cat amber eyes','#dbb877');
 const sphere=new T.SphereGeometry(1,20,14);
 const mesh=(geometry,m,position,scale=[1,1,1])=>{const o=new T.Mesh(geometry,m);o.position.set(...position);o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;decor.add(o);return o};
 const puff=(m,p,s)=>mesh(sphere.clone(),m,p,s);
 const curve=(points,r,m)=>mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),18,r,6,false),m,[0,0,0]);
 // A chocolate cat with little headphones: her cat + the music she loves.
 const cx=-.095,cz=.105;
 puff(charcoal,[cx,.057,cz],[.058,.069,.048]);
 puff(charcoal,[cx,.135,cz+.002],[.069,.06,.049]);
 for(const s of [-1,1]){
  const ear=mesh(new T.ConeGeometry(.026,.065,3),charcoal,[cx+s*.045,.192,cz],[1,1,.7]);ear.rotation.z=-s*.18;
  const inner=mesh(new T.ConeGeometry(.013,.035,3),pink,[cx+s*.045,.193,cz+.015],[1,1,.28]);inner.rotation.z=-s*.18;
  puff(charcoal,[cx+s*.034,.013,cz+.035],[.024,.018,.025]);
  puff(eye,[cx+s*.024,.142,cz+.045],[.011,.014,.004]);
  puff(charcoal,[cx+s*.024,.142,cz+.05],[.0025,.009,.0015]);
  puff(white,[cx+s*.027,.148,cz+.052],[.0024,.0024,.001]);
  puff(mint,[cx+s*.067,.139,cz],[.012,.024,.02]);
  for(const offset of [-1,1])curve([[cx+s*.021,.115+offset*.004,cz+.051],[cx+s*.045,.114+offset*.008,cz+.052],[cx+s*.066,.113+offset*.01,cz+.045]],.0013,white);
 }
 puff(pink,[cx,.126,cz+.052],[.006,.004,.003]);
 curve([[cx-.065,.139,cz],[cx-.059,.19,cz],[cx,.205,cz],[cx+.059,.19,cz],[cx+.065,.139,cz]],.006,mint);
 curve([[cx-.038,.03,cz-.015],[cx-.082,.037,cz-.008],[cx-.096,.07,cz+.018],[cx-.084,.085,cz+.038]],.013,charcoal);
 // A rounded sugar biscuit, with a crisp, unsquashed 600 printed on its face.
 const shape=new T.Shape();const w=.218,h=.148,r=.042;
 shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
 mesh(new T.ExtrudeGeometry(shape,{depth:.014,bevelEnabled:true,bevelSize:.007,bevelThickness:.006,bevelSegments:3,steps:1,curveSegments:12}),mint,[.072,.278,-.084]);
 for(const sx of [-.005,.15])mesh(new T.CylinderGeometry(.003,.003,.22,8),gold,[sx,.13,-.08]);
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=384;const c=canvas.getContext('2d');c.fillStyle='#63483b';c.textAlign='center';c.textBaseline='middle';c.font='800 244px system-ui, sans-serif';c.fillText('600',384,190);
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 const label=mesh(new T.PlaneGeometry(.183,.091),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}),[.072,.278,-.061]);label.name='600 sugar topper';
 // A pair of sugar eighth notes and piped pastel flowers, not an extra backdrop.
 for(const [nx,nz,color] of [[.18,.095,pink],[-.18,-.11,gold]]){
  puff(color,[nx,.017,nz],[.025,.01,.018]);mesh(new T.CylinderGeometry(.0035,.0035,.085,8),color,[nx+.018,.055,nz]);curve([[nx+.018,.096,nz],[nx+.038,.083,nz],[nx+.037,.064,nz]],.004,color);
 }
 for(const [fx,fz] of [[.19,-.10],[-.19,-.025],[.04,.205]]){
  for(let j=0;j<5;j++){const a=j*Math.PI*2/5;puff(pink,[fx+Math.cos(a)*.016,.01,fz+Math.sin(a)*.016],[.016,.01,.016]);}puff(gold,[fx,.019,fz],[.008,.007,.008]);
 }
 const band=mesh(new T.CylinderGeometry(.2585,.2585,.037,64,1,true),mint,[0,-.179,0]);band.name='Mint cake ribbon';
 // Batch sugar meshes by material. Only the printed topper retains its own draw call.
 decor.updateMatrixWorld(true);const bins=new Map();
 for(const o of [...decor.children]){if(o===label)continue;const g=o.geometry.clone();g.applyMatrix4(o.matrix);const key=o.material.uuid;if(!bins.has(key))bins.set(key,{m:o.material,gs:[]});bins.get(key).gs.push(g.index?g.toNonIndexed():g);decor.remove(o);o.geometry.dispose();}
 for(const {m,gs} of bins.values()){const o=new T.Mesh(mergeGeometries(gs),m);o.castShadow=true;o.receiveShadow=true;decor.add(o);gs.forEach(g=>g.dispose());}
 sphere.dispose();const original=cream.color.clone(),final=new T.Color('#f5d1b6');
 return {decor,reveal(t){decor.visible=t>0;decor.scale.setScalar(.92+.08*t);cream.color.copy(original).lerp(final,t);fruit.visible=t===0;},reset(){decor.visible=false;decor.scale.setScalar(1);cream.color.copy(original);fruit.visible=true;}};
}
