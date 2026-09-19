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

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Manrope', value: 'Manrope, Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Space Grotesk', value: '"Space Grotesk", Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Playfair Display', value: '"Playfair Display", Georgia, serif' },
  { label: 'Cormorant Garamond', value: '"Cormorant Garamond", Georgia, serif' },
  { label: 'DM Serif Display', value: '"DM Serif Display", Georgia, serif' },
  { label: 'Libre Baskerville', value: '"Libre Baskerville", Georgia, serif' },
  { label: 'Bebas Neue', value: '"Bebas Neue", Impact, sans-serif' },
  { label: 'Oswald', value: 'Oswald, Arial, sans-serif' },
  { label: 'Caveat', value: 'Caveat, cursive' }
];

const FONT_VALUES = FONT_OPTIONS.reduce((acc, item) => ({ ...acc, [item.label]: item.value }), {});
const defaultFont = FONT_VALUES['Inter'];

const starterQuote = 'some days i just want to disappear for a bit and come back when everything feels lighter.';

const templates = [
  // MINIMAL
  { id:'clean-center', name:'Clean Center', category:'Minimal', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.26,w:.72,size:.064,weight:800, font:defaultFont },
  { id:'clean-left', name:'Clean Left', category:'Minimal', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.11,y:.24,w:.72,size:.058,weight:800, font:defaultFont },
  { id:'clean-right', name:'Clean Right', category:'Minimal', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'right', x:.17,y:.28,w:.72,size:.057,weight:780, font:defaultFont },
  { id:'minimal-lower', name:'Minimal Lower', category:'Minimal', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.54,w:.72,size:.052,weight:760, font:defaultFont },
  { id:'air-left', name:'Airy Left', category:'Minimal', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.36,w:.62,size:.050,weight:700, font:defaultFont, topLine:true },
  { id:'quiet-frame', name:'Quiet Frame', category:'Minimal', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.16,y:.31,w:.68,size:.052,weight:760, font:defaultFont, frame:true },
  { id:'micro-label', name:'Micro Label', category:'Minimal', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.12,y:.27,w:.70,size:.058,weight:820, font:defaultFont, label:'relatable' },
  { id:'tiny-accent', name:'Tiny Accent', category:'Minimal', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.13,y:.29,w:.70,size:.055,weight:800, font:defaultFont, corner:true },

  // EDITORIAL
  { id:'editorial-left', name:'Editorial Left', category:'Editorial', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.12,y:.22,w:.66,size:.058,weight:750, font:FONT_VALUES['Playfair Display'], topLine:true },
  { id:'editorial-center', name:'Editorial Center', category:'Editorial', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.29,w:.72,size:.056,weight:760, font:FONT_VALUES['Playfair Display'], quoteMark:true },
  { id:'editorial-bottom', name:'Editorial Bottom', category:'Editorial', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.56,w:.74,size:.056,weight:800, font:FONT_VALUES['Playfair Display'], topPanel:true },
  { id:'editorial-column', name:'Editorial Column', category:'Editorial', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.27,y:.20,w:.58,size:.056,weight:780, font:FONT_VALUES['Libre Baskerville'], side:true },
  { id:'editorial-rule', name:'Editorial Rule', category:'Editorial', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.11,y:.31,w:.70,size:.059,weight:820, font:FONT_VALUES['Libre Baskerville'], twinBars:true },
  { id:'editorial-box', name:'Editorial Box', category:'Editorial', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'left', x:.14,y:.29,w:.66,size:.057,weight:810, font:FONT_VALUES['Playfair Display'], card:true, label:'note' },
  { id:'editorial-offset', name:'Offset Type', category:'Editorial', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.20,y:.18,w:.68,size:.064,weight:850, font:FONT_VALUES['Cormorant Garamond'], accentBox:true },
  { id:'caption-style', name:'Caption Style', category:'Editorial', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.46,w:.76,size:.051,weight:760, font:FONT_VALUES['Inter'], topLine:true, label:'kiocreates' },

  // BOLD
  { id:'bold-left', name:'Bold Statement', category:'Bold', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'left', x:.09,y:.20,w:.72,size:.075,weight:900, font:FONT_VALUES['Space Grotesk'] },
  { id:'big-type', name:'Big Type', category:'Bold', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'left', x:.08,y:.12,w:.82,size:.090,weight:900, font:FONT_VALUES['Bebas Neue'], letterSpacing:1.2 },
  { id:'poster', name:'Poster Type', category:'Bold', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', align:'left', x:.08,y:.12,w:.84,size:.082,weight:900, font:FONT_VALUES['Bebas Neue'], poster:true },
  { id:'high-contrast', name:'High Contrast', category:'Bold', bg:'#645cff', text:'#ffffff', accent:'#ffffff', align:'center', x:.12,y:.25,w:.76,size:.065,weight:900, font:FONT_VALUES['Space Grotesk'] },
  { id:'purple-accent', name:'Purple Accent', category:'Bold', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.12,y:.24,w:.70,size:.062,weight:850, font:FONT_VALUES['Space Grotesk'], stripe:true },
  { id:'split-emphasis', name:'Split Emphasis', category:'Bold', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.18,w:.72,size:.068,weight:900, font:FONT_VALUES['Space Grotesk'], accentBlock:true },
  { id:'bold-framed', name:'Bold Framed', category:'Bold', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.13,y:.27,w:.74,size:.067,weight:900, font:FONT_VALUES['Bebas Neue'], frame:true },
  { id:'bold-banner', name:'Bold Banner', category:'Bold', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.34,w:.78,size:.068,weight:900, font:FONT_VALUES['Bebas Neue'], lowerPanel:true },

  // SOFT
  { id:'soft-card', name:'Soft Card', category:'Soft', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.30,w:.72,size:.058,weight:800, font:FONT_VALUES['Inter'], card:true },
  { id:'lavender', name:'Soft Lavender', category:'Soft', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'center', x:.13,y:.28,w:.74,size:.060,weight:820, font:FONT_VALUES['Plus Jakarta Sans'] },
  { id:'soft-gradient', name:'Soft Gradient', category:'Soft', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.13,y:.28,w:.74,size:.058,weight:800, font:FONT_VALUES['Plus Jakarta Sans'], gradient:true },
  { id:'soft-pill', name:'Soft Pill', category:'Soft', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.32,w:.72,size:.055,weight:800, font:FONT_VALUES['Inter'], pill:true },
  { id:'soft-frame', name:'Soft Frame', category:'Soft', bg:'#f0efff', text:'#15171a', accent:'#7b73ff', align:'center', x:.15,y:.30,w:.70,size:.054,weight:770, font:FONT_VALUES['Plus Jakarta Sans'], frame:true, quoteMark:true },
  { id:'soft-note', name:'Soft Note', category:'Soft', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'left', x:.14,y:.29,w:.68,size:.054,weight:760, font:FONT_VALUES['Inter'], card:true, label:'soft truth' },
  { id:'soft-window', name:'Soft Window', category:'Soft', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'left', x:.15,y:.32,w:.67,size:.054,weight:780, font:FONT_VALUES['Cormorant Garamond'], insetCard:true },
  { id:'soft-orb', name:'Soft Orb', category:'Soft', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.20,y:.34,w:.60,size:.055,weight:780, font:FONT_VALUES['DM Serif Display'], orb:true },

  // DARK
  { id:'dark', name:'Dark Kiocreates', category:'Dark', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', align:'center', x:.12,y:.27,w:.76,size:.062,weight:800, font:FONT_VALUES['Inter'] },
  { id:'dark-left', name:'Dark Left', category:'Dark', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', align:'left', x:.10,y:.24,w:.74,size:.062,weight:850, font:FONT_VALUES['Space Grotesk'], stripe:true },
  { id:'dark-frame', name:'Dark Frame', category:'Dark', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', align:'center', x:.14,y:.29,w:.72,size:.057,weight:800, font:FONT_VALUES['Inter'], frameDark:true },
  { id:'dark-card', name:'Dark Card', category:'Dark', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', align:'left', x:.14,y:.31,w:.68,size:.056,weight:800, font:FONT_VALUES['Cormorant Garamond'], darkCard:true },
  { id:'dark-poster', name:'Dark Poster', category:'Dark', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', align:'left', x:.08,y:.14,w:.84,size:.084,weight:900, font:FONT_VALUES['Bebas Neue'], topLine:true },
  { id:'purple-night', name:'Purple Night', category:'Dark', bg:'#28233f', text:'#ffffff', accent:'#8d86ff', align:'center', x:.13,y:.28,w:.74,size:.060,weight:850, font:FONT_VALUES['DM Serif Display'], quoteMark:true },
  { id:'dark-split', name:'Dark Split', category:'Dark', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', align:'left', x:.30,y:.22,w:.60,size:.061,weight:850, font:FONT_VALUES['Space Grotesk'], leftPanelDark:true },
  { id:'dark-minimal', name:'Dark Minimal', category:'Dark', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', align:'center', x:.18,y:.37,w:.64,size:.051,weight:720, font:FONT_VALUES['Inter'], bottomLineDark:true },

  // PHOTO
  { id:'photo-quote', name:'Photo + Quote', category:'Photo', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', align:'left', x:.08,y:.58,w:.78,size:.055,weight:820, font:FONT_VALUES['Inter'], photoSlot:'top' },
  { id:'photo-left', name:'Photo Left', category:'Photo', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.52,y:.22,w:.38,size:.050,weight:800, font:FONT_VALUES['Playfair Display'], photoSlot:'left' },
  { id:'photo-right', name:'Photo Right', category:'Photo', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.24,w:.38,size:.050,weight:800, font:FONT_VALUES['Playfair Display'], photoSlot:'right' },
  { id:'photo-top', name:'Photo Top', category:'Photo', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.13,y:.61,w:.74,size:.050,weight:800, font:FONT_VALUES['Inter'], photoSlot:'top' },
  { id:'photo-card', name:'Photo Card', category:'Photo', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'left', x:.13,y:.57,w:.72,size:.052,weight:820, font:FONT_VALUES['Inter'], card:true, photoSlot:'cardTop' },
  { id:'photo-polaroid', name:'Photo Polaroid', category:'Photo', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.68,w:.72,size:.047,weight:780, font:FONT_VALUES['Caveat'], photoSlot:'polaroid' },
  { id:'photo-banner', name:'Photo Banner', category:'Photo', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.45,w:.78,size:.054,weight:850, font:FONT_VALUES['Space Grotesk'], photoSlot:'banner' },

  // MIXED FONTS
  { id:'mix-serifsans', name:'Serif + Sans', category:'Mixed', bg:'#ffffff', text:'#15171a', accent:'#645cff', mixed:'two', x:.10,y:.20,w:.80, fontA:FONT_VALUES['Playfair Display'], fontB:FONT_VALUES['Inter'] },
  { id:'mix-script-modern', name:'Script + Modern', category:'Mixed', bg:'#f0efff', text:'#15171a', accent:'#645cff', mixed:'two', x:.12,y:.24,w:.76, fontA:FONT_VALUES['Caveat'], fontB:FONT_VALUES['Manrope'] },
  { id:'mix-poster-seriff', name:'Poster + Serif', category:'Mixed', bg:'#ffffff', text:'#15171a', accent:'#645cff', mixed:'three', x:.08,y:.17,w:.84, fontA:FONT_VALUES['Bebas Neue'], fontB:FONT_VALUES['Libre Baskerville'], fontC:FONT_VALUES['Inter'] },
  { id:'mix-cormorant-space', name:'Cormorant + Space', category:'Mixed', bg:'#ffffff', text:'#15171a', accent:'#645cff', mixed:'two', x:.12,y:.22,w:.76, fontA:FONT_VALUES['Cormorant Garamond'], fontB:FONT_VALUES['Space Grotesk'] },
  { id:'mix-label', name:'Magazine Mix', category:'Mixed', bg:'#ffffff', text:'#15171a', accent:'#645cff', mixed:'three', x:.12,y:.18,w:.76, fontA:FONT_VALUES['DM Serif Display'], fontB:FONT_VALUES['Inter'], fontC:FONT_VALUES['Caveat'], label:'kiocreates' },
  { id:'mix-dark', name:'Dark Mixed', category:'Mixed', bg:'#15171a', text:'#ffffff', accent:'#8d86ff', mixed:'two', x:.10,y:.22,w:.80, fontA:FONT_VALUES['Bebas Neue'], fontB:FONT_VALUES['Cormorant Garamond'] },

  // EFFECTS
  { id:'effect-outline', name:'Outline', category:'Effects', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.12,y:.27,w:.76,size:.075,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'outline' },
  { id:'effect-echo', name:'Echo', category:'Effects', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.22,w:.76,size:.072,weight:900, font:FONT_VALUES['Space Grotesk'], effect:'echo' },
  { id:'effect-repeat', name:'Repeat Lines', category:'Effects', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.33,w:.72,size:.055,weight:800, font:FONT_VALUES['Inter'], effect:'repeat' },
  { id:'effect-fade', name:'Faded Ghost', category:'Effects', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.16,y:.34,w:.68,size:.058,weight:820, font:FONT_VALUES['Inter'], effect:'fade' },
  { id:'effect-watermark', name:'Watermark Word', category:'Effects', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.42,w:.74,size:.052,weight:800, font:FONT_VALUES['Inter'], effect:'watermark' },
  { id:'effect-pill-stack', name:'Rounded Stack', category:'Effects', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.18,y:.33,w:.64,size:.054,weight:820, font:FONT_VALUES['Inter'], effect:'pill-stack' },
  { id:'effect-orbit', name:'Orbit Note', category:'Effects', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.24,y:.34,w:.52,size:.050,weight:780, font:FONT_VALUES['DM Serif Display'], effect:'orbit' },
  { id:'effect-side-repeat', name:'Side Repeat', category:'Effects', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.24,y:.21,w:.62,size:.056,weight:800, font:FONT_VALUES['Inter'], effect:'side-repeat' },
  { id:'effect-stacked', name:'Stacked Words', category:'Effects', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.18,w:.58,size:.070,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'stacked' },
  { id:'effect-double-shadow', name:'Double Shadow', category:'Effects', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'center', x:.12,y:.25,w:.76,size:.068,weight:900, font:FONT_VALUES['Space Grotesk'], effect:'double-shadow' },
  { id:'effect-sheer', name:'Sheer Fade', category:'Effects', bg:'#15171a', text:'#ffffff', accent:'#7b73ff', align:'center', x:.14,y:.30,w:.72,size:.064,weight:820, font:FONT_VALUES['Inter'], effect:'sheer' },
  { id:'effect-round-badge', name:'Round Badge', category:'Effects', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'center', x:.26,y:.38,w:.48,size:.045,weight:760, font:FONT_VALUES['Playfair Display'], effect:'round-badge' },
  { id:'effect-underlay-word', name:'Underlay Word', category:'Effects', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.09,y:.48,w:.80,size:.050,weight:760, font:FONT_VALUES['Inter'], effect:'underlay' },
  { id:'effect-repeat-grid', name:'Repeat Grid', category:'Effects', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.18,y:.36,w:.64,size:.050,weight:790, font:FONT_VALUES['Inter'], effect:'repeat-grid' },
  { id:'effect-dual-line', name:'Dual Line', category:'Effects', bg:'#15171a', text:'#ffffff', accent:'#8d86ff', align:'left', x:.10,y:.24,w:.76,size:.058,weight:840, font:FONT_VALUES['Inter'], effect:'dual-line' },
  { id:'effect-poster-repeat', name:'Poster Repeat', category:'Effects', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.08,y:.16,w:.84,size:.084,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'poster-repeat' },
  { id:'effect-soft-glow', name:'Soft Glow', category:'Effects', bg:'#28233f', text:'#ffffff', accent:'#9b95ff', align:'center', x:.15,y:.28,w:.70,size:.060,weight:800, font:FONT_VALUES['DM Serif Display'], effect:'soft-glow' }
];

const TEMPLATE_CATEGORIES = ['All', ...new Set(templates.map((t) => t.category))];

let layerSeq = 1;
const nextId = () => `layer-${layerSeq++}`;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rgba(hex, alpha) {
  const raw = String(hex || '#000').replace('#', '');
  const expanded = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const n = parseInt(expanded, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function wordsToKey(text, count = 2) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, count)
    .join(' ')
    .toUpperCase() || 'MOOD';
}

function splitForMix(text, parts = 2) {
  const manual = String(text || '').split('\n').filter(Boolean);
  if (manual.length >= parts) return manual.slice(0, parts);
  const words = String(text || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (!words.length) return Array(parts).fill('');
  const size = Math.ceil(words.length / parts);
  const out = [];
  for (let i = 0; i < parts; i++) out.push(words.slice(i * size, (i + 1) * size).join(' '));
  while (out.length < parts) out.push('');
  return out;
}

function makeTextLayer({
  text,
  x,
  y,
  width,
  fontSize,
  weight = 800,
  color = BRAND.text,
  align = 'left',
  z = 10,
  fontFamily = defaultFont,
  opacity = 1,
  lineHeight = 1.1,
  rotation = 0,
  letterSpacing = 0,
  strokeColor,
  strokeWidth,
  shadowColor,
  shadowBlur,
  shadowX,
  shadowY,
  uppercase,
  blendMode
}) {
  return {
    id: nextId(),
    type: 'text',
    role: 'quote',
    text,
    x,
    y,
    width,
    fontSize,
    weight,
    color,
    align,
    z,
    fontFamily,
    opacity,
    lineHeight,
    rotation,
    letterSpacing,
    strokeColor,
    strokeWidth,
    shadowColor,
    shadowBlur,
    shadowX,
    shadowY,
    uppercase,
    blendMode
  };
}

function makeShapeLayer({ x, y, width, height, fill = 'transparent', stroke = 'transparent', radius = 0, z = 1 }) {
  return { id: nextId(), type: 'shape', x, y, width, height, fill, stroke, radius, z };
}

function makePhotoPlaceholder(slot, width, height, dark = false) {
  const common = { fill: dark ? rgba('#ffffff', 0.08) : rgba(BRAND.accent, 0.08), stroke: dark ? rgba('#ffffff', 0.18) : rgba(BRAND.accent, 0.18), radius: 28, z: 1 };
  if (slot === 'left') return makeShapeLayer({ x: width * 0.08, y: height * 0.13, width: width * 0.34, height: height * 0.72, ...common });
  if (slot === 'right') return makeShapeLayer({ x: width * 0.58, y: height * 0.13, width: width * 0.34, height: height * 0.72, ...common });
  if (slot === 'top') return makeShapeLayer({ x: width * 0.08, y: height * 0.08, width: width * 0.84, height: height * 0.38, ...common });
  if (slot === 'cardTop') return makeShapeLayer({ x: width * 0.12, y: height * 0.14, width: width * 0.76, height: height * 0.34, ...common });
  if (slot === 'polaroid') return makeShapeLayer({ x: width * 0.20, y: height * 0.12, width: width * 0.60, height: height * 0.44, fill: '#fff', stroke: BRAND.line, radius: 10, z: 1 });
  if (slot === 'banner') return makeShapeLayer({ x: width * 0.08, y: height * 0.16, width: width * 0.84, height: height * 0.18, fill: rgba(BRAND.accent, 0.10), stroke: 'transparent', radius: 26, z: 1 });
  return makeShapeLayer({ x: width * 0.08, y: height * 0.08, width: width * 0.84, height: height * 0.38, ...common });
}

function makeQuoteLayer(template, width, height, text = starterQuote) {
  const layer = makeTextLayer({
    text,
    x: Math.round(template.x * width),
    y: Math.round(template.y * height),
    width: Math.round(template.w * width),
    fontSize: Math.max(26, Math.round(template.size * Math.min(width, height))),
    weight: template.weight,
    color: template.text,
    align: template.align,
    z: 10,
    fontFamily: template.font || defaultFont,
    letterSpacing: template.letterSpacing || 0,
    lineHeight: template.lineHeight || 1.12,
    uppercase: template.uppercase || false
  });

  switch (template.effect) {
    case 'outline':
      layer.strokeColor = template.accent;
      layer.strokeWidth = Math.max(2, Math.round(layer.fontSize * 0.06));
      layer.color = rgba('#ffffff', 0.15);
      layer.uppercase = true;
      break;
    case 'double-shadow':
      layer.shadowColor = rgba(template.accent, 0.30);
      layer.shadowBlur = 0;
      layer.shadowX = Math.round(layer.fontSize * 0.08);
      layer.shadowY = Math.round(layer.fontSize * 0.08);
      layer.uppercase = true;
      break;
    case 'soft-glow':
      layer.shadowColor = rgba(template.accent, 0.75);
      layer.shadowBlur = Math.round(layer.fontSize * 0.35);
      layer.shadowX = 0;
      layer.shadowY = 0;
      break;
    case 'sheer':
      layer.opacity = 0.92;
      break;
    case 'poster-repeat':
      layer.uppercase = true;
      break;
    default:
      break;
  }
  return layer;
}

function templateDecorations(template, width, height, quoteText) {
  const out = [];
  const darkStroke = rgba('#ffffff', 0.12);

  if (template.card) out.push(makeShapeLayer({ x: width * 0.07, y: height * 0.16, width: width * 0.86, height: height * 0.66, fill: '#ffffff', stroke: BRAND.line, radius: 34, z: 1 }));
  if (template.frame) out.push(makeShapeLayer({ x: width * 0.07, y: height * 0.08, width: width * 0.86, height: height * 0.78, fill: 'transparent', stroke: BRAND.line, radius: 30, z: 1 }));
  if (template.frameDark) out.push(makeShapeLayer({ x: width * 0.07, y: height * 0.08, width: width * 0.86, height: height * 0.78, fill: 'transparent', stroke: darkStroke, radius: 30, z: 1 }));
  if (template.insetCard) out.push(makeShapeLayer({ x: width * 0.11, y: height * 0.16, width: width * 0.78, height: height * 0.60, fill: rgba('#ffffff', 0.78), stroke: rgba(BRAND.accent, 0.16), radius: 34, z: 1 }));
  if (template.darkCard) out.push(makeShapeLayer({ x: width * 0.10, y: height * 0.19, width: width * 0.80, height: height * 0.60, fill: rgba('#ffffff', 0.06), stroke: darkStroke, radius: 34, z: 1 }));
  if (template.orb) out.push(makeShapeLayer({ x: width * 0.20, y: height * 0.15, width: width * 0.60, height: height * 0.60, fill: BRAND.soft, stroke: rgba(BRAND.accent, 0.12), radius: height * 0.30, z: 1 }));
  if (template.pill) out.push(makeShapeLayer({ x: width * 0.12, y: height * 0.24, width: width * 0.76, height: height * 0.36, fill: BRAND.soft, stroke: 'transparent', radius: height * 0.18, z: 1 }));
  if (template.stripe) out.push(makeShapeLayer({ x: width * 0.08, y: height * 0.24, width: Math.max(9, width * 0.012), height: height * 0.32, fill: template.accent, stroke: template.accent, radius: 8, z: 2 }));
  if (template.side) out.push(makeShapeLayer({ x: width * 0.10, y: height * 0.20, width: width * 0.055, height: height * 0.48, fill: template.accent, stroke: template.accent, radius: 14, z: 2 }));
  if (template.leftPanelDark) out.push(makeShapeLayer({ x: width * 0.08, y: height * 0.12, width: width * 0.17, height: height * 0.76, fill: rgba(template.accent, 0.18), stroke: 'transparent', radius: 0, z: 1 }));
  if (template.accentBox) out.push(makeShapeLayer({ x: width * 0.12, y: height * 0.14, width: width * 0.28, height: height * 0.18, fill: BRAND.soft, stroke: 'transparent', radius: 24, z: 1 }));
  if (template.accentBlock) out.push(makeShapeLayer({ x: width * 0.08, y: height * 0.14, width: width * 0.48, height: height * 0.18, fill: BRAND.soft, stroke: 'transparent', radius: 12, z: 1 }));
  if (template.topPanel) out.push(makeShapeLayer({ x: width * 0.00, y: height * 0.00, width, height: height * 0.20, fill: BRAND.soft, stroke: 'transparent', radius: 0, z: 1 }));
  if (template.lowerPanel) out.push(makeShapeLayer({ x: width * 0.00, y: height * 0.54, width, height: height * 0.24, fill: BRAND.soft, stroke: 'transparent', radius: 0, z: 1 }));
  if (template.bottomLine || template.bottomLineDark) out.push(makeShapeLayer({ x: width * 0.16, y: height * 0.82, width: width * 0.68, height: 4, fill: template.bottomLineDark ? rgba('#ffffff', 0.25) : template.accent, stroke: 'transparent', radius: 4, z: 1 }));
  if (template.topLine) out.push(makeShapeLayer({ x: width * 0.10, y: height * 0.14, width: width * 0.16, height: 4, fill: template.accent, stroke: 'transparent', radius: 4, z: 1 }));
  if (template.twinBars) {
    out.push(makeShapeLayer({ x: width * 0.11, y: height * 0.24, width: width * 0.18, height: 5, fill: BRAND.accent, stroke: 'transparent', radius: 5, z: 1 }));
    out.push(makeShapeLayer({ x: width * 0.11, y: height * 0.27, width: width * 0.10, height: 5, fill: rgba(BRAND.accent, 0.35), stroke: 'transparent', radius: 5, z: 1 }));
  }
  if (template.corner) out.push(makeShapeLayer({ x: width * 0.82, y: height * 0.10, width: width * 0.10, height: width * 0.10, fill: BRAND.soft, stroke: rgba(BRAND.accent, 0.18), radius: 26, z: 1 }));
  if (template.quoteMark) {
    out.push(makeTextLayer({ text: '“', x: width * 0.11, y: height * 0.12, width: width * 0.12, fontSize: Math.round(Math.min(width, height) * 0.18), weight: 900, color: rgba(template.accent, 0.20), align: 'left', z: 1, fontFamily: FONT_VALUES['DM Serif Display'], lineHeight: 0.9 }));
    out[out.length - 1].role = 'decor';
  }
  if (template.label) {
    const label = makeTextLayer({ text: template.label.toUpperCase(), x: width * 0.12, y: height * 0.19, width: width * 0.40, fontSize: Math.max(18, width * 0.018), weight: 900, color: template.accent, align: 'left', z: 12, fontFamily: defaultFont, lineHeight: 1, letterSpacing: 4 });
    label.role = 'decor';
    out.push(label);
  }
  if (template.photoSlot) out.push(makePhotoPlaceholder(template.photoSlot, width, height, template.bg === '#15171a'));

  // EFFECT DECORATIONS
  const keyword = wordsToKey(quoteText, 2);
  switch (template.effect) {
    case 'echo': {
      const echo = makeQuoteLayer({ ...template, text: quoteText }, width, height, quoteText);
      echo.id = nextId();
      echo.role = 'decor';
      echo.x += Math.round(width * 0.018);
      echo.y += Math.round(height * 0.014);
      echo.color = rgba(template.accent, 0.28);
      echo.opacity = 1;
      echo.z = 8;
      out.push(echo);
      break;
    }
    case 'repeat': {
      for (let i = 0; i < 4; i++) {
        const rep = makeTextLayer({
          text: keyword,
          x: width * 0.08,
          y: height * (0.10 + i * 0.18),
          width: width * 0.84,
          fontSize: Math.round(Math.min(width, height) * 0.11),
          weight: 900,
          color: rgba(template.accent, 0.08),
          align: 'center',
          z: 1,
          fontFamily: FONT_VALUES['Bebas Neue'],
          letterSpacing: 2,
          uppercase: true
        });
        rep.role = 'decor';
        out.push(rep);
      }
      break;
    }
    case 'fade': {
      const ghost = makeTextLayer({
        text: quoteText,
        x: width * 0.14,
        y: height * 0.22,
        width: width * 0.72,
        fontSize: Math.round(Math.min(width, height) * 0.09),
        weight: 900,
        color: rgba(template.accent, 0.10),
        align: 'center',
        z: 1,
        fontFamily: FONT_VALUES['Bebas Neue'],
        uppercase: true,
        lineHeight: 0.92
      });
      ghost.role = 'decor';
      out.push(ghost);
      break;
    }
    case 'watermark': {
      const wm = makeTextLayer({ text: keyword, x: width * 0.05, y: height * 0.13, width: width * 0.90, fontSize: Math.round(Math.min(width, height) * 0.17), weight: 900, color: rgba(template.accent, 0.10), align: 'center', z: 1, fontFamily: FONT_VALUES['Bebas Neue'], uppercase: true, lineHeight: 0.9 });
      wm.role = 'decor';
      out.push(wm);
      break;
    }
    case 'pill-stack': {
      for (let i = 0; i < 3; i++) {
        out.push(makeShapeLayer({ x: width * 0.16, y: height * (0.22 + i * 0.13), width: width * 0.68, height: height * 0.10, fill: i === 1 ? BRAND.soft : '#ffffff', stroke: rgba(BRAND.accent, 0.12), radius: 999, z: 1 }));
      }
      break;
    }
    case 'orbit': {
      out.push(makeShapeLayer({ x: width * 0.12, y: height * 0.14, width: width * 0.76, height: height * 0.60, fill: 'transparent', stroke: rgba(BRAND.accent, 0.18), radius: height * 0.30, z: 1 }));
      const orbitWord = makeTextLayer({ text: keyword, x: width * 0.28, y: height * 0.10, width: width * 0.44, fontSize: Math.round(Math.min(width, height) * 0.03), weight: 800, color: template.accent, align: 'center', z: 2, fontFamily: defaultFont, uppercase: true, letterSpacing: 6 });
      orbitWord.role = 'decor';
      out.push(orbitWord);
      break;
    }
    case 'side-repeat': {
      const side = makeTextLayer({ text: keyword, x: width * 0.03, y: height * 0.80, width: height * 0.70, fontSize: Math.round(Math.min(width, height) * 0.11), weight: 900, color: rgba(template.accent, 0.14), align: 'left', z: 1, fontFamily: FONT_VALUES['Bebas Neue'], uppercase: true, rotation: -90, lineHeight: 1 });
      side.role = 'decor';
      out.push(side);
      break;
    }
    case 'stacked': {
      const stroke = makeTextLayer({ text: keyword, x: width * 0.52, y: height * 0.17, width: width * 0.34, fontSize: Math.round(Math.min(width, height) * 0.13), weight: 900, color: rgba(template.accent, 0.12), align: 'left', z: 1, fontFamily: FONT_VALUES['Bebas Neue'], uppercase: true, lineHeight: 0.88 });
      stroke.role = 'decor';
      out.push(stroke);
      break;
    }
    case 'round-badge': {
      out.push(makeShapeLayer({ x: width * 0.18, y: height * 0.13, width: width * 0.64, height: width * 0.64, fill: '#ffffff', stroke: rgba(BRAND.accent, 0.16), radius: width * 0.32, z: 1 }));
      const badge = makeTextLayer({ text: 'RELATABLE • NOTE •', x: width * 0.25, y: height * 0.22, width: width * 0.50, fontSize: Math.round(Math.min(width, height) * 0.022), weight: 900, color: template.accent, align: 'center', z: 2, fontFamily: defaultFont, uppercase: true, letterSpacing: 5 });
      badge.role = 'decor';
      out.push(badge);
      break;
    }
    case 'underlay': {
      const under = makeTextLayer({ text: keyword, x: width * 0.06, y: height * 0.17, width: width * 0.88, fontSize: Math.round(Math.min(width, height) * 0.16), weight: 900, color: rgba(template.accent, 0.08), align: 'left', z: 1, fontFamily: FONT_VALUES['Bebas Neue'], uppercase: true, lineHeight: 0.9 });
      under.role = 'decor';
      out.push(under);
      break;
    }
    case 'repeat-grid': {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 2; col++) {
          const rep = makeTextLayer({ text: keyword, x: width * (0.07 + col * 0.44), y: height * (0.12 + row * 0.20), width: width * 0.40, fontSize: Math.round(Math.min(width, height) * 0.06), weight: 800, color: rgba(template.accent, 0.08), align: 'center', z: 1, fontFamily: defaultFont, uppercase: true });
          rep.role = 'decor';
          out.push(rep);
        }
      }
      break;
    }
    case 'dual-line': {
      out.push(makeShapeLayer({ x: width * 0.08, y: height * 0.17, width: width * 0.84, height: 3, fill: rgba('#ffffff', 0.22), stroke: 'transparent', radius: 2, z: 1 }));
      out.push(makeShapeLayer({ x: width * 0.08, y: height * 0.77, width: width * 0.84, height: 3, fill: rgba('#ffffff', 0.22), stroke: 'transparent', radius: 2, z: 1 }));
      break;
    }
    case 'poster-repeat': {
      const rep = makeTextLayer({ text: keyword, x: width * 0.09, y: height * 0.58, width: width * 0.84, fontSize: Math.round(Math.min(width, height) * 0.13), weight: 900, color: rgba(template.accent, 0.10), align: 'left', z: 1, fontFamily: FONT_VALUES['Bebas Neue'], uppercase: true, lineHeight: 0.9 });
      rep.role = 'decor';
      out.push(rep);
      break;
    }
    default:
      break;
  }

  return out;
}

function buildTemplateLayers(template, width, height, quoteText) {
  const base = templateDecorations(template, width, height, quoteText);

  if (template.mixed === 'two') {
    const [a, b] = splitForMix(quoteText, 2);
    const layer1 = makeTextLayer({ text: a, x: width * (template.x || 0.12), y: height * (template.y || 0.22), width: width * (template.w || 0.76), fontSize: Math.round(Math.min(width, height) * 0.085), weight: 700, color: template.text, align: 'left', z: 10, fontFamily: template.fontA, lineHeight: 0.95 });
    const layer2 = makeTextLayer({ text: b, x: width * (template.x || 0.12), y: layer1.y + layer1.fontSize * 1.6, width: width * (template.w || 0.76), fontSize: Math.round(Math.min(width, height) * 0.048), weight: 800, color: template.accent, align: 'left', z: 11, fontFamily: template.fontB, lineHeight: 1.15, uppercase: false, letterSpacing: 1 });
    layer1.role = 'quote';
    layer2.role = 'quote-secondary';
    return [...base, layer1, layer2];
  }

  if (template.mixed === 'three') {
    const [a, b, c] = splitForMix(quoteText, 3);
    const x = width * (template.x || 0.12);
    const y = height * (template.y || 0.18);
    const w = width * (template.w || 0.76);
    const l1 = makeTextLayer({ text: a, x, y, width: w, fontSize: Math.round(Math.min(width, height) * 0.095), weight: 900, color: template.text, align: 'left', z: 10, fontFamily: template.fontA, uppercase: true, lineHeight: 0.90 });
    const l2 = makeTextLayer({ text: b, x, y: y + l1.fontSize * 1.10, width: w, fontSize: Math.round(Math.min(width, height) * 0.055), weight: 700, color: template.accent, align: 'left', z: 11, fontFamily: template.fontB, lineHeight: 1.02 });
    const l3 = makeTextLayer({ text: c, x, y: y + l1.fontSize * 1.95, width: w, fontSize: Math.round(Math.min(width, height) * 0.045), weight: 700, color: template.text, align: 'left', z: 12, fontFamily: template.fontC || defaultFont, lineHeight: 1.18 });
    l1.role = 'quote';
    l2.role = 'quote-secondary';
    l3.role = 'quote-tertiary';
    return [...base, l1, l2, l3];
  }

  if (template.effect === 'stacked') {
    const words = splitForMix(quoteText, 3).map((part) => part.toUpperCase());
    const x = width * 0.10;
    const y = height * 0.18;
    const first = makeTextLayer({ text: words[0], x, y, width: width * 0.56, fontSize: Math.round(Math.min(width, height) * 0.12), weight: 900, color: template.text, align: 'left', z: 10, fontFamily: template.font, lineHeight: 0.88, uppercase: true });
    const second = makeTextLayer({ text: words[1], x: x + width * 0.08, y: y + first.fontSize * 0.95, width: width * 0.58, fontSize: Math.round(Math.min(width, height) * 0.10), weight: 900, color: template.accent, align: 'left', z: 11, fontFamily: template.font, lineHeight: 0.88, uppercase: true });
    const third = makeTextLayer({ text: words[2], x: x + width * 0.16, y: second.y + second.fontSize * 0.95, width: width * 0.62, fontSize: Math.round(Math.min(width, height) * 0.08), weight: 900, color: template.text, align: 'left', z: 12, fontFamily: template.font, lineHeight: 0.90, uppercase: true });
    first.role = 'quote';
    second.role = 'quote-secondary';
    third.role = 'quote-tertiary';
    return [...base, first, second, third];
  }

  return [...base, makeQuoteLayer(template, width, height, quoteText)];
}

function makeTemplateState(templateId, sizeKey, quoteText = starterQuote) {
  const [width, height] = CANVAS_PRESETS[sizeKey];
  const template = templates.find((t) => t.id === templateId) || templates[0];
  return {
    background: template.bg,
    gradient: !!template.gradient,
    layers: buildTemplateLayers(template, width, height, quoteText)
  };
}

function FacebookBrand({ dark = false }) {
  return (
    <div className={`brandMark ${dark ? 'brandMarkDark' : ''}`}>
      <span className="fbCircle">f</span>
      <span>kiocreates</span>
    </div>
  );
}

function wrapLines(ctx, text, maxWidth) {
  const paragraphs = String(text || '').split('\n');
  const all = [];
  for (const paragraph of paragraphs) {
    if (!paragraph) {
      all.push('');
      continue;
    }
    const words = paragraph.split(/\s+/);
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        all.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) all.push(line);
  }
  return all;
}

function drawRoundRect(ctx, x, y, w, h, r, fill, stroke) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  if (fill && fill !== 'transparent') {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke && stroke !== 'transparent') {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

const loadImg = (src) => new Promise((resolve, reject) => {
  const im = new Image();
  im.onload = () => resolve(im);
  im.onerror = reject;
  im.src = src;
});

function layerFontString(layer) {
  return `${layer.weight || 700} ${layer.fontSize}px ${layer.fontFamily || defaultFont}`;
}

export default function TypographyStudio() {
  const [mode, setMode] = useState('template');
  const [sizeKey, setSizeKey] = useState('square');
  const [templateId, setTemplateId] = useState('clean-center');
  const [templateFilter, setTemplateFilter] = useState('All');
  const [quoteText, setQuoteText] = useState(starterQuote);
  const initial = useMemo(() => makeTemplateState('clean-center', 'square', starterQuote), []);
  const [background, setBackground] = useState(initial.background);
  const [gradient, setGradient] = useState(initial.gradient);
  const [layers, setLayers] = useState(initial.layers);
  const [selectedId, setSelectedId] = useState(initial.layers.find((l) => l.role === 'quote')?.id || null);
  const [brandPosition, setBrandPosition] = useState('bottom-left');
  const [brandVisible, setBrandVisible] = useState(true);
  const [quality, setQuality] = useState(92);
  const [exporting, setExporting] = useState(false);
  const dragRef = useRef(null);
  const fileRef = useRef(null);

  const [canvasWidth, canvasHeight] = CANVAS_PRESETS[sizeKey];
  const selected = layers.find((l) => l.id === selectedId) || null;
  const currentTemplate = templates.find((t) => t.id === templateId) || templates[0];
  const filteredTemplates = templateFilter === 'All' ? templates : templates.filter((t) => t.category === templateFilter);

  const updateLayer = (id, patch) => setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const applyTemplate = (id, key = sizeKey, text = quoteText) => {
    const next = makeTemplateState(id, key, text);
    setTemplateId(id);
    setMode('template');
    setBackground(next.background);
    setGradient(next.gradient);
    setLayers(next.layers);
    setSelectedId(next.layers.find((l) => l.role === 'quote')?.id || null);
  };

  const startFree = (key = sizeKey) => {
    setMode('free');
    setTemplateId('');
    setBackground(BRAND.card);
    setGradient(false);
    setLayers([]);
    setSelectedId(null);
  };

  const changeSize = (key) => {
    setSizeKey(key);
    if (mode === 'template' && templateId) applyTemplate(templateId, key, quoteText);
    else startFree(key);
  };

  const addText = () => {
    const layer = makeTextLayer({
      text: 'Type something…',
      x: canvasWidth * 0.16,
      y: canvasHeight * 0.24,
      width: canvasWidth * 0.68,
      fontSize: Math.round(Math.min(canvasWidth, canvasHeight) * 0.06),
      weight: 800,
      color: BRAND.text,
      align: 'center',
      z: Math.max(10, ...layers.map((l) => l.z || 1)) + 1,
      fontFamily: defaultFont,
      lineHeight: 1.12
    });
    layer.role = 'free';
    setLayers((p) => [...p, layer]);
    setSelectedId(layer.id);
  };

  const addImage = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const maxW = canvasWidth * 0.62;
      const maxH = canvasHeight * 0.55;
      const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
      const w = Math.max(120, img.width * ratio);
      const h = Math.max(120, img.height * ratio);
      const layer = {
        id: nextId(),
        type: 'image',
        src: url,
        name: file.name,
        x: (canvasWidth - w) / 2,
        y: (canvasHeight - h) / 2,
        width: w,
        height: h,
        rotation: 0,
        opacity: 1,
        z: Math.max(10, ...layers.map((l) => l.z || 1)) + 1
      };
      setLayers((p) => [...p, layer]);
      setSelectedId(layer.id);
    };
    img.src = url;
  };

  const removeSelected = () => {
    if (!selected) return;
    setLayers((p) => p.filter((l) => l.id !== selected.id));
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selected) return;
    const dup = { ...selected, id: nextId(), x: selected.x + 28, y: selected.y + 28, z: Math.max(...layers.map((l) => l.z || 1)) + 1 };
    setLayers((p) => [...p, dup]);
    setSelectedId(dup.id);
  };

  const moveLayer = (dir) => {
    if (!selected) return;
    const sorted = [...layers].sort((a, b) => (a.z || 0) - (b.z || 0));
    const idx = sorted.findIndex((x) => x.id === selected.id);
    const other = dir === 'up' ? sorted[idx + 1] : sorted[idx - 1];
    if (!other) return;
    const z = selected.z;
    updateLayer(selected.id, { z: other.z });
    updateLayer(other.id, { z });
  };

  const beginDrag = (e, layer, kind = 'move') => {
    if (layer.type === 'shape') return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(layer.id);
    dragRef.current = {
      kind,
      id: layer.id,
      startX: e.clientX,
      startY: e.clientY,
      x: layer.x,
      y: layer.y,
      width: layer.width,
      height: layer.height,
      fontSize: layer.fontSize
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag, { once: true });
  };

  const stageScale = () => {
    if (typeof document === 'undefined') return 1;
    const el = document.querySelector('.canvasStage');
    if (!el) return 1;
    return el.getBoundingClientRect().width / canvasWidth;
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const scale = stageScale();
    const dx = (e.clientX - d.startX) / scale;
    const dy = (e.clientY - d.startY) / scale;
    setLayers((prev) => prev.map((l) => {
      if (l.id !== d.id) return l;
      if (d.kind === 'move') return { ...l, x: clamp(d.x + dx, -l.width * 0.75, canvasWidth - l.width * 0.25), y: clamp(d.y + dy, -120, canvasHeight - 40) };
      if (d.kind === 'resize') {
        if (l.type === 'image') return { ...l, width: Math.max(80, d.width + dx), height: Math.max(80, d.height + dy) };
        const ratio = Math.max(0.35, (d.width + dx) / Math.max(1, d.width));
        return { ...l, width: Math.max(140, d.width + dx), fontSize: clamp(d.fontSize * ratio, 16, 240) };
      }
      return l;
    }));
  };

  const endDrag = () => {
    dragRef.current = null;
    window.removeEventListener('pointermove', onPointerMove);
  };

  const drawBrand = (ctx) => {
    if (!brandVisible) return;
    const padding = Math.round(Math.min(canvasWidth, canvasHeight) * 0.045);
    const fs = Math.round(Math.min(canvasWidth, canvasHeight) * 0.025);
    ctx.font = `800 ${fs}px ${defaultFont}`;
    const text = 'kiocreates';
    const tw = ctx.measureText(text).width;
    const circle = fs * 1.12;
    const gap = fs * 0.45;
    const total = circle + gap + tw;
    let x = padding;
    if (brandPosition === 'bottom-center') x = (canvasWidth - total) / 2;
    if (brandPosition === 'bottom-right') x = canvasWidth - padding - total;
    const y = canvasHeight - padding - circle / 2;
    const darkBg = ['#15171a', '#645cff', '#28233f'].includes(String(background).toLowerCase());
    ctx.fillStyle = darkBg ? '#ffffff' : BRAND.accent;
    ctx.beginPath();
    ctx.arc(x + circle / 2, y, circle / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = darkBg ? BRAND.accent : '#ffffff';
    ctx.font = `900 ${fs * 0.88}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('f', x + circle / 2, y + fs * 0.05);
    ctx.textAlign = 'left';
    ctx.fillStyle = darkBg ? '#ffffff' : BRAND.text;
    ctx.font = `800 ${fs}px ${defaultFont}`;
    ctx.fillText(text, x + circle + gap, y + fs * 0.08);
  };

  const drawTextToCanvas = (ctx, layer) => {
    const rawText = layer.uppercase ? String(layer.text || '').toUpperCase() : String(layer.text || '');
    ctx.translate(layer.x + layer.width / 2, layer.y);
    ctx.rotate(((layer.rotation || 0) * Math.PI) / 180);
    ctx.translate(-(layer.x + layer.width / 2), -layer.y);
    ctx.font = layerFontString(layer);
    ctx.textBaseline = 'top';
    ctx.textAlign = layer.align || 'left';
    if (layer.shadowColor) {
      ctx.shadowColor = layer.shadowColor;
      ctx.shadowBlur = layer.shadowBlur || 0;
      ctx.shadowOffsetX = layer.shadowX || 0;
      ctx.shadowOffsetY = layer.shadowY || 0;
    }
    const lines = wrapLines(ctx, rawText, layer.width);
    const lh = layer.fontSize * (layer.lineHeight || 1.15);
    let xx = layer.x;
    if (layer.align === 'center') xx = layer.x + layer.width / 2;
    if (layer.align === 'right') xx = layer.x + layer.width;
    for (let i = 0; i < lines.length; i++) {
      const yy = layer.y + i * lh;
      if (layer.strokeColor && layer.strokeWidth) {
        ctx.lineWidth = layer.strokeWidth;
        ctx.strokeStyle = layer.strokeColor;
        ctx.strokeText(lines[i], xx, yy);
      }
      ctx.fillStyle = layer.color;
      ctx.fillText(lines[i], xx, yy);
    }
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  const exportImage = async (format) => {
    setExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (gradient) {
        const g = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.55, BRAND.soft);
        g.addColorStop(1, '#e8e6ff');
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = background;
      }
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      const sorted = [...layers].sort((a, b) => (a.z || 0) - (b.z || 0));
      for (const layer of sorted) {
        ctx.save();
        ctx.globalAlpha = layer.opacity ?? 1;
        if (layer.type === 'shape') {
          drawRoundRect(ctx, layer.x, layer.y, layer.width, layer.height, layer.radius || 0, layer.fill, layer.stroke);
        } else if (layer.type === 'image') {
          try {
            const im = await loadImg(layer.src);
            ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
            ctx.rotate(((layer.rotation || 0) * Math.PI) / 180);
            ctx.drawImage(im, -layer.width / 2, -layer.height / 2, layer.width, layer.height);
          } catch {}
        } else if (layer.type === 'text') {
          drawTextToCanvas(ctx, layer);
        }
        ctx.restore();
      }
      drawBrand(ctx);
      const mime = format === 'webp' ? 'image/webp' : 'image/jpeg';
      const ext = format === 'webp' ? 'webp' : 'jpg';
      const data = canvas.toDataURL(mime, quality / 100);
      const a = document.createElement('a');
      a.href = data;
      a.download = `kiocreates-${sizeKey}-${Date.now()}.${ext}`;
      a.click();
    } finally {
      setExporting(false);
    }
  };

  const previewBackground = gradient ? 'linear-gradient(135deg,#ffffff 0%,#f0efff 55%,#e8e6ff 100%)' : background;
  const darkBrand = ['#15171a', '#645cff', '#28233f'].includes(String(background).toLowerCase());

  const quoteLayer = layers.find((l) => l.role === 'quote');

  const handleTemplateQuoteChange = (value) => {
    setQuoteText(value);
    if (mode === 'template' && templateId) applyTemplate(templateId, sizeKey, value);
  };

  const textLayerStyle = (layer) => ({
    left: `${(layer.x / canvasWidth) * 100}%`,
    top: `${(layer.y / canvasHeight) * 100}%`,
    width: `${(layer.width / canvasWidth) * 100}%`,
    transform: `rotate(${layer.rotation || 0}deg)`,
    opacity: layer.opacity ?? 1,
    zIndex: layer.z || 1,
    fontSize: `${(layer.fontSize / canvasWidth) * 100}cqw`,
    fontWeight: layer.weight,
    color: layer.color,
    textAlign: layer.align,
    lineHeight: layer.lineHeight || 1.12,
    letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}px` : undefined,
    fontFamily: layer.fontFamily || defaultFont,
    WebkitTextStroke: layer.strokeColor && layer.strokeWidth ? `${layer.strokeWidth}px ${layer.strokeColor}` : undefined,
    textShadow: layer.shadowColor ? `${layer.shadowX || 0}px ${layer.shadowY || 0}px ${layer.shadowBlur || 0}px ${layer.shadowColor}` : undefined,
    textTransform: layer.uppercase ? 'uppercase' : undefined,
    mixBlendMode: layer.blendMode || undefined
  });

  return (
    <main className="studioShell">
      <header className="studioHeader">
        <div>
          <div className="studioBrand">kiocreates</div>
          <div className="studioSubtitle">Typography Studio</div>
        </div>
        <div className="headerActions">
          <button className="ghostBtn" onClick={() => setBrandVisible((v) => !v)}>{brandVisible ? 'Brand on' : 'Brand off'}</button>
          <button className="primaryBtn" onClick={() => exportImage('jpg')} disabled={exporting}>Download JPG</button>
          <button className="primaryBtn" onClick={() => exportImage('webp')} disabled={exporting}>Download WebP</button>
        </div>
      </header>

      <section className="workspace">
        <aside className="panel leftPanel">
          <div className="panelSection">
            <div className="sectionTitle">Mode</div>
            <div className="segmented">
              <button className={mode === 'template' ? 'active' : ''} onClick={() => applyTemplate(templateId || 'clean-center')}>Templates</button>
              <button className={mode === 'free' ? 'active' : ''} onClick={() => startFree()}>Free mode</button>
            </div>
          </div>

          <div className="panelSection">
            <div className="sectionTitle">Canvas</div>
            <div className="sizeGrid">
              {Object.entries(CANVAS_PRESETS).map(([key, [w, h]]) => (
                <button key={key} className={sizeKey === key ? 'active' : ''} onClick={() => changeSize(key)}>
                  <strong>{key}</strong>
                  <span>{w} × {h}</span>
                </button>
              ))}
            </div>
          </div>

          {mode === 'template' && (
            <div className="panelSection growSection">
              <div className="sectionTitle">Templates <span>{templates.length}</span></div>
              <div className="categoryChips">
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <button key={cat} className={`chip ${templateFilter === cat ? 'active' : ''}`} onClick={() => setTemplateFilter(cat)}>{cat}</button>
                ))}
              </div>
              <div className="templateGrid">
                {filteredTemplates.map((t) => (
                  <button key={t.id} className={`templateTile ${templateId === t.id ? 'active' : ''}`} onClick={() => applyTemplate(t.id)}>
                    <span className="templatePreview" style={{ background: t.gradient ? 'linear-gradient(135deg,#fff,#f0efff,#e8e6ff)' : t.bg, color: t.text }}>
                      <i style={{ background: t.accent }} />
                      <b style={{ fontFamily: t.fontA || t.font || defaultFont }}>{t.mixed ? 'Ab' : t.effect ? 'FX' : 'Aa'}</b>
                      {t.effect && <em>{t.effect.replace('-', ' ')}</em>}
                    </span>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="panelSection">
            <div className="sectionTitle">Add</div>
            <div className="buttonRow">
              <button className="secondaryBtn" onClick={addText}>+ Text</button>
              <button className="secondaryBtn" onClick={() => fileRef.current?.click()}>+ Picture</button>
              <input ref={fileRef} hidden type="file" accept="image/*" onChange={(e) => { addImage(e.target.files?.[0]); e.target.value = ''; }} />
            </div>
          </div>
        </aside>

        <section className="stageColumn">
          <div className="canvasOuter">
            <div className="canvasStage" style={{ aspectRatio: `${canvasWidth}/${canvasHeight}`, background: previewBackground }} onPointerDown={() => setSelectedId(null)}>
              {[...layers].sort((a, b) => (a.z || 0) - (b.z || 0)).map((layer) => {
                const common = {
                  left: `${(layer.x / canvasWidth) * 100}%`,
                  top: `${(layer.y / canvasHeight) * 100}%`,
                  width: `${(layer.width / canvasWidth) * 100}%`,
                  transform: `rotate(${layer.rotation || 0}deg)`,
                  opacity: layer.opacity ?? 1,
                  zIndex: layer.z || 1
                };
                if (layer.type === 'shape') {
                  return <div key={layer.id} className="shapeLayer" style={{ ...common, height: `${(layer.height / canvasHeight) * 100}%`, background: layer.fill, border: `2px solid ${layer.stroke || 'transparent'}`, borderRadius: `${layer.radius || 0}px` }} />;
                }
                if (layer.type === 'image') {
                  return (
                    <div key={layer.id} className={`canvasLayer imageLayer ${selectedId === layer.id ? 'selected' : ''}`} style={{ ...common, height: `${(layer.height / canvasHeight) * 100}%` }} onPointerDown={(e) => beginDrag(e, layer)}>
                      <img src={layer.src} alt="Uploaded" draggable={false} />
                      <span className="resizeHandle" onPointerDown={(e) => beginDrag(e, layer, 'resize')} />
                    </div>
                  );
                }
                return (
                  <div key={layer.id} className={`canvasLayer textLayer ${selectedId === layer.id ? 'selected' : ''}`} style={textLayerStyle(layer)} onPointerDown={(e) => beginDrag(e, layer)}>
                    <span>{layer.uppercase ? String(layer.text || '').toUpperCase() : layer.text}</span>
                    <span className="resizeHandle" onPointerDown={(e) => beginDrag(e, layer, 'resize')} />
                  </div>
                );
              })}
              {brandVisible && <div className={`brandOverlay ${brandPosition}`}><FacebookBrand dark={darkBrand} /></div>}
            </div>
          </div>
          <div className="canvasMeta"><span>{mode === 'template' ? currentTemplate.name : 'Free canvas'}</span><span>{canvasWidth} × {canvasHeight}px</span></div>
        </section>

        <aside className="panel inspectorPanel">
          {mode === 'template' && (
            <div className="panelSection">
              <div className="sectionTitle">Quote</div>
              <textarea className="quoteInput" value={quoteText} onChange={(e) => handleTemplateQuoteChange(e.target.value)} />
            </div>
          )}

          <div className="panelSection">
            <div className="sectionTitle">Background</div>
            <div className="colorControl">
              <input type="color" value={background} onChange={(e) => { setBackground(e.target.value); setGradient(false); }} />
              <input value={background} onChange={(e) => { setBackground(e.target.value); setGradient(false); }} />
            </div>
            <label className="checkRow"><input type="checkbox" checked={gradient} onChange={(e) => setGradient(e.target.checked)} /> Kiocreates soft gradient</label>
          </div>

          {selected ? (
            <>
              <div className="panelSection">
                <div className="sectionTitle">Selected {selected.type}</div>
                {selected.type === 'text' && (
                  <>
                    <textarea className="smallTextarea" value={selected.text} onChange={(e) => updateLayer(selected.id, { text: e.target.value })} />
                    <div className="fieldGrid">
                      <label>Size<input type="number" min="16" max="240" value={Math.round(selected.fontSize)} onChange={(e) => updateLayer(selected.id, { fontSize: +e.target.value })} /></label>
                      <label>Weight<select value={selected.weight} onChange={(e) => updateLayer(selected.id, { weight: +e.target.value })}><option value="400">400</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option><option value="900">900</option></select></label>
                    </div>
                    <div className="fieldGrid">
                      <label>Align<select value={selected.align} onChange={(e) => updateLayer(selected.id, { align: e.target.value })}><option>left</option><option>center</option><option>right</option></select></label>
                      <label>Color<input type="color" value={selected.color} onChange={(e) => updateLayer(selected.id, { color: e.target.value })} /></label>
                    </div>
                    <div className="fieldGrid">
                      <label>Font<select value={selected.fontFamily || defaultFont} onChange={(e) => updateLayer(selected.id, { fontFamily: e.target.value })}>{FONT_OPTIONS.map((font) => <option key={font.label} value={font.value}>{font.label}</option>)}</select></label>
                      <label>Outline<input type="color" value={selected.strokeColor || '#645cff'} onChange={(e) => updateLayer(selected.id, { strokeColor: e.target.value, strokeWidth: selected.strokeWidth || 2 })} /></label>
                    </div>
                    <label className="rangeLabel">Outline width <span>{Math.round(selected.strokeWidth || 0)}px</span><input type="range" min="0" max="10" value={selected.strokeWidth || 0} onChange={(e) => updateLayer(selected.id, { strokeWidth: +e.target.value })} /></label>
                  </>
                )}
                <label className="rangeLabel">Rotation <span>{Math.round(selected.rotation || 0)}°</span><input type="range" min="-180" max="180" value={selected.rotation || 0} onChange={(e) => updateLayer(selected.id, { rotation: +e.target.value })} /></label>
                <label className="rangeLabel">Opacity <span>{Math.round((selected.opacity ?? 1) * 100)}%</span><input type="range" min="10" max="100" value={(selected.opacity ?? 1) * 100} onChange={(e) => updateLayer(selected.id, { opacity: +e.target.value / 100 })} /></label>
                <div className="buttonRow"><button className="miniBtn" onClick={() => moveLayer('down')}>Backward</button><button className="miniBtn" onClick={() => moveLayer('up')}>Forward</button></div>
                <div className="buttonRow"><button className="miniBtn" onClick={duplicateSelected}>Duplicate</button><button className="miniBtn danger" onClick={removeSelected}>Delete</button></div>
              </div>
            </>
          ) : <div className="emptyInspector">Select text or an image on the canvas to edit it.</div>}

          <div className="panelSection">
            <div className="sectionTitle">Branding</div>
            <select className="fullSelect" value={brandPosition} onChange={(e) => setBrandPosition(e.target.value)}><option value="bottom-left">Bottom left</option><option value="bottom-center">Bottom center</option><option value="bottom-right">Bottom right</option></select>
            <label className="checkRow"><input type="checkbox" checked={brandVisible} onChange={(e) => setBrandVisible(e.target.checked)} /> Facebook icon + kiocreates</label>
          </div>

          <div className="panelSection">
            <div className="sectionTitle">Export quality</div>
            <label className="rangeLabel"><span>{quality}%</span><input type="range" min="60" max="100" value={quality} onChange={(e) => setQuality(+e.target.value)} /></label>
            <div className="exportButtons"><button className="primaryBtn" onClick={() => exportImage('jpg')} disabled={exporting}>JPG</button><button className="primaryBtn" onClick={() => exportImage('webp')} disabled={exporting}>WebP</button></div>
          </div>
        </aside>
      </section>
    </main>
  );
}
