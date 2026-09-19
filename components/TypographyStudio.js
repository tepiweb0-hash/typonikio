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

const FONT_STACKS = {
  inter: 'Inter, Arial, sans-serif',
  dm: '"DM Sans", Inter, Arial, sans-serif',
  manrope: 'Manrope, Inter, Arial, sans-serif',
  space: '"Space Grotesk", Inter, Arial, sans-serif',
  poppins: 'Poppins, Inter, Arial, sans-serif',
  playfair: '"Playfair Display", Georgia, serif',
  cormorant: '"Cormorant Garamond", Georgia, serif',
  libre: '"Libre Baskerville", Georgia, serif',
  caveat: 'Caveat, "Comic Sans MS", cursive',
  bebas: '"Bebas Neue", Impact, sans-serif',
  georgia: 'Georgia, "Times New Roman", serif',
  mono: '"Courier New", Courier, monospace'
};

const FONT_OPTIONS = [
  ['Inter','inter'], ['DM Sans','dm'], ['Manrope','manrope'], ['Space Grotesk','space'], ['Poppins','poppins'],
  ['Playfair Display','playfair'], ['Cormorant Garamond','cormorant'], ['Libre Baskerville','libre'], ['Caveat','caveat'],
  ['Bebas Neue','bebas'], ['Georgia','georgia'], ['Courier New','mono']
];

const q = (font='inter', size=.064, weight=800, extra={}) => ({ font, size, weight, ...extra });

