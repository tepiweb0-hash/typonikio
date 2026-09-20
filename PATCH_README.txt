TyponiKio V1.8 UI + Crop PATCH
Base: apply over V1.7

Changed files:
- components/TypographyStudio.js
- app/globals.css

Updates:
1. New top navigation: Recreate / Templates / Freeform.
2. Recreate is now its own clean page with separate Upload, Review Text, Generate, and Choose Design steps.
3. Uploaded Recreate screenshot is reference-only and is never inserted into the editing canvas.
4. Templates now have a separate library page with categories and larger previews.
5. Freeform/editor is decluttered; template library and recreate controls were removed from the editor sidebar.
6. Selected text/image/frame controls now stay beside the canvas; selected-layer controls appear before background controls.
7. Added visible Delete Photo controls for standalone images and photos inside frames.
8. Added quick delete X for selected photos on the canvas.
9. Canva-style frame crop: double-click a frame photo, then drag the photo inside the frame. Includes Reset and Done.
10. Mobile/editor layout updated for the new nav and crop controls.
11. Fixes the stray invalid character inherited from the V1.7 source.

Validation performed:
- app/layout.js parsed successfully
- app/page.js parsed successfully
- components/TypographyStudio.js JSX parsed successfully
- app/globals.css parsed successfully

A full Next.js build was not run because node_modules are not installed in this workspace.
