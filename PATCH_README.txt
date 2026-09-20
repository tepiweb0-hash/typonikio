Kiocreates Typography Studio — V1.5 UX + Poetry Library PATCH

Base required: V1.4 Photo Composition patch/project.

Replace these files:
1. components/TypographyStudio.js
2. app/globals.css

What changed
- UI/UX overhaul with stronger mobile behavior.
- On mobile, canvas appears first; template sections use horizontal swipe rows.
- Added fixed mobile shortcut bar for Canvas / Templates / Edit / JPG.
- Template cards now render miniature versions of the ACTUAL layout instead of Aa / Ab / FX placeholders.
- Template thumbnails show typography hierarchy, effects, photo frames, shapes, and footer treatment.
- Template library expanded to 166 total templates.
- Poetry & Relatable section now has 40 versions, including serif, italic, Taglish-style, photo strips, mixed emphasis, film/photo poetry, handwritten, faded/repeat and long-thought formats.
- No T-shirt category. T-shirt screenshots were treated only as visual inspiration.

Typography behavior
- Template font sizes stay fixed when quote length changes.
- Auto adjustment now focuses on line spacing and spacing between mixed-font blocks.
- Unlocked text can manually change font size, text width, line spacing, style, font, weight, alignment, etc.
- Added Auto spacing button.
- Expanded aesthetic font library substantially (modern, serif, display, handwritten and script fonts).

Footer / branding
- Footer is no longer identical on every template.
- Added several footer styles: Facebook Sans, Facebook + Script, Signature, Handwritten, Editorial Serif, Elegant Serif, Condensed, Tiny Credit, Editorial Credit, Wordmark Only, and K Monogram.
- Templates choose different footer treatments automatically; footer style remains manually changeable.

Frames and photos
- Added Add Frame tool (separate from Add Pictures).
- New frame shapes: rectangle, rounded, circle, arch, polaroid and film strip.
- Added frame width/height controls and crop controls.
- Images and frames now default to aspect-ratio locked scaling.
- Ratio can be unlocked manually when stretching is actually wanted.
- Multiple photos remain supported.
- Existing frame photo crop / zoom / position / blend mode controls remain supported.

Background photos
- Added crop zoom, Crop X and Crop Y controls for photo backgrounds.
- Full / top / bottom / left / right background placement remains available.
- Blend mode, opacity and blur remain available.

Locking
- Template layouts remain locked by default.
- Text/photo content can still be changed while the layout is locked.
- Unlock Template enables layout transforms and font-size/width controls.
- Individual layer lock/unlock remains available.

Export
- JPG and WebP export remain supported.
- Export now waits for web fonts to finish loading for closer typography matching.
