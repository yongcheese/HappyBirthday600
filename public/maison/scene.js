import * as T from 'three';
import { GLTFLoader } from '../birthday-3d/vendor/GLTFLoader.js';
import { HDRLoader } from '../birthday-3d/vendor/HDRLoader.js';
import { mergeGeometries } from '../birthday-3d/vendor/BufferGeometryUtils.js';
import { galleryPhotos } from './content.js?v=20261013-film03';
import {createCafeShell} from './cafe-shell.js?v=20261013-film03';
const PI=Math.PI;
let seed=912;const rnd=()=>((seed=Math.imul(seed,1664525)+1013904223|0)>>>0)/4294967296;
export async function buildScene(scene,renderer,invalidate){
 const root=new T.Group();root.name='六百的生日展 | 花園與展廳';scene.add(root);
 const mats={};const mat=(name,color,r=.8,m=0)=>mats[name]??=new T.MeshStandardMaterial({name,color,roughness:r,metalness:m});
 const ivory=mat('Limestone','#d1c5a7'),linen=mat('Linen','#d8cbb2'),green=mat('Green enamel','#254236',.38,.45),brass=mat('Antique brass','#ad8d53',.32,.7),wood=mat('Oak','#bb936e'),soil=mat('Soil','#565740'),red=mat('Rose woven rug','#cb8c79',.96),leafmat=mat('Olive foliage','#61704e');
 const permanent=new T.Group();permanent.name='Static furnishings';root.add(permanent);
 function add(g,m,p=[0,0,0],name='Detail',parent=permanent){const o=new T.Mesh(g,m);o.name=name;o.position.set(...p);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 const box=(p,s,m,name='Joinery')=>add(new T.BoxGeometry(...s),m,p,name);
 const cyl=(p,r,h,m,r2=r)=>add(new T.CylinderGeometry(r,r2,h,20),m,p);
 function rounded(p,w,d,h,r,m){const s=new T.Shape();s.moveTo(-w/2+r,-d/2);s.lineTo(w/2-r,-d/2);s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);s.lineTo(w/2,d/2-r);s.quadraticCurveTo(w/2,d/2,w/2-r,d/2);s.lineTo(-w/2+r,d/2);s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);s.lineTo(-w/2,-d/2+r);s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);const g=new T.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.012,bevelThickness:.01,curveSegments:8});g.rotateX(-PI/2);return add(g,m,p);}
 function tube(points,r,m){return add(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),Math.max(5,points.length*3),r,6,false),m);}
 function canvasTexture(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return t;}
 const plaster=canvasTexture(256,256,(c,w,h)=>{c.fillStyle='#f3edde';c.fillRect(0,0,w,h);for(let i=0;i<13000;i++){c.fillStyle=i%2?'#8d806008':'#ffffff20';c.fillRect(rnd()*w,rnd()*h,1,1)}});plaster.wrapS=plaster.wrapT=T.RepeatWrapping;plaster.repeat.set(3,3);ivory.map=plaster;
 const paving=canvasTexture(1024,1024,(c,w,h)=>{c.fillStyle='#c7bfab';c.fillRect(0,0,w,h);for(let y=0;y<8;y++)for(let x=-1;x<5;x++){const shade=Math.floor(185+rnd()*18);c.fillStyle=`rgb(${shade+17},${shade+10},${shade-6})`;c.fillRect(x*256+(y%2)*128+2,y*128+2,252,124)}for(let i=0;i<60000;i++){c.fillStyle=i%2?'#ffffff12':'#463d3110';c.fillRect(rnd()*w,rnd()*h,1,1)}});paving.wrapS=paving.wrapT=T.RepeatWrapping;paving.repeat.set(3,5);const stoneFloor=mat('Limestone paving','#fff');stoneFloor.map=paving;
 box([0,-.24,0],[150,.2,150],mat('Garden ground','#73775d'));const gardenPath=rounded([0,-.065,15],5.5,20,.1,.65,stoneFloor);const pathUV=gardenPath.geometry.attributes.uv;for(let i=0;i<pathUV.count;i++)pathUV.setXY(i,(pathUV.getX(i)+2.75)/5.5,(pathUV.getY(i)+10)/20);
 for(const side of [-1,1]){rounded([side*3,0,15],.18,20,.16,.085,ivory);rounded([side*6,-.16,15],5.7,19,.12,.9,soil);rounded([side*6.8,-.13,0],2,17,.14,.75,soil)}
 createCafeShell({add,box,rounded,mat,canvasTexture,plaster,paving});
 const letter=await new GLTFLoader().loadAsync('./assets/letter.glb');
 root.add(letter.scene);letter.scene.traverse(o=>{if(o.isMesh){if(/BirthdayEnvelope_(Footer|WaxHeart)/.test(o.name))o.visible=false;o.castShadow=true;o.receiveShadow=true;if(/WaxSeal/.test(o.name)){o.material=o.material.clone();o.material.color.set('#872b36');o.material.metalness=.15;o.material.roughness=.55}}});
 // Keep the original letter mechanism, with a newly designed curved writing table.
 rounded([0,.77,-4.7],2.5,1.15,.07,.3,wood);
 for(const x of [-.76,.76]){cyl([x,.39,-4.7],.18,.78,wood,.23);cyl([x,.05,-4.7],.31,.06,brass)}
 const runner=rounded([0,.063,.8],1.85,11.4,.018,.32,red);runner.name='Soft rose walkway rug';
 // Exhibition walls are set inside the glazed shell, with oak dados and linen panels.
 const pics=await Promise.all(galleryPhotos.map(item=>Promise.all((item.images||[item]).map(photo=>new T.TextureLoader().loadAsync(photo.image)))));pics.flat().forEach(t=>{t.colorSpace=T.SRGBColorSpace;t.anisotropy=4});
 // Match pixel and world aspect ratios so Chinese glyphs remain square.
 function textPanel(text,w,h,color='#354733',bg=null,size=36){
  const width=1024,height=Math.round(width*h/w);
  const t=canvasTexture(width,height,(c,pw,ph)=>{
   if(bg){c.fillStyle=bg;c.fillRect(0,0,pw,ph)}
   c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';
   const font=px=>`600 ${px}px "Songti TC", "Noto Serif TC", serif`;
   let fontSize=Math.min(size,ph*.78);c.font=font(fontSize);
   fontSize*=Math.min(1,pw*.92/c.measureText(text).width);c.font=font(fontSize);
   c.fillText(text,pw/2,ph/2);
  });
  const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:t,transparent:!bg,depthWrite:false}));
  mesh.name='Text: '+text;return mesh;
 }

 // Birthday bunting: rounded fabric hems keep the entrance soft and festive.
 const birthdayColors=['#e8a08d','#ebcd83','#91b9ca','#e6b9bd'];
 const cord=Array.from({length:33},(_,i)=>{const x=-5.1+i*10.2/32;return [x,3.87+.006*x*x,6.61]});tube(cord,.012,brass);
 for(let i=0;i<15;i++){
  const x=-4.8+i*9.6/14,y=3.87+.006*x*x;
  const shape=new T.Shape();shape.moveTo(-.15,0);shape.lineTo(.15,0);shape.lineTo(.15,-.19);shape.quadraticCurveTo(.15,-.36,0,-.36);shape.quadraticCurveTo(-.15,-.36,-.15,-.19);shape.closePath();
  const material=mat('Birthday fabric '+i%4,birthdayColors[i%4]);material.side=T.DoubleSide;
  const flag=add(new T.ShapeGeometry(shape,8),material,[x,y,6.62],'Birthday scalloped ribbon');flag.rotation.z=Math.atan(.012*x);
 }
 const birthdaySign=textPanel('六百的生日派對',2.65,.36,'#70432f',null,112);birthdaySign.position.set(3.13,3.48,6.705);root.add(birthdaySign);
 for(const [index,item] of galleryPhotos.entries()){
  const {side,z}=item,x=side*3.2;box([x,1.53,z],[.15,3.05,2.65],ivory,'Linen exhibition panel');
  box([x-side*.092,.38,z],[.07,.7,2.66],wood);
  box([x-side*.14,1.94,z],[.065,1.49,1.99],brass);
  box([x-side*.185,1.94,z],[.045,1.40,1.90],linen);
  // Separate editable image planes keep both artists uncropped in one camera stop.
  const artwork=new T.Group();artwork.rotation.y=-side*PI/2;artwork.position.set(x-side*.212,1.94,z);artwork.name='Memory print '+item.id;root.add(artwork);
  for(const [photoIndex,texture] of pics[index].entries()){
   const paired=!!item.images,aspect=texture.image.width/texture.image.height,maxW=paired?.76:1.61,maxH=paired?.84:1.1;
   const print=new T.Mesh(new T.PlaneGeometry(Math.min(maxW,maxH*aspect),Math.min(maxH,maxW/aspect)),new T.MeshBasicMaterial({map:texture,toneMapped:false}));
   print.position.set(paired?(photoIndex===0?-.43:.43):0,paired?.08:0,0);artwork.add(print);
   if(paired){print.name=item.images[photoIndex].name;const label=textPanel(print.name,.76,.14,'#354733',null,78);label.position.set(print.position.x,-.45,.001);artwork.add(label)}
  }
  const caption=textPanel(`0${index+1}   /   ${item.caption}`,1.3,.22,'#354733','#ede5d1',48);caption.rotation.y=artwork.rotation.y;caption.position.set(x-side*.15,.95,z);root.add(caption);
  box([x-side*.3,2.92,z],[.1,.07,.8],brass);
  const bulb=mat('Warm fixture','#fff0bb',.5);bulb.emissive=new T.Color('#ffd99c');bulb.emissiveIntensity=.45;box([x-side*.31,2.87,z],[.07,.026,.75],bulb);
 }
 // Birthday corner: a casual banner and one loose balloon bouquet.
 const endTitle=textPanel('六百，生日快樂！',3.2,.5,'#a3523d',null,96);endTitle.position.set(0,2.6,-7.12);root.add(endTitle);
 const garland=Array.from({length:25},(_,i)=>{const x=-2.6+i*5.2/24;return [x,3.12+.05*x*x,-6.97]});tube(garland,.01,linen);
 for(let i=0;i<11;i++){
  const x=-2.4+i*.48,y=3.12+.05*x*x;
  const flagShape=new T.Shape();flagShape.moveTo(-.13,0);flagShape.lineTo(.13,0);flagShape.lineTo(.13,-.19);flagShape.quadraticCurveTo(0,-.31,-.13,-.19);flagShape.closePath();
  const flagMat=mat('Birthday fabric '+i%4,birthdayColors[i%4]);flagMat.side=T.DoubleSide;
  const flag=add(new T.ShapeGeometry(flagShape),flagMat,[x,y,-6.96],'Indoor birthday pennant');flag.rotation.z=Math.atan(.1*x);
 }
 function balloons(x,z,lower=0){
  const colors=['#e8a08d','#94c1d4','#eccd7e','#e7b6be','#c5d5c5'];
  for(const [i,dx,baseY,dz] of [[0,-.3,2.35,0],[1,.12,2.65,-.1],[2,-.25,2.96,-.04],[3,.32,2.18,.04],[4,.34,3.12,-.14]]){
   const y=baseY-lower;
   const latex=mat('Party balloon '+i,colors[i],.38,.04);
   const balloon=add(new T.SphereGeometry(.27,24,16),latex,[x+dx,y,z+dz],'Helium balloon');balloon.scale.set(1,1.2,1);
   add(new T.ConeGeometry(.028,.05,10),latex,[x+dx,y-.335,z+dz],'Balloon knot');
   tube([[x+dx,y-.35,z+dz],[x+dx*.8,(y+.2)/2,z+.03],[x,.2,z+.06]],.005,linen);
  }
  rounded([x,.07,z+.06],.15,.15,.11,.035,mat('Balloon weight','#b77759'));
 }
 balloons(-.8,-6.14,1.25);
 balloons(3.45,7.4,.75);
 // A few gifts sit on the floor; the letter stays within easy reach on the table.
 const ribbon=mat('Gift ribbon','#fff2d5');
 for(const [x,z,w,d,h,color] of [[1.95,-6.1,.55,.48,.36,'#9abec8'],[2.03,-6.08,.39,.36,.3,'#e7b398']]){
  const base=h===.3?.43:.07;
  const paper=mat('Gift paper '+color,color);
  rounded([x,base,z],w,d,h,.045,paper);rounded([x,base+h,z],w+.025,d+.025,.025,.035,paper);
  box([x,base+h+.029,z],[.06,.004,d+.027],ribbon);box([x,base+h+.032,z],[w+.027,.004,.06],ribbon);
  for(const side of [-1,1]){const bow=add(new T.TorusGeometry(.063,.01,6,16),ribbon,[x+side*.054,base+h+.07,z],'Gift bow');bow.scale.set(1,.55,1);bow.rotation.x=PI/2}
 }
 // Intimate seating corners.
 for(const side of [-1,1]){
  rounded([side*4.3,.43,-.2],1.05,1.9,.14,.16,linen);
  rounded([side*4.66,.64,-.2],.22,1.9,.64,.1,linen);
  for(const z of [-.87,.47])for(const x of [side*3.98,side*4.62])cyl([x,.23,z],.026,.4,brass);
  rounded([side*4.22,.59,-.45],.65,.60,.13,.15,mat('Sage velvet','#7d8b6a'));
 }
 // Soft paper pendants replace the rows of upright candle fixtures.
 const pendant=mat('Paper pendant','#fff0d0',.9);pendant.emissive=new T.Color('#ffe1ac');pendant.emissiveIntensity=.2;
 for(const [x,y,z,r] of [[-.65,3.65,3.2,.34],[.7,3.8,-.9,.4],[-.35,3.65,-4.8,.3]]){
  tube([[x,y,z],[x,6.12-Math.abs(x)*.363,z]],.009,wood);
  const shade=add(new T.SphereGeometry(r,24,16),pendant,[x,y,z],'Paper pendant');shade.scale.y=.82;
 }
 // Casual place settings, not a ceremonial vase arrangement.
 const porcelain=mat('Peach porcelain','#e6a991',.4);
 for(const [x,z] of [[-.72,-4.93],[-.85,-4.66]]){
  cyl([x,.862,z],.135,.018,porcelain);
  const rim=add(new T.TorusGeometry(.126,.008,6,32),linen,[x,.875,z]);rim.rotation.x=PI/2;
 }
 rounded([-.63,.857,-4.67],.22,.18,.012,.02,mat('Blue linen napkin','#9bbac5'));
 box([-.91,.864,-4.42],[.026,.015,.21],wood,'Dessert fork handle');
 box([-.91,.867,-4.55],[.04,.006,.07],brass,'Dessert fork');
 // A small patisserie cake on a porcelain stand beside the letter.
 // Fixed geometry joins the existing material batches; no extra render loop/lights.
 const cakeX=.62,cakeZ=-4.91;
 const cream=mat('Vanilla buttercream','#fff0d4',.72),icing=mat('Piped cream','#fff7e5',.6),berry=mat('Strawberry glaze','#b94742',.38),sage=mat('Birthday candle coral','#d98468',.52);
 const cakePart=(g,m,x,y,z,name)=>add(g,m,[cakeX+x,y,cakeZ+z],name);
 cakePart(new T.CylinderGeometry(.21,.23,.035,48),linen,0,.865,0,'Cake stand foot');
 cakePart(new T.CylinderGeometry(.055,.075,.11,24),brass,0,.93,0,'Cake stand stem');
 cakePart(new T.CylinderGeometry(.32,.30,.03,64),icing,0,.994,0,'Porcelain cake platter');
 const platterRim=cakePart(new T.TorusGeometry(.306,.009,8,64),brass,0,1.01,0,'Gold platter rim');platterRim.rotation.x=PI/2;
 const cakeProfile=[[0,0],[.22,0],[.25,.012],[.257,.03],[.257,.24],[.25,.262],[.22,.27],[0,.27]].map(p=>new T.Vector2(...p));
 cakePart(new T.LatheGeometry(cakeProfile,64),cream,0,1.01,0,'Rounded buttercream cake');
 for(const y of [1.027,1.272])for(let i=0;i<32;i++){
  const a=i*PI*2/32,puff=cakePart(new T.SphereGeometry(.023,10,7),icing,Math.cos(a)*.244,y,Math.sin(a)*.244,'Piped frosting shell');puff.scale.set(1,.72,1);
 }
 for(let i=0;i<5;i++){
  const a=i*PI*2/5+.35,x=Math.cos(a)*.177,z=Math.sin(a)*.177;
  const fruitProfile=[[0,0],[.031,.004],[.039,.022],[.031,.052],[.016,.077],[0,.085]].map(p=>new T.Vector2(...p));
  cakePart(new T.LatheGeometry(fruitProfile,16),berry,x,1.28,z,'Strawberry');
  for(let j=0;j<3;j++){const angle=j*PI*2/3,leaf=cakePart(new T.SphereGeometry(.023,8,5),leafmat,x+Math.cos(angle)*.013,1.285,z+Math.sin(angle)*.013,'Strawberry leaf');leaf.scale.set(1,.15,.45);leaf.rotation.y=-angle}
 }
 const flames=new T.Group();flames.name='Birthday candle flames';flames.visible=false;root.add(flames);
 const flameMat=new T.MeshBasicMaterial({color:'#ffd784'});
 for(const [x,z,h] of [[-.075,.005,.115],[.075,.005,.115],[0,-.065,.15]]){
  cakePart(new T.CylinderGeometry(.013,.013,h,12),sage,x,1.28+h/2,z,'Birthday candle');
  cakePart(new T.CylinderGeometry(.003,.003,.022,6),wood,x,1.28+h+.008,z,'Candle wick');
  const flame=new T.Mesh(new T.SphereGeometry(.019,10,8),flameMat);flame.position.set(cakeX+x,1.28+h+.036,cakeZ+z);flame.scale.set(.72,1.65,.72);flame.userData.baseScale=flame.scale.clone();flames.add(flame);
 }
 // Organic foliage: shared instanced leaf meshes, never sphere-shaped tree crowns.
 const leaves=[];const petals=[];const leafColors=['#65764f','#818d62','#97a173','#72835a'];
 function tree(x,z,h=5){const trunk=mat('Olive bark','#68614d');tube([[x,0,z],[x+.1,h*.3,z-.1],[x-.1,h*.72,z+.15]],.095,trunk);
  for(let i=0;i<16;i++){const a=i*2.4,rad=.65+rnd()*.65,by=h*(.50+rnd()*.4),ex=x+Math.cos(a)*rad,ez=z+Math.sin(a)*rad; tube([[x,h*.3,z],[x+Math.cos(a)*rad*.4,by-.5,z+Math.sin(a)*rad*.4],[ex,by,ez]],.025,trunk);for(let j=0;j<58;j++){const theta=rnd()*PI*2,u=rnd()*2-1,rr=Math.cbrt(rnd())*.72;leaves.push([ex+Math.sqrt(1-u*u)*Math.cos(theta)*rr,by+u*rr*.65,ez+Math.sqrt(1-u*u)*Math.sin(theta)*rr,.08+rnd()*.05])}}
 }
 for(const side of [-1,1])for(const [x,z,h] of [[8.5,8,5.8],[10.2,0,6.5],[9,-8,6.3],[11,18,6.5],[15,5,7],[18,-10,8]])tree(side*x,z,h);
 function shrub(x,z,r=.6){for(let i=0;i<90;i++){const a=rnd()*PI*2,rr=Math.sqrt(rnd())*r;leaves.push([x+Math.cos(a)*rr,.15+rnd()*.5,z+Math.sin(a)*rr,.07+rnd()*.05])}}
 for(const side of [-1,1]){for(let z=8;z<26;z+=.65){shrub(side*3.5,z,.5);shrub(side*7.8,z,.75)}for(const z of [7.9,11.6,15.3,19])for(let j=0;j<40;j++){const x=side*(4.3+rnd()*1.4),zz=z+(rnd()-.5)*2;const y=.24+rnd()*.30;tube([[x,.05,zz],[x,y,zz]],.006,leafmat);petals.push([x,y,zz,.055+rnd()*.04]);}}
 // Low terracotta pots cluster on one side of the door.
 for(const [x,z,r,h] of [[-2.65,7.55,.28,.42],[-3.25,7.88,.22,.3]]){
  cyl([x,h/2,z],r,h,mat('Terracotta planters','#c3896c'),r*.72);
  for(let i=0;i<100;i++){const a=rnd()*PI*2,rr=Math.sqrt(rnd())*r*1.45;leaves.push([x+Math.cos(a)*rr,h+rnd()*.48,z+Math.sin(a)*rr,.1]);}
 }
 const leafGeo=new T.BufferGeometry(),lv=[],li=[];for(let i=0;i<=4;i++){const t=i/4,w=Math.pow(Math.sin(t*PI),.65)*.43;lv.push(-w,Math.sin(t*PI)*.10,t,0,Math.sin(t*PI)*.18,t,w,Math.sin(t*PI)*.10,t);if(i<4)for(let j=0;j<2;j++){const a=i*3+j;li.push(a,a+3,a+1,a+1,a+3,a+4)}}leafGeo.setAttribute('position',new T.Float32BufferAttribute(lv,3));leafGeo.setIndex(li);leafGeo.computeVertexNormals();const instancedLeafMaterial=leafmat.clone();instancedLeafMaterial.side=T.DoubleSide;instancedLeafMaterial.color.set('#ffffff');instancedLeafMaterial.roughness=.72;
 // Spatial batches preserve every leaf, but skip entire off-screen garden sections.
 const dummy=new T.Object3D(),leafBatches=new Map();
 leaves.forEach((p,i)=>{dummy.position.set(...p.slice(0,3));dummy.scale.set(p[3],p[3],p[3]*1.9);dummy.rotation.set(rnd()*PI*2,rnd()*PI*2,rnd()*PI*2);dummy.updateMatrix();const key=`${Math.floor(p[0]/4)},${Math.floor(p[2]/4)}`;if(!leafBatches.has(key))leafBatches.set(key,[]);leafBatches.get(key).push({matrix:dummy.matrix.clone(),color:leafColors[i%4]})});
 for(const [key,items] of leafBatches){const mesh=new T.InstancedMesh(leafGeo,instancedLeafMaterial,items.length);items.forEach((item,i)=>{mesh.setMatrixAt(i,item.matrix);mesh.setColorAt(i,new T.Color(item.color))});mesh.castShadow=mesh.receiveShadow=true;mesh.name='Olive leaves '+key;mesh.computeBoundingSphere();root.add(mesh)}
 const fv=[],fi=[];for(let j=0;j<5;j++){const a=j*PI*.4,base=fv.length/3;fv.push(0,.05,0,Math.cos(a-.48)*.65,.22,Math.sin(a-.48)*.65,Math.cos(a)*1.1,.12,Math.sin(a)*1.1,Math.cos(a+.48)*.65,.22,Math.sin(a+.48)*.65);fi.push(base,base+1,base+2,base,base+2,base+3)}const flowerGeo=new T.BufferGeometry();flowerGeo.setAttribute('position',new T.Float32BufferAttribute(fv,3));flowerGeo.setIndex(fi);flowerGeo.computeVertexNormals();const blooms=new T.InstancedMesh(flowerGeo,mat('Garden blossom','#ded1cf'),petals.length);petals.forEach((p,i)=>{dummy.position.set(...p.slice(0,3));dummy.scale.set(p[3],p[3]*.9,p[3]);dummy.rotation.set(rnd()*3,rnd()*3,rnd()*3);dummy.updateMatrix();blooms.setMatrixAt(i,dummy.matrix);blooms.setColorAt(i,new T.Color(i%3?'#efb18b':'#e7bc70'))});blooms.material.side=T.DoubleSide;root.add(blooms);
 // Consolidate opaque fixed details by material. Interactive letter remains separate.
 permanent.updateMatrixWorld(true);const staticBins=new Map();for(const o of [...permanent.children]){if(!o.isMesh||o.material.transparent)continue;const g=o.geometry.clone().applyMatrix4(o.matrixWorld);for(const k of Object.keys(g.attributes))if(!['position','normal','uv'].includes(k))g.deleteAttribute(k);if(!g.attributes.uv)g.setAttribute('uv',new T.BufferAttribute(new Float32Array(g.attributes.position.count*2),2));const key=o.material.uuid;if(!staticBins.has(key))staticBins.set(key,{m:o.material,gs:[],shadow:false});const b=staticBins.get(key);b.gs.push(g.index?g.toNonIndexed():g);b.shadow ||= o.castShadow;permanent.remove(o);o.geometry.dispose()}
 for(const {m,gs,shadow} of staticBins.values()){const o=new T.Mesh(mergeGeometries(gs),m);o.name=m.name;o.castShadow=shadow;o.receiveShadow=true;root.add(o);gs.forEach(g=>g.dispose())}
 // A single directional shadow map; practicals are inexpensive unshadowed lights.
 scene.add(new T.HemisphereLight('#f0f8ff','#a19b80',1.5));const sun=new T.DirectionalLight('#fff2da',1.8);sun.position.set(-14,19,16);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-18,right:18,top:20,bottom:-18,near:1,far:65});sun.shadow.normalBias=.03;sun.shadow.bias=-.0001;scene.add(sun);
 for(const z of [2,-4]){const p=new T.PointLight('#ffd299',6,10,2);p.position.set(0,3.2,z);scene.add(p)}
 const sky=canvasTexture(16,256,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#a9d2e4');g.addColorStop(.55,'#e0edf0');g.addColorStop(1,'#f5eee0');c.fillStyle=g;c.fillRect(0,0,w,h)});scene.background=sky;scene.fog=new T.Fog('#e0edf0',30,95);
 // Environment is optional: core interactive scene is already ready if it fails.
 new HDRLoader().load('../birthday-3d/assets/tuscan/garden-sunset.hdr',t=>{t.mapping=T.EquirectangularReflectionMapping;scene.environment=t;scene.environmentIntensity=.28;scene.environmentRotation.y=2.2;invalidate();},undefined,()=>{});
 renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
 return {letter:letter.scene,root,cake:{flames,center:[cakeX,1.24,cakeZ]}};
}
