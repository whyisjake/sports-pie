import { ImageResponse } from 'next/og'
import { ID_TO_TEAM } from '../../lib/data'

export const runtime = 'edge'

const sportCodes = { 'f': 'Football', 'b': 'Basketball', 'h': 'Hockey', 'a': 'Baseball' }
const sportEmojis = { 'f': '🏈', 'b': '🏀', 'h': '🏒', 'a': '⚾' }

function parseChartData(dataParam) {
  if (!dataParam) return null

  const sports = []
  const parts = dataParam.split('|')

  parts.forEach(part => {
    const segments = part.split(':')
    const sportCode = segments[0]

    if (sportCode === 'c') {
      const sportName = decodeURIComponent(segments[1])
      const sportPercent = parseFloat(segments[2])
      sports.push({ name: sportName, percent: sportPercent, emoji: null })
    } else if (sportCodes[sportCode]) {
      const sportName = sportCodes[sportCode]
      const sportPercent = parseFloat(segments[1])
      const emoji = sportEmojis[sportCode]
      sports.push({ name: sportName, percent: sportPercent, emoji })
    }
  })

  return sports
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const dataParam = searchParams.get('d')

    if (!dataParam) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1e293b',
              color: 'white',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            <div style={{ fontSize: 80, marginBottom: 20 }}>🏈🏀🏒⚾</div>
            <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 20 }}>
              Sports Fandom Pie Chart
            </div>
            <div style={{ fontSize: 32, color: '#94a3b8' }}>
              Visualize Your Sports Love
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      )
    }

    const sports = parseChartData(dataParam)
    const topSports = sports.sort((a, b) => b.percent - a.percent).slice(0, 4)

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e293b',
            color: 'white',
            fontFamily: 'system-ui, sans-serif',
            padding: 60,
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 'bold', marginBottom: 40 }}>
            My Sports Fandom Breakdown
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '80%' }}>
            {topSports.map((sport, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#334155',
                  padding: '20px 30px',
                  borderRadius: 12,
                  fontSize: 36,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {sport.emoji && <span style={{ fontSize: 48 }}>{sport.emoji}</span>}
                  <span>{sport.name}</span>
                </div>
                <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>
                  {sport.percent.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, fontSize: 28, color: '#94a3b8' }}>
            sportspie.site
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error(e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
