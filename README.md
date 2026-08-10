# Lessons_Learned_Platform
This Platform is meant to create a searchable database that gets inputs from team forms, then enriches and surfaces actionable insights.

Quick start (developer)
1. Add your JSON file at data/lessons.json as a top-level array of lesson objects (the code reads whatever you supply).
2. Install dependencies:
   npm install
3. Run dev server:
   npm run dev
4. Build for production:
   npm run build

Vercel deploy (manual)
1. Sign in to https://vercel.com and connect your GitHub account.
2. Import Project → choose "lessons-learned-mvp" → Framework Preset: Next.js.
3. Build command: npm run build, Output Directory: (leave blank), Environment: none required for MVP.
4. Deploy. Future git pushes to this repo/branch will trigger automatic Vercel builds and preview deployments.

Troubleshooting build failures
- Share the npm run build error log (paste the terminal output) and I’ll diagnose it.
- Common fixes:
  - Ensure Node and npm are installed (Node 18+ recommended). Check with `node -v` and `npm -v`.
  - Run `npm ci` or `npm install` to ensure dependencies are present.
  - If build fails due to missing data/lessons.json, add a valid JSON file; otherwise the code handles an empty file.
  - If Node version is incompatible with Next.js version, install Node 18+ or adjust package.json Next version.

If you want, I can add the Vercel URL to this README after you deploy — tell me the URL and I’ll update it and mark deploy-and-docs done.

