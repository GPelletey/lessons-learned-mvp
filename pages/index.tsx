import Link from 'next/link'
import Layout from '../components/Layout'
import { getAllLessons, Lesson } from '../lib/lessons'
import { useState, useMemo } from 'react'

export default function Home({ lessons }: { lessons: Lesson[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return lessons
    const q = query.toLowerCase()
    return lessons.filter((l) => {
      return (
        (l.projectName && l.projectName.toLowerCase().includes(q)) ||
        (l.projectNumber && l.projectNumber.toLowerCase().includes(q)) ||
        (l.client && l.client.toLowerCase().includes(q)) ||
        (l.phase && l.phase.toLowerCase().includes(q)) ||
        (l.lesson && l.lesson.toLowerCase().includes(q)) ||
        (l.tags && l.tags.join(' ').toLowerCase().includes(q))
      )
    })
  }, [query, lessons])

  return (
    <Layout>
      <section>
        <p style={{ marginTop: 8 }}>A read-only MVP that lists lessons from a JSON file in /data/lessons.json.</p>

        <div style={{ margin: '12px 0' }}>
          <input
            aria-label="Search lessons"
            placeholder="Search by project, client, phase, or text..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 16, borderRadius: 6, border: '1px solid #e5e7eb' }}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="card">No lessons match your search. Ensure /data/lessons.json exists and contains records.</div>
        ) : (
          filtered.map((l) => (
            <article className="card" key={l.lessonId}>
              <h2><Link href={`/lessons/${l.lessonId}`}>{l.projectName || `Lesson ${l.lessonId}`}</Link></h2>
              <div className="meta">{l.client} — {l.phase}</div>
              <p>{l.lesson && l.lesson.slice(0, 180)}{l.lesson && l.lesson.length > 180 ? '...' : ''}</p>
            </article>
          ))
        )}
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const lessons = getAllLessons()
  return { props: { lessons }, revalidate: 10 }
}
