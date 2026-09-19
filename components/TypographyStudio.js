'use client';

import { useMemo, useRef, useState } from 'react';

const BRAND = {
  bg: '#f3f4f6',
  card: '#ffffff',
  text: '#15171a',
  muted: '#6b7280',
  line: '#e6e7ea',
  accent: '#645cff',
  accent2: '#7b73ff',
  soft: '#f0efff'
};

const CANVAS_PRESETS = {
  square: [1080, 1080],
  portrait: [1080, 1350],
  landscape: [1200, 630]
};

const starterQuote = "some days i just want to disappear for a bit and come back when everything feels lighter.";

const templates = [
  { id: 'clean-center', name: 'Clean Center', bg: '#ffffff', text: '#15171a', accent: '#645cff', align: 'center', x: .14, y: .26, w: .72, size: .064, weight: 800, radius: 0 },
  { id: 'bold-left', name: 'Bold Statement', bg: '#f3f4f6', text: '#15171a', accent: '#645cff', align: 'left', x: .09, y: .2, w: .72, size: .075, weight: 900, radius: 0 },
  { id: 'editorial-left', name: 'Editorial Left', bg: '#ffffff', text: '#15171a', accent: '#645cff', align: 'left', x: .12, y: .22, w: .66, size: .058, weight: 750, radius: 0 },
  { id: 'soft-card', name: 'Soft Card', bg: '#f3f4f6', text: '#15171a', accent: '#645cff', align: 'center', x: .14, y: .3, w: .72, size: .058, weight: 800, card: true },
  { id: 'purple-accent', name: 'Purple Accent', bg: '#ffffff', text: '#15171a', accent: '#645cff', align: 'left', x: .12, y: .24, w: .7, size: .062, weight: 850, stripe: true },
  { id: 'dark', name: 'Dark Kiocreates', bg: '#15171a', text: '#ffffff', accent: '#7b73ff', align: 'center', x: .12, y: .27, w: .76, size: .062, weight: 800 },
  { id: 'quote-frame', name: 'Quote Frame', bg: '#ffffff', text: '#15171a', accent: '#645cff', align: 'center', x: .14, y: .28, w: .72, size: .056, weight: 780, frame: true },
  { id: 'big-type', name: 'Big Type', bg: '#f0efff', text: '#15171a', accent: '#645cff', align: 'left', x: .08, y: .12, w: .82, size: .09, weight: 900 },
  { id: 'bottom-heavy', name: 'Bottom Heavy', bg: '#ffffff', text: '#15171a', accent: '#645cff', align: 'left', x: .1, y: .56, w: .78, size: .06, weight: 850 },
  { id: 'split-emphasis', name: 'Split Emphasis', bg: '#ffffff', text: '#15171a', accent: '#645cff', align: 'left', x: .1, y: .18, w: .72, size: .068, weight: 900, split: true },
  { id: 'lavender', name: 'Soft Lavender', bg: '#f0efff', text: '#15171a', accent: '#645cff', align: 'center', x: .13, y: .28, w: .74, size: .06, weight: 820 },
  { id: 'micro-label', name: 'Micro Label', bg: '#ffffff', text: '#15171a', accent: '#645cff', align: 'left', x: .12, y: .27, w: .7, size: .058, weight: 820, label: 'relatable' },
  { id: 'poster', name: 'Poster Type', bg: '#15171a', text: '#ffffff', accent: '#7b73ff', align: 'left', x: .08, y: .12, w: .84, size: .082, weight: 900, poster: true },
  { id: 'side-note', name: 'Side Note', bg: '#ffffff', text: '#15171a', accent: '#645cff', align: 'left', x: .23, y: .2, w: .62, size: .058, weight: 800, side: true },
  { id: 'minimal-lower', name: 'Minimal Lower', bg: '#f3f4f6', text: '#15171a', accent: '#645cff', align: 'center', x: .14, y: .54, w: .72, size: .052, weight: 760 },
  { id: 'high-contrast', name: 'High Contrast', bg: '#645cff', text: '#ffffff', accent: '#ffffff', align: 'center', x: .12, y: .25, w: .76, size: .065, weight: 900 },
  { id: 'soft-gradient', name: 'Soft Gradient', bg: '#ffffff', text: '#15171a', accent: '#645cff', align: 'center', x: .13, y: .28, w: .74, size: .058, weight: 800, gradient: true },
  { id: 'photo-quote', name: 'Photo + Quote', bg: '#15171a', text: '#ffffff', accent: '#7b73ff', align: 'left', x: .08, y: .58, w: .78, size: .055, weight: 820, photo: true }
];

