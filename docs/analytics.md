Analytics endpoints and usage

Data source
- data/lessons_ai_enhanced.json: enriched lessons with theme, subthemes, quotedKeywords, semanticKeywords, aiSummary

Lib helpers
- lib/analytics.ts
  - getAllEnhancedLessons() - load enriched JSON
  - aggregateKeywords(lessons, topN, filter?) - returns sorted keyword counts
  - aggregateThemes(lessons, filter?) - returns themes with counts and subthemes
  - getClientsAndProjects(lessons) - returns clients + projects
  - getSubmissions(lessons, {theme, subtheme, client, projectName}) - returns matching records
  - aggregateForProject / aggregateForClient - convenience aggregations

Pages using analytics
- pages/insights.tsx - central Insights tab that shows top keywords, themes, clients -> projects drilldown, and drill to submissions
- pages/index.tsx - home page shows top keywords summary
- pages/projects/[clientName]/[projectName].tsx - project analytics shown at top of project page

Notes
- Currently the analytics are computed at build-time (getStaticProps). For large data, consider moving to server API endpoints and caching.
- Drill-down is client-side selection that filters the preloaded lessons data in memory. For more data, prefer paginated API queries.