const templates = [
  { id:'clean-center', name:'Clean Center', category:'Clean', bg:'#ffffff', text:'#15171a', accent:'#645cff', blocks:[q('inter',.064,800,{x:.14,y:.26,w:.72,align:'center'})] },
  { id:'bold-left', name:'Bold Statement', category:'Bold', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', blocks:[q('inter',.075,900,{x:.09,y:.20,w:.78,align:'left'})] },
  { id:'editorial-left', name:'Editorial Left', category:'Editorial', bg:'#ffffff', text:'#15171a', accent:'#645cff', blocks:[q('playfair',.062,700,{x:.12,y:.22,w:.70,align:'left'})], topRule:true },
  { id:'soft-card', name:'Soft Card', category:'Clean', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', card:true, blocks:[q('dm',.058,700,{x:.14,y:.30,w:.72,align:'center'})] },
  { id:'purple-accent', name:'Purple Accent', category:'Clean', bg:'#ffffff', text:'#15171a', accent:'#645cff', stripe:true, blocks:[q('manrope',.061,800,{x:.13,y:.24,w:.70,align:'left'})] },
  { id:'dark', name:'Dark Kiocreates', category:'Dark', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', blocks:[q('inter',.062,800,{x:.12,y:.27,w:.76,align:'center'})] },
  { id:'quote-frame', name:'Quote Frame', category:'Clean', bg:'#ffffff', text:'#15171a', accent:'#645cff', frame:true, blocks:[q('libre',.052,700,{x:.15,y:.29,w:.70,align:'center'})] },
  { id:'big-type', name:'Big Type', category:'Bold', bg:'#f0efff', text:'#15171a', accent:'#645cff', blocks:[q('space',.088,700,{x:.08,y:.12,w:.84,align:'left',transform:'uppercase'})] },
  { id:'bottom-heavy', name:'Bottom Heavy', category:'Clean', bg:'#ffffff', text:'#15171a', accent:'#645cff', blocks:[q('manrope',.058,800,{x:.10,y:.56,w:.78,align:'left'})], cornerDot:true },
  { id:'lavender', name:'Soft Lavender', category:'Soft', bg:'#f0efff', text:'#15171a', accent:'#645cff', blocks:[q('dm',.058,700,{x:.13,y:.28,w:.74,align:'center'})] },
  { id:'micro-label', name:'Micro Label', category:'Editorial', bg:'#ffffff', text:'#15171a', accent:'#645cff', label:'relatable', blocks:[q('manrope',.058,800,{x:.12,y:.27,w:.70,align:'left'})] },
  { id:'poster', name:'Poster Type', category:'Bold', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', blocks:[q('bebas',.105,400,{x:.08,y:.11,w:.84,align:'left',transform:'uppercase',lineHeight:.94})], topRule:true },
  { id:'side-note', name:'Side Note', category:'Editorial', bg:'#ffffff', text:'#15171a', accent:'#645cff', side:true, blocks:[q('dm',.056,700,{x:.23,y:.20,w:.62,align:'left'})] },
  { id:'minimal-lower', name:'Minimal Lower', category:'Clean', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', blocks:[q('inter',.052,700,{x:.14,y:.54,w:.72,align:'center'})] },
  { id:'high-contrast', name:'High Contrast', category:'Bold', bg:'#645cff', text:'#ffffff', accent:'#ffffff', blocks:[q('space',.064,700,{x:.12,y:.25,w:.76,align:'center'})] },
  { id:'soft-gradient', name:'Soft Gradient', category:'Soft', bg:'#ffffff', text:'#15171a', accent:'#645cff', gradient:true, blocks:[q('playfair',.057,700,{x:.13,y:.28,w:.74,align:'center',style:'italic'})] },
  { id:'photo-quote', name:'Photo + Quote', category:'Photo', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', photo:true, blocks:[q('dm',.054,700,{x:.08,y:.58,w:.78,align:'left'})] },

  { id:'serif-punch', name:'Serif Punch', category:'Mixed Fonts', bg:'#ffffff', text:'#15171a', accent:'#645cff', blocks:[
    q('playfair',.070,700,{x:.10,y:.16,w:.80,align:'left',share:.42,style:'italic'}),
    q('inter',.072,900,{x:.10,y:.42,w:.80,align:'left',share:.58})
  ], cornerDot:true },
  { id:'quiet-loud', name:'Quiet / Loud', category:'Mixed Fonts', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', blocks:[
    q('cormorant',.068,600,{x:.10,y:.17,w:.78,align:'left',share:.46,style:'italic'}),
    q('space',.078,700,{x:.10,y:.43,w:.80,align:'left',share:.54,transform:'uppercase'})
  ] },
  { id:'soft-script', name:'Soft Script', category:'Mixed Fonts', bg:'#f0efff', text:'#15171a', accent:'#645cff', blocks:[
    q('caveat',.095,600,{x:.12,y:.17,w:.76,align:'center',share:.35,color:'#645cff'}),
    q('manrope',.054,700,{x:.14,y:.42,w:.72,align:'center',share:.65})
  ] },
  { id:'magazine-cut', name:'Magazine Cut', category:'Mixed Fonts', bg:'#ffffff', text:'#15171a', accent:'#645cff', topRule:true, blocks:[
    q('bebas',.095,400,{x:.09,y:.15,w:.82,align:'left',share:.46,transform:'uppercase',lineHeight:.93}),
    q('libre',.044,700,{x:.10,y:.48,w:.72,align:'left',share:.54,lineHeight:1.35})
  ] },
  { id:'two-voices', name:'Two Voices', category:'Mixed Fonts', bg:'#ffffff', text:'#15171a', accent:'#645cff', frame:true, blocks:[
    q('dm',.050,700,{x:.14,y:.20,w:.72,align:'left',share:.50,color:'#6b7280'}),
    q('playfair',.068,700,{x:.14,y:.45,w:.72,align:'right',share:.50,style:'italic',color:'#15171a'})
  ] },
  { id:'purple-whisper', name:'Purple Whisper', category:'Mixed Fonts', bg:'#ffffff', text:'#15171a', accent:'#645cff', blocks:[
    q('caveat',.082,600,{x:.11,y:.16,w:.75,align:'left',share:.30,color:'#645cff'}),
    q('inter',.061,850,{x:.11,y:.36,w:.76,align:'left',share:.70})
  ], stripe:true },
  { id:'sunday-note', name:'Sunday Note', category:'Mixed Fonts', bg:'#f7f7f8', text:'#15171a', accent:'#645cff', card:true, blocks:[
    q('libre',.052,700,{x:.15,y:.24,w:.70,align:'center',share:.64}),
    q('inter',.032,800,{x:.22,y:.58,w:.56,align:'center',share:.36,transform:'uppercase',letterSpacing:4,color:'#645cff'})
  ] },
  { id:'big-little', name:'Big + Little', category:'Mixed Fonts', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', blocks:[
    q('bebas',.115,400,{x:.07,y:.10,w:.86,align:'center',share:.42,transform:'uppercase',lineHeight:.90}),
    q('cormorant',.050,600,{x:.14,y:.53,w:.72,align:'center',share:.58,style:'italic',color:'#d8d6ff'})
  ] },
  { id:'modern-diary', name:'Modern Diary', category:'Mixed Fonts', bg:'#ffffff', text:'#15171a', accent:'#645cff', blocks:[
    q('manrope',.047,800,{x:.11,y:.18,w:.78,align:'left',share:.58}),
    q('caveat',.075,600,{x:.11,y:.50,w:.73,align:'right',share:.42,color:'#645cff'})
  ], cornerDot:true },
  { id:'headline-story', name:'Headline Story', category:'Mixed Fonts', bg:'#f0efff', text:'#15171a', accent:'#645cff', blocks:[
    q('space',.072,700,{x:.09,y:.15,w:.82,align:'left',share:.52,transform:'uppercase'}),
    q('playfair',.052,700,{x:.10,y:.49,w:.76,align:'left',share:.48,style:'italic'})
  ] },
  { id:'alternating-three', name:'Three Moods', category:'Mixed Fonts', bg:'#ffffff', text:'#15171a', accent:'#645cff', blocks:[
    q('inter',.055,850,{x:.10,y:.14,w:.80,align:'left',share:.32}),
    q('playfair',.067,700,{x:.10,y:.36,w:.80,align:'center',share:.34,style:'italic',color:'#645cff'}),
    q('space',.052,700,{x:.10,y:.63,w:.80,align:'right',share:.34,transform:'uppercase'})
  ] },
  { id:'mono-note', name:'Mono Note', category:'Mixed Fonts', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', frame:true, blocks:[
    q('mono',.045,700,{x:.14,y:.20,w:.72,align:'left',share:.58,lineHeight:1.35}),
    q('inter',.060,900,{x:.14,y:.52,w:.72,align:'left',share:.42,color:'#645cff'})
  ] },
  { id:'serif-sandwich', name:'Serif Sandwich', category:'Mixed Fonts', bg:'#ffffff', text:'#15171a', accent:'#645cff', blocks:[
    q('playfair',.055,700,{x:.12,y:.14,w:.76,align:'center',share:.28,style:'italic'}),
    q('inter',.076,900,{x:.10,y:.35,w:.80,align:'center',share:.44,transform:'uppercase'}),
    q('playfair',.048,700,{x:.14,y:.66,w:.72,align:'center',share:.28,style:'italic',color:'#645cff'})
  ] },
  { id:'lavender-editorial', name:'Lavender Editorial', category:'Editorial', bg:'#f0efff', text:'#15171a', accent:'#645cff', blocks:[
    q('playfair',.067,700,{x:.11,y:.16,w:.78,align:'left',share:.55}),
    q('dm',.040,700,{x:.11,y:.52,w:.63,align:'left',share:.45,color:'#6b7280',letterSpacing:1})
  ], topRule:true },
  { id:'tiny-huge', name:'Tiny / Huge', category:'Bold', bg:'#ffffff', text:'#15171a', accent:'#645cff', blocks:[
    q('inter',.031,800,{x:.09,y:.15,w:.62,align:'left',share:.30,transform:'uppercase',letterSpacing:5,color:'#645cff'}),
    q('bebas',.115,400,{x:.08,y:.28,w:.84,align:'left',share:.70,transform:'uppercase',lineHeight:.90})
  ] },
  { id:'serif-dark', name:'Midnight Serif', category:'Dark', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', blocks:[
    q('playfair',.065,700,{x:.12,y:.20,w:.76,align:'center',share:.70,style:'italic'}),
    q('inter',.031,800,{x:.20,y:.62,w:.60,align:'center',share:.30,transform:'uppercase',letterSpacing:5,color:'#b9b5ff'})
  ] },
  { id:'dark-script', name:'Night Note', category:'Dark', bg:'#202126', text:'#ffffff', accent:'#7b73ff', blocks:[
    q('caveat',.090,600,{x:.11,y:.16,w:.78,align:'center',share:.38,color:'#a9a4ff'}),
    q('manrope',.052,700,{x:.14,y:.45,w:.72,align:'center',share:.62})
  ] },
  { id:'purple-poster', name:'Purple Poster', category:'Bold', bg:'#645cff', text:'#ffffff', accent:'#ffffff', blocks:[
    q('bebas',.112,400,{x:.07,y:.12,w:.86,align:'center',share:.62,transform:'uppercase',lineHeight:.90}),
    q('playfair',.047,700,{x:.15,y:.63,w:.70,align:'center',share:.38,style:'italic'})
  ] },
  { id:'soft-serif-card', name:'Soft Serif Card', category:'Soft', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', card:true, blocks:[
    q('cormorant',.064,600,{x:.15,y:.24,w:.70,align:'center',share:.65,style:'italic'}),
    q('inter',.031,800,{x:.20,y:.61,w:.60,align:'center',share:.35,transform:'uppercase',letterSpacing:4,color:'#645cff'})
  ] },
  { id:'soft-bubbles', name:'Soft Blocks', category:'Soft', bg:'#ffffff', text:'#15171a', accent:'#645cff', bubble:true, blocks:[
    q('dm',.055,700,{x:.13,y:.22,w:.74,align:'center'})
  ] },
  { id:'left-right', name:'Left / Right', category:'Editorial', bg:'#ffffff', text:'#15171a', accent:'#645cff', blocks:[
    q('space',.054,700,{x:.08,y:.17,w:.64,align:'left',share:.50,transform:'uppercase'}),
    q('playfair',.057,700,{x:.28,y:.50,w:.64,align:'right',share:.50,style:'italic',color:'#645cff'})
  ], cornerDot:true },
  { id:'statement-label', name:'Statement Label', category:'Editorial', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', label:'thought of the day', blocks:[
    q('bebas',.085,400,{x:.11,y:.28,w:.78,align:'left',transform:'uppercase',lineHeight:.95})
  ] },
  { id:'bookish', name:'Bookish', category:'Editorial', bg:'#fffdf9', text:'#25231f', accent:'#645cff', frame:true, blocks:[
    q('libre',.049,700,{x:.15,y:.23,w:.70,align:'left',share:.75,lineHeight:1.4}),
    q('caveat',.061,600,{x:.18,y:.65,w:.64,align:'right',share:.25,color:'#645cff'})
  ] },
  { id:'photo-caption', name:'Photo Caption', category:'Photo', bg:'#ffffff', text:'#15171a', accent:'#645cff', photoTop:true, blocks:[
    q('playfair',.052,700,{x:.10,y:.62,w:.80,align:'left',share:.55,style:'italic'}),
    q('inter',.037,800,{x:.10,y:.78,w:.72,align:'left',share:.45,color:'#645cff'})
  ] },
  { id:'photo-editorial', name:'Photo Editorial', category:'Photo', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', photoSide:true, blocks:[
    q('space',.061,700,{x:.50,y:.18,w:.42,align:'left',share:.55,transform:'uppercase'}),
    q('playfair',.043,700,{x:.50,y:.53,w:.40,align:'left',share:.45,style:'italic',color:'#c9c6ff'})
  ] },
  { id:'photo-overlay', name:'Photo Overlay', category:'Photo', bg:'#202126', text:'#ffffff', accent:'#7b73ff', photoFull:true, overlay:true, blocks:[
    q('inter',.066,900,{x:.09,y:.56,w:.78,align:'left'})
  ] },
  { id:'photo-polaroid', name:'Photo + Note', category:'Photo', bg:'#f0efff', text:'#15171a', accent:'#645cff', polaroid:true, blocks:[
    q('caveat',.072,600,{x:.12,y:.65,w:.72,align:'center',share:.44,color:'#645cff'}),
    q('dm',.039,700,{x:.16,y:.78,w:.68,align:'center',share:.56})
  ] },
  { id:'caption-strip', name:'Caption Strip', category:'Photo', bg:'#ffffff', text:'#15171a', accent:'#645cff', photoFull:true, bottomStrip:true, blocks:[
    q('manrope',.042,800,{x:.07,y:.77,w:.86,align:'left'})
  ] },
  { id:'gradient-mix', name:'Gradient Mix', category:'Soft', bg:'#ffffff', text:'#15171a', accent:'#645cff', gradient:true, blocks:[
    q('cormorant',.070,600,{x:.11,y:.18,w:.78,align:'center',share:.45,style:'italic',color:'#645cff'}),
    q('space',.057,700,{x:.12,y:.48,w:.76,align:'center',share:.55,transform:'uppercase'})
  ] },
  { id:'clean-duo', name:'Clean Duo', category:'Mixed Fonts', bg:'#ffffff', text:'#15171a', accent:'#645cff', blocks:[
    q('dm',.047,600,{x:.14,y:.18,w:.72,align:'center',share:.52,color:'#6b7280'}),
    q('playfair',.069,700,{x:.12,y:.48,w:.76,align:'center',share:.48,style:'italic'})
  ] },
  { id:'compact-punch', name:'Compact Punch', category:'Bold', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', card:true, blocks:[
    q('bebas',.096,400,{x:.14,y:.23,w:.72,align:'center',share:.55,transform:'uppercase',lineHeight:.92}),
    q('inter',.038,800,{x:.20,y:.59,w:.60,align:'center',share:.45,color:'#645cff'})
  ] },
  { id:'center-rule', name:'Center Rule', category:'Clean', bg:'#ffffff', text:'#15171a', accent:'#645cff', centerRule:true, blocks:[
    q('playfair',.057,700,{x:.14,y:.21,w:.72,align:'center',share:.58}),
    q('inter',.036,800,{x:.18,y:.59,w:.64,align:'center',share:.42,transform:'uppercase',letterSpacing:3,color:'#645cff'})
  ] },
  { id:'offset-quote', name:'Offset Quote', category:'Editorial', bg:'#f0efff', text:'#15171a', accent:'#645cff', blocks:[
    q('space',.061,700,{x:.08,y:.18,w:.66,align:'left',share:.60}),
    q('caveat',.072,600,{x:.29,y:.57,w:.61,align:'right',share:.40,color:'#645cff'})
  ] },
  { id:'newspaper', name:'Modern Newspaper', category:'Editorial', bg:'#ffffff', text:'#15171a', accent:'#645cff', topRule:true, frame:true, blocks:[
    q('playfair',.059,700,{x:.12,y:.20,w:.76,align:'left',share:.62}),
    q('mono',.031,700,{x:.12,y:.58,w:.70,align:'left',share:.38,color:'#6b7280',lineHeight:1.35})
  ] }
];

