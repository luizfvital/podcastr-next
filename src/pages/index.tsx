import React from 'react'

interface HomeProps {
  episodes: any
}

export default function Home({episodes}: HomeProps) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(episodes)}</p>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8, // 8 horas
  }
}