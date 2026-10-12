import * as T from 'three';
import {buildScene} from './scene.js?v=20261011-apple01';
import {createLetterMotion} from './letter-motion.js?v=20261011-apple01';
import {memories,galleryPhotos} from './content.js?v=20261011-apple01';
import {createTour} from './tour.js?v=20261011-apple01';
import {birthdayVideo} from './delivery-config.js?v=20261011-apple01';
import {createBirthdayVideo} from './birthday-video.js?v=20261011-apple01';
import {createMusic} from './music.js?v=20261011-apple01';
const music=createMusic();
const birthdayFilm=createBirthdayVideo(birthdayVideo,{beforePlay:()=>music.stop()});
const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const state={loaded:false,started:false,playing:false,progress:0,yaw:0,pitch:0,page:0};
let renderer,scene,camera,motion,dirty=true,failed=false,last=performance.now(),pointer=null,phaseBefore='',travelTo=null;
const vector=a=>new T.Vector3(...a);const touchDevice=matchMedia('(pointer: coarse)').matches;const mobile=()=>innerWidth<=600||(touchDevice&&innerWidth<innerHeight);
let tour=createTour({mobile:mobile(),aspect:innerWidth/innerHeight});
const lookQ=new T.Quaternion();
const busy=()=>motion&&motion.phase!=='closed';
const clamp=v=>Math.max(0,Math.min(1,v));const ease=t=>t*t*(3-2*t);
let raf=0,inFrame=false,lastProgressUpdate=0;
function wake(){if(!raf&&!inFrame&&state.loaded&&!document.hidden&&!failed){last=performance.now();raf=requestAnimationFrame(frame)}}
function invalidate(){dirty=true;wake()}
// Bound GPU work on Retina/4K displays without reducing HTML photo/text resolution.
function pixelRatio(){return Math.min(devicePixelRatio,touchDevice?1.35:1.5,Math.sqrt((touchDevice?1600000:2500000)/(innerWidth*innerHeight)))}
function text(id,value){const el=$(id);if(el.textContent!==value)el.textContent=value}
function hidden(id,value){const el=$(id);if(el.hidden!==value)el.hidden=value}

