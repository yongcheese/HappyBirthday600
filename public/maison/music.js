// Official artist-hosted stream; playback always requires the visitor's play tap.
export function createMusic(){
 const dock=document.getElementById('musicDock'),toggle=document.getElementById('musicToggle'),panel=document.getElementById('musicPanel'),host=document.getElementById('musicPlayer');
 const status=document.createElement('p');status.className='music-status';status.setAttribute('role','status');status.hidden=true;host.before(status);
 let entered=false,frame=null,timer;
 const show=open=>{if(panel.hidden===open)panel.hidden=!open;const value=String(open);if(toggle.getAttribute('aria-expanded')!==value)toggle.setAttribute('aria-expanded',value)};
 function mount(){
  if(frame)return;
  status.textContent='正在準備音樂…';status.hidden=false;
  const player=document.createElement('iframe');frame=player;
  player.title='美秀集團〈米兒〉StreetVoice 官方播放器';player.src='https://streetvoice.com/music/embed/?id=566879';player.allow='autoplay';player.width='300';player.height='100';player.setAttribute('scrolling','no');player.referrerPolicy='strict-origin-when-cross-origin';
  player.addEventListener('load',()=>{if(frame!==player)return;clearTimeout(timer);status.hidden=true});
  timer=setTimeout(()=>{if(frame===player){status.textContent='音樂載入較慢，可以點下方「到街聲聽」。';status.hidden=false}},15000);
  host.append(player);
 }
 function remove(){clearTimeout(timer);frame?.remove();frame=null;status.hidden=true}
 toggle.onclick=()=>{mount();show(panel.hidden)};
 document.getElementById('musicCollapse').onclick=()=>show(false);
 const stop=()=>{remove();show(false)};
 document.getElementById('musicStop').onclick=stop;
 return {
  // Begin fetching after the visitor enters, leaving initial 3D loading uncontested.
  prepare:mount,
  stop,
  update(inside,reading){
   if(inside&&!entered){entered=true;dock.hidden=false;mount();show(true)}
   if(!inside&&entered)this.reset();
   if(reading)show(false);
  },
  reset(){remove();entered=false;dock.hidden=true;show(false)}
 };
}
