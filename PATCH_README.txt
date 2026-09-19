Kiocreates Typography Studio V1.1 patch

Replace these files in the existing Typography Studio project:
- components/TypographyStudio.js
- app/globals.css
- README.md
- package.json

Main changes:
- 51 coded templates total
- Mixed-font template compositions
- Template category filters
- Actual font-pair previews in template cards
- Per-text-layer font selection in Free Mode / inspector
- Mixed quote auto-splitting + manual line break control
- Canvas export uses each layer's selected font, italic style, case, and spacing where supported
- Google Fonts with system fallbacks

No Supabase or environment variables added.
