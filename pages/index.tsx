import Link from 'next/link'
import Layout from '../components/Layout'
import { getAllLessons, Lesson } from '../lib/lessons'
import { useState, useMemo } from 'react'

export default function Home({ lessons, clients, phases }: { lessons: Lesson[]; clients: string[]; phases: string[] }) {
  const [query, setQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = lessons
    if (query) {
      const q = query.toLowerCase()
      result = result.filter((l) => {
        return (
          (l.projectName && l.projectName.toLowerCase().includes(q)) ||
          (l.projectNumber && l.projectNumber.toLowerCase().includes(q)) ||
          (l.client && l.client.toLowerCase().includes(q)) ||
          (l.phase && l.phase.toLowerCase().includes(q)) ||
          (l.lesson && l.lesson.toLowerCase().includes(q)) ||
          (l.tags && l.tags.join(' ').toLowerCase().includes(q))
        )
      })
    }
    if (selectedClient) result = result.filter((l) => l.client === selectedClient)
    if (selectedPhase) result = result.filter((l) => l.phase === selectedPhase)
    return result
  }, [query, selectedClient, selectedPhase, lessons])

  const clientCounts = useMemo(() => {
    const counts: { [key: string]: number } = {}
    lessons.forEach((l) => {
      if (l.client) counts[l.client] = (counts[l.client] || 0) + 1
    })
    return counts
  }, [lessons])

  const phaseCounts = useMemo(() => {
    const counts: { [key: string]: number } = {}
    lessons.forEach((l) => {
      if (l.phase) counts[l.phase] = (counts[l.phase] || 0) + 1
    })
    return counts
  }, [lessons])

  return (
    <Layout>
      <section>
        <p style={{ marginTop: 8 }}>Browse lessons learned from construction projects. Use search and filters to explore by client, project, or phase.</p>

        <div style={{ margin: '12px 0' }}>
          <input
            aria-label="Search lessons"
            placeholder="Search by project, client, phase, or text..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 16, borderRadius: 6, border: '1px solid #e5e7eb' }}
          />
        </div>

        <div style={{ margin: '16px 0' }}>
          <div style={{ marginBottom: 8 }}>
            <strong>Filter by Client:</strong>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              <button
                onClick={() => setSelectedClient(null)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 4,
                  border: selectedClient === null ? '2px solid #0366d6' : '1px solid #d1d9e0',
                  background: selectedClient === null ? '#f0f6fc' : '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                All ({lessons.length})
              </button>
              {clients.map((client) => (
                <button
                  key={client}
                  onClick={() => setSelectedClient(client)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 4,
                    border: selectedClient === client ? '2px solid #0366d6' : '1px solid #d1d9e0',
                    background: selectedClient === client ? '#f0f6fc' : '#fff',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  {client} ({clientCounts[client] || 0})
                </button>
              ))}
            </div>
          </div>

          <div>
            <strong>Filter by Phase:</strong>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              <button
                onClick={() => setSelectedPhase(null)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 4,
                  border: selectedPhase === null ? '2px solid #0366d6' : '1px solid #d1d9e0',
                  background: selectedPhase === null ? '#f0f6fc' : '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                All ({lessons.length})
              </button>
              {phases.map((phase) => (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(phase)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 4,
                    border: selectedPhase === phase ? '2px solid #0366d6' : '1px solid #d1d9e0',
                    background: selectedPhase === phase ? '#f0f6fc' : '#fff',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  {phase} ({phaseCounts[phase] || 0})
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card">No lessons match your filters. Try adjusting your selection.</div>
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
  const clients = Array.from(new Set(lessons.map((l) => l.client).filter(Boolean)))
  const phases = Array.from(new Set(lessons.map((l) => l.phase).filter(Boolean)))
  return { props: { lessons, clients, phases }, revalidate: 10 }
}
