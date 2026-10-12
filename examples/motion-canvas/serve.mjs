import {createServer} from 'vite';
const server=await createServer();await server.listen();console.log(`Motion Canvas: http://127.0.0.1:${server.httpServer.address().port}/render.html`);