function fail(e){failed=true;state.playing=false;$('loading').hidden=true;$('error').hidden=false;$('errorDetail').textContent=e?.message||'請重新載入頁面。';console.error(e)}
function cameraPose(){const pose=tour.sample(state.progress);camera.position.copy(pose.position);camera.quaternion.copy(pose.quaternion);camera.fov=pose.fov;
 lookQ.setFromEuler(new T.Euler(state.pitch,state.yaw,0,'YXZ'));camera.quaternion.multiply(lookQ);
 camera.setViewOffset(innerWidth,innerHeight,mobile()?0:-innerWidth*.16*pose.opening,mobile()?innerHeight*.105*pose.opening:0,innerWidth,innerHeight);camera.updateProjectionMatrix();camera.updateMatrixWorld();
}
function updateUI(){const p=state.progress,view=tour.sample(p);music.update(state.started&&view.stage!=='garden',busy()||view.stage==='letter');const now=performance.now();if(now-lastProgressUpdate>=100||!state.playing){$('progress').value=Math.round(p*1000);lastProgressUpdate=now;}
 text('step',view.stage==='garden'?'01 / 花園':view.stage==='letter'?'03 / 生日祝福':view.photo>=0?`02 / 照片 ${String(view.photo+1).padStart(2,'0')} · 06`:'02 / 看照片');
 text('play',state.playing?'Ⅱ':'▷');const label=state.playing?'暫停行走':'繼續行走';if($('play').getAttribute('aria-label')!==label)$('play').setAttribute('aria-label',label);
 text('chapter',!state.started||busy()||view.stage==='letter'?'':view.stage==='garden'?'先看看照片吧。':view.photo>=0?galleryPhotos[view.photo].subtitle || '':'');
 hidden('controls',!state.started||busy()||!$('ending').hidden||p>=.999);
 hidden('envelope',!state.started||p<.97||busy()||!$('ending').hidden);hidden('letterPrelude',$('envelope').hidden);
}
function setProgress(p){state.progress=clamp(p);if(state.progress===1)state.playing=false;state.yaw=state.pitch=0;invalidate();updateUI()}
function begin(){if(!state.loaded)return;prepareMemories();music.prepare();state.started=true;state.playing=!reduced;document.body.classList.add('started');$('intro').classList.add('out');$('intro').inert=true;$('controls').hidden=false;updateUI();wake()}
function reset(){document.body.classList.remove('reading-letter','letter-finished');birthdayFilm.reset();music.reset();motion?.reset();state.started=state.playing=false;travelTo=null;$('ending').hidden=true;$('intro').classList.remove('out');$('intro').inert=false;document.body.classList.remove('started');$('controls').hidden=true;setProgress(0);$('start').focus({preventScroll:true})}
function openLetter(){if(!motion||busy())return;state.playing=false;travelTo=null;setProgress(1);cameraPose();$('controls').hidden=true;$('envelope').hidden=true;$('letterPrelude').hidden=true;$('chapter').textContent='';document.body.classList.remove('letter-finished');document.body.classList.add('reading-letter');motion.open();music.update(true,true);$('book').setAttribute('aria-modal','true');$('world').inert=true;document.querySelector('header').inert=true;invalidate()}
function finish(){motion?.finish();invalidate()}
function showPage(i){state.page=i;const m=memories[i];$('memory').src=m.image;$('memory').alt=m.alt;$('photoCaption').textContent=m.caption;$('pageLabel').textContent=`回憶 ${String(i+1).padStart(2,'0')}  /  給六百`;$('pageTitle').textContent=m.title;$('pageText').textContent=m.text;$('pageText').style.whiteSpace='pre-line';$('pageNumber').textContent=`${String(i+1).padStart(2,'0')}  /  ${String(memories.length).padStart(2,'0')}`;$('prev').disabled=i===0;$('next').textContent=i===memories.length-1?'✓':'→';$('next').setAttribute('aria-label',i===memories.length-1?'收好信件':'下一頁');$('swipeHint').textContent=i===memories.length-1?'再向左滑就能收好信':'左右滑動翻頁';const body=$('book').querySelector('.book-body');body.classList.remove('arrived');void body.offsetWidth;body.classList.add('arrived')}
function turn(i){if(motion?.phase!=='reading'||i<0)return;if(i>=memories.length)finish();else {motion.extract(i);wake()}}
$('start').onclick=begin;$('restart').onclick=reset;$('homeAgain').onclick=reset;
$('play').onclick=()=>{if(state.progress===1)setProgress(0);state.playing=!state.playing;travelTo=null;updateUI();wake()};
$('skip').onclick=()=>{state.playing=false;travelTo={from:state.progress,time:0};if(reduced){setProgress(1);travelTo=null}wake()};
$('progress').oninput=e=>{state.playing=false;travelTo=null;setProgress(e.target.value/1000)};
$('sealHotspot').onclick=openLetter;$('envelope').onclick=openLetter;$('readAgain').onclick=()=>{$('ending').hidden=true;openLetter()};
$('finishLetter').onclick=finish;$('book').querySelector('.close').onclick=finish;$('next').onclick=()=>turn(state.page+1);$('prev').onclick=()=>turn(state.page-1);
$('book').addEventListener('cancel',e=>{e.preventDefault();finish()});
let bookTouch; $('book').addEventListener('touchstart',e=>{const t=e.changedTouches[0];bookTouch=[t.clientX,t.clientY]},{passive:true});$('book').addEventListener('touchend',e=>{if(!bookTouch)return;const t=e.changedTouches[0],dx=t.clientX-bookTouch[0],dy=t.clientY-bookTouch[1];if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3)turn(state.page+(dx<0?1:-1));bookTouch=null},{passive:true});
$('world').addEventListener('wheel',e=>{if(!state.loaded||busy()||!$('ending').hidden)return;e.preventDefault();if(!state.started)begin();state.playing=false;travelTo=null;setProgress(state.progress+e.deltaY*.0005)},{passive:false});
$('world').addEventListener('pointerdown',e=>{if(!state.loaded||busy()||!$('ending').hidden)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY};$('world').setPointerCapture(e.pointerId)});
$('world').addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.lx,dy=e.clientY-pointer.ly;pointer.lx=e.clientX;pointer.ly=e.clientY;if(Math.abs(e.clientY-pointer.y)>Math.abs(e.clientX-pointer.x)){if(!state.started)begin();state.playing=false;travelTo=null;setProgress(state.progress-dy/innerHeight*.75)}else{state.yaw=T.MathUtils.clamp(state.yaw-dx*.0025,-.65,.65);invalidate()}});for(const name of ['pointerup','pointercancel','lostpointercapture'])$('world').addEventListener(name,()=>pointer=null);
window.addEventListener('keydown',e=>{if($('book').open){if(e.key==='Escape'){e.preventDefault();finish()}if(e.key==='ArrowRight')turn(state.page+1);if(e.key==='ArrowLeft')turn(state.page-1);if(e.key==='Tab'){const f=[...$('book').querySelectorAll('button:not(:disabled)')].filter(el=>el.getClientRects().length>0);const first=f[0],last=f.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}else if(state.started&&!busy()&&$('ending').hidden&&e.target.tagName!=='INPUT'&&['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();state.playing=false;setProgress(state.progress+(e.key==='ArrowUp'?.035:-.035))}});
let resizeTimer,viewportWidth=innerWidth,viewportHeight=innerHeight;
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{
 if(!renderer||(viewportWidth===innerWidth&&viewportHeight===innerHeight))return;
 viewportWidth=innerWidth;viewportHeight=innerHeight;
 // One drawing-buffer allocation after Safari's address bar / orientation settles.
 renderer.setDrawingBufferSize(innerWidth,innerHeight,pixelRatio());
 camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
 tour=createTour({mobile:mobile(),aspect:innerWidth/innerHeight});motion?.resize();invalidate();
},100)});
document.addEventListener('visibilitychange',()=>{last=performance.now();if(document.hidden){cancelAnimationFrame(raf);raf=0;state.playing=false;updateUI()}else invalidate()});
async function init(){try{renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(pixelRatio());renderer.setSize(innerWidth,innerHeight,false);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;$('world').append(renderer.domElement);scene=new T.Scene();camera=new T.PerspectiveCamera(mobile()?53:46,innerWidth/innerHeight,.05,150);const assets=await buildScene(scene,renderer,invalidate);motion=createLetterMotion(scene,assets.letter,camera,reduced,showPage,()=>{$('world').inert=false;document.querySelector('header').inert=false;$('book').removeAttribute('aria-modal');document.body.classList.remove('reading-letter');document.body.classList.add('letter-finished');birthdayFilm.refresh();$('ending').hidden=false;$('ending').focus();invalidate()});cameraPose();await renderer.compileAsync(scene,camera);state.loaded=true;$('loading').hidden=true;$('start').disabled=false;renderer.render(scene,camera);renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fail(new Error('3D 顯示中斷，請重新載入。'))});invalidate()}catch(e){fail(e)}}
const seal=new T.Vector3(),previousPosition=new T.Vector3(),previousQuaternion=new T.Quaternion();let previousFov=-1,previousOpening=-1;
function frame(now){
 raf=0;if(failed||document.hidden)return;inFrame=true;
 const dt=Math.min((now-last)/1000,.05);last=now;
 if(state.playing)setProgress(state.progress+dt/tour.duration);
 if(travelTo){travelTo.time+=dt;const u=clamp(travelTo.time/1.4);setProgress(T.MathUtils.lerp(travelTo.from,1,ease(u)));if(u===1)travelTo=null}
 const phase=motion.phase,phaseChanged=phase!==phaseBefore;
 if(phaseChanged){dirty=true;phaseBefore=phase;updateUI()}
 const animating=!['closed','reading'].includes(phase);
 if(dirty||animating){
  cameraPose();
  const opening=camera.view?.offsetX+camera.view?.offsetY;
  const cameraChanged=!previousPosition.equals(camera.position)||!previousQuaternion.equals(camera.quaternion)||previousFov!==camera.fov||previousOpening!==opening;
  motion.update(dt);
  // Card extraction/paging runs in the compositor; only flap motion changes 3D geometry.
  const flapMoving=phase==='opening'||phase==='closing';
  if(dirty&&!state.playing||cameraChanged||flapMoving||phaseChanged){
   renderer.shadowMap.needsUpdate ||= flapMoving||phaseChanged;
   renderer.render(scene,camera);
  }
  previousPosition.copy(camera.position);previousQuaternion.copy(camera.quaternion);previousFov=camera.fov;previousOpening=opening;
  hidden('sealHotspot',!state.started||state.progress<.97||busy()||!$('ending').hidden);
  if(!$('sealHotspot').hidden){seal.set(0,.925,-4.416).project(camera);$('sealHotspot').style.left=(seal.x+1)*innerWidth/2+'px';$('sealHotspot').style.top=(1-seal.y)*innerHeight/2+'px'}
  dirty=false;
 }
 inFrame=false;
 if(state.playing||travelTo||!['closed','reading'].includes(motion.phase))raf=requestAnimationFrame(frame);
}
window.maison={get tourStops(){return tour.stops},get tourDuration(){return tour.duration},get galleryFrames(){return galleryPhotos.map(photo=>({id:photo.id,corners:[[-.995,-.745],[.995,-.745],[.995,.745],[-.995,.745]].map(([z,y])=>new T.Vector3(photo.side*3.06,1.94+y,photo.z+z).project(camera).toArray())}))},get loaded(){return state.loaded},get progress(){return state.progress},get phase(){return motion?.phase},get page(){return state.page},get stats(){return renderer?.info},setProgress(p){if(!state.started)begin();state.playing=false;setProgress(p)}};
// Decode letter photos while the visitor starts the tour; artwork loads with the scene.
let memoriesPrepared=false;
function prepareMemories(){if(memoriesPrepared)return;memoriesPrepared=true;for(const {image} of memories){const img=new Image();img.src=image;img.decode().catch(()=>{});}}
init();