let layerSeq = 1;
const nextId = () => `layer-${layerSeq++}`;

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function makeQuoteLayer(template, width, height, text = starterQuote) {
  return {
    id: nextId(),
    type: 'text',
    role: 'quote',
    text,
    x: Math.round(template.x * width),
    y: Math.round(template.y * height),
    width: Math.round(template.w * width),
    fontSize: Math.max(28, Math.round(template.size * Math.min(width, height))),
    weight: template.weight,
    color: template.text,
    align: template.align,
    lineHeight: 1.12,
    rotation: 0,
    opacity: 1,
    z: 10
  };
}

function templateDecorations(template, width, height) {
  const out = [];
  if (template.card) out.push({ id: nextId(), type: 'shape', shape: 'card', x: width*.07, y: height*.16, width: width*.86, height: height*.66, fill: '#ffffff', stroke: BRAND.line, radius: 34, z: 1 });
  if (template.frame) out.push({ id: nextId(), type: 'shape', shape: 'frame', x: width*.07, y: height*.08, width: width*.86, height: height*.78, fill: 'transparent', stroke: BRAND.line, radius: 30, z: 1 });
  if (template.stripe) out.push({ id: nextId(), type: 'shape', shape: 'rect', x: width*.08, y: height*.24, width: Math.max(9,width*.012), height: height*.32, fill: template.accent, stroke: template.accent, radius: 8, z: 2 });
  if (template.side) out.push({ id: nextId(), type: 'shape', shape: 'rect', x: width*.1, y: height*.2, width: width*.055, height: height*.48, fill: template.accent, stroke: template.accent, radius: 14, z: 2 });
  if (template.label) out.push({ id: nextId(), type: 'text', role: 'label', text: template.label.toUpperCase(), x: width*.12, y: height*.19, width: width*.3, fontSize: Math.max(18,width*.018), weight: 900, color: template.accent, align: 'left', lineHeight: 1, rotation: 0, opacity: 1, z: 11, letterSpacing: 4 });
  return out;
}

function makeTemplateState(templateId, sizeKey, quoteText = starterQuote) {
  const [width, height] = CANVAS_PRESETS[sizeKey];
  const t = templates.find(x => x.id === templateId) || templates[0];
  return {
    background: t.bg,
    gradient: !!t.gradient,
    layers: [...templateDecorations(t, width, height), makeQuoteLayer(t, width, height, quoteText)]
  };
}

