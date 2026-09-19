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

const BLEND_MODES = [
  ['normal', 'Normal'],
  ['multiply', 'Multiply'],
  ['screen', 'Screen'],
  ['overlay', 'Overlay'],
  ['soft-light', 'Soft Light'],
  ['hard-light', 'Hard Light'],
  ['darken', 'Darken'],
  ['lighten', 'Lighten'],
  ['color-burn', 'Color Burn'],
  ['color-dodge', 'Color Dodge'],
  ['difference', 'Difference']
];

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
  { id:'effect-soft-glow', name:'Soft Glow', category:'Effects', bg:'#28233f', text:'#ffffff', accent:'#9b95ff', align:'center', x:.15,y:.28,w:.70,size:.060,weight:800, font:FONT_VALUES['DM Serif Display'], effect:'soft-glow' },

  // MINIMALIST INSPIRED
  { id:'minimalist-grid-note', name:'Grid Note', category:'Minimalist', bg:'#fbfbfa', text:'#15171a', accent:'#645cff', align:'left', x:.11,y:.20,w:.64,size:.050,weight:780, font:FONT_VALUES['Inter'], frame:true, label:'minimalist' },
  { id:'minimalist-bookish', name:'Bookish Margin', category:'Minimalist', bg:'#f7f6f2', text:'#15171a', accent:'#645cff', align:'left', x:.18,y:.30,w:.54,size:.048,weight:700, font:FONT_VALUES['Libre Baskerville'], topLine:true },
  { id:'minimalist-tall', name:'Tall Narrow', category:'Minimalist', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.16,y:.17,w:.40,size:.086,weight:900, font:FONT_VALUES['Bebas Neue'] },
  { id:'minimalist-monday', name:'Monday Page', category:'Minimalist', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.25,y:.42,w:.50,size:.034,weight:600, font:FONT_VALUES['Cormorant Garamond'] },
  { id:'minimalist-abstract', name:'Abstract Quiet', category:'Minimalist', bg:'#eff1f4', text:'#22242b', accent:'#645cff', align:'center', x:.22,y:.41,w:.56,size:.040,weight:700, font:FONT_VALUES['Plus Jakarta Sans'], orb:true },
  { id:'minimalist-thinline', name:'Thin Line', category:'Minimalist', bg:'#ffffff', text:'#15171a', accent:'#15171a', align:'left', x:.14,y:.54,w:.62,size:.046,weight:700, font:FONT_VALUES['Inter'], topLine:true, bottomLine:true },
  { id:'minimalist-page', name:'Editorial Page', category:'Minimalist', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'left', x:.22,y:.24,w:.50,size:.045,weight:650, font:FONT_VALUES['Playfair Display'], frame:true },
  { id:'minimalist-dot', name:'Dot Accent', category:'Minimalist', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.15,y:.29,w:.60,size:.047,weight:780, font:FONT_VALUES['Inter'], corner:true },
  { id:'minimalist-column', name:'White Column', category:'Minimalist', bg:'#f8f8f7', text:'#15171a', accent:'#645cff', align:'left', x:.31,y:.22,w:.35,size:.048,weight:700, font:FONT_VALUES['Cormorant Garamond'], side:true },
  { id:'minimalist-wide-space', name:'Wide Space', category:'Minimalist', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.34,w:.72,size:.038,weight:700, font:FONT_VALUES['Inter'], letterSpacing:1.5 },
  { id:'minimalist-serif-card', name:'Serif Card', category:'Minimalist', bg:'#f6f3ee', text:'#15171a', accent:'#645cff', align:'center', x:.18,y:.33,w:.64,size:.043,weight:700, font:FONT_VALUES['DM Serif Display'], card:true },
  { id:'minimalist-tiny-caption', name:'Tiny Caption', category:'Minimalist', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.13,y:.61,w:.42,size:.026,weight:600, font:FONT_VALUES['Inter'], label:'quiet note' },

  // MAXIMALIST INSPIRED
  { id:'maximalist-chaos', name:'Chaos Stack', category:'Maximalist', bg:'#fff6ec', text:'#ff4d3d', accent:'#2146ff', align:'left', x:.08,y:.13,w:.84,size:.090,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'poster-repeat' },
  { id:'maximalist-collage', name:'Collage Type', category:'Maximalist', bg:'#fff1ea', text:'#ef4c2c', accent:'#2146ff', mixed:'three', x:.08,y:.17,w:.84, fontA:FONT_VALUES['Bebas Neue'], fontB:FONT_VALUES['DM Serif Display'], fontC:FONT_VALUES['Inter'] },
  { id:'maximalist-signal', name:'Signal Burst', category:'Maximalist', bg:'#f7e8db', text:'#f04a2f', accent:'#0039ff', align:'left', x:.08,y:.18,w:.80,size:.082,weight:900, font:FONT_VALUES['Space Grotesk'], effect:'echo' },
  { id:'maximalist-yellow', name:'Loud Yellow', category:'Maximalist', bg:'#f5bf25', text:'#111111', accent:'#ffffff', align:'center', x:.10,y:.22,w:.80,size:.074,weight:900, font:FONT_VALUES['DM Serif Display'], effect:'outline' },
  { id:'maximalist-mag', name:'Magazine Frenzy', category:'Maximalist', bg:'#ffffff', text:'#111111', accent:'#ff5033', mixed:'two', x:.11,y:.18,w:.78, fontA:FONT_VALUES['Bebas Neue'], fontB:FONT_VALUES['Caveat'] },
  { id:'maximalist-nightclub', name:'Nightclub', category:'Maximalist', bg:'#1b1235', text:'#ffffff', accent:'#89ff4a', align:'center', x:.12,y:.24,w:.76,size:.072,weight:900, font:FONT_VALUES['Space Grotesk'], effect:'soft-glow' },
  { id:'maximalist-ribbon', name:'Ribbon Repeat', category:'Maximalist', bg:'#efe3d4', text:'#fb3f28', accent:'#3254ff', align:'left', x:.08,y:.30,w:.82,size:.074,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'repeat-grid' },
  { id:'maximalist-redblue', name:'Red Blue Clash', category:'Maximalist', bg:'#fff6ee', text:'#f5482f', accent:'#204cff', align:'left', x:.10,y:.17,w:.78,size:.084,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'double-shadow' },
  { id:'maximalist-layers', name:'Layered Headline', category:'Maximalist', bg:'#ffffff', text:'#111111', accent:'#ff5b2d', align:'left', x:.09,y:.15,w:.82,size:.086,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'underlay' },
  { id:'maximalist-neonpaper', name:'Neon Paper', category:'Maximalist', bg:'#f7ecde', text:'#2c2c2c', accent:'#2448ff', align:'center', x:.12,y:.29,w:.76,size:.068,weight:900, font:FONT_VALUES['DM Serif Display'], effect:'watermark' },
  { id:'maximalist-shout', name:'Shout Panel', category:'Maximalist', bg:'#fbf7f1', text:'#ea4528', accent:'#173fff', align:'left', x:.08,y:.18,w:.64,size:.108,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'stacked' },
  { id:'maximalist-electric', name:'Electric Mix', category:'Maximalist', bg:'#162134', text:'#ffffff', accent:'#ffea00', mixed:'three', x:.10,y:.18,w:.80, fontA:FONT_VALUES['Bebas Neue'], fontB:FONT_VALUES['DM Serif Display'], fontC:FONT_VALUES['Inter'] },

  // POSTER / DISPLAY
  { id:'poster-berlin', name:'Berlin Poster', category:'Poster', bg:'#f3efe7', text:'#15171a', accent:'#d32121', align:'left', x:.08,y:.12,w:.42,size:.088,weight:900, font:FONT_VALUES['Bebas Neue'], topLine:true },
  { id:'poster-boring', name:'Boring Poster', category:'Poster', bg:'#111111', text:'#f1f1ec', accent:'#645cff', align:'left', x:.06,y:.18,w:.44,size:.120,weight:900, font:FONT_VALUES['Bebas Neue'] },
  { id:'poster-simple', name:'Simple Type', category:'Poster', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.09,y:.24,w:.30,size:.054,weight:800, font:FONT_VALUES['Space Grotesk'], frame:true },
  { id:'poster-exhibit', name:'Exhibit Poster', category:'Poster', bg:'#0e3648', text:'#f7f7f2', accent:'#ffffff', align:'left', x:.38,y:.58,w:.40,size:.040,weight:700, font:FONT_VALUES['Inter'] },
  { id:'poster-note-vertical', name:'Vertical Note', category:'Poster', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.43,y:.20,w:.22,size:.090,weight:900, font:FONT_VALUES['Bebas Neue'], rotation:-90 },
  { id:'poster-aa-specimen', name:'AA Specimen', category:'Poster', bg:'#f4d6d1', text:'#111111', accent:'#645cff', align:'left', x:.10,y:.18,w:.58,size:.078,weight:700, font:FONT_VALUES['Inter'] },
  { id:'poster-copper-studio', name:'Copper Studio', category:'Poster', bg:'#be7f60', text:'#201614', accent:'#15171a', align:'center', x:.12,y:.18,w:.76,size:.072,weight:700, font:FONT_VALUES['DM Serif Display'] },
  { id:'poster-monograph', name:'Monograph', category:'Poster', bg:'#ededeb', text:'#15171a', accent:'#15171a', align:'left', x:.10,y:.14,w:.24,size:.098,weight:900, font:FONT_VALUES['Bebas Neue'] },

  // CIRCULAR / ROUND
  { id:'round-orbit-soft', name:'Orbit Soft', category:'Circular', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.24,y:.34,w:.52,size:.046,weight:780, font:FONT_VALUES['DM Serif Display'], effect:'orbit' },
  { id:'round-badge-clean', name:'Badge Clean', category:'Circular', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'center', x:.26,y:.38,w:.48,size:.044,weight:760, font:FONT_VALUES['Playfair Display'], effect:'round-badge' },
  { id:'round-badge-dark', name:'Badge Dark', category:'Circular', bg:'#15171a', text:'#ffffff', accent:'#8d86ff', align:'center', x:.26,y:.38,w:.48,size:.044,weight:760, font:FONT_VALUES['Playfair Display'], effect:'round-badge' },
  { id:'round-pill-stack', name:'Pill Stack', category:'Circular', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.18,y:.33,w:.64,size:.054,weight:820, font:FONT_VALUES['Inter'], effect:'pill-stack' },
  { id:'round-soft-orb', name:'Soft Orb Copy', category:'Circular', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'center', x:.20,y:.34,w:.60,size:.052,weight:760, font:FONT_VALUES['DM Serif Display'], orb:true },
  { id:'round-label-orbit', name:'Label Orbit', category:'Circular', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.22,y:.35,w:.56,size:.042,weight:700, font:FONT_VALUES['Inter'], effect:'orbit', label:'circle note' },

  // REPEAT / LAYER
  { id:'repeat-clean', name:'Clean Repeat', category:'Repeat', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.33,w:.72,size:.055,weight:800, font:FONT_VALUES['Inter'], effect:'repeat' },
  { id:'repeat-side', name:'Repeat Side', category:'Repeat', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.24,y:.21,w:.62,size:.056,weight:800, font:FONT_VALUES['Inter'], effect:'side-repeat' },
  { id:'repeat-fade', name:'Repeat Fade', category:'Repeat', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.16,y:.34,w:.68,size:.058,weight:820, font:FONT_VALUES['Inter'], effect:'fade' },
  { id:'repeat-watermark', name:'Repeat Watermark', category:'Repeat', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.42,w:.74,size:.052,weight:800, font:FONT_VALUES['Inter'], effect:'watermark' },
  { id:'repeat-grid-paper', name:'Grid Paper', category:'Repeat', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.18,y:.36,w:.64,size:.050,weight:790, font:FONT_VALUES['Inter'], effect:'repeat-grid' },
  { id:'repeat-poster', name:'Poster Repeat Lite', category:'Repeat', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.08,y:.16,w:.84,size:.084,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'poster-repeat' },



  // DIGITAL POETRY / PHOTO FRAMES
  { id:'poetry-center-window', name:'Center Window', category:'Digital Poetry', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.16,y:.68,w:.68,size:.042,weight:700, font:FONT_VALUES['Playfair Display'], frames:[{key:'main',x:.22,y:.15,w:.56,h:.42,radius:18,shape:'rect'}], label:'a small thought' },
  { id:'poetry-left-photo', name:'Left Memory', category:'Digital Poetry', bg:'#f5f2ed', text:'#15171a', accent:'#645cff', align:'left', x:.55,y:.24,w:.34,size:.042,weight:700, font:FONT_VALUES['Cormorant Garamond'], frames:[{key:'main',x:.08,y:.14,w:.38,h:.62,radius:10,shape:'rect'}] },
  { id:'poetry-right-photo', name:'Right Memory', category:'Digital Poetry', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.24,w:.35,size:.044,weight:720, font:FONT_VALUES['Libre Baskerville'], frames:[{key:'main',x:.56,y:.14,w:.34,h:.60,radius:24,shape:'rect'}], topLine:true },
  { id:'poetry-polaroid-note', name:'Polaroid Note', category:'Digital Poetry', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'center', x:.15,y:.73,w:.70,size:.040,weight:680, font:FONT_VALUES['Caveat'], frames:[{key:'main',x:.22,y:.12,w:.56,h:.48,radius:8,shape:'polaroid'}] },
  { id:'poetry-circle-memory', name:'Circle Memory', category:'Digital Poetry', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.17,y:.64,w:.66,size:.041,weight:700, font:FONT_VALUES['DM Serif Display'], frames:[{key:'main',x:.28,y:.12,w:.44,h:.44,radius:999,shape:'circle'}] },
  { id:'poetry-double-memory', name:'Double Memory', category:'Digital Poetry', bg:'#f7f7f5', text:'#15171a', accent:'#645cff', align:'center', x:.18,y:.66,w:.64,size:.040,weight:700, font:FONT_VALUES['Inter'], frames:[{key:'a',x:.10,y:.13,w:.36,h:.42,radius:18,shape:'rect'},{key:'b',x:.54,y:.18,w:.36,h:.42,radius:18,shape:'rect'}] },
  { id:'poetry-three-stills', name:'Three Stills', category:'Digital Poetry', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.12,y:.68,w:.72,size:.038,weight:680, font:FONT_VALUES['Playfair Display'], frames:[{key:'a',x:.08,y:.12,w:.25,h:.40,radius:12,shape:'rect'},{key:'b',x:.375,y:.08,w:.25,h:.44,radius:12,shape:'rect'},{key:'c',x:.67,y:.16,w:.25,h:.36,radius:12,shape:'rect'}] },
  { id:'poetry-filmstrip', name:'Film Strip', category:'Digital Poetry', bg:'#15171a', text:'#ffffff', accent:'#8d86ff', align:'center', x:.14,y:.70,w:.72,size:.040,weight:650, font:FONT_VALUES['Cormorant Garamond'], frames:[{key:'a',x:.08,y:.15,w:.25,h:.34,radius:3,shape:'rect'},{key:'b',x:.375,y:.15,w:.25,h:.34,radius:3,shape:'rect'},{key:'c',x:.67,y:.15,w:.25,h:.34,radius:3,shape:'rect'}] },
  { id:'poetry-small-center', name:'Small Center Photo', category:'Digital Poetry', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.17,y:.58,w:.66,size:.046,weight:720, font:FONT_VALUES['Playfair Display'], frames:[{key:'main',x:.36,y:.17,w:.28,h:.28,radius:16,shape:'rect'}], quoteMark:true },
  { id:'poetry-bottom-window', name:'Bottom Window', category:'Digital Poetry', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'center', x:.15,y:.14,w:.70,size:.044,weight:700, font:FONT_VALUES['DM Serif Display'], frames:[{key:'main',x:.18,y:.48,w:.64,h:.34,radius:22,shape:'rect'}] },
  { id:'poetry-overlap-two', name:'Overlapping Memories', category:'Digital Poetry', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.12,y:.58,w:.48,size:.042,weight:720, font:FONT_VALUES['Inter'], frames:[{key:'back',x:.38,y:.12,w:.42,h:.43,radius:18,shape:'rect',rotation:7},{key:'front',x:.52,y:.24,w:.36,h:.38,radius:18,shape:'rect',rotation:-5}] },
  { id:'poetry-side-caption', name:'Side Caption', category:'Digital Poetry', bg:'#f7f4ef', text:'#15171a', accent:'#645cff', align:'left', x:.70,y:.18,w:.20,size:.030,weight:620, font:FONT_VALUES['Inter'], frames:[{key:'main',x:.08,y:.12,w:.54,h:.66,radius:0,shape:'rect'}], label:'memory no. 01' },

  // PHOTO FRAME COMPOSITIONS
  { id:'frames-hero-center', name:'Hero Center', category:'Photo Frames', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.72,w:.72,size:.045,weight:760, font:FONT_VALUES['Inter'], frames:[{key:'main',x:.16,y:.10,w:.68,h:.50,radius:26,shape:'rect'}] },
  { id:'frames-split-vertical', name:'Vertical Split', category:'Photo Frames', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.55,y:.20,w:.34,size:.050,weight:800, font:FONT_VALUES['Space Grotesk'], frames:[{key:'main',x:.08,y:.10,w:.38,h:.72,radius:0,shape:'rect'}] },
  { id:'frames-split-horizontal', name:'Horizontal Split', category:'Photo Frames', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.60,w:.78,size:.050,weight:780, font:FONT_VALUES['Playfair Display'], frames:[{key:'main',x:.08,y:.08,w:.84,h:.40,radius:0,shape:'rect'}] },
  { id:'frames-duo-equal', name:'Duo Equal', category:'Photo Frames', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.68,w:.72,size:.042,weight:720, font:FONT_VALUES['Inter'], frames:[{key:'a',x:.08,y:.12,w:.39,h:.42,radius:20,shape:'rect'},{key:'b',x:.53,y:.12,w:.39,h:.42,radius:20,shape:'rect'}] },
  { id:'frames-duo-offset', name:'Duo Offset', category:'Photo Frames', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.12,y:.62,w:.56,size:.043,weight:720, font:FONT_VALUES['Cormorant Garamond'], frames:[{key:'a',x:.10,y:.10,w:.46,h:.40,radius:12,shape:'rect'},{key:'b',x:.54,y:.24,w:.34,h:.36,radius:12,shape:'rect'}] },
  { id:'frames-trio-grid', name:'Trio Grid', category:'Photo Frames', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.69,w:.72,size:.040,weight:700, font:FONT_VALUES['Inter'], frames:[{key:'a',x:.08,y:.10,w:.52,h:.44,radius:14,shape:'rect'},{key:'b',x:.64,y:.10,w:.28,h:.20,radius:14,shape:'rect'},{key:'c',x:.64,y:.34,w:.28,h:.20,radius:14,shape:'rect'}] },
  { id:'frames-circle-pair', name:'Circle Pair', category:'Photo Frames', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'center', x:.16,y:.65,w:.68,size:.042,weight:720, font:FONT_VALUES['DM Serif Display'], frames:[{key:'a',x:.15,y:.15,w:.32,h:.32,radius:999,shape:'circle'},{key:'b',x:.53,y:.15,w:.32,h:.32,radius:999,shape:'circle'}] },
  { id:'frames-photo-card', name:'Photo Card', category:'Photo Frames', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'left', x:.16,y:.59,w:.68,size:.045,weight:750, font:FONT_VALUES['Inter'], card:true, frames:[{key:'main',x:.16,y:.20,w:.68,h:.30,radius:20,shape:'rect'}] },
  { id:'frames-window-caption', name:'Window + Caption', category:'Photo Frames', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.15,y:.66,w:.48,size:.038,weight:650, font:FONT_VALUES['Libre Baskerville'], frames:[{key:'main',x:.14,y:.12,w:.72,h:.46,radius:4,shape:'rect'}], label:'digital poetry' },
  { id:'frames-arch', name:'Soft Arch', category:'Photo Frames', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.16,y:.70,w:.68,size:.042,weight:730, font:FONT_VALUES['Playfair Display'], frames:[{key:'main',x:.25,y:.10,w:.50,h:.50,radius:180,shape:'arch'}] },
  { id:'frames-collage-four', name:'Four Memories', category:'Photo Frames', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.72,w:.72,size:.040,weight:700, font:FONT_VALUES['Inter'], frames:[{key:'a',x:.08,y:.10,w:.38,h:.25,radius:10,shape:'rect'},{key:'b',x:.54,y:.10,w:.38,h:.25,radius:10,shape:'rect'},{key:'c',x:.08,y:.39,w:.38,h:.25,radius:10,shape:'rect'},{key:'d',x:.54,y:.39,w:.38,h:.25,radius:10,shape:'rect'}] },
  { id:'frames-photo-note', name:'Photo + Tiny Note', category:'Photo Frames', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.68,y:.60,w:.22,size:.028,weight:600, font:FONT_VALUES['Inter'], frames:[{key:'main',x:.08,y:.12,w:.52,h:.60,radius:18,shape:'rect'}], label:'note 01' }

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

