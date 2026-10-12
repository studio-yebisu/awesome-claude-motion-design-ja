import * as d3 from 'd3';

export async function create({root,width,height,fps}) {
  root.style.background='#f2efe8';
  root.innerHTML=`<div style="position:absolute;left:60px;top:62px"><span class="mono" style="font-size:16px;color:#7e719a;letter-spacing:3px">DEMO DATA / SAME VALUES, NEW VIEW</span><h1 style="font-size:53px;letter-spacing:-2px;margin:16px 0">Hierarchy, reimagined.</h1></div><svg width="960" height="600" style="position:absolute;inset:0"></svg><div id="mode" class="mono" style="position:absolute;right:64px;top:138px;font-size:17px;color:#6b4fbb">TREEMAP → ICICLE</div>`;
  const data={name:'studio',children:[{name:'DESIGN',children:[{name:'TYPE',value:18},{name:'COLOUR',value:10},{name:'MOTION',value:22}]},{name:'BUILD',children:[{name:'SCENES',value:24},{name:'ASSETS',value:14}]},{name:'REVIEW',children:[{name:'FRAMES',value:20},{name:'TIMING',value:12},{name:'EXPORT',value:15}]}]};
  const hierarchy=d3.hierarchy(data).sum(d=>d.value||0).sort((a,b)=>b.value-a.value);
  const tree=hierarchy.copy();d3.treemap().size([836,304]).padding(5).round(true)(tree);
  const partition=hierarchy.copy();d3.partition().size([836,304]).padding(5)(partition);
  const partitionLeaves=new Map(partition.leaves().map(n=>[n.data.name,n]));
  const colours=d3.scaleOrdinal().domain(['DESIGN','BUILD','REVIEW']).range(['#6b4fbb','#927aca','#bba6df']);
  const svg=d3.select(root.querySelector('svg'));
  const parentGroups=svg.append('g').attr('transform','translate(62 205)').selectAll('g').data(partition.descendants().filter(n=>n.children)).join('g').attr('transform',d=>`translate(${d.x0},${d.y0})`);
  parentGroups.append('rect').attr('width',d=>d.x1-d.x0).attr('height',d=>d.y1-d.y0).attr('rx',7).attr('fill',d=>d.depth?colours(d.data.name):'#282235');
  parentGroups.append('text').attr('x',18).attr('y',52).attr('fill','#f8f5ed').attr('font-size',30).attr('font-weight',800).text(d=>d.depth?d.data.name:'STUDIO / CREATIVE PIPELINE');
  const groups=svg.append('g').attr('transform','translate(62 205)').selectAll('g').data(tree.leaves()).join('g');
  groups.append('rect').attr('rx',7).attr('fill',d=>colours(d.parent.data.name));
  groups.append('text').attr('fill','#f8f5ed').attr('font-size',20).attr('font-weight',600).attr('x',14).attr('y',27).text(d=>d.data.name);
  groups.append('text').attr('class','value').attr('fill','#f8f5ed').attr('font-size',37).attr('font-weight',800).attr('x',14).attr('y',72).text(d=>d.data.value);
  return {label:'D3 / HIERARCHY + TREEMAP + PARTITION',feature:'hierarchy, treemap, partition, scaleOrdinal, easeCubicInOut, selection joins',seek(frame){
    const t=frame/fps;
    let p=t<1.4?0:t<3.5?d3.easeCubicInOut((t-1.4)/2.1):t<5.2?1:d3.easeCubicInOut(Math.max(0,1-(t-5.2)/2.1));
    const rectFor=d=>{const b=partitionLeaves.get(d.data.name);return{x:d3.interpolateNumber(d.x0,b.x0)(p),y:d3.interpolateNumber(d.y0,b.y0)(p),w:d3.interpolateNumber(d.x1-d.x0,b.x1-b.x0)(p),h:d3.interpolateNumber(d.y1-d.y0,b.y1-b.y0)(p)};};
    groups.attr('transform',d=>{const r=rectFor(d);return`translate(${r.x},${r.y})`;});
    groups.select('rect').attr('width',d=>rectFor(d).w).attr('height',d=>rectFor(d).h);
    groups.select('text:not(.value)').attr('font-size',d=>Math.min(20,(rectFor(d).w-20)/(d.data.name.length*.58))).attr('x',10).attr('y',25);
    groups.select('.value').attr('font-size',d=>Math.min(37,rectFor(d).w*.47)).attr('x',10).attr('y',68).attr('opacity',d=>rectFor(d).h>75?1:0);
    parentGroups.attr('opacity',p);
    root.querySelector('#mode').textContent=p>.5?'ICICLE / SAME HIERARCHY':'TREEMAP / SAME HIERARCHY';
  }};
}
