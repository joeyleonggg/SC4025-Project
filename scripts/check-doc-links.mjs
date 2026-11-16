import {readdir,readFile,access} from 'node:fs/promises';
import {resolve,dirname,join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
async function walk(folder){
 const files=[];
 for(const item of await readdir(folder,{withFileTypes:true})){
  const path=join(folder,item.name);
  if(item.isDirectory())files.push(...await walk(path));
  else if(item.name.endsWith('.md'))files.push(path);
 }
 return files;
}
const files=[resolve(root,'README.md'),...await walk(resolve(root,'docs')),...await walk(resolve(root,'backend'))];
const missing=[];
for(const file of files){
 for(const match of (await readFile(file,'utf8')).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
  const link=match[1].replace(/^<|>$/g,'');
  if(/^(?:[a-z]+:|#)/i.test(link))continue;
  const target=decodeURIComponent(link.split('#')[0]);if(!target)continue;
  try{await access(resolve(dirname(file),target));}catch{missing.push(relative(root,file)+' -> '+link);}
 }
}
if(missing.length)throw new Error('Missing documentation targets:\n'+missing.join('\n'));
console.log('All local Markdown links resolve ('+files.length+' documents).');
