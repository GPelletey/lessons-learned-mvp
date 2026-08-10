import Layout from '../../components/Layout'
import { getAllLessons, getLessonById, Lesson } from '../../lib/lessons'
import ReactMarkdown from 'react-markdown'

export default function LessonPage({ lesson }: { lesson?: Lesson }) {
  if (!lesson) {
    return (
      <Layout>
        <div className="card">Lesson not found. Ensure /data/lessons.json contains the record.</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <article className="card">
        <h2>{lesson.projectName || `Lesson ${lesson.lessonId}`}</h2>
        <div className="meta">{lesson.client} — {lesson.phase} — Submitted by {lesson.submittedBy}</div>
        <div style={{ marginTop: 12 }}>
          <ReactMarkdown>{lesson.lesson}</ReactMarkdown>
        </div>
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const lessons = getAllLessons()
  const paths = lessons.map((l) => ({ params: { id: String(l.lessonId) } }))
  return { paths, fallback: true }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const lesson = getLessonById(params.id)
  return { props: { lesson: lesson || null }, revalidate: 10 }
}
