# SO Generator — frontend

React + Vite UI for the SO Generator backend: design-draft PDF, warranty handbook,
daily installation report, XLSX → order-lines conversion, and the Database
Manager.

## Run it

```bash
npm install
cp .env.example .env      # then check VITE_API_URL
npm run dev
```

## Environment

One variable. Vite only exposes names prefixed with `VITE_`, and it reads
`.env` **at startup** — restart the dev server after editing it.

| Variable | Default if unset | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Origin of the FastAPI backend, no trailing slash |

Read it through `src/api/config.js` (`API_BASE`, `apiUrl()`), never
`import.meta.env.VITE_API_URL` directly — the direct form silently produced
`POST /undefined/generate-pdf` whenever `.env` was missing.

Whatever origin the dev server ends up on has to be listed in the backend's
`ALLOWED_ORIGINS`. Vite moves to 5174, 5175, … when 5173 is taken, and the only
symptom of a missing origin is a CORS error in the browser console.
