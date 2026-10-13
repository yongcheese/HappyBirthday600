import * as T from 'three';
import {softBox} from './soft-geometry.js?v=20261014-letter01';
// The gallery footprint and doorway stay aligned with the existing camera path.
// Every timber, pane, roof panel and patio furnishing remains editable here.
export function createCafeShell({add,box,rounded,mat,canvasTexture,plaster,paving}){
 const plasterMat=mat('Cafe warm plaster','#f0e5d1',.9);plasterMat.map=plaster;
 const oak=mat('Cafe honey oak','#c79c73',.78),roof=mat('Strawberry cottage roof','#d58498',.8,.02),edge=mat('Cafe roof edge','#f6e7d0',.7);
 const glass=new T.MeshStandardMaterial({name:'Cafe clear glazing',color:'#cce2e3',transparent:true,opacity:.12,roughness:.18,metalness:.08,depthWrite:false,side:T.DoubleSide});
 const timber=(p,s,m=oak,n='Cafe timber')=>add(softBox(...s,.025),m,p,n);
 const pane=(p,s)=>{const o=box(p,s,glass,'Cafe glazing');o.castShadow=false;return o};
 const grain=canvasTexture(512,256,(c,w,h)=>{c.fillStyle='#e2bd91';c.fillRect(0,0,w,h);for(let i=0;i<90;i++){c.strokeStyle=i%3?'#80522e0d':'#fff8e314';c.beginPath();const y=i*h/90;c.moveTo(0,y);c.bezierCurveTo(w*.3,y+2,w*.7,y-2,w,y);c.stroke()}});oak.map=grain;
 const floor=mat('Cafe terrazzo','#eee1cd',.8);floor.map=paving;
 rounded([0,-.15,-.4],11.4,14.2,.18,.15,plasterMat);
 box([0,.035,-.4],[10.8,.06,13.6],floor,'Gallery floor');
 timber([0,2.04,-7.35],[11.2,4.08,.22],plasterMat,'Cafe rear wall');
 // A large strawberry-pink cottage roof changes the silhouette at first glance.
 const halfSpan=5.92,rise=2.15,eave=4.12,ridge=eave+rise,slope=Math.atan2(rise,halfSpan),slopeWidth=Math.hypot(halfSpan,rise);
 for(const side of [-1,1]){
  const roofPanel=add(softBox(slopeWidth+.18,.21,15.28,.11),roof,[side*halfSpan/2,eave+rise/2,-.25],'Pink pitched roof');roofPanel.rotation.z=-side*slope;
  for(const z of [7.43,-7.93]){const fascia=add(softBox(slopeWidth+.22,.22,.15,.07),edge,[side*halfSpan/2,eave+rise/2-.025,z],'Cream cottage eave');fascia.rotation.z=-side*slope}
  timber([side*5.94,eave-.015,-.25],[.16,.2,15.26],edge,'Soft outer eave');
  for(let x=.38;x<5.9;x+=.62)box([side*x,ridge-x*rise/halfSpan+.125,-.25],[.025,.022,15.13],roof,'Roof panel seam');
 }
 const ridgeCap=add(new T.CylinderGeometry(.105,.105,15.3,16),roof,[0,ridge+.035,-.25],'Round roof ridge');ridgeCap.rotation.x=Math.PI/2;
 const gable=new T.Shape();gable.moveTo(-5.45,4.04);gable.lineTo(5.45,4.04);gable.lineTo(0,6.02);gable.closePath();
 add(new T.ShapeGeometry(gable),plasterMat,[0,0,6.36],'Cream cottage gable');
 add(new T.ShapeGeometry(gable),plasterMat,[0,0,-7.35],'Rear cottage gable');
 // A circular attic window is the cottage's main front detail.
 const windowBlue=mat('Attic window blue','#a4cbd1',.35);
 const porthole=add(new T.CircleGeometry(.49,48),windowBlue,[0,4.94,6.49],'Round attic window');porthole.castShadow=false;
 const ring=add(new T.TorusGeometry(.51,.065,12,48),edge,[0,4.94,6.5],'Round window cream rim');
 timber([0,4.94,6.55],[.055,.93,.035],edge,'Attic vertical mullion');
 timber([0,4.94,6.55],[.93,.055,.035],edge,'Attic horizontal mullion');
 // Wide rectangular windows and slender timber posts replace masonry arches.
 for(const side of [-1,1]){
  timber([side*5.45,.38,-.4],[.18,.68,13.7],plasterMat,'Low window sill wall');
  for(const z of [6.35,3.65,.95,-1.75,-4.45,-7.15])timber([side*5.45,2.1,z],[.15,4.2,.15]);
  for(const y of [.78,3.68,4.06])timber([side*5.45,y,-.4],[.13,.11,13.6]);
  for(const z of [5,2.3,-.4,-3.1,-5.8])pane([side*5.45,2.22,z],[.018,2.78,2.53]);
 }
 // Left: textured timber wall and a small cafe window. Right: broad clear glass.
 timber([-4.65,2.05,6.35],[1.55,4.05,.18],plasterMat,'Asymmetric plaster pier');
 for(let y=.3;y<3.9;y+=.28)timber([-4.65,y,6.49],[1.47,.20,.065],mat('Cottage peach siding','#e5b7a8'),'Peach cottage siding');
 for(const x of [-3.77,-1.64,1.64,5.4])timber([x,2.02,6.4],[.14,4.04,.18]);
 timber([-2.7,.53,6.39],[2.07,1.02,.14],plasterMat,'Cafe window apron');
 for(const [x,w,base,h] of [[-2.7,2.06,1.1,2.06],[3.52,3.57,.3,2.86]]){
  pane([x,base+h/2,6.4],[w,h,.022]);
  for(const y of [base,base+h])timber([x,y,6.46],[w+.06,.085,.1]);
 }
 timber([3.53,1.74,6.48],[.065,2.9,.09]);
 timber([0,3.51,6.4],[10.8,.54,.2],plasterMat,'Plain cafe lintel');
 pane([0,3.97,6.38],[10.76,.33,.025]);
 // Door leaves are parked open beside the entrance; the camera has 3.1 m clearance.
 for(const side of [-1,1]){
  const x=side*1.69,z=5.78;
  pane([x,1.55,z],[.025,2.91,1.15]);
  for(const y of [.08,3.02])timber([x,y,z],[.085,.085,1.2]);
  for(const dz of [-.59,.59])timber([x,1.55,z+dz],[.085,3.03,.085]);
 }
 // Peach-striped fabric canopy and an oak deck make the threshold domestic.
 const peach=mat('Cafe awning peach','#e5a0a0'),cream=mat('Cafe awning cream','#fff1d4');peach.side=cream.side=T.DoubleSide;
 for(let i=0;i<12;i++){
  const x=-4.0+i*.38;
  const strip=box([x,3.27,7.0],[.383,.028,1.26],i%2?cream:peach,'Striped cafe awning');strip.rotation.x=.13;
  const scallop=new T.Shape();scallop.moveTo(-.192,0);scallop.lineTo(.192,0);scallop.lineTo(.192,-.105);scallop.quadraticCurveTo(.192,-.25,0,-.25);scallop.quadraticCurveTo(-.192,-.25,-.192,-.105);scallop.closePath();
  add(new T.ShapeGeometry(scallop,12),i%2?cream:peach,[x,3.25,7.64],'Scalloped awning hem');
 }
 for(const x of [-4.15,.35]){const bar=box([x,3.23,7.0],[.025,.025,1.36],oak,'Awning support');bar.rotation.x=.13}
 rounded([0,-.07,7.95],12.6,3.7,.12,.28,oak);
 for(let z=6.2;z<9.7;z+=.21)box([0,.052,z],[12.25,.002,.009],mat('Deck joints','#9e7957'),'Deck plank joint');
 // A bench off to one side leaves a clear route into the photo gallery.
 rounded([-3.7,.48,8.38],2.05,.59,.095,.08,oak);
 timber([-3.7,.88,8.13],[2.05,.56,.09],oak,'Patio bench back');
 for(const x of [-4.43,-2.98])for(const z of [8.18,8.58])timber([x,.25,z],[.075,.47,.075]);
 rounded([-3.18,.58,8.38],.49,.43,.09,.055,mat('Patio cushion blue','#92b7c5'));
 // Rounded cream plaque with a small black-cat emblem; text is added by scene.js.
 const blush=mat('Sign blush border','#d9958a',.72),milk=mat('Sign cream face','#fff0d3',.8),ink=mat('Little black cat','#343d3b',.68);
 add(softBox(3.9,.68,.09,.23),blush,[2.85,3.48,6.6],'Rounded birthday sign border');
 add(softBox(3.79,.57,.04,.2),milk,[2.85,3.48,6.665],'Rounded birthday sign face');
 const catBadge=new T.Shape();catBadge.moveTo(-.17,-.02);catBadge.quadraticCurveTo(-.21,.07,-.16,.17);catBadge.lineTo(-.18,.31);catBadge.lineTo(-.065,.23);catBadge.quadraticCurveTo(0,.255,.065,.23);catBadge.lineTo(.18,.31);catBadge.lineTo(.16,.17);catBadge.quadraticCurveTo(.23,.04,.16,-.045);catBadge.quadraticCurveTo(0,-.16,-.17,-.02);catBadge.closePath();
 add(new T.ShapeGeometry(catBadge,16),ink,[1.43,3.405,6.691],'Cat sign emblem');
 for(const x of [1.37,1.49]){const eye=add(new T.SphereGeometry(.018,10,8),milk,[x,3.51,6.705],'Cat emblem eye');eye.scale.z=.3}
 // A little cat ornament sits on the bench, clear of the doorway.
 const cat={position:new T.Vector3(-3.95,.575,8.35)};
 // Use the shared add helper so all solid pieces join the static material batches.
 const catPart=(g,m,p,n)=>add(g,m,[cat.position.x+p[0],cat.position.y+p[1],cat.position.z+p[2]],n);
 const body=catPart(new T.SphereGeometry(.18,20,14),ink,[0,.19,0],'Cat body');body.scale.set(.92,1.15,.85);
 const head=catPart(new T.SphereGeometry(.16,20,14),ink,[0,.43,.035],'Cat head');head.scale.set(1.08,.95,.9);
 for(const x of [-.105,.105]){const ear=catPart(new T.ConeGeometry(.07,.155,3),ink,[x,.584,.018],'Cat ear');ear.rotation.y=Math.PI/6}
 for(const x of [-.06,.06]){const eye=catPart(new T.SphereGeometry(.022,12,8),milk,[x,.447,.17],'Cat eye');eye.scale.set(.85,1,.28);catPart(new T.SphereGeometry(.011,8,6),ink,[x,.447,.177],'Cat pupil')}
 const pink=mat('Cat nose pink','#c99186');const nose=catPart(new T.SphereGeometry(.012,8,6),pink,[0,.4,.178],'Cat nose');
 const tail=catPart(new T.TorusGeometry(.15,.037,8,24,Math.PI*1.45),ink,[.16,.18,-.02],'Curled cat tail');tail.rotation.x=Math.PI/2;tail.rotation.z=-.8;
 // Two low pots of pink and butter-yellow daisies brighten one patio corner.
 const stem=mat('Daisy stems','#7e9c72'),pinkPetal=mat('Daisy pink','#e39da4'),yellowPetal=mat('Daisy yellow','#efd282'),heart=mat('Daisy centre','#c89b48');
 for(const [x,z,r,h] of [[4.75,8.5,.27,.38],[4.12,8.73,.19,.27]]){
  const pot=mat('Peach flower pot','#e3bba7');
  add(new T.CylinderGeometry(r,r*.78,h,32),pot,[x,.06+h/2,z],'Patio flower pot');
  const lip=add(new T.TorusGeometry(r,.025,8,32),milk,[x,.06+h,z],'Cream pot rim');lip.rotation.x=Math.PI/2;
  for(let i=0;i<5;i++){
   const a=i*Math.PI*2/5,fx=x+Math.cos(a)*r*.6,fz=z+Math.sin(a)*r*.6,y=.06+h+.22+(i%2)*.13;
   add(new T.CylinderGeometry(.009,.009,y-h-.06,6),stem,[fx,(y+h+.06)/2,fz],'Daisy stem');
   for(let j=0;j<8;j++){const angle=j*Math.PI/4,petal=add(new T.SphereGeometry(.056,10,7),i%2?pinkPetal:yellowPetal,[fx+Math.cos(angle)*.058,y+Math.sin(angle)*.058,fz+.03],'Daisy petal');petal.scale.set(.75,1,.3);petal.rotation.z=angle-Math.PI/2}
   const center=add(new T.SphereGeometry(.039,12,8),heart,[fx,y,fz+.049],'Daisy centre');center.scale.z=.4;
  }
 }

}