const TEMPLATE_CATEGORIES = ['All','Mixed Fonts','Clean','Editorial','Bold','Soft','Dark','Photo'];

let layerSeq = 1;
const nextId = () => `layer-${layerSeq++}`;

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function splitQuote(text, blocks) {
  const clean = String(text || '').trim();
  if (!clean) return blocks.map(()=>'');
  const hard = clean.split(/\n+/).map(s=>s.trim()).filter(Boolean);
  if (hard.length === blocks.length) return hard;
  const words = clean.replace(/\n+/g,' ').split(/\s+/).filter(Boolean);
  if (blocks.length === 1) return [words.join(' ')];
  const shares = blocks.map(b => b.share || 1/blocks.length);
  const total = shares.reduce((a,b)=>a+b,0);
  let cursor = 0;
  return blocks.map((b, i) => {
    const remainingBlocks = blocks.length - i;
    const remainingWords = words.length - cursor;
    let count;
    if (i === blocks.length - 1) count = remainingWords;
    else count = Math.max(1, Math.round(words.length * (shares[i]/total)));
    count = Math.min(count, Math.max(1, remainingWords - (remainingBlocks - 1)));
    const part = words.slice(cursor, cursor + count).join(' ');
    cursor += count;
    return part;
  });
}

function makeQuoteLayers(template, width, height, text = starterQuote) {
  const blocks = template.blocks || [q('inter',.06,800,{x:.14,y:.26,w:.72,align:'center'})];
  const parts = splitQuote(text, blocks);
  return blocks.map((b, index) => ({
    id: nextId(), type:'text', role:'quote-part', partIndex:index, text:parts[index] || '',
    x: Math.round((b.x ?? .14) * width), y: Math.round((b.y ?? .26) * height), width: Math.round((b.w ?? .72) * width),
    fontSize: Math.max(22, Math.round((b.size ?? .06) * Math.min(width, height))), weight:b.weight ?? 800,
    fontFamily: FONT_STACKS[b.font || 'inter'], fontKey:b.font || 'inter', fontStyle:b.style || 'normal', textTransform:b.transform || 'none',
    color:b.color || template.text, align:b.align || 'left', lineHeight:b.lineHeight || 1.12, letterSpacing:b.letterSpacing || 0,
    rotation:0, opacity:1, z:10 + index
  }));
}

