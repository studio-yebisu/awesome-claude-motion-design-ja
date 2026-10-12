import {makeScene2D,Rect,Txt,Code,Line} from '@motion-canvas/2d';
import {all,createRef,waitFor,easeInOutCubic} from '@motion-canvas/core';
export default makeScene2D(function*(view){
  const code=createRef<Code>(),a=createRef<Rect>(),b=createRef<Rect>(),c=createRef<Rect>(),ratio=createRef<Txt>();
  view.fill('#0e0f12');
  view.add(<><Txt text="Give code a rhythm." x={-430} y={-207} offsetX={-1} fill="#f2efe8" fontFamily="Arial" fontWeight={700} fontSize={58}/><Txt text="MOTION CANVAS / CODE MORPH + SIGNAL TWEENS" x={-435} y={267} offsetX={-1} fill="#9297a0" fontSize={15} fontFamily="Consolas"/><Rect x={-88} y={40} width={630} height={282} radius={16} fill="#1b1e24"/><Code ref={code} x={-88} y={40} fontSize={26} fontFamily="Consolas" fill="#f2efe8" code={'const rhythm = [1, 1, 1];\n\nfor (const beat of rhythm) {\n  yield* pulse(beat);\n}'}/><Rect ref={a} x={302} y={90} offsetY={1} width={40} height={72} radius={6} fill="#d3ef73"/><Rect ref={b} x={363} y={90} offsetY={1} width={40} height={72} radius={6} fill="#d3ef73"/><Rect ref={c} x={424} y={90} offsetY={1} width={40} height={72} radius={6} fill="#d3ef73"/><Line points={[[278,92],[449,92]]} stroke="#6a717e" lineWidth={2}/><Txt ref={ratio} text="1 : 1 : 1" x={361} y={139} fill="#d3ef73" fontFamily="Consolas" fontSize={24}/></>);
  yield* waitFor(.6);
  yield* all(code().code('const rhythm = [1, 2, 3];\n\nfor (const beat of rhythm) {\n  yield* pulse(beat);\n}',1),ratio().text('1 : 2 : 3',1),b().height(144,1,easeInOutCubic),c().height(216,1,easeInOutCubic));
  yield* waitFor(1.5);
  yield* all(code().code('const rhythm = [3, 2, 1];\n\nfor (const beat of rhythm) {\n  yield* pulse(beat);\n}',1),ratio().text('3 : 2 : 1',1),a().height(216,1,easeInOutCubic),c().height(72,1,easeInOutCubic));
  yield* waitFor(1.5);
  yield* all(code().code('const rhythm = [1, 1, 1];\n\nfor (const beat of rhythm) {\n  yield* pulse(beat);\n}',1),ratio().text('1 : 1 : 1',1),a().height(72,1,easeInOutCubic),b().height(72,1,easeInOutCubic));
  yield* waitFor(1.4);
});
