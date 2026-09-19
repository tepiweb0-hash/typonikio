# Kiocreates Typography Studio

Standalone browser-based quote and typography image creator. This is a separate site/project from the Kiocreates publishing website.

## Included

- Kiocreates visual identity and color system
- Template Mode with 18 coded layouts
- Free Mode / blank canvas
- Square 1080×1080
- Portrait 1080×1350
- Landscape 1200×630
- Add multiple text layers
- Upload images and drag them anywhere on the canvas
- Resize, rotate, duplicate, delete, move forward/backward
- Background colors and Kiocreates gradient
- Facebook-circle + `kiocreates` branding with position controls
- JPG export
- WebP export
- Export quality control
- No Supabase, login, database, or server upload required

## Deploy to Vercel

1. Create a new GitHub repository for this project. Do not put it inside the existing Kiocreates repo unless you intentionally want a monorepo.
2. Upload all files from this folder.
3. Import the new repository into Vercel as a new project.
4. Framework preset: Next.js.
5. No environment variables are required.
6. Deploy.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Notes

All exported images are rendered client-side using the browser Canvas API. Uploaded pictures stay in the user's browser and are not sent to a server.
