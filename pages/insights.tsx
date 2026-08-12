import Layout from '../components/Layout'
import { getAllEnhancedLessons, EnhancedLesson, aggregateKeywords, aggregateThemes, getClientsAndProjects, getSubmissions } from '../lib/analytics'
import { useState } from 'react'
import Link from 'next/link'

export default function InsightsPage({ lessons, topKeywords, themes, clients }: { lessons: EnhancedLesson[]; topKeywords: any[]; themes: any[]; clients: any[] }) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [selectedSubtheme, setSelectedSubtheme] = useState<string | null>(null)

  const submissions = selectedTheme && selectedSubtheme ? getSubmissions(lessons, { client: selectedClient || undefined, projectName: selectedProject || undefined, theme: selectedTheme, subtheme: selectedSubtheme }) : []

  return (
    <Layout>
      <section>
        <h2>Insights Dashboard</h2>

        <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
          <div style={{ flex: 1 }}>
            <div className="card">
              <h3>Top Keywords</h3>
              <ul>
                {topKeywords.slice(0, 20).map((k) => (
                  <li key={k.keyword}>{k.keyword} — {k.count}</li>
                ))}
              </ul>
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <h3>Clients & Projects</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => { setSelectedClient(null); setSelectedProject(null); setSelectedTheme(null); setSelectedSubtheme(null) }} style={{ padding: 8 }}>All</button>
                {clients.map((c: any) => (
                  <div key={c.client}>
                    <button onClick={() => { setSelectedClient(c.client); setSelectedProject(null); setSelectedTheme(null); setSelectedSubtheme(null) }} style={{ padding: 8, marginRight: 6 }}>{c.client}</button>
                    {selectedClient === c.client && (
                      <div style={{ marginTop: 6 }}>
                        {c.projects.map((p: string) => (
                          <button key={p} onClick={() => { setSelectedProject(p); setSelectedTheme(null); setSelectedSubtheme(null) }} style={{ padding: 6, margin: 4 }}>{p}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ flex: 2 }}>
            <div className="card">
              <h3>Themes</h3>
              <div>
                {themes.map((t) => (
                  <div key={t.theme} style={{ marginBottom: 12 }}>
                    <strong style={{ cursor: 'pointer' }} onClick={() => { setSelectedTheme(t.theme); setSelectedSubtheme(null) }}>{t.theme} ({t.count})</strong>
                    {selectedTheme === t.theme && (
                      <div style={{ marginLeft: 12, marginTop: 6 }}>
                        {t.subthemes.map((s: any) => (
                          <div key={s.name}>
                            <button onClick={() => setSelectedSubtheme(s.name)} style={{ padding: 6, margin: 4 }}>{s.name} ({s.count})</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <h3>Drill-down</h3>
              <div style={{ color: '#374151' }}>
                <div>Scope: {selectedClient || 'All Clients'} {selectedProject ? ` / ${selectedProject}` : ''}</div>
                <div>Theme: {selectedTheme || '—'}</div>
                <div>Subtheme: {selectedSubtheme || '—'}</div>

                {selectedTheme && selectedSubtheme ? (
                  <div style={{ marginTop: 12 }}>
                    <h4>Submissions ({submissions.length})</h4>
                    {submissions.map((s) => (
                      <article key={s.lessonId} className="card" style={{ marginBottom: 8 }}>
                        <h4><Link href={`/lessons/${s.lessonId}`}>{s.projectName || `Lesson ${s.lessonId}`}</Link></h4>
                        <div className="meta">{s.client} — {s.phase}</div>
                        <p>{s.aiSummary || (s.lesson && s.lesson.slice(0, 200))}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p style={{ marginTop: 8 }}>Select a theme and subtheme to see submissions.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const lessons = getAllEnhancedLessons()
  const topKeywords = aggregateKeywords(lessons, 50)
  const themes = aggregateThemes(lessons)
  const clients = getClientsAndProjects(lessons)
  return { props: { lessons, topKeywords, themes, clients }, revalidate: 30 }
}
