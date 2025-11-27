# FantasyRealms / WildCulture Quest

This repository contains the FantasyRealms / WildCulture Quest web app — a Vite + React project focused on wildlife conservation learning experiences.

- Frontend: `client/` (Vite + React + Tailwind)
- Backend: `server/` (Express development server + API)

Run locally:

1. Install dependencies:

```bash
npm install
```

2. Start the full-stack dev server (backend serves frontend + API):

Windows (cmd):
```cmd
set PORT=5001 && npm run dev
```

PowerShell:
```powershell
$env:PORT=5001; npm run dev
```

3. Open http://localhost:5001

Notes:
- The server uses an in-memory storage implementation for sample data (no DB required).
- If you want to push this repo to GitHub, install the `gh` CLI and run:

```bash
gh repo create <your-org-or-username>/fantasy-realms --public --source=. --remote=origin --push
```

Then teammates can clone:

```bash
git clone https://github.com/<your-org-or-username>/fantasy-realms.git
```
