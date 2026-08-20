# Partner photos (not logos)

Upload one photo per partner — field teams, inspection sites, or branded facility images work well.

Suggested filenames (match `photoSrc` in `src/lib/content/partners-catalog.ts`):

- `sgs.jpg`
- `bureau-veritas.jpg`
- `intertek.jpg`
- `control-union.jpg`
- `cotecna.jpg`

Example catalog entry:

```ts
{
  slug: "sgs",
  name: "SGS",
  intro: "Your one-line intro here.",
  photoSrc: "/images/partners/sgs.jpg",
  photoAlt: "SGS inspection at port",
  content: ["Paragraph one…", "Paragraph two…"],
}
```

Each partner profile shows: **name → intro → photo → descriptive text**.
