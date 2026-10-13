import * as T from 'three';
// Finite birthday scene: idle at the candle prompt and again at the final card.
export function createCelebration({camera,cake,reduced,onWake,onFinish}){
 const layer=document.getElementById('celebration'),prompt=document.getElementById('candlePrompt'),light=document.getElementById('lightCandles'),egg=document.getElementById('birthdayEgg'),foam=document.getElementById('foamLens');
 let shadowDirty=false,phase='idle',time=0,fromPosition=new T.Vector3(),fromQuaternion=new T.Quaternion(),fromFov=46,animations=[],audio=null;
 const center=new T.Vector3(...cake.center),targetPosition=center.clone().add(new T.Vector3(0,.34,1.72));
 const targetQuaternion=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().lookAt(targetPosition,center,new T.Vector3(0,1,0)));
 const finalePosition=center.clone().add(new T.Vector3(0,.43,1.20));
 const finaleLook=center.clone().add(new T.Vector3(0,-.12,0));
 const finaleQuaternion=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().lookAt(finalePosition,finaleLook,new T.Vector3(0,1,0)));
 const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
 const setPhase=p=>{phase=p;time=0;layer.dataset.phase=p};
 function clearFoam(){animations.forEach(a=>a.cancel());animations=[];foam.replaceChildren();layer.classList.remove('foam-hit')}
 function reset(){shadowDirty=true;document.body.classList.remove('celebrating');clearFoam();setPhase('idle');layer.hidden=true;egg.hidden=true;prompt.hidden=true;cake.finale.reset();cake.flames.visible=false;cake.flames.children.forEach(f=>f.scale.copy(f.userData.baseScale));audio?.close().catch(()=>{});audio=null}
 function finish(){audio?.close().catch(()=>{});audio=null;document.body.classList.remove('celebrating');clearFoam();setPhase('idle');layer.hidden=true;onFinish();onWake()}
 function prepareSound(){try{const A=window.AudioContext||window.webkitAudioContext;audio??=new A();audio.resume().catch(()=>{});}catch{/* Visual celebration works without audio permission. */}}
 function hiss(){if(!audio||audio.state!=='running')return;const buffer=audio.createBuffer(1,audio.sampleRate*.65,audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.3;const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();source.buffer=buffer;filter.type='lowpass';filter.frequency.value=2300;source.connect(filter);filter.connect(gain);gain.connect(audio.destination);const t=audio.currentTime;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.2,t+.08);gain.gain.exponentialRampToValueAtTime(.001,t+.65);source.start(t);source.stop(t+.66)}
 function spray(){hiss();clearFoam();layer.classList.add('foam-hit');if(reduced)return;const w=innerWidth,h=innerHeight;
  for(let i=0;i<12;i++){const puff=document.createElement('i'),x=(i%3)*.36+.13,y=Math.floor(i/3)*.28+.05;puff.style.left=x*100+'%';puff.style.top=y*100+'%';foam.append(puff);const delay=i*28;
   animations.push(puff.animate([{transform:`translate(${(-.1-x)*w}px,${(1.05-y)*h}px) scale(.03)`,opacity:0},{transform:'translate(-50%,-50%) scale(1.35)',opacity:1,offset:.46},{transform:'translate(-50%,-50%) scale(1.42)',opacity:1,offset:.7},{transform:`translate(-50%,${-h*.12}px) scale(1.5)`,opacity:0}],{duration:2200,delay,fill:'both',easing:'cubic-bezier(.2,.7,.25,1)'}));
  }
 }
 light.onclick=()=>{if(phase!=='wish')return;prepareSound();prompt.hidden=true;cake.flames.visible=true;setPhase('lighting');onWake()};
 document.getElementById('acceptBirthday').onclick=finish;document.getElementById('skipCelebration').onclick=finish;
 return{reset,takeShadowUpdate(){const changed=shadowDirty;shadowDirty=false;return changed},get active(){return phase!=='idle'},get phase(){return phase},get needsFrames(){return ['approach','lighting','foam','reveal'].includes(phase)},get changes3D(){return ['approach','lighting','foam','reveal'].includes(phase)},start(){reset();document.body.classList.add('celebrating');fromPosition.copy(camera.position);fromQuaternion.copy(camera.quaternion);fromFov=camera.fov;layer.hidden=false;prompt.hidden=false;light.disabled=true;setPhase('approach');onWake()},update(dt){if(phase==='idle')return;time+=dt;const narrow=innerWidth/innerHeight<.85;
  const u=phase==='approach'?ease(time/(reduced?.01:1.6)):1;camera.position.copy(fromPosition).lerp(targetPosition,u);camera.quaternion.copy(fromQuaternion).slerp(targetQuaternion,u);camera.fov=T.MathUtils.lerp(fromFov,narrow?65:43,u);if(phase==='reveal'||phase==='egg'){finaleLook.y=center.y+(narrow?-.12:.02);finaleQuaternion.setFromRotationMatrix(new T.Matrix4().lookAt(finalePosition,finaleLook,new T.Vector3(0,1,0)));const r=phase==='egg'?1:ease(time/(reduced?.01:1.35));camera.position.copy(targetPosition).lerp(finalePosition,r);camera.quaternion.copy(targetQuaternion).slerp(finaleQuaternion,r);camera.fov=T.MathUtils.lerp(narrow?65:43,narrow?65:50,r);}
  camera.clearViewOffset();camera.updateProjectionMatrix();camera.updateMatrixWorld();
  if(phase==='approach'&&u===1){setPhase('wish');light.disabled=false;light.focus({preventScroll:true})}
  else if(phase==='lighting'){cake.flames.children.forEach((f,i)=>f.scale.copy(f.userData.baseScale).multiplyScalar(Math.min(1,time/.4)*(reduced?1:1+Math.sin(time*9+i)*.045)));if(time>=(reduced?.65:2.35)){setPhase('foam');spray()}}
  else if(phase==='foam'){if(time>=(reduced?.3:1.35)&&!cake.finale.decor.visible){cake.finale.reveal(1);shadowDirty=true};if(time>=(reduced?.8:2.7)){clearFoam();setPhase('reveal');onWake()}}
  else if(phase==='reveal'&&time>=(reduced?.01:1.35)){setPhase('egg');egg.hidden=false;document.getElementById('acceptBirthday').focus({preventScroll:true})}
 }};
}
