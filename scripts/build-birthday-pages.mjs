import {cp,mkdir,readdir,rm,stat,writeFile} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=join(root,'dist/pages');
await rm(output,{recursive:true,force:true});
async function copy(relative){const target=join(output,relative);await mkdir(dirname(target),{recursive:true});await cp(join(root,'public',relative),target);}
// Explicit delivery list: keep old scenes, source models and audit captures out of Pages.
for(const entry of await readdir(join(root,'public/maison'))){if(/\.(html|css|js)$/.test(entry))await copy(`maison/${entry}`);}
await copy('maison/assets/letter.glb');
for(const entry of ['birthday600.mp4','birthday600-poster.jpg','SOURCES.md'])await copy(`maison/assets/video/${entry}`);
for(const entry of await readdir(join(root,'public/maison/assets/photos'))){if(entry!=='bench-friends.webp'&&/\.(webp|md)$/.test(entry))await copy(`maison/assets/photos/${entry}`);}
for(const entry of ['three.module.js','three.core.js','GLTFLoader.js','HDRLoader.js','BufferGeometryUtils.js','LICENSE.three.txt'])await copy(`birthday-3d/vendor/${entry}`);
for(const entry of ['garden-sunset.hdr','ENVIRONMENT.txt'])await copy(`birthday-3d/assets/tuscan/${entry}`);
await writeFile(join(output,'.nojekyll'),'');
await writeFile(join(output,'index.html'),'<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=./maison/"><title>六百，生日快樂！</title><a href="./maison/">打開六百的生日展</a></html>');
let count=0,bytes=0;
async function inspect(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())await inspect(p);else{count++;bytes+=(await stat(p)).size;}}}
await inspect(output);console.log(`Birthday Pages: ${count} files, ${(bytes/1024/1024).toFixed(2)} MiB → ${output}`);