function makeFrameLayer({ slotKey, x, y, width, height, radius = 20, rotation = 0, shape = 'rect', z = 4, dark = false }) {
  return {
    id: nextId(),
    type: 'frame',
    role: 'photo-slot',
    slotKey,
    x,
    y,
    width,
    height,
    radius,
    rotation,
    frameShape: shape,
    imageSrc: null,
    imageName: '',
    imageFit: 'cover',
    imageScale: 1,
    imagePositionX: 50,
    imagePositionY: 50,
    blendMode: 'normal',
    opacity: 1,
    frameFill: dark ? rgba('#ffffff', 0.08) : rgba(BRAND.accent, 0.07),
    frameStroke: dark ? rgba('#ffffff', 0.22) : rgba(BRAND.accent, 0.20),
    z
  };
}

function makePhotoPlaceholder(slot, width, height, dark = false, slotKey = 'photo') {
  if (slot === 'left') return makeFrameLayer({ slotKey, x: width * 0.08, y: height * 0.13, width: width * 0.34, height: height * 0.72, radius: 20, dark });
  if (slot === 'right') return makeFrameLayer({ slotKey, x: width * 0.58, y: height * 0.13, width: width * 0.34, height: height * 0.72, radius: 20, dark });
  if (slot === 'top') return makeFrameLayer({ slotKey, x: width * 0.08, y: height * 0.08, width: width * 0.84, height: height * 0.38, radius: 22, dark });
  if (slot === 'cardTop') return makeFrameLayer({ slotKey, x: width * 0.12, y: height * 0.14, width: width * 0.76, height: height * 0.34, radius: 22, dark });
  if (slot === 'polaroid') return makeFrameLayer({ slotKey, x: width * 0.20, y: height * 0.12, width: width * 0.60, height: height * 0.44, radius: 8, shape: 'polaroid', dark });
  if (slot === 'banner') return makeFrameLayer({ slotKey, x: width * 0.08, y: height * 0.16, width: width * 0.84, height: height * 0.18, radius: 24, dark });
  return makeFrameLayer({ slotKey, x: width * 0.08, y: height * 0.08, width: width * 0.84, height: height * 0.38, radius: 22, dark });
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
  if (template.photoSlot) out.push(makePhotoPlaceholder(template.photoSlot, width, height, template.bg === '#15171a', `${template.id}-main`));
  if (template.frames) {
    template.frames.forEach((frame, index) => {
      out.push(makeFrameLayer({
        slotKey: `${template.id}-${frame.key || index}`,
        x: width * frame.x,
        y: height * frame.y,
        width: width * frame.w,
        height: height * frame.h,
        radius: frame.radius ?? 18,
        rotation: frame.rotation || 0,
        shape: frame.shape || 'rect',
        z: 4 + index,
        dark: ['#15171a', '#28233f'].includes(template.bg)
      }));
    });
  }

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
    layers: buildTemplateLayers(template, width, height, quoteText).map((layer) => ({ ...layer, templateOwned: true }))
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

function roundedPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function placementRect(placement, width, height) {
  if (placement === 'top') return { x: 0, y: 0, width, height: height * 0.52 };
  if (placement === 'bottom') return { x: 0, y: height * 0.48, width, height: height * 0.52 };
  if (placement === 'left') return { x: 0, y: 0, width: width * 0.52, height };
  if (placement === 'right') return { x: width * 0.48, y: 0, width: width * 0.52, height };
  return { x: 0, y: 0, width, height };
}

function canvasBlend(mode) {
  return !mode || mode === 'normal' ? 'source-over' : mode;
}

function drawImageIntoRect(ctx, image, x, y, width, height, fit = 'cover', positionX = 50, positionY = 50, zoom = 1) {
  const coverScale = fit === 'contain'
    ? Math.min(width / image.width, height / image.height)
    : Math.max(width / image.width, height / image.height);
  const scale = coverScale * Math.max(0.1, zoom || 1);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  const overflowX = Math.max(0, drawW - width);
  const overflowY = Math.max(0, drawH - height);
  const dx = x - overflowX * clamp((positionX ?? 50) / 100, 0, 1) + Math.max(0, width - drawW) / 2;
  const dy = y - overflowY * clamp((positionY ?? 50) / 100, 0, 1) + Math.max(0, height - drawH) / 2;
  ctx.drawImage(image, dx, dy, drawW, drawH);
}

function frameClip(ctx, layer) {
  const radius = layer.frameShape === 'circle'
    ? Math.min(layer.width, layer.height) / 2
    : layer.frameShape === 'arch'
      ? Math.min(layer.width / 2, layer.height * 0.48)
      : layer.radius || 0;
  roundedPath(ctx, layer.x, layer.y, layer.width, layer.height, radius);
  ctx.clip();
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
  const [backgroundPhoto, setBackgroundPhoto] = useState('');
  const [backgroundPhotoOpacity, setBackgroundPhotoOpacity] = useState(1);
  const [backgroundPhotoBlend, setBackgroundPhotoBlend] = useState('normal');
  const [backgroundPhotoBlur, setBackgroundPhotoBlur] = useState(0);
  const [backgroundPhotoPlacement, setBackgroundPhotoPlacement] = useState('full');
  const [layers, setLayers] = useState(initial.layers);
  const [selectedId, setSelectedId] = useState(initial.layers.find((l) => l.role === 'quote')?.id || null);
  const [brandPosition, setBrandPosition] = useState('bottom-left');
  const [brandVisible, setBrandVisible] = useState(true);
  const [quality, setQuality] = useState(92);
  const [exporting, setExporting] = useState(false);
  const [templateLocked, setTemplateLocked] = useState(true);
  const dragRef = useRef(null);
  const fileRef = useRef(null);
  const frameFileRef = useRef(null);
  const backgroundFileRef = useRef(null);
  const pendingFrameIdRef = useRef(null);

  const [canvasWidth, canvasHeight] = CANVAS_PRESETS[sizeKey];
  const selected = layers.find((l) => l.id === selectedId) || null;
  const currentTemplate = templates.find((t) => t.id === templateId) || templates[0];
  const filteredTemplates = templateFilter === 'All' ? templates : templates.filter((t) => t.category === templateFilter);
  const groupedTemplates = (templateFilter === 'All' ? TEMPLATE_CATEGORIES.filter((cat) => cat !== 'All') : [templateFilter])
    .map((category) => ({ category, items: templates.filter((t) => t.category === category) }))
    .filter((group) => group.items.length);

  const updateLayer = (id, patch) => setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const applyTemplate = (id, key = sizeKey, text = quoteText) => {
    const next = makeTemplateState(id, key, text);
    const existingFrames = new Map(layers.filter((layer) => layer.type === 'frame' && layer.slotKey).map((layer) => [layer.slotKey, layer]));
    next.layers = next.layers.map((layer) => {
      if (layer.type !== 'frame' || !existingFrames.has(layer.slotKey)) return layer;
      const previous = existingFrames.get(layer.slotKey);
      return {
        ...layer,
        imageSrc: previous.imageSrc,
        imageName: previous.imageName,
        imageFit: previous.imageFit,
        imageScale: previous.imageScale,
        imagePositionX: previous.imagePositionX,
        imagePositionY: previous.imagePositionY,
        blendMode: previous.blendMode,
        opacity: previous.opacity
      };
    });
    setTemplateId(id);
    setMode('template');
    if (id !== templateId || key !== sizeKey) setTemplateLocked(true);
    setBackground(next.background);
    setGradient(next.gradient);
    setLayers(next.layers);
    setSelectedId(next.layers.find((l) => l.role === 'quote')?.id || null);
  };

  const startFree = (key = sizeKey) => {
    setMode('free');
    setTemplateLocked(false);
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
        blendMode: 'normal',
        z: Math.max(10, ...layers.map((l) => l.z || 1)) + 1
      };
      setLayers((p) => [...p, layer]);
      setSelectedId(layer.id);
    };
    img.src = url;
  };

  const addBlock = () => {
    const layer = {
      id: nextId(),
      type: 'block',
      x: canvasWidth * 0.10,
      y: canvasHeight * 0.18,
      width: canvasWidth * 0.80,
      height: canvasHeight * 0.28,
      fill: BRAND.soft,
      radius: 24,
      rotation: 0,
      opacity: 1,
      locked: false,
      z: Math.max(2, ...layers.map((l) => l.z || 1)) + 1
    };
    setLayers((prev) => [...prev, layer]);
    setSelectedId(layer.id);
  };

  const addBackgroundPhoto = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBackgroundPhoto(url);
    setGradient(false);
  };

  const chooseFramePhoto = (frameId) => {
    pendingFrameIdRef.current = frameId;
    frameFileRef.current?.click();
  };

  const attachFramePhoto = (file) => {
    const frameId = pendingFrameIdRef.current;
    if (!file || !frameId) return;
    const url = URL.createObjectURL(file);
    updateLayer(frameId, { imageSrc: url, imageName: file.name, imageScale: 1, imagePositionX: 50, imagePositionY: 50 });
    pendingFrameIdRef.current = null;
  };

  const layerMovementLocked = (layer) => Boolean(layer?.locked || (mode === 'template' && templateLocked && layer?.templateOwned));

  const removeSelected = () => {
    if (!selected || layerMovementLocked(selected)) return;
    setLayers((p) => p.filter((l) => l.id !== selected.id));
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selected || layerMovementLocked(selected)) return;
    const dup = { ...selected, id: nextId(), x: selected.x + 28, y: selected.y + 28, z: Math.max(...layers.map((l) => l.z || 1)) + 1 };
    setLayers((p) => [...p, dup]);
    setSelectedId(dup.id);
  };

  const moveLayer = (dir) => {
    if (!selected || layerMovementLocked(selected)) return;
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
    if (layerMovementLocked(layer)) return;
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
        if (['image', 'frame', 'block'].includes(l.type)) return { ...l, width: Math.max(80, d.width + dx), height: Math.max(80, d.height + dy) };
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
      if (backgroundPhoto) {
        try {
          const bgImage = await loadImg(backgroundPhoto);
          const rect = placementRect(backgroundPhotoPlacement, canvasWidth, canvasHeight);
          ctx.save();
          ctx.globalAlpha = backgroundPhotoOpacity;
          ctx.globalCompositeOperation = canvasBlend(backgroundPhotoBlend);
          ctx.filter = backgroundPhotoBlur ? `blur(${backgroundPhotoBlur}px)` : 'none';
          ctx.beginPath();
          ctx.rect(rect.x, rect.y, rect.width, rect.height);
          ctx.clip();
          drawImageIntoRect(ctx, bgImage, rect.x, rect.y, rect.width, rect.height, 'cover', 50, 50, 1);
          ctx.restore();
        } catch {}
      }
      const sorted = [...layers].sort((a, b) => (a.z || 0) - (b.z || 0));
      for (const layer of sorted) {
        ctx.save();
        ctx.globalAlpha = layer.opacity ?? 1;
        if (layer.type === 'shape' || layer.type === 'block') {
          drawRoundRect(ctx, layer.x, layer.y, layer.width, layer.height, layer.radius || 0, layer.fill, layer.stroke);
        } else if (layer.type === 'image') {
          try {
            const im = await loadImg(layer.src);
            ctx.globalCompositeOperation = canvasBlend(layer.blendMode);
            ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
            ctx.rotate(((layer.rotation || 0) * Math.PI) / 180);
            ctx.drawImage(im, -layer.width / 2, -layer.height / 2, layer.width, layer.height);
          } catch {}
        } else if (layer.type === 'frame') {
          ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
          ctx.rotate(((layer.rotation || 0) * Math.PI) / 180);
          ctx.translate(-(layer.x + layer.width / 2), -(layer.y + layer.height / 2));
          drawRoundRect(ctx, layer.x, layer.y, layer.width, layer.height, layer.radius || 0, layer.frameFill, layer.frameStroke);
          if (layer.imageSrc) {
            try {
              const im = await loadImg(layer.imageSrc);
              ctx.save();
              frameClip(ctx, layer);
              ctx.globalCompositeOperation = canvasBlend(layer.blendMode);
              drawImageIntoRect(ctx, im, layer.x, layer.y, layer.width, layer.height, layer.imageFit || 'cover', layer.imagePositionX, layer.imagePositionY, layer.imageScale || 1);
              ctx.restore();
            } catch {}
          }
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
  const bgPhotoRect = placementRect(backgroundPhotoPlacement, canvasWidth, canvasHeight);
  const bgPhotoStyle = {
    left: `${(bgPhotoRect.x / canvasWidth) * 100}%`,
    top: `${(bgPhotoRect.y / canvasHeight) * 100}%`,
    width: `${(bgPhotoRect.width / canvasWidth) * 100}%`,
    height: `${(bgPhotoRect.height / canvasHeight) * 100}%`,
    opacity: backgroundPhotoOpacity,
    mixBlendMode: backgroundPhotoBlend,
    filter: backgroundPhotoBlur ? `blur(${backgroundPhotoBlur}px)` : undefined
  };
  const selectedTransformLocked = selected ? layerMovementLocked(selected) : false;

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
            {mode === 'template' && (
              <button className={`templateLockBtn ${templateLocked ? 'locked' : 'unlocked'}`} onClick={() => setTemplateLocked((value) => !value)}>
                <span>{templateLocked ? '🔒' : '🔓'}</span>
                <span>{templateLocked ? 'Template locked' : 'Template unlocked'}</span>
              </button>
            )}
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
              {templateFilter !== 'All' && <div className="sectionHint">Showing <strong>{filteredTemplates.length}</strong> template{filteredTemplates.length !== 1 ? 's' : ''} in <strong>{templateFilter}</strong></div>}
              {groupedTemplates.map((group) => (
                <div key={group.category} className="templateSectionGroup">
                  <div className="templateSectionHeading">
                    <h4>{group.category}</h4>
                    <span>{group.items.length}</span>
                  </div>
                  <div className="templateGrid">
                    {group.items.map((t) => (
                      <button key={t.id} className={`templateTile ${templateId === t.id ? 'active' : ''}`} onClick={() => applyTemplate(t.id)}>
                        <span className="templatePreview" style={{ background: t.gradient ? 'linear-gradient(135deg,#fff,#f0efff,#e8e6ff)' : t.bg, color: t.text }}>
                          <i style={{ background: t.accent }} />
                          <b style={{ fontFamily: t.fontA || t.font || defaultFont }}>{t.frames ? '▧' : t.mixed ? 'Ab' : t.effect ? 'FX' : 'Aa'}</b>
                          {(t.effect || t.mixed || t.frames) && <em>{t.frames ? `${t.frames.length} photo slot${t.frames.length > 1 ? 's' : ''}` : t.effect ? t.effect.replace('-', ' ') : `${t.mixed} mix`}</em>}
                        </span>
                        <span>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="panelSection">
            <div className="sectionTitle">Add</div>
            <div className="buttonRow addRow">
              <button className="secondaryBtn" onClick={addText}>+ Text</button>
              <button className="secondaryBtn" onClick={() => fileRef.current?.click()}>+ Pictures</button>
              <button className="secondaryBtn" onClick={addBlock}>+ Block</button>
              <input ref={fileRef} hidden multiple type="file" accept="image/*" onChange={(e) => { Array.from(e.target.files || []).forEach(addImage); e.target.value = ''; }} />
              <input ref={frameFileRef} hidden type="file" accept="image/*" onChange={(e) => { attachFramePhoto(e.target.files?.[0]); e.target.value = ''; }} />
              <input ref={backgroundFileRef} hidden type="file" accept="image/*" onChange={(e) => { addBackgroundPhoto(e.target.files?.[0]); e.target.value = ''; }} />
            </div>
          </div>
        </aside>

        <section className="stageColumn">
          <div className="canvasOuter">
            <div className="canvasStage" style={{ aspectRatio: `${canvasWidth}/${canvasHeight}`, background: previewBackground }} onPointerDown={() => setSelectedId(null)}>
              {backgroundPhoto && <img className="canvasBackgroundPhoto" src={backgroundPhoto} alt="Background" style={bgPhotoStyle} draggable={false} />}
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
                if (layer.type === 'block') {
                  return (
                    <div key={layer.id} className={`canvasLayer blockLayer ${selectedId === layer.id ? 'selected' : ''} ${layerMovementLocked(layer) ? 'isLocked' : ''}`} style={{ ...common, height: `${(layer.height / canvasHeight) * 100}%`, background: layer.fill, borderRadius: `${layer.radius || 0}px` }} onPointerDown={(e) => beginDrag(e, layer)}>
                      {layerMovementLocked(layer) && <span className="layerLockBadge">🔒</span>}
                      <span className="resizeHandle" onPointerDown={(e) => beginDrag(e, layer, 'resize')} />
                    </div>
                  );
                }
                if (layer.type === 'frame') {
                  const shapeClass = `frame-${layer.frameShape || 'rect'}`;
                  return (
                    <div key={layer.id} className={`canvasLayer photoFrame ${shapeClass} ${selectedId === layer.id ? 'selected' : ''} ${layerMovementLocked(layer) ? 'isLocked' : ''}`} style={{ ...common, height: `${(layer.height / canvasHeight) * 100}%`, borderRadius: layer.frameShape === 'circle' ? '50%' : layer.frameShape === 'arch' ? '50% 50% 12px 12px / 42% 42% 12px 12px' : `${layer.radius || 0}px`, background: layer.frameFill, border: `2px dashed ${layer.frameStroke || BRAND.line}` }} onPointerDown={(e) => beginDrag(e, layer)} onDoubleClick={() => chooseFramePhoto(layer.id)}>
                      {layer.imageSrc ? (
                        <img src={layer.imageSrc} alt={layer.imageName || 'Frame photo'} draggable={false} style={{ objectFit: layer.imageFit || 'cover', objectPosition: `${layer.imagePositionX ?? 50}% ${layer.imagePositionY ?? 50}%`, transform: `scale(${layer.imageScale || 1})`, mixBlendMode: layer.blendMode || 'normal' }} />
                      ) : (
                        <button className="framePlaceholder" onPointerDown={(e) => e.stopPropagation()} onClick={() => chooseFramePhoto(layer.id)}>+ Add photo</button>
                      )}
                      {layerMovementLocked(layer) && <span className="layerLockBadge">🔒</span>}
                      <span className="resizeHandle" onPointerDown={(e) => beginDrag(e, layer, 'resize')} />
                    </div>
                  );
                }
                if (layer.type === 'image') {
                  return (
                    <div key={layer.id} className={`canvasLayer imageLayer ${selectedId === layer.id ? 'selected' : ''} ${layerMovementLocked(layer) ? 'isLocked' : ''}`} style={{ ...common, height: `${(layer.height / canvasHeight) * 100}%`, mixBlendMode: layer.blendMode || 'normal' }} onPointerDown={(e) => beginDrag(e, layer)}>
                      <img src={layer.src} alt="Uploaded" draggable={false} />
                      {layerMovementLocked(layer) && <span className="layerLockBadge">🔒</span>}
                      <span className="resizeHandle" onPointerDown={(e) => beginDrag(e, layer, 'resize')} />
                    </div>
                  );
                }
                return (
                  <div key={layer.id} className={`canvasLayer textLayer ${selectedId === layer.id ? 'selected' : ''} ${layerMovementLocked(layer) ? 'isLocked' : ''}`} style={textLayerStyle(layer)} onPointerDown={(e) => beginDrag(e, layer)}>
                    <span>{layer.uppercase ? String(layer.text || '').toUpperCase() : layer.text}</span>
                    {layerMovementLocked(layer) && <span className="layerLockBadge">🔒</span>}
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
            <div className="buttonRow backgroundActions">
              <button className="secondaryBtn" onClick={() => backgroundFileRef.current?.click()}>{backgroundPhoto ? 'Replace photo' : '+ Photo background'}</button>
              {backgroundPhoto && <button className="miniBtn danger" onClick={() => setBackgroundPhoto('')}>Remove</button>}
            </div>
            {backgroundPhoto && (
              <div className="backgroundPhotoControls">
                <div className="fieldGrid">
                  <label>Placement<select value={backgroundPhotoPlacement} onChange={(e) => setBackgroundPhotoPlacement(e.target.value)}><option value="full">Full canvas</option><option value="top">Top half</option><option value="bottom">Bottom half</option><option value="left">Left half</option><option value="right">Right half</option></select></label>
                  <label>Blend<select value={backgroundPhotoBlend} onChange={(e) => setBackgroundPhotoBlend(e.target.value)}>{BLEND_MODES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                </div>
                <label className="rangeLabel">Photo opacity <span>{Math.round(backgroundPhotoOpacity * 100)}%</span><input type="range" min="0" max="100" value={backgroundPhotoOpacity * 100} onChange={(e) => setBackgroundPhotoOpacity(+e.target.value / 100)} /></label>
                <label className="rangeLabel">Blur <span>{backgroundPhotoBlur}px</span><input type="range" min="0" max="24" value={backgroundPhotoBlur} onChange={(e) => setBackgroundPhotoBlur(+e.target.value)} /></label>
              </div>
            )}
          </div>

          {selected ? (
            <>
              <div className="panelSection">
                <div className="sectionTitle">Selected {selected.type}<span>{selectedTransformLocked ? 'locked' : 'editable'}</span></div>
                {selected.templateOwned && templateLocked && <div className="lockNotice">Template layout is locked. You can edit content or replace photos, but unlock the template to move or resize its elements.</div>}

                {selected.type === 'text' && (
                  <>
                    <textarea className="smallTextarea" value={selected.text} onChange={(e) => updateLayer(selected.id, { text: e.target.value })} />
                    <div className="fieldGrid">
                      <label>Size<input disabled={selectedTransformLocked} type="number" min="16" max="240" value={Math.round(selected.fontSize)} onChange={(e) => updateLayer(selected.id, { fontSize: +e.target.value })} /></label>
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

                {selected.type === 'image' && (
                  <>
                    <div className="fieldGrid oneCol">
                      <label>Blend mode<select value={selected.blendMode || 'normal'} onChange={(e) => updateLayer(selected.id, { blendMode: e.target.value })}>{BLEND_MODES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                    </div>
                  </>
                )}

                {selected.type === 'frame' && (
                  <>
                    <div className="buttonRow">
                      <button className="secondaryBtn" onClick={() => chooseFramePhoto(selected.id)}>{selected.imageSrc ? 'Replace photo' : '+ Attach photo'}</button>
                      {selected.imageSrc && <button className="miniBtn danger" onClick={() => updateLayer(selected.id, { imageSrc: null, imageName: '' })}>Clear</button>}
                    </div>
                    <div className="fieldGrid">
                      <label>Fit<select value={selected.imageFit || 'cover'} onChange={(e) => updateLayer(selected.id, { imageFit: e.target.value })}><option value="cover">Cover</option><option value="contain">Contain</option></select></label>
                      <label>Blend<select value={selected.blendMode || 'normal'} onChange={(e) => updateLayer(selected.id, { blendMode: e.target.value })}>{BLEND_MODES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                    </div>
                    <label className="rangeLabel">Photo zoom <span>{Math.round((selected.imageScale || 1) * 100)}%</span><input type="range" min="50" max="240" value={(selected.imageScale || 1) * 100} onChange={(e) => updateLayer(selected.id, { imageScale: +e.target.value / 100 })} /></label>
                    <label className="rangeLabel">Photo X <span>{Math.round(selected.imagePositionX ?? 50)}%</span><input type="range" min="0" max="100" value={selected.imagePositionX ?? 50} onChange={(e) => updateLayer(selected.id, { imagePositionX: +e.target.value })} /></label>
                    <label className="rangeLabel">Photo Y <span>{Math.round(selected.imagePositionY ?? 50)}%</span><input type="range" min="0" max="100" value={selected.imagePositionY ?? 50} onChange={(e) => updateLayer(selected.id, { imagePositionY: +e.target.value })} /></label>
                  </>
                )}

                {selected.type === 'block' && (
                  <>
                    <div className="fieldGrid">
                      <label>Block color<input type="color" value={selected.fill || BRAND.soft} onChange={(e) => updateLayer(selected.id, { fill: e.target.value })} /></label>
                      <label>Radius<input type="number" min="0" max="300" value={Math.round(selected.radius || 0)} onChange={(e) => updateLayer(selected.id, { radius: +e.target.value })} /></label>
                    </div>
                  </>
                )}

                <label className="rangeLabel">Rotation <span>{Math.round(selected.rotation || 0)}°</span><input disabled={selectedTransformLocked} type="range" min="-180" max="180" value={selected.rotation || 0} onChange={(e) => updateLayer(selected.id, { rotation: +e.target.value })} /></label>
                <label className="rangeLabel">Opacity <span>{Math.round((selected.opacity ?? 1) * 100)}%</span><input type="range" min="10" max="100" value={(selected.opacity ?? 1) * 100} onChange={(e) => updateLayer(selected.id, { opacity: +e.target.value / 100 })} /></label>
                <button className={`layerLockButton ${selected.locked ? 'locked' : ''}`} onClick={() => updateLayer(selected.id, { locked: !selected.locked })}>{selected.locked ? '🔒 Unlock this layer' : '🔓 Lock this layer'}</button>
                <div className="buttonRow"><button disabled={selectedTransformLocked} className="miniBtn" onClick={() => moveLayer('down')}>Backward</button><button disabled={selectedTransformLocked} className="miniBtn" onClick={() => moveLayer('up')}>Forward</button></div>
                <div className="buttonRow"><button disabled={selectedTransformLocked} className="miniBtn" onClick={duplicateSelected}>Duplicate</button><button disabled={selectedTransformLocked} className="miniBtn danger" onClick={removeSelected}>Delete</button></div>
              </div>
            </>
          ) : <div className="emptyInspector">Select text, a picture, frame, or block on the canvas to edit it.</div>}

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
