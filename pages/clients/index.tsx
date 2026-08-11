import Link from 'next/link'
import Layout from '../../components/Layout'
import { getAllLessons, Lesson } from '../../lib/lessons'

export default function ClientsPage({ clients }: { clients: Array<{ name: string; projects: string[] }> }) {
  return (
    <Layout>
      <section>
        <h2>Browse by Client</h2>
        <p>Select a client to see all associated projects and their lessons.</p>

        {clients.length === 0 ? (
          <div className="card">No clients found.</div>
        ) : (
          clients.map((client) => (
            <article className="card" key={client.name}>
              <h3><Link href={`/clients/${encodeURIComponent(client.name)}`}>{client.name}</Link></h3>
              <p className="meta">{client.projects.length} project{client.projects.length !== 1 ? 's' : ''}</p>
            </article>
          ))
        )}
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const lessons = getAllLessons()
  const clientMap: { [key: string]: Set<string> } = {}
  lessons.forEach((l) => {
    if (l.client && l.projectName) {
      if (!clientMap[l.client]) clientMap[l.client] = new Set()
      clientMap[l.client].add(l.projectName)
    }
  })
  const clients = Object.entries(clientMap)
    .map(([name, projects]) => ({ name, projects: Array.from(projects) }))
    .sort((a, b) => a.name.localeCompare(b.name))
  return { props: { clients }, revalidate: 10 }
}
