import fs from 'fs'
import path from 'path'

export type EnhancedLesson = {
  lessonId: number
  projectNumber?: string
  projectName?: string
  client?: string
  phase?: string
  submittedBy?: string
  lesson: string
  sentiment?: string
  theme?: string
  subthemes?: string[]
  aiSummary?: string
  quotedKeywords?: string[]
  semanticKeywords?: string[]
}

const dataPath = path.join(process.cwd(), 'data', 'lessons_ai_enhanced.json')

function readEnhancedSafe(): EnhancedLesson[] {
  try {
    if (!fs.existsSync(dataPath)) return []
    const raw = fs.readFileSync(dataPath, 'utf-8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as EnhancedLesson[]
    return Object.values(parsed) as EnhancedLesson[]
  } catch (e) {
    console.error('Failed to read lessons_ai_enhanced.json', e)
    return []
  }
}

export function getAllEnhancedLessons(): EnhancedLesson[] {
  return readEnhancedSafe()
}

export function aggregateKeywords(lessons: EnhancedLesson[], topN = 20, filter?: (l: EnhancedLesson) => boolean) {
  const counts: { [k: string]: number } = {}
  const items = filter ? lessons.filter(filter) : lessons
  items.forEach((l) => {
    ;(l.quotedKeywords || []).forEach((kw) => (counts[kw] = (counts[kw] || 0) + 1))
    ;(l.semanticKeywords || []).forEach((kw) => (counts[kw] = (counts[kw] || 0) + 1))
  })
  const arr = Object.entries(counts).map(([k, v]) => ({ keyword: k, count: v }))
  arr.sort((a, b) => b.count - a.count)
  return arr.slice(0, topN)
}

export function aggregateThemes(lessons: EnhancedLesson[], filter?: (l: EnhancedLesson) => boolean) {
  const items = filter ? lessons.filter(filter) : lessons
  const themeCounts: { [theme: string]: number } = {}
  const subthemeCounts: { [theme: string]: { [sub: string]: number } } = {}

  items.forEach((l) => {
    const theme = l.theme || 'Uncategorized'
    themeCounts[theme] = (themeCounts[theme] || 0) + 1
    if (!subthemeCounts[theme]) subthemeCounts[theme] = {}
    ;(l.subthemes || []).forEach((st) => (subthemeCounts[theme][st] = (subthemeCounts[theme][st] || 0) + 1))
  })

  const themes = Object.keys(themeCounts).map((t) => ({ theme: t, count: themeCounts[t], subthemes: Object.entries(subthemeCounts[t] || {}).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count) }))
  themes.sort((a, b) => b.count - a.count)
  return themes
}

export function getClientsAndProjects(lessons: EnhancedLesson[]) {
  const clients: { [client: string]: Set<string> } = {}
  lessons.forEach((l) => {
    if (!l.client) return
    if (!clients[l.client]) clients[l.client] = new Set()
    if (l.projectName) clients[l.client].add(l.projectName)
  })
  const result = Object.entries(clients).map(([client, projects]) => ({ client, projects: Array.from(projects).sort() }))
  result.sort((a, b) => a.client.localeCompare(b.client))
  return result
}

export function getSubmissions(lessons: EnhancedLesson[], options: { theme?: string; subtheme?: string; client?: string; projectName?: string } = {}) {
  return lessons.filter((l) => {
    if (options.client && l.client !== options.client) return false
    if (options.projectName && l.projectName !== options.projectName) return false
    if (options.theme && l.theme !== options.theme) return false
    if (options.subtheme && !(l.subthemes || []).includes(options.subtheme)) return false
    return true
  })
}

export function aggregateForProject(lessons: EnhancedLesson[], projectName?: string) {
  if (!projectName) return { keywords: [], themes: [] }
  const projectLessons = lessons.filter((l) => l.projectName === projectName)
  return { keywords: aggregateKeywords(projectLessons), themes: aggregateThemes(projectLessons) }
}

export function aggregateForClient(lessons: EnhancedLesson[], client?: string) {
  if (!client) return { keywords: [], themes: [] }
  const clientLessons = lessons.filter((l) => l.client === client)
  return { keywords: aggregateKeywords(clientLessons), themes: aggregateThemes(clientLessons), projects: Array.from(new Set(clientLessons.map((l) => l.projectName).filter(Boolean))) }
}
