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
  { label: 'Sora', value: 'Sora, Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Outfit', value: 'Outfit, Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Urbanist', value: 'Urbanist, Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'DM Sans', value: '"DM Sans", Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Syne', value: 'Syne, Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Unbounded', value: 'Unbounded, Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Playfair Display', value: '"Playfair Display", Georgia, serif' },
  { label: 'Cormorant Garamond', value: '"Cormorant Garamond", Georgia, serif' },
  { label: 'DM Serif Display', value: '"DM Serif Display", Georgia, serif' },
  { label: 'Libre Baskerville', value: '"Libre Baskerville", Georgia, serif' },
  { label: 'Bodoni Moda', value: '"Bodoni Moda", Georgia, serif' },
  { label: 'Prata', value: 'Prata, Georgia, serif' },
  { label: 'Fraunces', value: 'Fraunces, Georgia, serif' },
  { label: 'Lora', value: 'Lora, Georgia, serif' },
  { label: 'Abril Fatface', value: '"Abril Fatface", Georgia, serif' },
  { label: 'Yeseva One', value: '"Yeseva One", Georgia, serif' },
  { label: 'Cinzel', value: 'Cinzel, Georgia, serif' },
  { label: 'Gloock', value: 'Gloock, Georgia, serif' },
  { label: 'Bebas Neue', value: '"Bebas Neue", Impact, sans-serif' },
  { label: 'Oswald', value: 'Oswald, Arial, sans-serif' },
  { label: 'Anton', value: 'Anton, Impact, sans-serif' },
  { label: 'League Spartan', value: '"League Spartan", Arial, sans-serif' },
  { label: 'Archivo Black', value: '"Archivo Black", Arial, sans-serif' },
  { label: 'Barlow Condensed', value: '"Barlow Condensed", Arial, sans-serif' },
  { label: 'Fjalla One', value: '"Fjalla One", Arial, sans-serif' },
  { label: 'Caveat', value: 'Caveat, cursive' },
  { label: 'Dancing Script', value: '"Dancing Script", cursive' },
  { label: 'Sacramento', value: 'Sacramento, cursive' },
  { label: 'Allura', value: 'Allura, cursive' },
  { label: 'Parisienne', value: 'Parisienne, cursive' },
  { label: 'Great Vibes', value: '"Great Vibes", cursive' },
  { label: 'Homemade Apple', value: '"Homemade Apple", cursive' },
  { label: 'Shadows Into Light', value: '"Shadows Into Light", cursive' },
  { label: 'Poiret One', value: '"Poiret One", cursive' }
];

const FONT_VALUES = FONT_OPTIONS.reduce((acc, item) => ({ ...acc, [item.label]: item.value }), {});
const defaultFont = FONT_VALUES['Inter'];

const BRAND_STYLES = {
  social: { label: 'Facebook Sans', fontFamily: FONT_VALUES['Inter'], weight: 850, icon: 'facebook', text: 'kiocreates', letterSpacing: -0.5, scale: 1 },
  'script-social': { label: 'Facebook + Script', fontFamily: FONT_VALUES['Allura'], weight: 500, icon: 'facebook', text: 'kiocreates', letterSpacing: 0, scale: 1.22 },
  signature: { label: 'Signature', fontFamily: FONT_VALUES['Great Vibes'], weight: 400, icon: 'none', text: 'kiocreates', letterSpacing: 0, scale: 1.30 },
  handwritten: { label: 'Handwritten', fontFamily: FONT_VALUES['Caveat'], weight: 700, icon: 'none', text: 'kiocreates', letterSpacing: 0, scale: 1.08 },
  serif: { label: 'Editorial Serif', fontFamily: FONT_VALUES['Playfair Display'], weight: 700, icon: 'none', text: 'kiocreates', letterSpacing: -0.4, scale: 1.02 },
  elegant: { label: 'Elegant Serif', fontFamily: FONT_VALUES['Cormorant Garamond'], weight: 700, icon: 'none', text: 'kiocreates', letterSpacing: 0.4, scale: 1.12 },
  condensed: { label: 'Condensed', fontFamily: FONT_VALUES['Barlow Condensed'], weight: 700, icon: 'facebook', text: 'kiocreates', letterSpacing: 1.3, scale: 1.02 },
  tiny: { label: 'Tiny Credit', fontFamily: FONT_VALUES['DM Sans'], weight: 700, icon: 'facebook', text: 'kiocreates', letterSpacing: 0.8, scale: 0.78 },
  editorial: { label: 'Editorial Credit', fontFamily: FONT_VALUES['Space Grotesk'], weight: 700, icon: 'none', text: 'FACEBOOK / KIOCREATES', letterSpacing: 1.7, scale: 0.70 },
  wordmark: { label: 'Wordmark Only', fontFamily: FONT_VALUES['Manrope'], weight: 800, icon: 'none', text: 'kiocreates', letterSpacing: -0.7, scale: 0.95 },
  monogram: { label: 'K Monogram', fontFamily: FONT_VALUES['Sora'], weight: 800, icon: 'k', text: 'kiocreates', letterSpacing: -0.4, scale: 0.95 }
};

const BRAND_STYLE_OPTIONS = Object.entries(BRAND_STYLES).map(([value, style]) => ({ value, label: style.label }));

