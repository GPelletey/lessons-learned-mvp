import Link from 'next/link'
import Layout from '../../../components/Layout'
import { getAllLessons } from '../../../lib/lessons'

export default function ClientPage({ clientName, projects }: { clientName: string; projects: string[] }) {
  return (
    <Layout>
      <section>
        <Link href="/clients" style={{ fontSize: 14, color: '#0366d6' }}>← Back to Clients</Link>
        <h2>{clientName}</h2>
        <p>Select a project to see all associated lessons.</p>

        {projects.length === 0 ? (
          <div className="card">No projects found for this client.</div>
        ) : (
          projects.map((project) => (
            <article className="card" key={project}>
              <h3><Link href={`/projects/${encodeURIComponent(clientName)}/${encodeURIComponent(project)}`}>{project}</Link></h3>
            </article>
          ))
        )}
      </section>
    </Layout>
  )
}

export async function getStaticPaths() {
  const lessons = getAllLessons()
  const clients = Array.from(new Set(lessons.map((l) => l.client).filter(Boolean)))
  const paths = clients.map((client) => ({ params: { name: client } }))
  return { paths, fallback: true }
}

export async function getStaticProps({ params }: { params: { name: string } }) {
  const lessons = getAllLessons()
  const filteredLessons = lessons.filter((l) => l.client === params.name)
  const projects = Array.from(new Set(filteredLessons.map((l) => l.projectName).filter(Boolean))).sort()
  return { props: { clientName: params.name, projects }, revalidate: 10 }
}
