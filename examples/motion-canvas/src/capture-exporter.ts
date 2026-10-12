import {ObjectMetaField,RendererResult} from '@motion-canvas/core';
export class CaptureExporter {
  static id='specimen/png';static displayName='Specimen PNG';
  static meta(){return new ObjectMetaField('PNG',{});}
  static async create(){return new CaptureExporter();}
  async handleFrame(canvas:HTMLCanvasElement,frame:number){
    await (window as any).__saveFrame({frame,png:canvas.toDataURL('image/png')});
  }
  async stop(result:RendererResult){(window as any).__renderResult=result;}
}
