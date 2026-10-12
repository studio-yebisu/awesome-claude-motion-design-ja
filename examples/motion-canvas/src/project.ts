import {makeProject} from '@motion-canvas/core';
import scene from './scene?scene';
import {CaptureExporter} from './capture-exporter';
export default makeProject({scenes:[scene],plugins:[{name:'specimen-capture',exporters:()=>[CaptureExporter]}]});
