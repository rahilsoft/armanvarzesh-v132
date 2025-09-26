# Accessibility & Performance Polish

This phase adds:
- ESLint with `plugin:jsx-a11y/recommended`
- Skip link, focus-visible styling helpers, `VisuallyHidden`
- `<Img>` wrapper enforcing `alt`, `loading=lazy`, `decoding=async`
- `_document.tsx` with `lang="fa"` and `dir="rtl"`, preconnect & preload
- Simple a11y audit script (`tools/audit/a11y-check.mjs`)
- Lighthouse CI config to watch Core Web Vitals & A11y

## Run
```bash
pnpm eslint .
node tools/audit/a11y-check.mjs . reports/a11y-report.json
npx @lhci/cli autorun
```
