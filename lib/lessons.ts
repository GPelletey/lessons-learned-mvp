import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'lessons.json')

export type Lesson = {
  lessonId: number
  projectNumber?: string
  projectName?: string
  client?: string
  phase?: string
  submittedBy?: string
  lesson: string
  tags?: string[]
  createdAt?: string
}

function readJsonSafe(): Lesson[] {
  try {
    if (!fs.existsSync(dataPath)) return []
    const raw = fs.readFileSync(dataPath, 'utf-8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    // support object with top-level items
    return Object.values(parsed) as unknown as Lesson[]
  } catch (e) {
    console.error('Failed to read lessons.json', e)
    return []
  }
}

export function getAllLessons(): Lesson[] {
  return readJsonSafe()
}

export function getLessonById(id: string | number): Lesson | undefined {
  const all = readJsonSafe()
  return all.find((l) => String(l.lessonId) === String(id))
}
