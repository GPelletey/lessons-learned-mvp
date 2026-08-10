import React from 'react'
import Head from 'next/head'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <Head>
        <title>Lessons Learned — MVP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className="header">
        <h1 className="h1">Lessons Learned — MVP</h1>
      </header>
      <main>{children}</main>
      <footer style={{ marginTop: 40, color: '#6b7280' }}>Built for Vercel deployment — read-only MVP</footer>
    </div>
  )
}
