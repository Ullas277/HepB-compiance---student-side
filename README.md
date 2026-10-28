# HepB Compliance scaffold

Static recreation of the Exxat **Compliance** mandatory-requirements screen (reference screenshot in `.cursor` assets). Built on [PRISM tokens](https://github.com/Exxat-Design/PRISM-tokens) with `theme-blue-light` on `<html>`.

## View without a build

From the project root:

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080/preview.html](http://localhost:8080/preview.html). To open the HepB flow immediately, use [preview.html#hepb](http://localhost:8080/preview.html#hepb). Otherwise click anywhere on the **Hepatitis B** row (or its **In Progress** pill).

## Dev (React + Vite + Tailwind v4)

```bash
npm install
npm run dev
```

### Hepatitis B flow (Figma)

On the compliance table, click **In Progress** on the **Hepatitis B** row to open the drawer flow:

1. Select a vaccination record type → **Continue**
2. Tap **+** on **Titer lab report** → fill **Titer lab record** → **Save**
3. View uploaded **Vaccination records** (Pending Review)

Requires the React dev app (`npm run dev`); static `preview.html` does not include this interaction yet.

## Where to edit

| Area | Location |
|------|----------|
| Table rows | `src/data/complianceRows.ts` (keep `complianceRows.json` / `scaffold-static.js` in sync for static preview) |
| Layout / chrome | `src/components/ComplianceScreen.tsx`, `styles/compliance-scaffold.css` |
| Colors | PRISM source repo only — copy updated `styles/prism-*.css` files here |

Reference image: compare side-by-side with the screenshot while iterating on spacing.
