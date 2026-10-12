import {spawn} from 'node:child_process';
const base=process.argv[2];
const ids=process.argv.slice(3);
async function work(){
  for(;;){
    const id=ids.shift(); if(!id)return;
    await new Promise((resolve,reject)=>{
      const p=spawn(process.execPath,['capture.mjs','--scene',id,'--base',base],{stdio:'inherit'});
      p.on('exit',code=>code===0?resolve():reject(new Error(`${id} exited ${code}`)));
      p.on('error',reject);
    });
  }
}
await Promise.all([work(),work()]);
