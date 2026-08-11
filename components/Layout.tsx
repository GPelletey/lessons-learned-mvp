import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <Head>
        <title>Lessons Learned — MVP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className="header">
        <h1 className="h1">Lessons Learned</h1>
        <nav style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 14 }}>
          <Link href="/">Home</Link>
          <Link href="/clients">Clients</Link>
          <Link href="/insights">Insights</Link>
          <Link href="/chatbot">Chatbot</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer style={{ marginTop: 40, color: '#6b7280', fontSize: 12 }}>Built for Vercel deployment — Lessons Learned Platform MVP</footer>
    </div>
  )
}
