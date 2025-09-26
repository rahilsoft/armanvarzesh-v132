# Phase 5 — Axios → @arman/http-client Codemod
Date: 2025-08-18

Files changed: 6
Import replacements: 3
Usage replacements: 8

Details:
- `import axios from 'axios'` → `import { http } from '@arman/http-client'`
- `axios.*` → `http.*`
- Types re-exported via `@arman/http-client`
