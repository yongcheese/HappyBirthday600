import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(process.argv[2]||'public'),port=Number(process.argv[3]||4178);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.mp4':'video/mp4','.jpg':'image/jpeg','.webp':'image/webp','.glb':'model/gltf-binary','.hdr':'application/octet-stream','.md':'text/plain; charset=utf-8'};
createServer(async(req,res)=>{try{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});return res.end()}
 let file=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);return res.end()}
 let info=await stat(file);if(info.isDirectory()){file=resolve(file,'index.html');info=await stat(file)}
 let start=0,end=info.size-1,status=200;const headers={'Content-Type':types[extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store'};
 if(req.headers.range){const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end()}
  if(match[1]){start=Number(match[1]);if(match[2])end=Math.min(Number(match[2]),end)}else start=Math.max(0,info.size-Number(match[2]));
  if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end()}
  status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
 }
 headers['Content-Length']=Math.max(0,end-start+1);res.writeHead(status,headers);if(req.method==='HEAD'||info.size===0)return res.end();const stream=createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
 }catch{if(!res.headersSent)res.writeHead(404);res.end('Not found')}
}).listen(port,'127.0.0.1',()=>console.log(`Birthday preview: http://127.0.0.1:${port}/maison/`));