function stringHash(value = '') {
  return Array.from(String(value)).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function footerStyleForTemplate(template) {
  if (template?.footerStyle && BRAND_STYLES[template.footerStyle]) return template.footerStyle;
  const category = template?.category || '';
  const pools = {
    'Poetry & Relatable': ['signature', 'serif', 'script-social', 'handwritten', 'tiny', 'elegant'],
    'Photo Frames': ['tiny', 'signature', 'serif', 'social'],
    Editorial: ['serif', 'editorial', 'elegant', 'tiny'],
    Minimal: ['social', 'tiny', 'wordmark'],
    Minimalist: ['tiny', 'wordmark', 'serif'],
    Bold: ['social', 'condensed', 'monogram'],
    Poster: ['condensed', 'editorial', 'monogram'],
    Maximalist: ['condensed', 'monogram', 'social'],
    Mixed: ['script-social', 'serif', 'social', 'signature'],
    Soft: ['script-social', 'signature', 'tiny', 'elegant'],
    Dark: ['social', 'condensed', 'serif'],
    Photo: ['tiny', 'social', 'signature'],
    Effects: ['social', 'condensed', 'monogram'],
    Circular: ['serif', 'signature', 'social'],
    Repeat: ['condensed', 'tiny', 'social']
  };
  const pool = pools[category] || ['social', 'tiny', 'wordmark'];
  return pool[stringHash(template?.id) % pool.length];
}

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

const FRAME_SHAPES = [
  ['rect', 'Rectangle'],
  ['rounded', 'Rounded'],
  ['circle', 'Circle'],
  ['arch', 'Arch'],
  ['polaroid', 'Polaroid'],
  ['film', 'Film strip']
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
  { id:'poetry-center-window', name:'Center Window', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.16,y:.68,w:.68,size:.042,weight:700, font:FONT_VALUES['Playfair Display'], frames:[{key:'main',x:.22,y:.15,w:.56,h:.42,radius:18,shape:'rect'}], label:'a small thought' },
  { id:'poetry-left-photo', name:'Left Memory', category:'Poetry & Relatable', bg:'#f5f2ed', text:'#15171a', accent:'#645cff', align:'left', x:.55,y:.24,w:.34,size:.042,weight:700, font:FONT_VALUES['Cormorant Garamond'], frames:[{key:'main',x:.08,y:.14,w:.38,h:.62,radius:10,shape:'rect'}] },
  { id:'poetry-right-photo', name:'Right Memory', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.24,w:.35,size:.044,weight:720, font:FONT_VALUES['Libre Baskerville'], frames:[{key:'main',x:.56,y:.14,w:.34,h:.60,radius:24,shape:'rect'}], topLine:true },
  { id:'poetry-polaroid-note', name:'Polaroid Note', category:'Poetry & Relatable', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'center', x:.15,y:.73,w:.70,size:.040,weight:680, font:FONT_VALUES['Caveat'], frames:[{key:'main',x:.22,y:.12,w:.56,h:.48,radius:8,shape:'polaroid'}] },
  { id:'poetry-circle-memory', name:'Circle Memory', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.17,y:.64,w:.66,size:.041,weight:700, font:FONT_VALUES['DM Serif Display'], frames:[{key:'main',x:.28,y:.12,w:.44,h:.44,radius:999,shape:'circle'}] },
  { id:'poetry-double-memory', name:'Double Memory', category:'Poetry & Relatable', bg:'#f7f7f5', text:'#15171a', accent:'#645cff', align:'center', x:.18,y:.66,w:.64,size:.040,weight:700, font:FONT_VALUES['Inter'], frames:[{key:'a',x:.10,y:.13,w:.36,h:.42,radius:18,shape:'rect'},{key:'b',x:.54,y:.18,w:.36,h:.42,radius:18,shape:'rect'}] },
  { id:'poetry-three-stills', name:'Three Stills', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.12,y:.68,w:.72,size:.038,weight:680, font:FONT_VALUES['Playfair Display'], frames:[{key:'a',x:.08,y:.12,w:.25,h:.40,radius:12,shape:'rect'},{key:'b',x:.375,y:.08,w:.25,h:.44,radius:12,shape:'rect'},{key:'c',x:.67,y:.16,w:.25,h:.36,radius:12,shape:'rect'}] },
  { id:'poetry-filmstrip', name:'Film Strip', category:'Poetry & Relatable', bg:'#15171a', text:'#ffffff', accent:'#8d86ff', align:'center', x:.14,y:.70,w:.72,size:.040,weight:650, font:FONT_VALUES['Cormorant Garamond'], frames:[{key:'a',x:.08,y:.15,w:.25,h:.34,radius:3,shape:'rect'},{key:'b',x:.375,y:.15,w:.25,h:.34,radius:3,shape:'rect'},{key:'c',x:.67,y:.15,w:.25,h:.34,radius:3,shape:'rect'}] },
  { id:'poetry-small-center', name:'Small Center Photo', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.17,y:.58,w:.66,size:.046,weight:720, font:FONT_VALUES['Playfair Display'], frames:[{key:'main',x:.36,y:.17,w:.28,h:.28,radius:16,shape:'rect'}], quoteMark:true },
  { id:'poetry-bottom-window', name:'Bottom Window', category:'Poetry & Relatable', bg:'#f3f4f6', text:'#15171a', accent:'#645cff', align:'center', x:.15,y:.14,w:.70,size:.044,weight:700, font:FONT_VALUES['DM Serif Display'], frames:[{key:'main',x:.18,y:.48,w:.64,h:.34,radius:22,shape:'rect'}] },
  { id:'poetry-overlap-two', name:'Overlapping Memories', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.12,y:.58,w:.48,size:.042,weight:720, font:FONT_VALUES['Inter'], frames:[{key:'back',x:.38,y:.12,w:.42,h:.43,radius:18,shape:'rect',rotation:7},{key:'front',x:.52,y:.24,w:.36,h:.38,radius:18,shape:'rect',rotation:-5}] },
  { id:'poetry-side-caption', name:'Side Caption', category:'Poetry & Relatable', bg:'#f7f4ef', text:'#15171a', accent:'#645cff', align:'left', x:.70,y:.18,w:.20,size:.030,weight:620, font:FONT_VALUES['Inter'], frames:[{key:'main',x:.08,y:.12,w:.54,h:.66,radius:0,shape:'rect'}], label:'memory no. 01' },


  { id:'poetry-big-serif', name:'Big Serif Thought', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.20,w:.74,size:.066,weight:700, font:FONT_VALUES['Playfair Display'], previewText:'be gentle\nwith yourself', footerStyle:'serif' },
  { id:'poetry-italic-break', name:'Italic Break', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.24,w:.72,size:.058,weight:500, font:FONT_VALUES['Bodoni Moda'], fontStyle:'italic', previewText:'some things\nneed more time', footerStyle:'signature' },
  { id:'poetry-taglish-serif', name:'Taglish Serif', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.12,y:.22,w:.76,size:.060,weight:700, font:FONT_VALUES['Cormorant Garamond'], previewText:'minsan okay lang\nna mapagod', footerStyle:'tiny' },
  { id:'poetry-photo-strip-top', name:'Photo Strip Top', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.15,y:.48,w:.70,size:.042,weight:650, font:FONT_VALUES['Libre Baskerville'], frames:[{key:'main',x:.20,y:.17,w:.60,h:.17,radius:0,shape:'rect'}], previewText:'some memories\nstay quietly', footerStyle:'signature' },
  { id:'poetry-photo-strip-middle', name:'Photo Between Lines', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.16,y:.16,w:.68,size:.038,weight:650, font:FONT_VALUES['Lora'], frames:[{key:'main',x:.18,y:.39,w:.64,h:.18,radius:0,shape:'rect'}], previewText:'i kept going\neven on quiet days', footerStyle:'handwritten' },
  { id:'poetry-photo-strip-bottom', name:'Photo Strip Bottom', category:'Poetry & Relatable', bg:'#f7f5f0', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.18,w:.72,size:.043,weight:700, font:FONT_VALUES['Prata'], frames:[{key:'main',x:.17,y:.55,w:.66,h:.18,radius:4,shape:'rect'}], previewText:'you can miss it\nand still move on', footerStyle:'elegant' },
  { id:'poetry-mixed-emphasis', name:'Serif Emphasis', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', mixed:'poetry-emphasis', x:.10,y:.19,w:.80, fontA:FONT_VALUES['Playfair Display'], fontB:FONT_VALUES['Bodoni Moda'], fontC:FONT_VALUES['Playfair Display'], previewText:'be kind\nwith the little you\ninside you', footerStyle:'signature' },
  { id:'poetry-mixed-taglish', name:'Taglish Emphasis', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', mixed:'poetry-emphasis', x:.11,y:.20,w:.78, fontA:FONT_VALUES['Cormorant Garamond'], fontB:FONT_VALUES['DM Serif Display'], fontC:FONT_VALUES['Cormorant Garamond'], previewText:'yung gusto mong\npahinga\npero kailangan mo pa rin', footerStyle:'tiny' },
  { id:'poetry-small-photo-note', name:'Tiny Memory Note', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.24,y:.58,w:.52,size:.034,weight:600, font:FONT_VALUES['Lora'], frames:[{key:'main',x:.36,y:.20,w:.28,h:.22,radius:2,shape:'rect'}], previewText:'a quiet reminder\nfor later', footerStyle:'signature' },
  { id:'poetry-wide-film', name:'Wide Film Note', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.62,w:.72,size:.037,weight:650, font:FONT_VALUES['Cormorant Garamond'], frames:[{key:'main',x:.10,y:.25,w:.80,h:.25,radius:0,shape:'rect'}], previewText:'we grow in ways\nwe do not notice', footerStyle:'elegant' },
  { id:'poetry-dark-film', name:'Midnight Film', category:'Poetry & Relatable', bg:'#15171a', text:'#ffffff', accent:'#8d86ff', align:'center', x:.15,y:.64,w:.70,size:.040,weight:600, font:FONT_VALUES['Lora'], frames:[{key:'main',x:.12,y:.20,w:.76,h:.30,radius:2,shape:'rect'}], previewText:'some nights\nfeel like old songs', footerStyle:'script-social' },
  { id:'poetry-soft-letter', name:'Soft Letter', category:'Poetry & Relatable', bg:'#f3f0ea', text:'#15171a', accent:'#645cff', align:'left', x:.16,y:.25,w:.60,size:.042,weight:500, font:FONT_VALUES['Lora'], previewText:'dear you,\nyou made it here.', footerStyle:'signature' },
  { id:'poetry-cursive-note', name:'Cursive Note', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.18,y:.30,w:.64,size:.052,weight:500, font:FONT_VALUES['Dancing Script'], previewText:'take your time,\nplease.', footerStyle:'tiny' },
  { id:'poetry-handwritten-photo', name:'Handwritten Memory', category:'Poetry & Relatable', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.66,w:.72,size:.044,weight:700, font:FONT_VALUES['Caveat'], frames:[{key:'main',x:.23,y:.14,w:.54,h:.40,radius:14,shape:'rect'}], previewText:'some places\nfeel like home', footerStyle:'handwritten' },
  { id:'poetry-left-quiet', name:'Quiet Left', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.10,y:.31,w:.48,size:.046,weight:650, font:FONT_VALUES['Libre Baskerville'], previewText:'not every ending\nneeds an answer', footerStyle:'serif' },
  { id:'poetry-right-quiet', name:'Quiet Right', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'right', x:.40,y:.32,w:.50,size:.046,weight:650, font:FONT_VALUES['Libre Baskerville'], previewText:'some peace\nlooks like distance', footerStyle:'tiny' },
  { id:'poetry-large-small', name:'Large + Small', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', mixed:'two', x:.10,y:.22,w:.80, fontA:FONT_VALUES['DM Serif Display'], fontB:FONT_VALUES['Inter'], previewText:'you survived\nmore than you say', footerStyle:'signature' },
  { id:'poetry-script-modern', name:'Script + Serif', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', mixed:'two', x:.12,y:.25,w:.76, fontA:FONT_VALUES['Great Vibes'], fontB:FONT_VALUES['Playfair Display'], previewText:'little things\nstill matter', footerStyle:'social' },
  { id:'poetry-three-tone', name:'Three Tone', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', mixed:'three', x:.09,y:.18,w:.82, fontA:FONT_VALUES['Bebas Neue'], fontB:FONT_VALUES['Cormorant Garamond'], fontC:FONT_VALUES['Inter'], previewText:'KEEP GOING\neven when quiet\ndays feel heavy', footerStyle:'tiny' },
  { id:'poetry-faded-word', name:'Faded Feeling', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.16,y:.38,w:.68,size:.048,weight:700, font:FONT_VALUES['Playfair Display'], effect:'watermark', previewText:'healing can be\nvery quiet', footerStyle:'signature' },
  { id:'poetry-repeat-soft', name:'Repeated Thought', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.15,y:.36,w:.70,size:.045,weight:700, font:FONT_VALUES['Inter'], effect:'repeat', previewText:'stay soft\nstay true', footerStyle:'tiny' },
  { id:'poetry-outline-note', name:'Outline Whisper', category:'Poetry & Relatable', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'center', x:.14,y:.31,w:.72,size:.056,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'outline', previewText:'STILL HERE', footerStyle:'script-social' },
  { id:'poetry-two-photo-story', name:'Two Photo Story', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.16,y:.66,w:.68,size:.038,weight:650, font:FONT_VALUES['Lora'], frames:[{key:'a',x:.12,y:.16,w:.34,h:.36,radius:6,shape:'rect'},{key:'b',x:.54,y:.16,w:.34,h:.36,radius:6,shape:'rect'}], previewText:'two places,\none feeling', footerStyle:'signature' },
  { id:'poetry-photo-stack', name:'Stacked Memories', category:'Poetry & Relatable', bg:'#f7f5f0', text:'#15171a', accent:'#645cff', align:'left', x:.12,y:.64,w:.50,size:.040,weight:650, font:FONT_VALUES['Cormorant Garamond'], frames:[{key:'back',x:.24,y:.12,w:.48,h:.38,radius:4,shape:'rect',rotation:5},{key:'front',x:.38,y:.25,w:.46,h:.36,radius:4,shape:'rect',rotation:-4}], previewText:'the same memory\nchanges with time', footerStyle:'handwritten' },
  { id:'poetry-circle-note', name:'Circle Poetry', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.18,y:.65,w:.64,size:.040,weight:650, font:FONT_VALUES['Prata'], frames:[{key:'main',x:.31,y:.15,w:.38,h:.38,radius:999,shape:'circle'}], previewText:'you looked happy\nthere', footerStyle:'elegant' },
  { id:'poetry-arch-note', name:'Arch Memory', category:'Poetry & Relatable', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'center', x:.15,y:.67,w:.70,size:.040,weight:650, font:FONT_VALUES['Playfair Display'], frames:[{key:'main',x:.27,y:.11,w:.46,h:.46,radius:180,shape:'arch'}], previewText:'some memories\narrive softly', footerStyle:'signature' },
  { id:'poetry-long-paragraph', name:'Long Thought', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.12,y:.18,w:.72,size:.037,weight:650, font:FONT_VALUES['Lora'], previewText:'you do not need to have every answer today. sometimes continuing is already enough.', footerStyle:'tiny' },
  { id:'poetry-bottom-credit', name:'Bottom Credit', category:'Poetry & Relatable', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.16,y:.30,w:.68,size:.050,weight:700, font:FONT_VALUES['Bodoni Moda'], previewText:'you can begin\nagain quietly', footerStyle:'editorial' },

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
  { id:'frames-photo-note', name:'Photo + Tiny Note', category:'Photo Frames', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'left', x:.68,y:.60,w:.22,size:.028,weight:600, font:FONT_VALUES['Inter'], frames:[{key:'main',x:.08,y:.12,w:.52,h:.60,radius:18,shape:'rect'}], label:'note 01' },

  // FISHEYE / WARP
  { id:'fisheye-soft-burst', name:'Soft Burst', category:'Fisheye & Warp', bg:'#ffffff', text:'#15171a', accent:'#645cff', align:'center', x:.12,y:.34,w:.76,size:.072,weight:900, font:FONT_VALUES['Space Grotesk'], effect:'fisheye', previewText:'stay weird' },
  { id:'fisheye-lavender', name:'Lavender Lens', category:'Fisheye & Warp', bg:'#f0efff', text:'#15171a', accent:'#645cff', align:'center', x:.10,y:.34,w:.80,size:.074,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'fisheye', previewText:'LOOK AT ME' },
  { id:'fisheye-midnight', name:'Midnight Lens', category:'Fisheye & Warp', bg:'#15171a', text:'#ffffff', accent:'#8d86ff', align:'center', x:.10,y:.34,w:.80,size:.074,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'fisheye', previewText:'late thoughts', footerStyle:'script-social' },
  { id:'fisheye-repeat-wave', name:'Warp + Repeat', category:'Fisheye & Warp', bg:'#fff6ee', text:'#f5482f', accent:'#2146ff', align:'center', x:.12,y:.33,w:.76,size:.070,weight:900, font:FONT_VALUES['Bebas Neue'], effect:'fisheye', previewText:'FEELS LOUD', footerStyle:'social' }

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
  blendMode,
  fontStyle = 'normal'
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
    blendMode,
    fontStyle
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
    aspectLocked: true,
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

function estimateLineCount(text, width, fontSize) {
  const safeWidth = Math.max(80, width || 80);
  const safeSize = Math.max(12, fontSize || 12);
  const charsPerLine = Math.max(5, Math.floor(safeWidth / (safeSize * 0.52)));
  return String(text || '').split('\n').reduce((total, paragraph) => {
    const length = Math.max(1, paragraph.trim().length);
    return total + Math.max(1, Math.ceil(length / charsPerLine));
  }, 0);
}

function adaptiveLineHeight(text, width, fontSize, base = 1.12) {
  const lines = estimateLineCount(text, width, fontSize);
  if (lines <= 2) return base;
  if (lines === 3) return Math.max(0.98, base - 0.08);
  if (lines === 4) return Math.max(0.90, base - 0.16);
  if (lines === 5) return Math.max(0.82, base - 0.24);
  if (lines === 6) return Math.max(0.76, base - 0.30);
  return Math.max(0.68, base - 0.38);
}

function estimatedTextHeight(text, width, fontSize, lineHeight) {
  return estimateLineCount(text, width, fontSize) * fontSize * lineHeight;
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
    lineHeight: adaptiveLineHeight(text, Math.round(template.w * width), Math.max(26, Math.round(template.size * Math.min(width, height))), template.lineHeight || 1.12),
    uppercase: template.uppercase || false,
    fontStyle: template.fontStyle || 'normal'
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
    case 'fisheye':
      layer.uppercase = true;
      layer.warp = 'fisheye';
      layer.lineHeight = Math.max(0.86, (layer.lineHeight || 1.05) - 0.10);
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
  const minDim = Math.min(width, height);

  if (template.mixed === 'two') {
    const [a, b] = splitForMix(quoteText, 2);
    const x = width * (template.x || 0.12);
    const y = height * (template.y || 0.22);
    const w = width * (template.w || 0.76);
    const fs1 = Math.round(minDim * 0.085);
    const fs2 = Math.round(minDim * 0.048);
    const lh1 = adaptiveLineHeight(a, w, fs1, 0.98);
    const lh2 = adaptiveLineHeight(b, w, fs2, 1.10);
    const h1 = estimatedTextHeight(a, w, fs1, lh1);
    const h2 = estimatedTextHeight(b, w, fs2, lh2);
    const density = estimateLineCount(a, w, fs1) + estimateLineCount(b, w, fs2);
    const gap = clamp(height * (0.055 - Math.max(0, density - 4) * 0.008), height * 0.008, height * 0.055);
    const layer1 = makeTextLayer({ text: a, x, y, width: w, fontSize: fs1, weight: 700, color: template.text, align: template.align || 'left', z: 10, fontFamily: template.fontA, lineHeight: lh1, fontStyle: template.fontStyleA || 'normal' });
    const layer2 = makeTextLayer({ text: b, x, y: y + h1 + gap, width: w, fontSize: fs2, weight: 800, color: template.accent, align: template.align || 'left', z: 11, fontFamily: template.fontB, lineHeight: lh2, uppercase: false, letterSpacing: 1, fontStyle: template.fontStyleB || 'normal' });
    layer1.role = 'quote';
    layer2.role = 'quote-secondary';
    layer1.autoSpacing = true;
    layer2.autoSpacing = true;
    layer2.maxSuggestedBottom = y + h1 + gap + h2;
    return [...base, layer1, layer2];
  }

  if (template.mixed === 'three') {
    const [a, b, c] = splitForMix(quoteText, 3);
    const x = width * (template.x || 0.12);
    const y = height * (template.y || 0.18);
    const w = width * (template.w || 0.76);
    const fs1 = Math.round(minDim * 0.095);
    const fs2 = Math.round(minDim * 0.055);
    const fs3 = Math.round(minDim * 0.045);
    const lh1 = adaptiveLineHeight(a, w, fs1, 0.92);
    const lh2 = adaptiveLineHeight(b, w, fs2, 1.02);
    const lh3 = adaptiveLineHeight(c, w, fs3, 1.12);
    const h1 = estimatedTextHeight(a, w, fs1, lh1);
    const h2 = estimatedTextHeight(b, w, fs2, lh2);
    const density = estimateLineCount(a, w, fs1) + estimateLineCount(b, w, fs2) + estimateLineCount(c, w, fs3);
    const gap = clamp(height * (0.040 - Math.max(0, density - 5) * 0.005), height * 0.006, height * 0.040);
    const l1 = makeTextLayer({ text: a, x, y, width: w, fontSize: fs1, weight: 900, color: template.text, align: template.align || 'left', z: 10, fontFamily: template.fontA, uppercase: true, lineHeight: lh1, fontStyle: template.fontStyleA || 'normal' });
    const l2 = makeTextLayer({ text: b, x, y: y + h1 + gap, width: w, fontSize: fs2, weight: 700, color: template.accent, align: template.align || 'left', z: 11, fontFamily: template.fontB, lineHeight: lh2, fontStyle: template.fontStyleB || 'normal' });
    const l3 = makeTextLayer({ text: c, x, y: y + h1 + gap + h2 + gap, width: w, fontSize: fs3, weight: 700, color: template.text, align: template.align || 'left', z: 12, fontFamily: template.fontC || defaultFont, lineHeight: lh3, fontStyle: template.fontStyleC || 'normal' });
    l1.role = 'quote';
    l2.role = 'quote-secondary';
    l3.role = 'quote-tertiary';
    l1.autoSpacing = l2.autoSpacing = l3.autoSpacing = true;
    return [...base, l1, l2, l3];
  }

  if (template.mixed === 'poetry-emphasis') {
    const [a, b, c] = splitForMix(quoteText, 3);
    const x = width * (template.x || 0.12);
    const y = height * (template.y || 0.20);
    const w = width * (template.w || 0.76);
    const fs1 = Math.round(minDim * 0.060);
    const fs2 = Math.round(minDim * 0.072);
    const fs3 = Math.round(minDim * 0.058);
    const lh1 = adaptiveLineHeight(a, w, fs1, 1.00);
    const lh2 = adaptiveLineHeight(b, w, fs2, 0.92);
    const lh3 = adaptiveLineHeight(c, w, fs3, 1.00);
    const h1 = estimatedTextHeight(a, w, fs1, lh1);
    const h2 = estimatedTextHeight(b, w, fs2, lh2);
    const totalLines = estimateLineCount(a, w, fs1) + estimateLineCount(b, w, fs2) + estimateLineCount(c, w, fs3);
    const gap = clamp(height * (0.045 - Math.max(0, totalLines - 5) * 0.006), height * 0.004, height * 0.045);
    const l1 = makeTextLayer({ text: a, x, y, width: w, fontSize: fs1, weight: 650, color: template.text, align: template.align || 'center', z: 10, fontFamily: template.fontA || FONT_VALUES['Playfair Display'], lineHeight: lh1 });
    const l2 = makeTextLayer({ text: b, x, y: y + h1 + gap, width: w, fontSize: fs2, weight: 600, color: template.text, align: template.align || 'center', z: 11, fontFamily: template.fontB || FONT_VALUES['Bodoni Moda'], lineHeight: lh2, fontStyle: 'italic' });
    const l3 = makeTextLayer({ text: c, x, y: y + h1 + gap + h2 + gap, width: w, fontSize: fs3, weight: 650, color: template.text, align: template.align || 'center', z: 12, fontFamily: template.fontC || FONT_VALUES['Playfair Display'], lineHeight: lh3 });
    l1.role = 'quote';
    l2.role = 'quote-secondary';
    l3.role = 'quote-tertiary';
    l1.autoSpacing = l2.autoSpacing = l3.autoSpacing = true;
    return [...base, l1, l2, l3];
  }

  if (template.effect === 'stacked') {
    const words = splitForMix(quoteText, 3).map((part) => part.toUpperCase());
    const x = width * 0.10;
    const y = height * 0.18;
    const w1 = width * 0.56;
    const w2 = width * 0.58;
    const w3 = width * 0.62;
    const fs1 = Math.round(minDim * 0.12);
    const fs2 = Math.round(minDim * 0.10);
    const fs3 = Math.round(minDim * 0.08);
    const lh1 = adaptiveLineHeight(words[0], w1, fs1, 0.88);
    const lh2 = adaptiveLineHeight(words[1], w2, fs2, 0.88);
    const h1 = estimatedTextHeight(words[0], w1, fs1, lh1);
    const h2 = estimatedTextHeight(words[1], w2, fs2, lh2);
    const gap = height * 0.008;
    const first = makeTextLayer({ text: words[0], x, y, width: w1, fontSize: fs1, weight: 900, color: template.text, align: 'left', z: 10, fontFamily: template.font, lineHeight: lh1, uppercase: true });
    const second = makeTextLayer({ text: words[1], x: x + width * 0.08, y: y + h1 + gap, width: w2, fontSize: fs2, weight: 900, color: template.accent, align: 'left', z: 11, fontFamily: template.font, lineHeight: lh2, uppercase: true });
    const third = makeTextLayer({ text: words[2], x: x + width * 0.16, y: second.y + h2 + gap, width: w3, fontSize: fs3, weight: 900, color: template.text, align: 'left', z: 12, fontFamily: template.font, lineHeight: adaptiveLineHeight(words[2], w3, fs3, 0.90), uppercase: true });
    first.role = 'quote';
    second.role = 'quote-secondary';
    third.role = 'quote-tertiary';
    first.autoSpacing = second.autoSpacing = third.autoSpacing = true;
    return [...base, first, second, third];
  }

  const quote = makeQuoteLayer(template, width, height, quoteText);
  quote.autoSpacing = true;
  return [...base, quote];
}

const DYNAMIC_RECREATE_RECIPES = [
  { id:'dynamic-soft-editorial', name:'Soft Editorial', category:'Dynamic Recreate', background:'#ffffff', accent:'#645cff', footerStyle:'serif', layout:'centered' },
  { id:'dynamic-memory-window', name:'Memory Window', category:'Dynamic Recreate', background:'#f5f2ed', accent:'#645cff', footerStyle:'signature', layout:'center-photo' },
  { id:'dynamic-split-story', name:'Split Story', category:'Dynamic Recreate', background:'#ffffff', accent:'#645cff', footerStyle:'tiny', layout:'split-photo' },
  { id:'dynamic-background-whisper', name:'Background Whisper', category:'Dynamic Recreate', background:'#ffffff', accent:'#645cff', footerStyle:'editorial', layout:'background-card' },
  { id:'dynamic-fisheye-burst', name:'Fisheye Burst', category:'Dynamic Recreate', background:'#15171a', accent:'#8d86ff', footerStyle:'script-social', layout:'fisheye' },
  { id:'dynamic-film-note', name:'Film Note', category:'Dynamic Recreate', background:'#15171a', accent:'#8d86ff', footerStyle:'handwritten', layout:'filmstrip' },
  { id:'dynamic-layered-note', name:'Layered Note', category:'Dynamic Recreate', background:'#f0efff', accent:'#645cff', footerStyle:'social', layout:'layered-card' }
];

function normalizeRemixText(text = '') {
  return String(text || '').replace(/\r/g, '').trim() || starterQuote;
}

function splitDynamicText(text, parts = 2) {
  const manual = normalizeRemixText(text).split('\n').map((line) => line.trim()).filter(Boolean);
  if (manual.length >= parts) {
    const out = manual.slice(0, parts);
    while (out.length < parts) out.push('');
    return out;
  }
  const words = normalizeRemixText(text).replace(/\s+/g, ' ').split(' ').filter(Boolean);
  if (!words.length) return Array(parts).fill('');
  const per = Math.ceil(words.length / parts);
  const out = [];
  for (let i = 0; i < parts; i++) out.push(words.slice(i * per, (i + 1) * per).join(' '));
  while (out.length < parts) out.push('');
  return out;
}

function buildDynamicRemixLayers(recipe, width, height, text = starterQuote) {
  const safeText = normalizeRemixText(text);
  const accent = recipe.accent || BRAND.accent;
  const dark = ['#15171a', '#1b1235', '#162134', '#28233f'].includes(String(recipe.background).toLowerCase());
  const textColor = dark ? '#ffffff' : BRAND.text;
  const layers = [];
  const add = (layer) => { layers.push(layer); return layer; };

  if (recipe.layout === 'centered') {
    add(makeShapeLayer({ x: width * 0.12, y: height * 0.18, width: width * 0.76, height: height * 0.60, fill: '#ffffff', stroke: rgba(accent, 0.14), radius: 28, z: 1 }));
    const quote = makeTextLayer({ text: safeText, x: width * 0.16, y: height * 0.30, width: width * 0.68, fontSize: Math.round(Math.min(width, height) * 0.056), weight: 700, color: textColor, align: 'center', z: 10, fontFamily: FONT_VALUES['Playfair Display'], lineHeight: adaptiveLineHeight(safeText, width * 0.68, Math.round(Math.min(width, height) * 0.056), 1.08) });
    quote.role = 'quote';
    quote.autoSpacing = true;
    add(quote);
  }

  if (recipe.layout === 'center-photo') {
    const frame = makeFrameLayer({ slotKey: `${recipe.id}-photo`, x: width * 0.20, y: height * 0.12, width: width * 0.60, height: height * 0.42, radius: 18, shape: 'rect', z: 4, dark });
    add(frame);
    const quote = makeTextLayer({ text: safeText, x: width * 0.14, y: height * 0.63, width: width * 0.72, fontSize: Math.round(Math.min(width, height) * 0.042), weight: 650, color: textColor, align: 'center', z: 10, fontFamily: FONT_VALUES['Lora'], lineHeight: adaptiveLineHeight(safeText, width * 0.72, Math.round(Math.min(width, height) * 0.042), 1.10) });
    quote.role = 'quote';
    add(quote);
  }

  if (recipe.layout === 'split-photo') {
    const frame = makeFrameLayer({ slotKey: `${recipe.id}-photo`, x: width * 0.08, y: height * 0.12, width: width * 0.38, height: height * 0.68, radius: 10, shape: 'rect', z: 4, dark });
    add(frame);
    const [one, two] = splitDynamicText(safeText, 2);
    const a = makeTextLayer({ text: one, x: width * 0.55, y: height * 0.22, width: width * 0.28, fontSize: Math.round(Math.min(width, height) * 0.070), weight: 900, color: textColor, align: 'left', z: 11, fontFamily: FONT_VALUES['Bebas Neue'], lineHeight: 0.94, uppercase: true });
    a.role = 'quote';
    const b = makeTextLayer({ text: two, x: width * 0.55, y: height * 0.50, width: width * 0.26, fontSize: Math.round(Math.min(width, height) * 0.036), weight: 600, color: textColor, align: 'left', z: 12, fontFamily: FONT_VALUES['Inter'], lineHeight: adaptiveLineHeight(two, width * 0.26, Math.round(Math.min(width, height) * 0.036), 1.10) });
    b.role = 'quote-secondary';
    add(a);
    add(b);
  }

  if (recipe.layout === 'background-card') {
    const keyword = wordsToKey(safeText, 2);
    const under = makeTextLayer({ text: keyword, x: width * 0.06, y: height * 0.14, width: width * 0.88, fontSize: Math.round(Math.min(width, height) * 0.15), weight: 900, color: rgba(accent, 0.10), align: 'center', z: 1, fontFamily: FONT_VALUES['Bebas Neue'], uppercase: true, lineHeight: 0.9 });
    under.role = 'decor';
    add(under);
    add(makeShapeLayer({ x: width * 0.12, y: height * 0.28, width: width * 0.76, height: height * 0.42, fill: '#ffffff', stroke: rgba(accent, 0.14), radius: 24, z: 2 }));
    const quote = makeTextLayer({ text: safeText, x: width * 0.18, y: height * 0.38, width: width * 0.64, fontSize: Math.round(Math.min(width, height) * 0.044), weight: 650, color: BRAND.text, align: 'center', z: 10, fontFamily: FONT_VALUES['Cormorant Garamond'], lineHeight: adaptiveLineHeight(safeText, width * 0.64, Math.round(Math.min(width, height) * 0.044), 1.06) });
    quote.role = 'quote';
    add(quote);
  }

  if (recipe.layout === 'fisheye') {
    const [one, two] = splitDynamicText(safeText, 2);
    const quote = makeTextLayer({ text: `${one}\n${two}`.trim(), x: width * 0.08, y: height * 0.28, width: width * 0.84, fontSize: Math.round(Math.min(width, height) * 0.082), weight: 900, color: '#ffffff', align: 'center', z: 10, fontFamily: FONT_VALUES['Bebas Neue'], lineHeight: 0.88, uppercase: true });
    quote.role = 'quote';
    quote.warp = 'fisheye';
    add(quote);
    const sub = makeTextLayer({ text: 'dynamic recreate', x: width * 0.28, y: height * 0.76, width: width * 0.44, fontSize: Math.round(Math.min(width, height) * 0.02), weight: 800, color: rgba('#ffffff', 0.66), align: 'center', z: 11, fontFamily: defaultFont, letterSpacing: 5, uppercase: true });
    sub.role = 'decor';
    add(sub);
  }

  if (recipe.layout === 'filmstrip') {
    const slots = [0.10, 0.38, 0.66];
    slots.forEach((left, index) => add(makeFrameLayer({ slotKey: `${recipe.id}-${index}`, x: width * left, y: height * 0.14, width: width * 0.22, height: height * 0.30, radius: 3, shape: 'rect', z: 4 + index, dark: true })));
    const quote = makeTextLayer({ text: safeText, x: width * 0.14, y: height * 0.58, width: width * 0.72, fontSize: Math.round(Math.min(width, height) * 0.040), weight: 650, color: '#ffffff', align: 'center', z: 10, fontFamily: FONT_VALUES['Lora'], lineHeight: adaptiveLineHeight(safeText, width * 0.72, Math.round(Math.min(width, height) * 0.040), 1.08) });
    quote.role = 'quote';
    add(quote);
  }

  if (recipe.layout === 'layered-card') {
    add(makeShapeLayer({ x: width * 0.10, y: height * 0.15, width: width * 0.46, height: height * 0.16, fill: rgba(accent, 0.14), stroke: 'transparent', radius: 20, z: 1 }));
    add(makeShapeLayer({ x: width * 0.28, y: height * 0.26, width: width * 0.58, height: height * 0.48, fill: '#ffffff', stroke: rgba(accent, 0.18), radius: 26, z: 2 }));
    const [one, two, three] = splitDynamicText(safeText, 3);
    const a = makeTextLayer({ text: one, x: width * 0.18, y: height * 0.18, width: width * 0.58, fontSize: Math.round(Math.min(width, height) * 0.074), weight: 900, color: BRAND.text, align: 'left', z: 10, fontFamily: FONT_VALUES['Bebas Neue'], lineHeight: 0.94, uppercase: true });
    const b = makeTextLayer({ text: two, x: width * 0.34, y: height * 0.39, width: width * 0.42, fontSize: Math.round(Math.min(width, height) * 0.040), weight: 700, color: BRAND.text, align: 'left', z: 11, fontFamily: FONT_VALUES['Playfair Display'], lineHeight: adaptiveLineHeight(two, width * 0.42, Math.round(Math.min(width, height) * 0.040), 1.05) });
    const c = makeTextLayer({ text: three, x: width * 0.34, y: height * 0.60, width: width * 0.38, fontSize: Math.round(Math.min(width, height) * 0.026), weight: 650, color: BRAND.text, align: 'left', z: 12, fontFamily: FONT_VALUES['Inter'], lineHeight: adaptiveLineHeight(three, width * 0.38, Math.round(Math.min(width, height) * 0.026), 1.12) });
    a.role = 'quote';
    b.role = 'quote-secondary';
    c.role = 'quote-tertiary';
    add(a); add(b); add(c);
  }

  return layers.map((layer) => ({ ...layer, templateOwned: true }));
}

function makeDynamicRecreateState(recipeId, sizeKey, quoteText = starterQuote) {
  const [width, height] = CANVAS_PRESETS[sizeKey];
  const recipe = DYNAMIC_RECREATE_RECIPES.find((item) => item.id === recipeId) || DYNAMIC_RECREATE_RECIPES[0];
  return {
    background: recipe.background,
    gradient: false,
    layers: buildDynamicRemixLayers(recipe, width, height, quoteText),
    recipe
  };
}

function DynamicMiniPreview({ recipeId, text }) {
  const preview = makeDynamicRecreateState(recipeId, 'square', text);
  const recipe = preview.recipe;
  const width = 1080;
  const height = 1080;
  const dark = ['#15171a', '#1b1235', '#162134', '#28233f'].includes(String(preview.background).toLowerCase());
  return (
    <span className="templatePreview actualTemplatePreview" style={{ background: preview.background, color: dark ? '#ffffff' : BRAND.text }}>
      {[...preview.layers].sort((a, b) => (a.z || 0) - (b.z || 0)).map((layer) => {
        const common = {
          left: `${(layer.x / width) * 100}%`,
          top: `${(layer.y / height) * 100}%`,
          width: `${(layer.width / width) * 100}%`,
          opacity: layer.opacity ?? 1,
          transform: `${layer.warp === 'fisheye' ? 'perspective(500px) rotateX(16deg) scaleX(1.05)' : ''} rotate(${layer.rotation || 0}deg)`,
          zIndex: layer.z || 1
        };
        if (layer.type === 'shape' || layer.type === 'block') return <span key={layer.id} className="miniShape" style={{ ...common, height: `${(layer.height / height) * 100}%`, background: layer.fill, border: `1px solid ${layer.stroke || 'transparent'}`, borderRadius: `${Math.min(18, layer.radius || 0)}px` }} />;
        if (layer.type === 'frame') {
          const radius = layer.frameShape === 'circle' ? '50%' : layer.frameShape === 'arch' ? '50% 50% 8px 8px / 45% 45% 8px 8px' : `${Math.min(16, layer.radius || 0)}px`;
          return <span key={layer.id} className="miniFrame" style={{ ...common, height: `${(layer.height / height) * 100}%`, borderRadius: radius }}><span className="miniPhotoShimmer" /></span>;
        }
        return (
          <span key={layer.id} className="miniText" style={{ ...common, fontFamily: layer.fontFamily || defaultFont, fontWeight: layer.weight, fontStyle: layer.fontStyle || 'normal', fontSize: `${Math.max(4.5, (layer.fontSize / width) * 100)}cqw`, lineHeight: layer.lineHeight || 1.05, color: layer.color, textAlign: layer.align || 'left', whiteSpace: 'pre-wrap', letterSpacing: layer.letterSpacing ? `${layer.letterSpacing / 5}px` : undefined, WebkitTextStroke: layer.strokeColor && layer.strokeWidth ? `${Math.max(0.2, layer.strokeWidth / 5)}px ${layer.strokeColor}` : undefined, textShadow: layer.shadowColor ? `${(layer.shadowX || 0) / 6}px ${(layer.shadowY || 0) / 6}px ${(layer.shadowBlur || 0) / 6}px ${layer.shadowColor}` : undefined, textTransform: layer.uppercase ? 'uppercase' : undefined }}>{layer.uppercase ? String(layer.text || '').toUpperCase() : layer.text}</span>
        );
      })}
      <span className="miniBrandWrap"><BrandMark dark={dark} styleKey={recipe.footerStyle || 'social'} mini /></span>
    </span>
  );
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

function BrandMark({ dark = false, styleKey = 'social', mini = false }) {
  const style = BRAND_STYLES[styleKey] || BRAND_STYLES.social;
  const iconText = style.icon === 'k' ? 'k' : 'f';
  return (
    <div
      className={`brandMark brand-${styleKey} ${dark ? 'brandMarkDark' : ''} ${mini ? 'brandMini' : ''}`}
      style={{ fontFamily: style.fontFamily, fontWeight: style.weight, letterSpacing: `${style.letterSpacing || 0}px`, fontSize: mini ? undefined : `calc(2.45cqw * ${style.scale || 1})` }}
    >
      {style.icon !== 'none' && <span className={`fbCircle ${style.icon === 'k' ? 'monogramCircle' : ''}`}>{iconText}</span>}
      <span>{style.text}</span>
    </div>
  );
}

function TemplateMiniPreview({ template }) {
  const width = 1080;
  const height = 1080;
  const sample = template.previewText || (template.category === 'Poetry & Relatable' ? 'some days\nneed softness' : 'make it feel\nlike you');
  const miniLayers = buildTemplateLayers(template, width, height, sample);
  const styleKey = footerStyleForTemplate(template);
  const dark = ['#15171a', '#645cff', '#28233f', '#1b1235', '#162134'].includes(String(template.bg).toLowerCase());
  return (
    <span className="templatePreview actualTemplatePreview" style={{ background: template.gradient ? 'linear-gradient(135deg,#fff,#f0efff,#e8e6ff)' : template.bg, color: template.text }}>
      {[...miniLayers].sort((a, b) => (a.z || 0) - (b.z || 0)).map((layer) => {
        const common = {
          left: `${(layer.x / width) * 100}%`,
          top: `${(layer.y / height) * 100}%`,
          width: `${(layer.width / width) * 100}%`,
          opacity: layer.opacity ?? 1,
          transform: `${layer.warp === 'fisheye' ? 'perspective(500px) rotateX(16deg) scaleX(1.05)' : ''} rotate(${layer.rotation || 0}deg)`,
          zIndex: layer.z || 1
        };
        if (layer.type === 'shape' || layer.type === 'block') {
          return <span key={layer.id} className="miniShape" style={{ ...common, height: `${(layer.height / height) * 100}%`, background: layer.fill, border: `1px solid ${layer.stroke || 'transparent'}`, borderRadius: `${Math.min(18, layer.radius || 0)}px` }} />;
        }
        if (layer.type === 'frame') {
          const radius = layer.frameShape === 'circle' ? '50%' : layer.frameShape === 'arch' ? '50% 50% 8px 8px / 45% 45% 8px 8px' : `${Math.min(16, layer.radius || 0)}px`;
          return <span key={layer.id} className="miniFrame" style={{ ...common, height: `${(layer.height / height) * 100}%`, borderRadius: radius }}><span className="miniPhotoShimmer" /></span>;
        }
        if (layer.type === 'text') {
          return (
            <span
              key={layer.id}
              className="miniText"
              style={{
                ...common,
                fontFamily: layer.fontFamily || defaultFont,
                fontWeight: layer.weight,
                fontStyle: layer.fontStyle || 'normal',
                fontSize: `${Math.max(4.5, (layer.fontSize / width) * 100)}cqw`,
                lineHeight: layer.lineHeight || 1.05,
                color: layer.color,
                textAlign: layer.align || 'left',
                whiteSpace: 'pre-wrap',
                letterSpacing: layer.letterSpacing ? `${layer.letterSpacing / 5}px` : undefined,
                WebkitTextStroke: layer.strokeColor && layer.strokeWidth ? `${Math.max(0.2, layer.strokeWidth / 5)}px ${layer.strokeColor}` : undefined,
                textShadow: layer.shadowColor ? `${(layer.shadowX || 0) / 6}px ${(layer.shadowY || 0) / 6}px ${(layer.shadowBlur || 0) / 6}px ${layer.shadowColor}` : undefined,
                textTransform: layer.uppercase ? 'uppercase' : undefined
              }}
            >
              {layer.uppercase ? String(layer.text || '').toUpperCase() : layer.text}
            </span>
          );
        }
        return null;
      })}
      <span className="miniBrandWrap"><BrandMark dark={dark} styleKey={styleKey} mini /></span>
    </span>
  );
}

function wrapLines(ctx, text, maxWidth) {
  const paragraphs = String(text || '').split('\n');
  const all = [];
  for (const paragraph of paragraphs) {
    if (paragraph === '') {
      all.push('');
      continue;
    }
    const tokens = paragraph.match(/\s+|\S+/g) || [''];
    let line = '';
    for (const token of tokens) {
      const test = `${line}${token}`;
      if (line && ctx.measureText(test).width > maxWidth) {
        all.push(line);
        line = token;
      } else {
        line = test;
      }
    }
    all.push(line);
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
  return `${layer.fontStyle || 'normal'} ${layer.weight || 700} ${layer.fontSize}px ${layer.fontFamily || defaultFont}`;
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
  const [backgroundPhotoScale, setBackgroundPhotoScale] = useState(1);
  const [backgroundPhotoPositionX, setBackgroundPhotoPositionX] = useState(50);
  const [backgroundPhotoPositionY, setBackgroundPhotoPositionY] = useState(50);
  const [layers, setLayers] = useState(initial.layers);
  const [selectedId, setSelectedId] = useState(initial.layers.find((l) => l.role === 'quote')?.id || null);
  const [brandPosition, setBrandPosition] = useState('bottom-left');
  const [brandVisible, setBrandVisible] = useState(true);
  const [brandStyleKey, setBrandStyleKey] = useState('social');
  const [newFrameShape, setNewFrameShape] = useState('rect');
  const [quality, setQuality] = useState(92);
  const [exporting, setExporting] = useState(false);
  const [templateLocked, setTemplateLocked] = useState(true);
  const [workspacePage, setWorkspacePage] = useState('freeform');
  const [cropLayerId, setCropLayerId] = useState(null);
  const dragRef = useRef(null);
  const cropDragRef = useRef(null);
  const fileRef = useRef(null);
  const frameFileRef = useRef(null);
  const backgroundFileRef = useRef(null);
  const pendingFrameIdRef = useRef(null);
  const remixFileRef = useRef(null);

  const [remixImageSrc, setRemixImageSrc] = useState('');
  const [remixFileName, setRemixFileName] = useState('');
  const [remixDetectedText, setRemixDetectedText] = useState('');
  const [remixStatus, setRemixStatus] = useState('');
  const [remixBusy, setRemixBusy] = useState(false);
  const [remixSuggestions, setRemixSuggestions] = useState([]);
  const [remixSeed, setRemixSeed] = useState(0);
  const [remixMode, setRemixMode] = useState('dynamic');

  const [canvasWidth, canvasHeight] = CANVAS_PRESETS[sizeKey];
  const selected = layers.find((l) => l.id === selectedId) || null;
  const currentTemplate = templates.find((t) => t.id === templateId) || null;
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
    const chosenTemplate = templates.find((item) => item.id === id) || templates[0];
    const switchingTemplate = id !== templateId || key !== sizeKey;
    if (switchingTemplate) {
      setBrandStyleKey(footerStyleForTemplate(chosenTemplate));
      if (chosenTemplate.footerPosition) setBrandPosition(chosenTemplate.footerPosition);
      setTemplateLocked(true);
    }
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
        aspectLocked: true,
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

  const addFrame = (shape = newFrameShape) => {
    const presets = {
      rect: { w: 0.60, h: 0.38, radius: 0, frameShape: 'rect' },
      rounded: { w: 0.60, h: 0.38, radius: 34, frameShape: 'rect' },
      circle: { w: 0.42, h: 0.42, radius: 999, frameShape: 'circle' },
      arch: { w: 0.46, h: 0.54, radius: 180, frameShape: 'arch' },
      polaroid: { w: 0.48, h: 0.54, radius: 8, frameShape: 'polaroid' },
      film: { w: 0.72, h: 0.24, radius: 3, frameShape: 'rect' }
    };
    const preset = presets[shape] || presets.rect;
    const frame = makeFrameLayer({
      slotKey: `custom-${Date.now()}`,
      x: canvasWidth * (0.5 - preset.w / 2),
      y: canvasHeight * (0.5 - preset.h / 2),
      width: canvasWidth * preset.w,
      height: canvasHeight * preset.h,
      radius: preset.radius,
      shape: preset.frameShape,
      z: Math.max(4, ...layers.map((l) => l.z || 1)) + 1
    });
    frame.templateOwned = false;
    frame.locked = false;
    frame.aspectLocked = true;
    frame.customFrameKind = shape;
    setLayers((prev) => [...prev, frame]);
    setSelectedId(frame.id);
  };

  const addBackgroundPhoto = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBackgroundPhoto(url);
    setBackgroundPhotoScale(1);
    setBackgroundPhotoPositionX(50);
    setBackgroundPhotoPositionY(50);
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

  const sanitizeOCRText = (value) => String(value || '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/ +\n/g, '\n')
    .trim();

  const uploadRemixReference = async (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setRemixImageSrc(url);
    setRemixFileName(file.name || 'reference');
    setRemixStatus('Reading the post and extracting text…');
    setRemixDetectedText('');
    setRemixSuggestions([]);
    setRemixBusy(true);
    try {
      const Tesseract = await import('tesseract.js');
      const result = await Tesseract.recognize(file, 'eng');
      const parsed = sanitizeOCRText(result?.data?.text || '');
      setRemixDetectedText(parsed || '');
      setRemixStatus(parsed ? 'Detected text. Review it below, then generate 5 suggested designs.' : 'Could not confidently detect text. You can type or paste the caption below, then generate designs.');
    } catch (error) {
      setRemixStatus('OCR was not available. You can still type/paste the text below and generate designs manually.');
    } finally {
      setRemixBusy(false);
    }
  };

  const clearRemixReference = () => {
    setRemixImageSrc('');
    setRemixFileName('');
    setRemixDetectedText('');
    setRemixStatus('');
    setRemixSuggestions([]);
    setRemixSeed(0);
  };

  const shuffleList = (items, seed = Math.random()) => {
    const list = [...items];
    let s = Math.floor(seed * 100000) || 1;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  const buildRemixSuggestions = (seedValue = Math.random()) => {
    const textValue = remixDetectedText.trim() || quoteText.trim() || starterQuote;
    if (remixMode === 'dynamic') {
      const picked = shuffleList(DYNAMIC_RECREATE_RECIPES, seedValue).slice(0, 5).map((recipe, index) => ({
        id: `remix-dynamic-${index}-${recipe.id}`,
        kind: 'dynamic',
        recipeId: recipe.id,
        name: recipe.name,
        category: recipe.category,
        text: textValue,
        footerStyle: recipe.footerStyle
      }));
      setRemixSeed(seedValue);
      setRemixSuggestions(picked);
      return;
    }
    const hasImage = Boolean(remixImageSrc);
    const matching = (exp) => templates.filter((template) => exp.test(`${template.category} ${template.name} ${template.id}`));
    const pools = hasImage
      ? [
          matching(/poetry|relatable|photo|frame|editorial/i),
          matching(/mixed|soft|minimal|circular/i),
          matching(/effect|repeat|poster|dark|fisheye/i),
          templates
        ]
      : [
          matching(/poetry|relatable|editorial|mixed/i),
          matching(/minimal|soft|bold|poster|fisheye/i),
          matching(/effect|repeat|dark/i),
          templates
        ];
    const picked = [];
    const seen = new Set();
    for (const pool of pools) {
      for (const item of shuffleList(pool, seedValue + picked.length)) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        picked.push(item);
        if (picked.length === 5) break;
      }
      if (picked.length === 5) break;
    }
    const finalItems = picked.slice(0, 5).map((template, index) => ({
      id: `remix-template-${index}-${template.id}`,
      kind: 'template',
      templateId: template.id,
      name: template.name,
      category: template.category,
      text: textValue
    }));
    setRemixSeed(seedValue);
    setRemixSuggestions(finalItems);
  };

  const applyRemixSuggestion = (suggestion) => {
    const textValue = suggestion?.text?.trim() || remixDetectedText.trim() || quoteText.trim() || starterQuote;

    // The uploaded screenshot is always a reference. It is never inserted into the editor canvas.
    setBackgroundPhoto('');
    setCropLayerId(null);

    if (suggestion.kind === 'dynamic') {
      const next = makeDynamicRecreateState(suggestion.recipeId, sizeKey, textValue);
      const editableLayers = next.layers.map((layer) => ({ ...layer, templateOwned: false, locked: false }));
      setMode('free');
      setTemplateId('');
      setQuoteText(textValue);
      setBackground(next.background);
      setGradient(next.gradient);
      setLayers(editableLayers);
      setSelectedId(editableLayers.find((layer) => layer.role === 'quote')?.id || editableLayers[0]?.id || null);
      setBrandStyleKey(suggestion.footerStyle || 'social');
      setTemplateLocked(false);
      setWorkspacePage('freeform');
      return;
    }

    const next = makeTemplateState(suggestion.templateId, sizeKey, textValue);
    setTemplateId(suggestion.templateId);
    setMode('template');
    setQuoteText(textValue);
    setBackground(next.background);
    setGradient(next.gradient);
    setLayers(next.layers);
    setSelectedId(next.layers.find((layer) => layer.role === 'quote')?.id || next.layers[0]?.id || null);
    setBrandStyleKey(footerStyleForTemplate(templates.find((item) => item.id === suggestion.templateId)));
    setTemplateLocked(true);
    setWorkspacePage('freeform');
  };

  const layerMovementLocked = (layer) => Boolean(layer?.locked || (mode === 'template' && templateLocked && layer?.templateOwned));
  const canDeleteLayer = (layer) => Boolean(layer && !layerMovementLocked(layer));

  const removeSelected = () => {
    if (!selected || !canDeleteLayer(selected)) return;
    if (cropLayerId === selected.id) setCropLayerId(null);
    setLayers((prev) => {
      const next = prev.filter((layer) => layer.id !== selected.id);
      setTimeout(() => setSelectedId(next[next.length - 1]?.id || null), 0);
      return next;
    });
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

  const enterCropMode = (layer) => {
    if (!layer || layer.type !== 'frame') return;
    setSelectedId(layer.id);
    if (!layer.imageSrc) {
      chooseFramePhoto(layer.id);
      return;
    }
    setCropLayerId(layer.id);
  };

  const exitCropMode = () => {
    setCropLayerId(null);
    cropDragRef.current = null;
    window.removeEventListener('pointermove', onCropPointerMove);
  };

  const beginCropDrag = (e, layer) => {
    if (!layer?.imageSrc || cropLayerId !== layer.id) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    cropDragRef.current = {
      id: layer.id,
      startX: e.clientX,
      startY: e.clientY,
      positionX: layer.imagePositionX ?? 50,
      positionY: layer.imagePositionY ?? 50,
      width: Math.max(1, rect.width),
      height: Math.max(1, rect.height)
    };
    window.addEventListener('pointermove', onCropPointerMove);
    window.addEventListener('pointerup', endCropDrag, { once: true });
  };

  const onCropPointerMove = (e) => {
    const d = cropDragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    updateLayer(d.id, {
      imagePositionX: clamp(d.positionX - (dx / d.width) * 100, 0, 100),
      imagePositionY: clamp(d.positionY - (dy / d.height) * 100, 0, 100)
    });
  };

  const endCropDrag = () => {
    cropDragRef.current = null;
    window.removeEventListener('pointermove', onCropPointerMove);
  };

  const beginDrag = (e, layer, kind = 'move') => {
    if (layer.type === 'shape') return;
    if (cropLayerId === layer.id && layer.type === 'frame') return;
    if (cropLayerId && cropLayerId !== layer.id) setCropLayerId(null);
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
      fontSize: layer.fontSize,
      aspectLocked: layer.aspectLocked !== false,
      aspectRatio: layer.width && layer.height ? layer.width / layer.height : 1
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
        if (['image', 'frame', 'block'].includes(l.type)) {
          if (l.type !== 'block' && d.aspectLocked) {
            const scaleByWidth = (d.width + dx) / Math.max(1, d.width);
            const scaleByHeight = (d.height + dy) / Math.max(1, d.height);
            const scaleFactor = Math.abs(dx / Math.max(1, d.width)) >= Math.abs(dy / Math.max(1, d.height)) ? scaleByWidth : scaleByHeight;
            const safeScale = Math.max(80 / Math.max(1, d.width), 80 / Math.max(1, d.height), scaleFactor);
            return { ...l, width: Math.max(80, d.width * safeScale), height: Math.max(80, d.height * safeScale) };
          }
          return { ...l, width: Math.max(80, d.width + dx), height: Math.max(80, d.height + dy) };
        }
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
    const style = BRAND_STYLES[brandStyleKey] || BRAND_STYLES.social;
    const padding = Math.round(Math.min(canvasWidth, canvasHeight) * 0.045);
    const baseFs = Math.round(Math.min(canvasWidth, canvasHeight) * 0.025);
    const fs = Math.round(baseFs * (style.scale || 1));
    const darkBg = ['#15171a', '#645cff', '#28233f', '#1b1235', '#162134'].includes(String(background).toLowerCase());
    const text = style.text;
    ctx.font = `${style.weight || 700} ${fs}px ${style.fontFamily || defaultFont}`;
    const tw = ctx.measureText(text).width;
    const hasIcon = style.icon !== 'none';
    const circle = hasIcon ? fs * 1.12 : 0;
    const gap = hasIcon ? fs * 0.42 : 0;
    const total = circle + gap + tw;
    let x = padding;
    if (brandPosition === 'bottom-center') x = (canvasWidth - total) / 2;
    if (brandPosition === 'bottom-right') x = canvasWidth - padding - total;
    const y = canvasHeight - padding - Math.max(circle, fs) / 2;

    if (hasIcon) {
      ctx.fillStyle = darkBg ? '#ffffff' : BRAND.accent;
      ctx.beginPath();
      ctx.arc(x + circle / 2, y, circle / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = darkBg ? BRAND.accent : '#ffffff';
      ctx.font = `900 ${fs * 0.86}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(style.icon === 'k' ? 'k' : 'f', x + circle / 2, y + fs * 0.04);
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = darkBg ? '#ffffff' : BRAND.text;
    ctx.font = `${style.weight || 700} ${fs}px ${style.fontFamily || defaultFont}`;
    ctx.fillText(text, x + circle + gap, y + fs * 0.03);
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
    const drawFisheyeLine = (line, baseX, baseY) => {
      const chars = Array.from(line || ' ');
      const widths = chars.map((ch) => ctx.measureText(ch).width + (layer.letterSpacing || 0));
      const total = widths.reduce((sum, value) => sum + value, 0);
      let startX = baseX;
      if ((layer.align || 'left') === 'center') startX = baseX - total / 2;
      if ((layer.align || 'left') === 'right') startX = baseX - total;
      const center = startX + total / 2;
      let cursor = startX;
      chars.forEach((ch, index) => {
        const step = widths[index] || 0;
        const charCenter = cursor + step / 2;
        const dist = total ? Math.min(1, Math.abs((charCenter - center) / (total / 2))) : 0;
        const focus = 1 - dist;
        const scale = 1 + focus * 0.38;
        const yOffset = -layer.fontSize * 0.18 * focus;
        ctx.save();
        ctx.translate(charCenter, baseY + yOffset + layer.fontSize * 0.06);
        ctx.scale(scale, scale);
        ctx.translate(-step / 2, 0);
        if (layer.strokeColor && layer.strokeWidth) {
          ctx.lineWidth = layer.strokeWidth;
          ctx.strokeStyle = layer.strokeColor;
          ctx.strokeText(ch, 0, 0);
        }
        ctx.fillStyle = layer.color;
        ctx.fillText(ch, 0, 0);
        ctx.restore();
        cursor += step;
      });
    };
    for (let i = 0; i < lines.length; i++) {
      const yy = layer.y + i * lh;
      if (layer.warp === 'fisheye') {
        drawFisheyeLine(lines[i], xx, yy);
        continue;
      }
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
      if (document.fonts?.ready) await document.fonts.ready;
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
          drawImageIntoRect(ctx, bgImage, rect.x, rect.y, rect.width, rect.height, 'cover', backgroundPhotoPositionX, backgroundPhotoPositionY, backgroundPhotoScale);
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
  const bgPhotoImageStyle = {
    objectPosition: `${backgroundPhotoPositionX}% ${backgroundPhotoPositionY}%`,
    transform: `scale(${backgroundPhotoScale})`,
    transformOrigin: `${backgroundPhotoPositionX}% ${backgroundPhotoPositionY}%`
  };
  const selectedTransformLocked = selected ? layerMovementLocked(selected) : false;
  const selectedCanDelete = selected ? canDeleteLayer(selected) : false;

  const quoteLayer = layers.find((l) => l.role === 'quote');

  const handleTemplateQuoteChange = (value) => {
    setQuoteText(value);
    if (mode === 'template' && templateId) applyTemplate(templateId, sizeKey, value);
  };

  const textLayerStyle = (layer) => ({
    left: `${(layer.x / canvasWidth) * 100}%`,
    top: `${(layer.y / canvasHeight) * 100}%`,
    width: `${(layer.width / canvasWidth) * 100}%`,
    transform: `${layer.warp === 'fisheye' ? 'perspective(500px) rotateX(16deg) scaleX(1.05)' : ''} rotate(${layer.rotation || 0}deg)`,
    opacity: layer.opacity ?? 1,
    zIndex: layer.z || 1,
    fontSize: `${(layer.fontSize / canvasWidth) * 100}cqw`,
    fontWeight: layer.weight,
    color: layer.color,
    textAlign: layer.align,
    lineHeight: layer.lineHeight || 1.12,
    letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}px` : undefined,
    fontFamily: layer.fontFamily || defaultFont,
    fontStyle: layer.fontStyle || 'normal',
    WebkitTextStroke: layer.strokeColor && layer.strokeWidth ? `${layer.strokeWidth}px ${layer.strokeColor}` : undefined,
    textShadow: layer.shadowColor ? `${layer.shadowX || 0}px ${layer.shadowY || 0}px ${layer.shadowBlur || 0}px ${layer.shadowColor}` : undefined,
    textTransform: layer.uppercase ? 'uppercase' : undefined,
    mixBlendMode: layer.blendMode || undefined
  });

  return (
    <main className="studioShell">
      <header className="studioHeader">
        <div className="brandCluster">
          <div className="studioBrand">kiocreates</div>
          <div className="studioSubtitle">Typography Studio</div>
        </div>
        <nav className="studioNav" aria-label="TyponiKio sections">
          <button className={workspacePage === 'recreate' ? 'active' : ''} onClick={() => setWorkspacePage('recreate')}>Recreate</button>
          <button className={workspacePage === 'templates' ? 'active' : ''} onClick={() => setWorkspacePage('templates')}>Templates</button>
          <button className={workspacePage === 'freeform' ? 'active' : ''} onClick={() => setWorkspacePage('freeform')}>Freeform</button>
        </nav>
        <div className="headerActions">
          {workspacePage === 'freeform' && <button className="ghostBtn" onClick={() => setBrandVisible((v) => !v)}>{brandVisible ? 'Brand on' : 'Brand off'}</button>}
          {workspacePage === 'freeform' && <button className="primaryBtn" onClick={() => exportImage('jpg')} disabled={exporting}>Download JPG</button>}
          {workspacePage === 'freeform' && <button className="primaryBtn" onClick={() => exportImage('webp')} disabled={exporting}>Download WebP</button>}
        </div>
      </header>



      {workspacePage === 'recreate' && (
        <section className="pageShell recreatePage">
          <div className="pageIntro">
            <span className="eyebrow">Recreate</span>
            <h1>Upload the reference. Edit the text. Generate a new design.</h1>
            <p>The uploaded post stays here as a reference only. It will not be placed on your editing canvas.</p>
          </div>
          <div className="recreateGrid">
            <div className="pageCard recreateInputCard">
              <div className="stepLabel">01 · Upload reference</div>
              <div className="uploadDrop" onClick={() => remixFileRef.current?.click()}>
                {remixImageSrc ? <img src={remixImageSrc} alt="Reference post" /> : <div><strong>Upload a post or screenshot</strong><span>JPG, PNG, WebP</span></div>}
              </div>
              <input ref={remixFileRef} hidden type="file" accept="image/*" onChange={(e) => { uploadRemixReference(e.target.files?.[0]); e.target.value = ''; }} />
              <div className="buttonRow">
                <button className="secondaryBtn" onClick={() => remixFileRef.current?.click()}>{remixImageSrc ? 'Replace reference' : 'Choose image'}</button>
                {remixImageSrc && <button className="miniBtn danger" onClick={clearRemixReference}>Remove</button>}
              </div>
              {remixStatus && <div className="statusNote">{remixStatus}</div>}

              <div className="stepLabel stepGap">02 · Review text</div>
              <textarea className="quoteInput recreateTextArea" placeholder="Detected or pasted text will appear here…" value={remixDetectedText} onChange={(e) => setRemixDetectedText(e.target.value)} />
              <div className="fieldGrid oneCol recreateModeField">
                <label>Recreate style<select value={remixMode} onChange={(e) => { setRemixMode(e.target.value); setRemixSuggestions([]); }}><option value="dynamic">Dynamic recreate</option><option value="template">Template remix</option></select></label>
              </div>
              <button className="primaryBtn wideAction" disabled={remixBusy || (!remixDetectedText.trim() && !quoteText.trim())} onClick={() => buildRemixSuggestions(Math.random())}>{remixBusy ? 'Reading reference…' : 'Generate 5 designs'}</button>
            </div>

            <div className="pageCard recreateResultsCard">
              <div className="resultsHeader">
                <div><div className="stepLabel">03 · Choose a design</div><h3>{remixSuggestions.length ? 'Your five suggestions' : 'Suggestions will appear here'}</h3></div>
                {remixSuggestions.length > 0 && <button className="ghostBtn" disabled={remixBusy} onClick={() => buildRemixSuggestions(Math.random() + remixSeed)}>Generate 5 more</button>}
              </div>
              {remixSuggestions.length === 0 ? (
                <div className="emptyResults"><strong>No generated designs yet.</strong><span>Upload a reference, review the text, then generate.</span></div>
              ) : (
                <div className="recreateSuggestionGrid">
                  {remixSuggestions.map((suggestion) => {
                    const template = suggestion.kind === 'template' ? templates.find((item) => item.id === suggestion.templateId) : null;
                    return (
                      <article key={suggestion.id} className="recreateSuggestionCard">
                        <div className="recreateSuggestionPreview">
                          {suggestion.kind === 'dynamic' ? <DynamicMiniPreview recipeId={suggestion.recipeId} text={suggestion.text} /> : template ? <TemplateMiniPreview template={template} /> : null}
                        </div>
                        <div className="suggestionFooter">
                          <div><strong>{suggestion.name}</strong><span>{suggestion.kind === 'dynamic' ? 'New dynamic layout' : suggestion.category}</span></div>
                          <button className="primaryBtn" onClick={() => applyRemixSuggestion(suggestion)}>Edit design</button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {workspacePage === 'templates' && (
        <section className="pageShell templatesPage">
          <div className="pageIntro templatesIntro">
            <div><span className="eyebrow">Templates</span><h1>Pick a layout, then edit it beside the canvas.</h1></div>
            <button className="primaryBtn" onClick={() => { startFree(); setWorkspacePage('freeform'); }}>Start blank canvas</button>
          </div>
          <div className="templateLibraryCard">
            <div className="categoryChips templatePageChips">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button key={cat} className={`chip ${templateFilter === cat ? 'active' : ''}`} onClick={() => setTemplateFilter(cat)}>{cat}</button>
              ))}
            </div>
            {groupedTemplates.map((group) => (
              <section key={group.category} className="templateLibraryGroup">
                <div className="templateLibraryHeading"><h2>{group.category}</h2><span>{group.items.length} designs</span></div>
                <div className="templateLibraryGrid">
                  {group.items.map((t) => (
                    <button key={t.id} className="templateLibraryTile" onClick={() => { applyTemplate(t.id); setWorkspacePage('freeform'); }}>
                      <TemplateMiniPreview template={t} />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      )}

      {workspacePage === 'freeform' && (
      <section className="workspace editorWorkspace">
        <aside className="panel leftPanel">
          <div className="panelSection editorStartSection">
            <div className="sectionTitle">Editor <span>{mode === 'template' ? 'template' : 'freeform'}</span></div>
            <div className="buttonRow">
              <button className="secondaryBtn" onClick={() => setWorkspacePage('templates')}>Browse templates</button>
              <button className="ghostBtn" onClick={() => startFree()}>Start blank</button>
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

          <div className="panelSection">
            <div className="sectionTitle">Add</div>
            <div className="buttonRow addRow">
              <button className="secondaryBtn" onClick={addText}>+ Text</button>
              <button className="secondaryBtn" onClick={() => fileRef.current?.click()}>+ Picture</button>
              <button className="secondaryBtn" onClick={addBlock}>+ Block</button>
            </div>
            <div className="frameBuilderRow">
              <select value={newFrameShape} onChange={(e) => setNewFrameShape(e.target.value)}>
                {FRAME_SHAPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <button className="secondaryBtn" onClick={() => addFrame(newFrameShape)}>+ Frame</button>
            </div>
            <input ref={fileRef} hidden multiple type="file" accept="image/*" onChange={(e) => { Array.from(e.target.files || []).forEach(addImage); e.target.value = ''; }} />
            <input ref={frameFileRef} hidden type="file" accept="image/*" onChange={(e) => { attachFramePhoto(e.target.files?.[0]); e.target.value = ''; }} />
            <input ref={backgroundFileRef} hidden type="file" accept="image/*" onChange={(e) => { addBackgroundPhoto(e.target.files?.[0]); e.target.value = ''; }} />
          </div>
        </aside>

        <section className="stageColumn">
          <div className="canvasOuter">
            <div className="canvasStage" style={{ aspectRatio: `${canvasWidth}/${canvasHeight}`, background: previewBackground }} onPointerDown={() => { setSelectedId(null); setCropLayerId(null); }}>
              {backgroundPhoto && <div className="canvasBackgroundPhotoWrap" style={bgPhotoStyle}><img className="canvasBackgroundPhoto" src={backgroundPhoto} alt="Background" style={bgPhotoImageStyle} draggable={false} /></div>}
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
                  const shapeClass = `frame-${layer.customFrameKind || layer.frameShape || 'rect'}`;
                  return (
                    <div key={layer.id} className={`canvasLayer photoFrame ${shapeClass} ${selectedId === layer.id ? 'selected' : ''} ${layerMovementLocked(layer) ? 'isLocked' : ''} ${cropLayerId === layer.id ? 'isCropping' : ''}`} style={{ ...common, height: `${(layer.height / canvasHeight) * 100}%`, borderRadius: layer.frameShape === 'circle' ? '50%' : layer.frameShape === 'arch' ? '50% 50% 12px 12px / 42% 42% 12px 12px' : `${layer.radius || 0}px`, background: layer.frameFill, border: layer.imageSrc ? '0 solid transparent' : `2px dashed ${layer.frameStroke || BRAND.line}` }} onPointerDown={(e) => cropLayerId === layer.id ? beginCropDrag(e, layer) : beginDrag(e, layer)} onDoubleClick={(e) => { e.stopPropagation(); enterCropMode(layer); }}>
                      {layer.imageSrc ? (
                        <img src={layer.imageSrc} alt={layer.imageName || 'Frame photo'} draggable={false} style={{ objectFit: layer.imageFit || 'cover', objectPosition: `${layer.imagePositionX ?? 50}% ${layer.imagePositionY ?? 50}%`, transform: `scale(${layer.imageScale || 1})`, mixBlendMode: layer.blendMode || 'normal' }} />
                      ) : (
                        <button className="framePlaceholder" onPointerDown={(e) => e.stopPropagation()} onClick={() => chooseFramePhoto(layer.id)}>+ Add photo</button>
                      )}
                      {cropLayerId === layer.id && <span className="cropFrameBadge">Drag photo to crop</span>}
                      {layerMovementLocked(layer) && cropLayerId !== layer.id && <span className="layerLockBadge">🔒</span>}
                      {selectedId === layer.id && layer.imageSrc && cropLayerId !== layer.id && <button className="quickPhotoDelete" title="Delete photo" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { imageSrc: null, imageName: '', imageScale: 1, imagePositionX: 50, imagePositionY: 50 }); }}>×</button>}
                      <span className="resizeHandle" onPointerDown={(e) => beginDrag(e, layer, 'resize')} />
                    </div>
                  );
                }
                if (layer.type === 'image') {
                  return (
                    <div key={layer.id} className={`canvasLayer imageLayer ${selectedId === layer.id ? 'selected' : ''} ${layerMovementLocked(layer) ? 'isLocked' : ''}`} style={{ ...common, height: `${(layer.height / canvasHeight) * 100}%`, mixBlendMode: layer.blendMode || 'normal' }} onPointerDown={(e) => beginDrag(e, layer)}>
                      <img src={layer.src} alt="Uploaded" draggable={false} />
                      {layerMovementLocked(layer) && <span className="layerLockBadge">🔒</span>}
                      {selectedId === layer.id && !layerMovementLocked(layer) && <button className="quickPhotoDelete" title="Delete photo" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setLayers((prev) => prev.filter((item) => item.id !== layer.id)); setSelectedId(null); }}>×</button>}
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
              {cropLayerId && (
                <div className="cropModeToolbar" onPointerDown={(e) => e.stopPropagation()}>
                  <span>Crop mode · drag the photo inside the frame</span>
                  <button onClick={() => { const layer = layers.find((item) => item.id === cropLayerId); if (layer) updateLayer(layer.id, { imagePositionX: 50, imagePositionY: 50, imageScale: 1 }); }}>Reset</button>
                  <button className="cropDoneBtn" onClick={exitCropMode}>Done</button>
                </div>
              )}
              {brandVisible && <div className={`brandOverlay ${brandPosition}`}><BrandMark dark={darkBrand} styleKey={brandStyleKey} /></div>}
            </div>
          </div>
          <div className="canvasMeta"><span>{mode === 'template' ? (currentTemplate?.name || 'Custom composition') : 'Free canvas'}</span><span>{canvasWidth} × {canvasHeight}px</span></div>
        </section>

        <aside className="panel inspectorPanel">
          {mode === 'template' && (
            <div className="panelSection">
              <div className="sectionTitle">Quote</div>
              <textarea className="quoteInput" value={quoteText} onChange={(e) => handleTemplateQuoteChange(e.target.value)} />
            </div>
          )}

          {selected ? (
            <>
              <div className="panelSection">
                <div className="sectionTitle">Selected {selected.type}<span>{selectedTransformLocked ? 'locked' : 'editable'}</span></div>
                {selected.templateOwned && templateLocked && <div className="lockNotice">Template layout is locked. You can edit content or replace photos, but unlock the template to move or resize its elements.</div>}

                {selected.type === 'text' && (
                  <>
                    <textarea className="smallTextarea" value={selected.text} onChange={(e) => { const value = e.target.value; updateLayer(selected.id, { text: value, lineHeight: selected.autoSpacing === false ? selected.lineHeight : adaptiveLineHeight(value, selected.width, selected.fontSize, 1.12) }); }} />
                    <div className="fieldGrid">
                      <label>Font size<input disabled={selectedTransformLocked} type="number" min="16" max="240" value={Math.round(selected.fontSize)} onChange={(e) => updateLayer(selected.id, { fontSize: +e.target.value })} /></label>
                      <label>Text width<input disabled={selectedTransformLocked} type="number" min="120" max={canvasWidth} value={Math.round(selected.width)} onChange={(e) => updateLayer(selected.id, { width: clamp(+e.target.value, 120, canvasWidth) })} /></label>
                    </div>
                    <div className="fieldGrid">
                      <label>Weight<select value={selected.weight} onChange={(e) => updateLayer(selected.id, { weight: +e.target.value })}><option value="400">400</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option><option value="900">900</option></select></label>
                      <label>Style<select value={selected.fontStyle || 'normal'} onChange={(e) => updateLayer(selected.id, { fontStyle: e.target.value })}><option value="normal">Normal</option><option value="italic">Italic</option></select></label>
                    </div>
                    <div className="fieldGrid">
                      <label>Align<select value={selected.align} onChange={(e) => updateLayer(selected.id, { align: e.target.value })}><option>left</option><option>center</option><option>right</option></select></label>
                      <label>Color<input type="color" value={selected.color} onChange={(e) => updateLayer(selected.id, { color: e.target.value })} /></label>
                    </div>
                    <div className="fieldGrid">
                      <label>Font<select value={selected.fontFamily || defaultFont} onChange={(e) => updateLayer(selected.id, { fontFamily: e.target.value })}>{FONT_OPTIONS.map((font) => <option key={font.label} value={font.value}>{font.label}</option>)}</select></label>
                      <label>Outline<input type="color" value={selected.strokeColor || '#645cff'} onChange={(e) => updateLayer(selected.id, { strokeColor: e.target.value, strokeWidth: selected.strokeWidth || 2 })} /></label>
                    </div>
                    <label className="rangeLabel">Line spacing <span>{(selected.lineHeight || 1.12).toFixed(2)}</span><input disabled={selectedTransformLocked} type="range" min="0.65" max="1.7" step="0.01" value={selected.lineHeight || 1.12} onChange={(e) => updateLayer(selected.id, { lineHeight: +e.target.value, autoSpacing: false })} /></label>
                    <button disabled={selectedTransformLocked} className="miniBtn autoSpacingBtn" onClick={() => updateLayer(selected.id, { lineHeight: adaptiveLineHeight(selected.text, selected.width, selected.fontSize, 1.12), autoSpacing: true })}>Auto spacing</button>
                    <label className="rangeLabel">Outline width <span>{Math.round(selected.strokeWidth || 0)}px</span><input type="range" min="0" max="10" value={selected.strokeWidth || 0} onChange={(e) => updateLayer(selected.id, { strokeWidth: +e.target.value })} /></label>
                  </>
                )}

                {selected.type === 'image' && (
                  <>
                    <div className="buttonRow photoDeleteRow">
                      <button className="miniBtn danger" disabled={selectedTransformLocked} onClick={() => { setLayers((prev) => prev.filter((item) => item.id !== selected.id)); setSelectedId(null); }}>Delete photo</button>
                    </div>
                    <div className="fieldGrid oneCol">
                      <label>Blend mode<select value={selected.blendMode || 'normal'} onChange={(e) => updateLayer(selected.id, { blendMode: e.target.value })}>{BLEND_MODES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                    </div>
                    <label className="checkRow"><input type="checkbox" checked={selected.aspectLocked !== false} onChange={(e) => updateLayer(selected.id, { aspectLocked: e.target.checked })} /> Lock aspect ratio while scaling</label>
                    <div className="fieldGrid">
                      <label>Width<input disabled={selectedTransformLocked} type="number" min="80" max={canvasWidth * 2} value={Math.round(selected.width)} onChange={(e) => {
                        const nextWidth = Math.max(80, +e.target.value);
                        const ratio = selected.width / Math.max(1, selected.height);
                        updateLayer(selected.id, selected.aspectLocked !== false ? { width: nextWidth, height: nextWidth / ratio } : { width: nextWidth });
                      }} /></label>
                      <label>Height<input disabled={selectedTransformLocked || selected.aspectLocked !== false} type="number" min="80" max={canvasHeight * 2} value={Math.round(selected.height)} onChange={(e) => updateLayer(selected.id, { height: Math.max(80, +e.target.value) })} /></label>
                    </div>
                  </>
                )}

                {selected.type === 'frame' && (
                  <>
                    <div className="buttonRow framePhotoActions">
                      <button className="secondaryBtn" onClick={() => chooseFramePhoto(selected.id)}>{selected.imageSrc ? 'Replace photo' : '+ Attach photo'}</button>
                      {selected.imageSrc && <button className="miniBtn" onClick={() => enterCropMode(selected)}>Crop</button>}
                      {selected.imageSrc && <button className="miniBtn danger" onClick={() => { setCropLayerId(null); updateLayer(selected.id, { imageSrc: null, imageName: '', imageScale: 1, imagePositionX: 50, imagePositionY: 50 }); }}>Delete photo</button>}
                    </div>
                    {selected.imageSrc && <div className="cropHelp">Double-click the photo on the canvas, then drag it inside the frame to crop.</div>}
                    <div className="fieldGrid">
                      <label>Frame shape<select disabled={selectedTransformLocked} value={selected.customFrameKind || selected.frameShape || 'rect'} onChange={(e) => {
                        const kind = e.target.value;
                        const shape = kind === 'rounded' || kind === 'film' ? 'rect' : kind;
                        const patch = { customFrameKind: kind, frameShape: shape };
                        patch.aspectLocked = true;
                        if (kind === 'circle') { patch.radius = 999; patch.height = selected.width; }
                        if (kind === 'rounded') patch.radius = 34;
                        if (kind === 'rect') patch.radius = 0;
                        if (kind === 'film') { patch.radius = 3; patch.height = selected.width * 0.33; }
                        if (kind === 'polaroid') { patch.radius = 8; patch.height = selected.width * 1.12; }
                        if (kind === 'arch') { patch.radius = 180; patch.height = selected.width * 1.12; }
                        updateLayer(selected.id, patch);
                      }}>{FRAME_SHAPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                      <label>Fit<select value={selected.imageFit || 'cover'} onChange={(e) => updateLayer(selected.id, { imageFit: e.target.value })}><option value="cover">Cover</option><option value="contain">Contain</option></select></label>
                    </div>
                    <div className="fieldGrid">
                      <label>Blend<select value={selected.blendMode || 'normal'} onChange={(e) => updateLayer(selected.id, { blendMode: e.target.value })}>{BLEND_MODES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                      <label>Corner radius<input disabled={selectedTransformLocked || ['circle','arch'].includes(selected.frameShape)} type="number" min="0" max="300" value={Math.round(selected.radius || 0)} onChange={(e) => updateLayer(selected.id, { radius: +e.target.value })} /></label>
                    </div>
                    <label className="checkRow"><input type="checkbox" checked={selected.aspectLocked !== false} onChange={(e) => updateLayer(selected.id, { aspectLocked: e.target.checked })} /> Lock frame ratio while scaling</label>
                    <div className="fieldGrid">
                      <label>Frame width<input disabled={selectedTransformLocked} type="number" min="80" max={canvasWidth * 2} value={Math.round(selected.width)} onChange={(e) => {
                        const nextWidth = Math.max(80, +e.target.value);
                        const ratio = selected.width / Math.max(1, selected.height);
                        updateLayer(selected.id, selected.aspectLocked !== false ? { width: nextWidth, height: nextWidth / ratio } : { width: nextWidth });
                      }} /></label>
                      <label>Frame height<input disabled={selectedTransformLocked || selected.aspectLocked !== false} type="number" min="80" max={canvasHeight * 2} value={Math.round(selected.height)} onChange={(e) => updateLayer(selected.id, { height: Math.max(80, +e.target.value) })} /></label>
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
                <div className="buttonRow"><button disabled={selectedTransformLocked} className="miniBtn" onClick={duplicateSelected}>Duplicate</button><button disabled={!selectedCanDelete} className="miniBtn danger" onClick={removeSelected}>{selected?.type === 'frame' ? 'Delete frame' : selected?.type === 'image' ? 'Delete photo' : 'Delete'}</button></div>
              </div>
            </>
          ) : <div className="emptyInspector">Select text, a picture, frame, or block on the canvas to edit it.</div>}

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
                <label className="rangeLabel">Crop zoom <span>{Math.round(backgroundPhotoScale * 100)}%</span><input type="range" min="100" max="300" value={backgroundPhotoScale * 100} onChange={(e) => setBackgroundPhotoScale(+e.target.value / 100)} /></label>
                <label className="rangeLabel">Crop X <span>{Math.round(backgroundPhotoPositionX)}%</span><input type="range" min="0" max="100" value={backgroundPhotoPositionX} onChange={(e) => setBackgroundPhotoPositionX(+e.target.value)} /></label>
                <label className="rangeLabel">Crop Y <span>{Math.round(backgroundPhotoPositionY)}%</span><input type="range" min="0" max="100" value={backgroundPhotoPositionY} onChange={(e) => setBackgroundPhotoPositionY(+e.target.value)} /></label>
                <label className="rangeLabel">Photo opacity <span>{Math.round(backgroundPhotoOpacity * 100)}%</span><input type="range" min="0" max="100" value={backgroundPhotoOpacity * 100} onChange={(e) => setBackgroundPhotoOpacity(+e.target.value / 100)} /></label>
                <label className="rangeLabel">Blur <span>{backgroundPhotoBlur}px</span><input type="range" min="0" max="24" value={backgroundPhotoBlur} onChange={(e) => setBackgroundPhotoBlur(+e.target.value)} /></label>
                <button className="miniBtn" onClick={() => { setBackgroundPhotoScale(1); setBackgroundPhotoPositionX(50); setBackgroundPhotoPositionY(50); }}>Reset crop</button>
              </div>
            )}
          </div>

          <div className="panelSection">
            <div className="sectionTitle">Branding <span>{BRAND_STYLES[brandStyleKey]?.label || 'Custom'}</span></div>
            <div className="fieldGrid oneCol">
              <label>Footer style<select value={brandStyleKey} onChange={(e) => setBrandStyleKey(e.target.value)}>{BRAND_STYLE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            </div>
            <select className="fullSelect" value={brandPosition} onChange={(e) => setBrandPosition(e.target.value)}><option value="bottom-left">Bottom left</option><option value="bottom-center">Bottom center</option><option value="bottom-right">Bottom right</option></select>
            <label className="checkRow"><input type="checkbox" checked={brandVisible} onChange={(e) => setBrandVisible(e.target.checked)} /> Show kiocreates footer</label>
          </div>

          <div className="panelSection">
            <div className="sectionTitle">Export quality</div>
            <label className="rangeLabel"><span>{quality}%</span><input type="range" min="60" max="100" value={quality} onChange={(e) => setQuality(+e.target.value)} /></label>
            <div className="exportButtons"><button className="primaryBtn" onClick={() => exportImage('jpg')} disabled={exporting}>JPG</button><button className="primaryBtn" onClick={() => exportImage('webp')} disabled={exporting}>WebP</button></div>
          </div>
        </aside>
      </section>
      )}
      {workspacePage === 'freeform' && (
        <nav className="mobileQuickBar" aria-label="Mobile editor shortcuts">
          <button onClick={() => document.querySelector('.stageColumn')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><span>▣</span><small>Canvas</small></button>
          <button onClick={() => setWorkspacePage('templates')}><span>▦</span><small>Templates</small></button>
          <button onClick={() => document.querySelector('.inspectorPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><span>✦</span><small>Edit</small></button>
          <button onClick={() => exportImage('jpg')} disabled={exporting}><span>↓</span><small>JPG</small></button>
        </nav>
      )}
    </main>
  );
}
