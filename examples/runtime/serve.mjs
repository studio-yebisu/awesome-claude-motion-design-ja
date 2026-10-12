import {createServer} from 'vite';
const server = await createServer({server:{host:'127.0.0.1',port:0,headers:{'Cross-Origin-Opener-Policy':'same-origin','Cross-Origin-Embedder-Policy':'require-corp'}},build:{outDir:'../../.qa/runtime-dist',emptyOutDir:false}});
await server.listen();
const address=server.httpServer.address();
console.log(`Motion examples: http://127.0.0.1:${address.port}/`);