function rgba(hex, alpha) {
  const raw = hex.replace('#','');
  const n = parseInt(raw.length===3 ? raw.split('').map(c=>c+c).join('') : raw,16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${alpha})`;
}

function FacebookBrand({ dark=false }) {
  return <div className={`brandMark ${dark ? 'brandMarkDark' : ''}`}><span className="fbCircle">f</span><span>kiocreates</span></div>;
}

export default function TypographyStudio() {
  const [mode, setMode] = useState('template');
  const [sizeKey, setSizeKey] = useState('square');
  const [templateId, setTemplateId] = useState('clean-center');
  const initial = useMemo(() => makeTemplateState('clean-center','square'), []);
  const [background, setBackground] = useState(initial.background);
  const [gradient, setGradient] = useState(initial.gradient);
  const [layers, setLayers] = useState(initial.layers);
  const [selectedId, setSelectedId] = useState(initial.layers.find(l=>l.role==='quote')?.id || null);
  const [brandPosition, setBrandPosition] = useState('bottom-left');
  const [brandVisible, setBrandVisible] = useState(true);
  const [quality, setQuality] = useState(92);
  const [exporting, setExporting] = useState(false);
  const dragRef = useRef(null);
  const fileRef = useRef(null);

  const [canvasWidth, canvasHeight] = CANVAS_PRESETS[sizeKey];
  const selected = layers.find(l => l.id === selectedId) || null;
  const currentTemplate = templates.find(t => t.id === templateId) || templates[0];

  const updateLayer = (id, patch) => setLayers(prev => prev.map(l => l.id === id ? {...l, ...patch} : l));

  const applyTemplate = (id, key=sizeKey) => {
    const quote = layers.find(l=>l.role==='quote')?.text || starterQuote;
    const next = makeTemplateState(id, key, quote);
    setTemplateId(id);
    setMode('template');
    setBackground(next.background);
    setGradient(next.gradient);
    setLayers(next.layers);
    setSelectedId(next.layers.find(l=>l.role==='quote')?.id || null);
  };

  const startFree = (key=sizeKey) => {
    setMode('free');
    setTemplateId('');
    setBackground(BRAND.card);
    setGradient(false);
    setLayers([]);
    setSelectedId(null);
  };

  const changeSize = (key) => {
    setSizeKey(key);
    if (mode === 'template' && templateId) applyTemplate(templateId, key);
    else startFree(key);
  };

  const addText = () => {
    const layer = {
      id: nextId(), type:'text', role:'free', text:'Type something…', x:canvasWidth*.16, y:canvasHeight*.24,
      width:canvasWidth*.68, fontSize:Math.round(Math.min(canvasWidth,canvasHeight)*.06), weight:800,
      color:BRAND.text, align:'center', lineHeight:1.12, rotation:0, opacity:1, z:Math.max(10,...layers.map(l=>l.z||1))+1
    };
    setLayers(p=>[...p,layer]); setSelectedId(layer.id);
  };

  const addImage = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const maxW = canvasWidth*.62, maxH = canvasHeight*.55;
      const ratio = Math.min(maxW/img.width, maxH/img.height, 1);
      const w = Math.max(120, img.width*ratio), h = Math.max(120, img.height*ratio);
      const layer = { id:nextId(), type:'image', src:url, name:file.name, x:(canvasWidth-w)/2, y:(canvasHeight-h)/2, width:w, height:h, rotation:0, opacity:1, z:Math.max(10,...layers.map(l=>l.z||1))+1 };
      setLayers(p=>[...p,layer]); setSelectedId(layer.id);
    };
    img.src = url;
  };

  const removeSelected = () => {
    if (!selected) return;
    setLayers(p=>p.filter(l=>l.id!==selected.id));
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selected) return;
    const dup = {...selected, id:nextId(), x:selected.x+28, y:selected.y+28, z:Math.max(...layers.map(l=>l.z||1))+1};
    setLayers(p=>[...p,dup]); setSelectedId(dup.id);
  };

  const moveLayer = (dir) => {
    if (!selected) return;
    const sorted=[...layers].sort((a,b)=>(a.z||0)-(b.z||0));
    const idx=sorted.findIndex(x=>x.id===selected.id);
    const other=dir==='up'?sorted[idx+1]:sorted[idx-1];
    if (!other) return;
    const z=selected.z; updateLayer(selected.id,{z:other.z}); updateLayer(other.id,{z});
  };

  const beginDrag = (e, layer, kind='move') => {
    if (layer.type === 'shape') return;
    e.preventDefault(); e.stopPropagation();
    setSelectedId(layer.id);
    dragRef.current = { kind, id:layer.id, startX:e.clientX, startY:e.clientY, x:layer.x, y:layer.y, width:layer.width, height:layer.height, fontSize:layer.fontSize };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag, { once:true });
  };

  const onPointerMove = (e) => {
    const d=dragRef.current; if (!d) return;
    const scale = stageScale();
    const dx=(e.clientX-d.startX)/scale, dy=(e.clientY-d.startY)/scale;
    setLayers(prev=>prev.map(l=>{
      if(l.id!==d.id) return l;
      if(d.kind==='move') return {...l,x:clamp(d.x+dx,-l.width*.75,canvasWidth-l.width*.25),y:clamp(d.y+dy,-80,canvasHeight-60)};
      if(d.kind==='resize') {
        if(l.type==='image') return {...l,width:Math.max(80,d.width+dx),height:Math.max(80,d.height+dy)};
        const ratio=Math.max(.35,(d.width+dx)/Math.max(1,d.width));
        return {...l,width:Math.max(160,d.width+dx),fontSize:clamp(d.fontSize*ratio,18,220)};
      }
      return l;
    }));
  };

  const endDrag = () => {
    dragRef.current=null;
    window.removeEventListener('pointermove',onPointerMove);
  };

  const stageScale = () => {
    if (typeof document === 'undefined') return 1;
    const el=document.querySelector('.canvasStage');
    if(!el) return 1;
    return el.getBoundingClientRect().width/canvasWidth;
  };

  const quoteLayer = layers.find(l=>l.role==='quote');

  const wrapLines = (ctx, text, maxWidth) => {
    const paragraphs=String(text||'').split('\n');
    const all=[];
    for(const paragraph of paragraphs){
      if(!paragraph){ all.push(''); continue; }
      const words=paragraph.split(/\s+/); let line='';
      for(const word of words){
        const test=line?`${line} ${word}`:word;
        if(ctx.measureText(test).width>maxWidth && line){ all.push(line); line=word; } else line=test;
      }
      if(line) all.push(line);
    }
    return all;
  };

  const drawRoundRect = (ctx,x,y,w,h,r,fill,stroke) => {
    const rr=Math.min(r,w/2,h/2); ctx.beginPath(); ctx.moveTo(x+rr,y); ctx.arcTo(x+w,y,x+w,y+h,rr); ctx.arcTo(x+w,y+h,x,y+h,rr); ctx.arcTo(x,y+h,x,y,rr); ctx.arcTo(x,y,x+w,y,rr); ctx.closePath();
    if(fill && fill!=='transparent'){ctx.fillStyle=fill;ctx.fill();} if(stroke && stroke!=='transparent'){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}
  };

  const loadImg = src => new Promise((resolve,reject)=>{ const im=new Image(); im.onload=()=>resolve(im); im.onerror=reject; im.src=src; });

  const drawBrand = (ctx) => {
    if(!brandVisible) return;
    const padding=Math.round(Math.min(canvasWidth,canvasHeight)*.045); const fs=Math.round(Math.min(canvasWidth,canvasHeight)*.025);
    ctx.font=`800 ${fs}px Inter, Arial, sans-serif`; const text='kiocreates'; const tw=ctx.measureText(text).width; const circle=fs*1.12; const gap=fs*.45; const total=circle+gap+tw;
    let x=padding; if(brandPosition==='bottom-center') x=(canvasWidth-total)/2; if(brandPosition==='bottom-right') x=canvasWidth-padding-total;
    const y=canvasHeight-padding-circle/2;
    const darkBg = background.toLowerCase()==='#15171a' || background.toLowerCase()==='#645cff';
    ctx.fillStyle= darkBg ? '#ffffff' : BRAND.accent; ctx.beginPath(); ctx.arc(x+circle/2,y,circle/2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle= darkBg ? BRAND.accent : '#ffffff'; ctx.font=`900 ${fs*.88}px Arial, sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('f',x+circle/2,y+fs*.05);
    ctx.textAlign='left'; ctx.fillStyle=darkBg?'#ffffff':BRAND.text; ctx.font=`800 ${fs}px Inter, Arial, sans-serif`; ctx.fillText(text,x+circle+gap,y+fs*.08);
  };

  const exportImage = async (format) => {
    setExporting(true);
    try{
      const canvas=document.createElement('canvas'); canvas.width=canvasWidth; canvas.height=canvasHeight; const ctx=canvas.getContext('2d');
      if(gradient){ const g=ctx.createLinearGradient(0,0,canvasWidth,canvasHeight); g.addColorStop(0,'#ffffff'); g.addColorStop(.55,BRAND.soft); g.addColorStop(1,'#e8e6ff'); ctx.fillStyle=g; }
      else ctx.fillStyle=background;
      ctx.fillRect(0,0,canvasWidth,canvasHeight);
      const sorted=[...layers].sort((a,b)=>(a.z||0)-(b.z||0));
      for(const layer of sorted){
        ctx.save(); ctx.globalAlpha=layer.opacity ?? 1;
        if(layer.type==='shape'){
          drawRoundRect(ctx,layer.x,layer.y,layer.width,layer.height,layer.radius||0,layer.fill,layer.stroke);
        } else if(layer.type==='image'){
          try{ const im=await loadImg(layer.src); ctx.translate(layer.x+layer.width/2,layer.y+layer.height/2);ctx.rotate((layer.rotation||0)*Math.PI/180);ctx.drawImage(im,-layer.width/2,-layer.height/2,layer.width,layer.height); }catch{}
        } else if(layer.type==='text'){
          ctx.translate(layer.x+layer.width/2,layer.y);ctx.rotate((layer.rotation||0)*Math.PI/180);ctx.translate(-(layer.x+layer.width/2),-layer.y);
          ctx.fillStyle=layer.color; ctx.font=`${layer.weight||700} ${layer.fontSize}px Inter, Arial, sans-serif`; ctx.textBaseline='top'; ctx.textAlign=layer.align||'left';
          const lines=wrapLines(ctx,layer.text,layer.width); const lh=layer.fontSize*(layer.lineHeight||1.15); let xx=layer.x; if(layer.align==='center')xx=layer.x+layer.width/2; if(layer.align==='right')xx=layer.x+layer.width;
          for(let i=0;i<lines.length;i++) ctx.fillText(lines[i],xx,layer.y+i*lh);
        }
        ctx.restore();
      }
      drawBrand(ctx);
      const mime=format==='webp'?'image/webp':'image/jpeg'; const ext=format==='webp'?'webp':'jpg'; const data=canvas.toDataURL(mime,quality/100); const a=document.createElement('a'); a.href=data; a.download=`kiocreates-${sizeKey}-${Date.now()}.${ext}`; a.click();
    } finally { setExporting(false); }
  };

  const previewBackground = gradient ? 'linear-gradient(135deg,#ffffff 0%,#f0efff 55%,#e8e6ff 100%)' : background;
  const darkBrand = ['#15171a','#645cff'].includes(background.toLowerCase());

  return (
    <main className="studioShell">
      <header className="studioHeader">
        <div>
          <div className="studioBrand">kiocreates</div>
          <div className="studioSubtitle">Typography Studio</div>
        </div>
        <div className="headerActions">
          <button className="ghostBtn" onClick={()=>setBrandVisible(v=>!v)}>{brandVisible?'Brand on':'Brand off'}</button>
          <button className="primaryBtn" onClick={()=>exportImage('jpg')} disabled={exporting}>Download JPG</button>
          <button className="primaryBtn" onClick={()=>exportImage('webp')} disabled={exporting}>Download WebP</button>
        </div>
      </header>

      <section className="workspace">
        <aside className="panel leftPanel">
          <div className="panelSection">
            <div className="sectionTitle">Mode</div>
            <div className="segmented">
              <button className={mode==='template'?'active':''} onClick={()=>applyTemplate(templateId||'clean-center')}>Templates</button>
              <button className={mode==='free'?'active':''} onClick={()=>startFree()}>Free mode</button>
            </div>
          </div>

          <div className="panelSection">
            <div className="sectionTitle">Canvas</div>
            <div className="sizeGrid">
              {Object.entries(CANVAS_PRESETS).map(([key,[w,h]])=><button key={key} className={sizeKey===key?'active':''} onClick={()=>changeSize(key)}><strong>{key}</strong><span>{w} × {h}</span></button>)}
            </div>
          </div>

          {mode==='template' && <div className="panelSection growSection">
            <div className="sectionTitle">Templates <span>{templates.length}</span></div>
            <div className="templateGrid">
              {templates.map(t=><button key={t.id} className={`templateTile ${templateId===t.id?'active':''}`} onClick={()=>applyTemplate(t.id)}>
                <span className="templatePreview" style={{background:t.gradient?'linear-gradient(135deg,#fff,#f0efff,#e8e6ff)':t.bg,color:t.text}}><i style={{background:t.accent}}></i><b>Aa</b></span>
                <span>{t.name}</span>
              </button>)}
            </div>
          </div>}

          <div className="panelSection">
            <div className="sectionTitle">Add</div>
            <div className="buttonRow">
              <button className="secondaryBtn" onClick={addText}>+ Text</button>
              <button className="secondaryBtn" onClick={()=>fileRef.current?.click()}>+ Picture</button>
              <input ref={fileRef} hidden type="file" accept="image/*" onChange={e=>{addImage(e.target.files?.[0]);e.target.value='';}} />
            </div>
          </div>
        </aside>

        <section className="stageColumn">
          <div className="canvasOuter">
            <div className="canvasStage" style={{aspectRatio:`${canvasWidth}/${canvasHeight}`,background:previewBackground}} onPointerDown={()=>setSelectedId(null)}>
              {[...layers].sort((a,b)=>(a.z||0)-(b.z||0)).map(layer=>{
                const common={left:`${layer.x/canvasWidth*100}%`,top:`${layer.y/canvasHeight*100}%`,width:`${layer.width/canvasWidth*100}%`,transform:`rotate(${layer.rotation||0}deg)`,opacity:layer.opacity??1,zIndex:layer.z||1};
                if(layer.type==='shape') return <div key={layer.id} className="shapeLayer" style={{...common,height:`${layer.height/canvasHeight*100}%`,background:layer.fill,border:`2px solid ${layer.stroke||'transparent'}`,borderRadius:`${layer.radius||0}px`}}/>;
                if(layer.type==='image') return <div key={layer.id} className={`canvasLayer imageLayer ${selectedId===layer.id?'selected':''}`} style={{...common,height:`${layer.height/canvasHeight*100}%`}} onPointerDown={e=>beginDrag(e,layer)}><img src={layer.src} alt="Uploaded" draggable={false}/><span className="resizeHandle" onPointerDown={e=>beginDrag(e,layer,'resize')}/></div>;
                return <div key={layer.id} className={`canvasLayer textLayer ${selectedId===layer.id?'selected':''}`} style={{...common,fontSize:`${layer.fontSize/canvasWidth*100}cqw`,fontWeight:layer.weight,color:layer.color,textAlign:layer.align,lineHeight:layer.lineHeight||1.12,letterSpacing:layer.letterSpacing?`${layer.letterSpacing}px`:undefined}} onPointerDown={e=>beginDrag(e,layer)}><span>{layer.text}</span><span className="resizeHandle" onPointerDown={e=>beginDrag(e,layer,'resize')}/></div>;
              })}
              {brandVisible && <div className={`brandOverlay ${brandPosition}`}><FacebookBrand dark={darkBrand}/></div>}
            </div>
          </div>
          <div className="canvasMeta"><span>{mode==='template'?currentTemplate.name:'Free canvas'}</span><span>{canvasWidth} × {canvasHeight}px</span></div>
        </section>

        <aside className="panel inspectorPanel">
          {quoteLayer && mode==='template' && <div className="panelSection">
            <div className="sectionTitle">Quote</div>
            <textarea className="quoteInput" value={quoteLayer.text} onChange={e=>updateLayer(quoteLayer.id,{text:e.target.value})}/>
          </div>}

          <div className="panelSection">
            <div className="sectionTitle">Background</div>
            <div className="colorControl"><input type="color" value={background} onChange={e=>{setBackground(e.target.value);setGradient(false);}}/><input value={background} onChange={e=>{setBackground(e.target.value);setGradient(false);}}/></div>
            <label className="checkRow"><input type="checkbox" checked={gradient} onChange={e=>setGradient(e.target.checked)}/> Kiocreates soft gradient</label>
          </div>

          {selected ? <>
            <div className="panelSection">
              <div className="sectionTitle">Selected {selected.type}</div>
              {selected.type==='text' && <>
                <textarea className="smallTextarea" value={selected.text} onChange={e=>updateLayer(selected.id,{text:e.target.value})}/>
                <div className="fieldGrid">
                  <label>Size<input type="number" min="18" max="220" value={Math.round(selected.fontSize)} onChange={e=>updateLayer(selected.id,{fontSize:+e.target.value})}/></label>
                  <label>Weight<select value={selected.weight} onChange={e=>updateLayer(selected.id,{weight:+e.target.value})}><option value="400">400</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option><option value="900">900</option></select></label>
                </div>
                <div className="fieldGrid">
                  <label>Align<select value={selected.align} onChange={e=>updateLayer(selected.id,{align:e.target.value})}><option>left</option><option>center</option><option>right</option></select></label>
                  <label>Color<input type="color" value={selected.color} onChange={e=>updateLayer(selected.id,{color:e.target.value})}/></label>
                </div>
              </>}
              <label className="rangeLabel">Rotation <span>{Math.round(selected.rotation||0)}°</span><input type="range" min="-180" max="180" value={selected.rotation||0} onChange={e=>updateLayer(selected.id,{rotation:+e.target.value})}/></label>
              <label className="rangeLabel">Opacity <span>{Math.round((selected.opacity??1)*100)}%</span><input type="range" min="10" max="100" value={(selected.opacity??1)*100} onChange={e=>updateLayer(selected.id,{opacity:+e.target.value/100})}/></label>
              <div className="buttonRow"><button className="miniBtn" onClick={()=>moveLayer('down')}>Backward</button><button className="miniBtn" onClick={()=>moveLayer('up')}>Forward</button></div>
              <div className="buttonRow"><button className="miniBtn" onClick={duplicateSelected}>Duplicate</button><button className="miniBtn danger" onClick={removeSelected}>Delete</button></div>
            </div>
          </> : <div className="emptyInspector">Select text or an image on the canvas to edit it.</div>}

          <div className="panelSection">
            <div className="sectionTitle">Branding</div>
            <select className="fullSelect" value={brandPosition} onChange={e=>setBrandPosition(e.target.value)}><option value="bottom-left">Bottom left</option><option value="bottom-center">Bottom center</option><option value="bottom-right">Bottom right</option></select>
            <label className="checkRow"><input type="checkbox" checked={brandVisible} onChange={e=>setBrandVisible(e.target.checked)}/> Facebook icon + kiocreates</label>
          </div>

          <div className="panelSection">
            <div className="sectionTitle">Export quality</div>
            <label className="rangeLabel"><span>{quality}%</span><input type="range" min="60" max="100" value={quality} onChange={e=>setQuality(+e.target.value)}/></label>
            <div className="exportButtons"><button className="primaryBtn" onClick={()=>exportImage('jpg')} disabled={exporting}>JPG</button><button className="primaryBtn" onClick={()=>exportImage('webp')} disabled={exporting}>WebP</button></div>
          </div>
        </aside>
      </section>
    </main>
  );
}