function templateDecorations(template, width, height) {
  const out = [];
  if (template.card) out.push({ id:nextId(), type:'shape', shape:'card', x:width*.07, y:height*.16, width:width*.86, height:height*.66, fill:'#ffffff', stroke:BRAND.line, radius:34, z:1 });
  if (template.frame) out.push({ id:nextId(), type:'shape', shape:'frame', x:width*.07, y:height*.08, width:width*.86, height:height*.78, fill:'transparent', stroke:template.bg==='#15171a'?'#36383f':BRAND.line, radius:30, z:1 });
  if (template.stripe) out.push({ id:nextId(), type:'shape', shape:'rect', x:width*.08, y:height*.24, width:Math.max(9,width*.012), height:height*.32, fill:template.accent, stroke:template.accent, radius:8, z:2 });
  if (template.side) out.push({ id:nextId(), type:'shape', shape:'rect', x:width*.10, y:height*.20, width:width*.055, height:height*.48, fill:template.accent, stroke:template.accent, radius:14, z:2 });
  if (template.topRule) out.push({ id:nextId(), type:'shape', shape:'rect', x:width*.09, y:height*.09, width:width*.30, height:Math.max(5,height*.005), fill:template.accent, stroke:template.accent, radius:99, z:2 });
  if (template.centerRule) out.push({ id:nextId(), type:'shape', shape:'rect', x:width*.40, y:height*.52, width:width*.20, height:Math.max(4,height*.004), fill:template.accent, stroke:template.accent, radius:99, z:2 });
  if (template.cornerDot) out.push({ id:nextId(), type:'shape', shape:'dot', x:width*.82, y:height*.11, width:width*.055, height:width*.055, fill:template.accent, stroke:template.accent, radius:999, z:2 });
  if (template.bubble) {
    out.push({ id:nextId(), type:'shape', shape:'bubble', x:width*.10, y:height*.17, width:width*.80, height:height*.55, fill:BRAND.soft, stroke:'transparent', radius:Math.round(width*.045), z:1 });
    out.push({ id:nextId(), type:'shape', shape:'bubble2', x:width*.67, y:height*.09, width:width*.18, height:width*.18, fill:'#e7e5ff', stroke:'transparent', radius:999, z:0 });
  }
  if (template.label) out.push({ id:nextId(), type:'text', role:'label', text:template.label.toUpperCase(), x:width*.12, y:height*.19, width:width*.42, fontSize:Math.max(18,width*.018), weight:900, fontFamily:FONT_STACKS.inter, fontKey:'inter', fontStyle:'normal', textTransform:'none', color:template.accent, align:'left', lineHeight:1, rotation:0, opacity:1, z:20, letterSpacing:4 });
  if (template.photoTop) out.push({ id:nextId(), type:'shape', shape:'photo-placeholder', x:width*.07, y:height*.07, width:width*.86, height:height*.45, fill:'#dedfe4', stroke:'transparent', radius:30, z:1 });
  if (template.photoSide) out.push({ id:nextId(), type:'shape', shape:'photo-placeholder', x:width*.07, y:height*.10, width:width*.36, height:height*.72, fill:'#33353b', stroke:'#454851', radius:28, z:1 });
  if (template.photoFull) out.push({ id:nextId(), type:'shape', shape:'photo-placeholder', x:0, y:0, width, height, fill:'#2b2d33', stroke:'transparent', radius:0, z:0 });
  if (template.overlay) out.push({ id:nextId(), type:'shape', shape:'overlay', x:0, y:height*.42, width, height:height*.58, fill:'rgba(21,23,26,.70)', stroke:'transparent', radius:0, z:2 });
  if (template.polaroid) out.push({ id:nextId(), type:'shape', shape:'photo-placeholder', x:width*.16, y:height*.08, width:width*.68, height:height*.48, fill:'#ffffff', stroke:BRAND.line, radius:22, z:1 });
  if (template.bottomStrip) out.push({ id:nextId(), type:'shape', shape:'strip', x:0, y:height*.70, width, height:height*.30, fill:'#ffffff', stroke:'transparent', radius:0, z:3 });
  return out;
}

