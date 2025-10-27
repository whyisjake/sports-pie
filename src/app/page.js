import SportsPieChart from './components/SportsPieChart'
import './globals.css'

export async function generateMetadata({ searchParams }) {
  const dataParam = searchParams.d

  if (dataParam) {
    return {
      title: 'My Sports Fandom Breakdown',
      description: 'Check out my sports fandom breakdown!',
      openGraph: {
        title: 'My Sports Fandom Breakdown',
        description: 'Check out my sports fandom breakdown!',
        images: [{
          url: `/api/og?d=${encodeURIComponent(dataParam)}`,
          width: 1200,
          height: 630,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'My Sports Fandom Breakdown',
        description: 'Check out my sports fandom breakdown!',
        images: [`/api/og?d=${encodeURIComponent(dataParam)}`],
      },
    }
  }

  return {}
}

export default function Home() {
  return <SportsPieChart />
}
