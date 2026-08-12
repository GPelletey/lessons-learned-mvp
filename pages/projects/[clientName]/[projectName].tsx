import Link from 'next/link'
import Layout from '../../../components/Layout'
import { getAllLessons, Lesson } from '../../../lib/lessons'
import { getAllEnhancedLessons, aggregateForProject } from '../../../lib/analytics'
import ReactMarkdown from 'react-markdown'

export default function ProjectPage({ clientName, projectName, lessons, projectAnalytics }: { clientName: string; projectName: string; lessons: Lesson[]; projectAnalytics: any }) {
  return (
    <Layout>
      <section>
        <Link href={`/clients/${encodeURIComponent(clientName)}`} style={{ fontSize: 14, color: '#0366d6' }}>← Back to {clientName}</Link>
        <h2>{projectName}</h2>
        <p className="meta">{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</p>

        <div className="card">
          <h3>Project Analytics</h3>
          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <strong>Top Keywords</strong>
              <ul>
                {projectAnalytics.keywords.slice(0, 10).map((k: any) => (
                  <li key={k.keyword}>{k.keyword} — {k.count}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Themes</strong>
              <ul>
                {projectAnalytics.themes.map((t: any) => (
                  <li key={t.theme}>{t.theme} — {t.count}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="card">No lessons found for this project.</div>
        ) : (
          lessons.map((l) => (
            <article className="card" key={l.lessonId}>
              <h3><Link href={`/lessons/${l.lessonId}`}>{l.lesson.slice(0, 80)}</Link></h3>
              <div className="meta">Submitted by {l.submittedBy}</div>
              <ReactMarkdown>{l.lesson.slice(0, 250)}</ReactMarkdown>
            </article>
          ))
        )}
      </section>
    </Layout>
  )
}

export async function getStaticPaths() {
  const lessons = getAllLessons()
  const paths: Array<{ params: { clientName: string; projectName: string } }> = []
  const seen = new Set<string>()
  lessons.forEach((l) => {
    if (l.client && l.projectName) {
      const key = `${l.client}|${l.projectName}`
      if (!seen.has(key)) {
        paths.push({ params: { clientName: l.client, projectName: l.projectName } })
        seen.add(key)
      }
    }
  })
  return { paths, fallback: false }
}

export async function getStaticProps({ params }: { params: { clientName: string; projectName: string } }) {
  const lessons = getAllLessons().filter(
    (l) => l.client === params.clientName && l.projectName === params.projectName
  )
  const enhanced = getAllEnhancedLessons()
  const projectAnalytics = aggregateForProject(enhanced, params.projectName)
  return { props: { clientName: params.clientName, projectName: params.projectName, lessons, projectAnalytics }, revalidate: 10 }
}