function makeTemplateState(templateId, sizeKey, quoteText = starterQuote) {
  const [width, height] = CANVAS_PRESETS[sizeKey];
  const t = templates.find(x => x.id === templateId) || templates[0];
  return { background:t.bg, gradient:!!t.gradient, layers:[...templateDecorations(t,width,height), ...makeQuoteLayers(t,width,height,quoteText)] };
}

function getTemplateQuote(layers) {
  return layers.filter(l=>l.role==='quote-part').sort((a,b)=>(a.partIndex||0)-(b.partIndex||0)).map(l=>l.text).join(' ').replace(/\s+/g,' ').trim();
}

function rgba(hex, alpha) {
  const raw = hex.replace('#','');
  const n = parseInt(raw.length===3 ? raw.split('').map(c=>c+c).join('') : raw,16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${alpha})`;
}

function transformText(text, transform='none') {
  if (transform === 'uppercase') return String(text || '').toUpperCase();
  if (transform === 'lowercase') return String(text || '').toLowerCase();
  return String(text || '');
}

function isDarkColor(hex) {
  if (!hex || !hex.startsWith('#')) return false;
  const raw = hex.slice(1);
  if (![3,6].includes(raw.length)) return false;
  const full = raw.length===3 ? raw.split('').map(c=>c+c).join('') : raw;
  const r=parseInt(full.slice(0,2),16), g=parseInt(full.slice(2,4),16), b=parseInt(full.slice(4,6),16);
  return (0.299*r + 0.587*g + 0.114*b) < 145;
}

function FacebookBrand({ dark=false }) {
  return <div className={`brandMark ${dark ? 'brandMarkDark' : ''}`}><span className="fbCircle">f</span><span>kiocreates</span></div>;
}

export default function TypographyStudio() {
  const [mode, setMode] = useState('template');
  const [sizeKey, setSizeKey] = useState('square');
  const [templateId, setTemplateId] = useState('clean-center');
  const [templateCategory, setTemplateCategory] = useState('All');
  const initial = useMemo(() => makeTemplateState('clean-center','square'), []);
  const [background, setBackground] = useState(initial.background);
  const [gradient, setGradient] = useState(initial.gradient);
  const [layers, setLayers] = useState(initial.layers);
  const [selectedId, setSelectedId] = useState(initial.layers.find(l=>l.role==='quote-part')?.id || null);
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
    const quote = getTemplateQuote(layers) || starterQuote;
    const next = makeTemplateState(id, key, quote);
    setTemplateId(id);
    setMode('template');
    setBackground(next.background);
    setGradient(next.gradient);
    setLayers(next.layers);
    setSelectedId(next.layers.find(l=>l.role==='quote-part')?.id || null);
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
      color:BRAND.text, align:'center', lineHeight:1.12, rotation:0, opacity:1, z:Math.max(10,...layers.map(l=>l.z||1))+1,
      fontFamily:FONT_STACKS.inter, fontKey:'inter', fontStyle:'normal', textTransform:'none', letterSpacing:0
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

  const templateQuote = getTemplateQuote(layers);
  const filteredTemplates = templateCategory==='All' ? templates : templates.filter(t=>t.category===templateCategory);

  const updateTemplateQuote = (text) => {
    if (mode !== 'template' || !templateId) return;
    const t = templates.find(x=>x.id===templateId) || templates[0];
    const nextQuote = makeQuoteLayers(t, canvasWidth, canvasHeight, text);
    setLayers(prev => [...prev.filter(l=>l.role!=='quote-part'), ...nextQuote]);
    setSelectedId(nextQuote[0]?.id || null);
  };

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
    const darkBg = isDarkColor(background);
    ctx.fillStyle= darkBg ? '#ffffff' : BRAND.accent; ctx.beginPath(); ctx.arc(x+circle/2,y,circle/2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle= darkBg ? BRAND.accent : '#ffffff'; ctx.font=`900 ${fs*.88}px Arial, sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('f',x+circle/2,y+fs*.05);
    ctx.textAlign='left'; ctx.fillStyle=darkBg?'#ffffff':BRAND.text; ctx.font=`800 ${fs}px Inter, Arial, sans-serif`; ctx.fillText(text,x+circle+gap,y+fs*.08);
  };

  const exportImage = async (format) => {
    setExporting(true);
    try{
      if (document.fonts?.ready) await document.fonts.ready;
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
          ctx.fillStyle=layer.color;
          const stylePrefix=layer.fontStyle==='italic'?'italic ':'';
          ctx.font=`${stylePrefix}${layer.weight||700} ${layer.fontSize}px ${layer.fontFamily||FONT_STACKS.inter}`;
          if ('letterSpacing' in ctx) ctx.letterSpacing=`${layer.letterSpacing||0}px`;
          ctx.textBaseline='top'; ctx.textAlign=layer.align||'left';
          const exportText=transformText(layer.text,layer.textTransform);
          const lines=wrapLines(ctx,exportText,layer.width); const lh=layer.fontSize*(layer.lineHeight||1.15); let xx=layer.x; if(layer.align==='center')xx=layer.x+layer.width/2; if(layer.align==='right')xx=layer.x+layer.width;
          for(let i=0;i<lines.length;i++) ctx.fillText(lines[i],xx,layer.y+i*lh);
        }
        ctx.restore();
      }
      drawBrand(ctx);
      const mime=format==='webp'?'image/webp':'image/jpeg'; const ext=format==='webp'?'webp':'jpg'; const data=canvas.toDataURL(mime,quality/100); const a=document.createElement('a'); a.href=data; a.download=`kiocreates-${sizeKey}-${Date.now()}.${ext}`; a.click();
    } finally { setExporting(false); }
  };

  const previewBackground = gradient ? 'linear-gradient(135deg,#ffffff 0%,#f0efff 55%,#e8e6ff 100%)' : background;
  const darkBrand = isDarkColor(background);

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
            <div className="templateFilters">
              {TEMPLATE_CATEGORIES.map(cat=><button key={cat} className={templateCategory===cat?'active':''} onClick={()=>setTemplateCategory(cat)}>{cat}</button>)}
            </div>
            <div className="templateGrid">
              {filteredTemplates.map(t=>{
                const a=t.blocks?.[0]||q(); const b=t.blocks?.[1];
                return <button key={t.id} className={`templateTile ${templateId===t.id?'active':''}`} onClick={()=>applyTemplate(t.id)}>
                  <span className="templatePreview" style={{background:t.gradient?'linear-gradient(135deg,#fff,#f0efff,#e8e6ff)':t.bg,color:t.text}}>
                    <i style={{background:t.accent}}></i>
                    <span className="previewType previewTypeOne" style={{fontFamily:FONT_STACKS[a.font||'inter'],fontStyle:a.style||'normal',fontWeight:a.weight||700}}>Aa</span>
                    {b && <span className="previewType previewTypeTwo" style={{fontFamily:FONT_STACKS[b.font||'inter'],fontStyle:b.style||'normal',fontWeight:b.weight||700}}>type</span>}
                  </span>
                  <span className="templateName">{t.name}</span><small>{t.category}</small>
                </button>;
              })}
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
                return <div key={layer.id} className={`canvasLayer textLayer ${selectedId===layer.id?'selected':''}`} style={{...common,fontSize:`${layer.fontSize/canvasWidth*100}cqw`,fontWeight:layer.weight,fontFamily:layer.fontFamily||FONT_STACKS.inter,fontStyle:layer.fontStyle||'normal',textTransform:layer.textTransform||'none',color:layer.color,textAlign:layer.align,lineHeight:layer.lineHeight||1.12,letterSpacing:layer.letterSpacing?`${layer.letterSpacing}px`:undefined}} onPointerDown={e=>beginDrag(e,layer)}><span>{layer.text}</span><span className="resizeHandle" onPointerDown={e=>beginDrag(e,layer,'resize')}/></div>;
              })}
              {brandVisible && <div className={`brandOverlay ${brandPosition}`}><FacebookBrand dark={darkBrand}/></div>}
            </div>
          </div>
          <div className="canvasMeta"><span>{mode==='template'?currentTemplate.name:'Free canvas'}</span><span>{canvasWidth} × {canvasHeight}px</span></div>
        </section>

        <aside className="panel inspectorPanel">
          {mode==='template' && <div className="panelSection">
            <div className="sectionTitle">Quote <span>auto-split</span></div>
            <textarea className="quoteInput" value={templateQuote} onChange={e=>updateTemplateQuote(e.target.value)} placeholder="Type your quote…"/>
            <div className="helperText">Mixed-font templates automatically divide the quote into styled sections. Add line breaks equal to the number of sections for exact control.</div>
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
                <label className="fontField">Font<select className="fullSelect" value={selected.fontKey||'inter'} onChange={e=>updateLayer(selected.id,{fontKey:e.target.value,fontFamily:FONT_STACKS[e.target.value]})}>{FONT_OPTIONS.map(([label,key])=><option key={key} value={key}>{label}</option>)}</select></label>
                <div className="fieldGrid">
                  <label>Size<input type="number" min="18" max="220" value={Math.round(selected.fontSize)} onChange={e=>updateLayer(selected.id,{fontSize:+e.target.value})}/></label>
                  <label>Weight<select value={selected.weight} onChange={e=>updateLayer(selected.id,{weight:+e.target.value})}><option value="400">400</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option><option value="900">900</option></select></label>
                </div>
                <div className="fieldGrid">
                  <label>Align<select value={selected.align} onChange={e=>updateLayer(selected.id,{align:e.target.value})}><option>left</option><option>center</option><option>right</option></select></label>
                  <label>Color<input type="color" value={selected.color} onChange={e=>updateLayer(selected.id,{color:e.target.value})}/></label>
                </div>
                <div className="fieldGrid">
                  <label>Style<select value={selected.fontStyle||'normal'} onChange={e=>updateLayer(selected.id,{fontStyle:e.target.value})}><option value="normal">Normal</option><option value="italic">Italic</option></select></label>
                  <label>Case<select value={selected.textTransform||'none'} onChange={e=>updateLayer(selected.id,{textTransform:e.target.value})}><option value="none">Original</option><option value="uppercase">UPPERCASE</option><option value="lowercase">lowercase</option></select></label>
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
