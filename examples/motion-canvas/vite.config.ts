import {defineConfig} from 'vite';
import motionCanvasModule from '@motion-canvas/vite-plugin';
const motionCanvas=typeof motionCanvasModule==='function'?motionCanvasModule:(motionCanvasModule as any).default;
export default defineConfig({plugins:[motionCanvas({project:'./src/project.ts',output:'../../.qa/motion-canvas-frames'})],server:{host:'127.0.0.1',port:0}});
