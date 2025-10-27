import SportsPieChart from './components/SportsPieChart'
import './globals.css'

export async function generateMetadata({ searchParams }) {
  const params = await searchParams
  const dataParam = params.d

  if (dataParam) {
    const pageUrl = `https://sportspie.site/?d=${dataParam}`
    const encodedUrl = encodeURIComponent(pageUrl)

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
      alternates: {
        types: {
          'application/json+oembed': `https://sportspie.site/api/oembed?url=${encodedUrl}&format=json`,
          'text/xml+oembed': `https://sportspie.site/api/oembed?url=${encodedUrl}&format=xml`,
        },
      },
    }
  }

  return {}
}

export default function Home() {
  return <SportsPieChart />
}
