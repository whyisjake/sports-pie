'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title as ChartTitle
} from 'chart.js'
import { colorPalette, sportEmojis } from '../lib/data'
import { loadFromURL, generateColorShades } from '../lib/utils'
import '../globals.css'

ChartJS.register(ArcElement, Tooltip, Legend, ChartTitle)

function EmbedChart() {
  const searchParams = useSearchParams()
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    const dataParam = searchParams.get('d')
    if (dataParam) {
      const loaded = loadFromURL(dataParam)
      if (loaded) {
        const data = generateChartData(loaded.sports, loaded.otherSports)
        setChartData(data)
      }
    }
  }, [searchParams])

  const generateChartData = (sports, otherSports) => {
    const labels = []
    const data = []
    const colors = []
    const offsets = []
    const emojis = []
    let colorIndex = 0

    const majorSports = ['football', 'basketball', 'hockey', 'baseball']
    majorSports.forEach(sport => {
      const sportData = sports[sport]
      if (sportData.percent > 0) {
        const teams = sportData.teams.filter(t => t.name && t.percent > 0)
        const baseColor = colorPalette[colorIndex % colorPalette.length]
        const sportName = sport.charAt(0).toUpperCase() + sport.slice(1)
        const emoji = sportEmojis[sport]

        if (teams.length > 0) {
          const totalTeamPercent = teams.reduce((sum, t) => sum + t.percent, 0)
          const teamCount = totalTeamPercent < 100 ? teams.length + 1 : teams.length
          const shades = generateColorShades(baseColor, teamCount)

          teams.forEach((team, idx) => {
            const teamShare = (sportData.percent * team.percent) / 100
            labels.push(`${emoji} ${team.name}`)
            data.push(teamShare)
            colors.push(shades[idx])
            emojis.push(emoji)
            offsets.push(20)
          })

          if (totalTeamPercent < 100) {
            const otherShare = (sportData.percent * (100 - totalTeamPercent)) / 100
            labels.push(`${emoji} Other ${sportName}`)
            data.push(otherShare)
            colors.push(shades[teams.length])
            emojis.push(emoji)
            offsets.push(5)
          }
        } else {
          labels.push(`${emoji} ${sportName}`)
          data.push(sportData.percent)
          colors.push(baseColor)
          emojis.push(emoji)
          offsets.push(5)
        }
        colorIndex++
      }
    })

    otherSports.forEach(sportData => {
      if (sportData.percent > 0 && sportData.name) {
        const teams = sportData.teams.filter(t => t.name && t.percent > 0)
        const baseColor = colorPalette[colorIndex % colorPalette.length]

        if (teams.length > 0) {
          const totalTeamPercent = teams.reduce((sum, t) => sum + t.percent, 0)
          const teamCount = totalTeamPercent < 100 ? teams.length + 1 : teams.length
          const shades = generateColorShades(baseColor, teamCount)

          teams.forEach((team, idx) => {
            const teamShare = (sportData.percent * team.percent) / 100
            labels.push(`${sportData.name}: ${team.name}`)
            data.push(teamShare)
            colors.push(shades[idx])
            emojis.push(null)
            offsets.push(20)
          })

          if (totalTeamPercent < 100) {
            const otherShare = (sportData.percent * (100 - totalTeamPercent)) / 100
            labels.push(`Other ${sportData.name}`)
            data.push(otherShare)
            colors.push(shades[teams.length])
            emojis.push(null)
            offsets.push(5)
          }
        } else {
          labels.push(sportData.name)
          data.push(sportData.percent)
          colors.push(baseColor)
          emojis.push(null)
          offsets.push(5)
        }
        colorIndex++
      }
    })

    return { labels, data, colors, offsets, emojis }
  }

  const emojiPlugin = {
    id: 'emojiOverlay',
    afterDatasetsDraw(chart) {
      if (!chartData) return

      const { ctx, chartArea } = chart
      const meta = chart.getDatasetMeta(0)
      const centerX = (chartArea.left + chartArea.right) / 2
      const centerY = (chartArea.top + chartArea.bottom) / 2

      ctx.save()
      ctx.font = 'bold 32px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      meta.data.forEach((arc, index) => {
        const emoji = chartData.emojis[index]
        if (!emoji) return

        const startAngle = arc.startAngle
        const endAngle = arc.endAngle
        const midAngle = (startAngle + endAngle) / 2
        const radius = (arc.outerRadius + arc.innerRadius) / 2
        const offset = chartData.offsets[index] || 0
        const adjustedRadius = radius + (offset * 0.3)
        const x = centerX + adjustedRadius * Math.cos(midAngle)
        const y = centerY + adjustedRadius * Math.sin(midAngle)

        ctx.fillText(emoji, x, y)
      })

      ctx.restore()
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 14 },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Sports Fandom Breakdown',
        font: { size: 24, weight: 'bold' },
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.parsed || 0
            return `${label}: ${value.toFixed(1)}%`
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        bodyFont: { size: 14 }
      },
      emojiOverlay: {}
    }
  }

  const chartConfig = chartData ? {
    labels: chartData.labels,
    datasets: [{
      data: chartData.data,
      backgroundColor: chartData.colors,
      borderColor: '#ffffff',
      borderWidth: 5,
      offset: chartData.offsets,
      hoverOffset: 25,
      spacing: 2
    }]
  } : null

  if (!chartData) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px'
      }}>
        Loading chart...
      </div>
    )
  }

  return (
    <div style={{
      padding: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <Pie data={chartConfig} options={chartOptions} plugins={[emojiPlugin]} />
      </div>
    </div>
  )
}

export default function EmbedPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px'
      }}>
        Loading chart...
      </div>
    }>
      <EmbedChart />
    </Suspense>
  )
}
