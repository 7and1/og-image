# Pre-Coding Checklist

> Final verification before starting implementation

---

## Quick Start Commands

```bash
# 1. Initialize project
npx create-next-app@latest . --typescript --tailwind --eslint --app --import-alias="@/*"

# 2. Install dependencies
npm install satori @resvg/resvg-js zustand lucide-react clsx tailwind-merge react-colorful

# 3. Copy WASM
cp node_modules/@resvg/resvg-js/resvg.wasm public/

# 4. Download font (manual step)
# Download Inter-Bold.ttf to public/fonts/

# 5. Start dev server
npm run dev
```

---

## File Checklist

### Must Create Before Coding

- [ ] `public/resvg.wasm` (from node_modules)
- [ ] `public/fonts/Inter-Bold.ttf` (download)
- [ ] `public/_headers` (for Cloudflare)

### Configuration Files

- [ ] `next.config.js` (output: 'export')
- [ ] `tailwind.config.ts` (dark mode)
- [ ] `tsconfig.json` (path aliases)

---

## Architecture Summary

```
User Input → Zustand Store → Template Component → Satori → Resvg → PNG Blob
```

### Data Flow

1. **User types** in EditorPanel
2. **Zustand** updates state (immediate)
3. **useEffect** triggers (with 500ms debounce)
4. **Template** receives props, returns React element
5. **Satori** converts React → SVG string
6. **Resvg** converts SVG → PNG buffer
7. **Blob URL** created for display

---

## Key Code Patterns

### Engine Singleton
```typescript
let wasmInit = false;
let fontCache: ArrayBuffer | null = null;

async function ensureInit() {
  if (!wasmInit) {
    await initWasm(fetch('/resvg.wasm'));
    wasmInit = true;
  }
  if (!fontCache) {
    fontCache = await fetch('/fonts/Inter-Bold.ttf').then(r => r.arrayBuffer());
  }
}
```

### Debounced Render
```typescript
useEffect(() => {
  const timer = setTimeout(async () => {
    const url = await renderToBlob(template);
    // Revoke old URL first!
    if (prevUrl) URL.revokeObjectURL(prevUrl);
    setPreviewUrl(url);
  }, 500);
  return () => clearTimeout(timer);
}, [deps]);
```

### Template Structure
```typescript
// Must use inline styles, Flexbox only
<div style={{
  width: '100%',
  height: '100%',
  display: 'flex',
  // ...
}}>
```

---

## Common Gotchas

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Using CSS classes in templates | Styles ignored | Use inline styles |
| Using CSS Grid | Layout breaks | Use Flexbox |
| Not revoking Blob URLs | Memory leak | Always revoke previous |
| Missing _headers | Firefox fails | Add WASM Content-Type |
| Not debouncing | UI jank | 500ms setTimeout |

---

## Development Order

```
Day 1:
├── Phase 0: Setup
└── Phase 1: Engine

Day 2:
├── Phase 2: Store
├── Phase 3: First Template
└── Phase 4: UI Components (start)

Day 3:
├── Phase 4: UI Components (finish)
├── Phase 5: Home Page
└── Phase 6: Export Features

Day 4:
├── Phase 7: More Templates
└── Phase 8: Templates Page

Day 5:
├── Phase 9: Validator
└── Phase 10: Meta Tags

Day 6:
├── Phase 11: Audit
└── Phase 12: Polish

Day 7:
└── Deploy & Test
```

---

## Success Criteria

### MVP (Day 3)
- [ ] Generator renders images
- [ ] Can change title/description
- [ ] Can download PNG
- [ ] Can copy code

### Complete (Day 7)
- [ ] 8 templates working
- [ ] Validator fetches OG tags
- [ ] Audit scans multiple pages
- [ ] Mobile responsive
- [ ] Deployed to Cloudflare

---

## Ready to Code?

1. ✅ Read MASTER-PLAN.md
2. ✅ Read TECH-STACK.md
3. ✅ Read ARCHITECTURE.md
4. ✅ Read FILE-STRUCTURE.md
5. ✅ Read DEV-SEQUENCE.md
6. ✅ Read RISKS.md
7. ✅ Have Inter font file ready
8. ✅ Understand Satori limitations

**Let's build! 🚀**
