import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import * as data from '../src/data.js';
const root=new URL('../../backend/mock-data/',import.meta.url);
const files={
 'catalogue.json':{categories:data.CATEGORIES,items:data.MENU,setDrinks:data.SET_DRINKS},
 'outlets.json':data.OUTLET_CAPS,
 'demo-accounts.json':data.ACCOUNTS.map(a=>({name:data.USERS0[a.id].n,email:a.identifier,role:a.id===0?'organiser':'participant',startingPoints:data.USERS0[a.id].pts,cards:data.SAVED_CARDS[a.id]})),
 'groups-and-history.json':{savedGroups:data.SAVED0,exampleHistory:data.HIST0}
};
await mkdir(root,{recursive:true});
for(const [name,value]of Object.entries(files)){
 const text=JSON.stringify(value,null,2)+'\n',path=new URL(name,root);
 if(process.argv.includes('--check')){
  if((await readFile(path,'utf8')).replace(/\r\n/g,'\n')!==text)throw new Error(name+' differs from frontend/src/data.js; run npm run export:mock');
 }else await writeFile(path,text);
}
console.log(process.argv.includes('--check')?'Mock-data snapshots match the application.':'Exported mock-data snapshots to '+fileURLToPath(root));
