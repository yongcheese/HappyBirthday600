export function videoAvailability(config,now=Date.now()){
 const opening=Date.parse(config.unlockAt);
 const valid=Number.isFinite(opening);
 const locked=!valid||now<opening;
 return {locked,ready:!locked&&Boolean(config.src?.trim()),opening};
}
export function createBirthdayVideo(config,{beforePlay=()=>{}}={}){
 const button=document.getElementById('watchVideo'),status=document.getElementById('videoAvailability');
 const dialog=document.getElementById('birthdayVideoDialog'),video=document.getElementById('birthdayVideo'),error=document.getElementById('videoError');
 let timer=0;
 const openingLabel=Number.isFinite(Date.parse(config.unlockAt))?new Intl.DateTimeFormat('zh-TW',{timeZone:config.timeZone,month:'numeric',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(config.unlockAt)):'';
 function refresh(){
  clearTimeout(timer);const state=videoAvailability(config);
  button.disabled=!state.ready;
  const message=state.locked?(openingLabel?`${openingLabel} 開放・台灣時間`:'這段影片晚點開放。'):state.ready?'可以看影片了。':'影片還在準備，晚點再來看看。';
  if(status.textContent!==message)status.textContent=message;
  if(state.locked&&Number.isFinite(state.opening)&&!document.hidden)timer=setTimeout(refresh,Math.max(50,Math.min(60000,state.opening-Date.now())));
  return state;
 }
 function close(){video.pause();if(dialog.open)dialog.close()}
 function open(){
  if(!refresh().ready)return;
  beforePlay();error.hidden=true;
  if(video.getAttribute('src')!==config.src){
   video.src=config.src;
   if(config.poster)video.poster=config.poster;
   if(config.captions&&!video.querySelector('track')){const track=document.createElement('track');track.kind='captions';track.srclang='zh-Hant';track.label='中文字幕';track.src=config.captions;track.default=true;video.append(track)}
  }
  dialog.showModal();video.play().catch(()=>{/* Native controls remain available if playback needs another tap. */});
 }
 button.addEventListener('click',open);
 document.getElementById('closeBirthdayVideo').addEventListener('click',close);
 document.getElementById('backFromVideo').addEventListener('click',close);
 dialog.addEventListener('cancel',event=>{event.preventDefault();close()});
 dialog.addEventListener('close',()=>video.pause());
 video.addEventListener('error',()=>{error.hidden=false});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(timer);else refresh()});
 refresh();
 return {refresh,reset(){close();if(video.hasAttribute('src')){video.removeAttribute('src');video.load()}error.hidden=true}};
}
