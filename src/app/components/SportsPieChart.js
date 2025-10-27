'use client'

import { useState, useEffect, useRef } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title as ChartTitle
} from 'chart.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, ChartTitle)

// Import team data
import { TEAM_IDS, ID_TO_TEAM, colorPalette, sportEmojis, TEAM_LISTS } from '../lib/data'
import { encodeStateToURL, loadFromURL, generateColorShades } from '../lib/utils'

export default function SportsPieChart() {
  const [sports, setSports] = useState({
    football: { percent: 0, teams: [] },
    basketball: { percent: 0, teams: [] },
    hockey: { percent: 0, teams: [] },
    baseball: { percent: 0, teams: [] }
  })
  const [otherSports, setOtherSports] = useState([])
  const [chartData, setChartData] = useState(null)
  const [total, setTotal] = useState(0)
  const chartRef = useRef(null)

  // Load from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const dataParam = params.get('d')
    if (dataParam) {
      const loaded = loadFromURL(dataParam)
      if (loaded) {
        setSports(loaded.sports)
        setOtherSports(loaded.otherSports)
        setTimeout(() => generateChart(), 100)
      }
    }
  }, [])

  // Update total whenever sports change
  useEffect(() => {
    const majorTotal = Object.values(sports).reduce((sum, sport) => sum + (sport.percent || 0), 0)
    const otherTotal = otherSports.reduce((sum, sport) => sum + (sport.percent || 0), 0)
    setTotal(majorTotal + otherTotal)
  }, [sports, otherSports])

  const updateSportPercent = (sportName, value) => {
    setSports(prev => ({
      ...prev,
      [sportName]: { ...prev[sportName], percent: parseFloat(value) || 0 }
    }))
  }

  const addTeam = (sportName) => {
    setSports(prev => ({
      ...prev,
      [sportName]: {
        ...prev[sportName],
        teams: [...prev[sportName].teams, { name: '', percent: 0 }]
      }
    }))
  }

  const updateTeam = (sportName, index, field, value) => {
    setSports(prev => ({
      ...prev,
      [sportName]: {
        ...prev[sportName],
        teams: prev[sportName].teams.map((team, i) =>
          i === index ? { ...team, [field]: field === 'percent' ? parseFloat(value) || 0 : value } : team
        )
      }
    }))
  }

  const removeTeam = (sportName, index) => {
    setSports(prev => ({
      ...prev,
      [sportName]: {
        ...prev[sportName],
        teams: prev[sportName].teams.filter((_, i) => i !== index)
      }
    }))
  }

  const addOtherSport = () => {
    setOtherSports(prev => [...prev, { name: '', percent: 0, teams: [] }])
  }

  const updateOtherSport = (index, field, value) => {
    setOtherSports(prev => prev.map((sport, i) =>
      i === index ? { ...sport, [field]: field === 'percent' ? parseFloat(value) || 0 : value } : sport
    ))
  }

  const removeOtherSport = (index) => {
    setOtherSports(prev => prev.filter((_, i) => i !== index))
  }

  const addOtherTeam = (sportIndex) => {
    setOtherSports(prev => prev.map((sport, i) =>
      i === sportIndex ? { ...sport, teams: [...sport.teams, { name: '', percent: 0 }] } : sport
    ))
  }

  const updateOtherTeam = (sportIndex, teamIndex, field, value) => {
    setOtherSports(prev => prev.map((sport, i) =>
      i === sportIndex ? {
        ...sport,
        teams: sport.teams.map((team, j) =>
          j === teamIndex ? { ...team, [field]: field === 'percent' ? parseFloat(value) || 0 : value } : team
        )
      } : sport
    ))
  }

  const removeOtherTeam = (sportIndex, teamIndex) => {
    setOtherSports(prev => prev.map((sport, i) =>
      i === sportIndex ? {
        ...sport,
        teams: sport.teams.filter((_, j) => j !== teamIndex)
      } : sport
    ))
  }

  const generateChart = () => {
    const data = collectChartData()
    if (data.labels.length === 0) {
      alert('Please add some sports with percentages greater than 0')
      return
    }
    setChartData(data)
  }

  const collectChartData = () => {
    const labels = []
    const data = []
    const colors = []
    const offsets = []
    const emojis = []
    let colorIndex = 0

    // Process major sports
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

    // Process other sports
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

  const resetAll = () => {
    setSports({
      football: { percent: 0, teams: [] },
      basketball: { percent: 0, teams: [] },
      hockey: { percent: 0, teams: [] },
      baseball: { percent: 0, teams: [] }
    })
    setOtherSports([])
    setChartData(null)
  }

  const shareChart = () => {
    const url = encodeStateToURL(sports, otherSports)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showNotification('Link copied to clipboard!')
      })
    }
  }

  const downloadChart = () => {
    if (!chartRef.current) return
    const url = chartRef.current.toBase64Image()
    const link = document.createElement('a')
    link.download = 'sports-fandom-chart.png'
    link.href = url
    link.click()
  }

  const showNotification = (message) => {
    // Simple notification - could be improved with a toast library
    alert(message)
  }

  const chartOptions = chartData ? {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Your Sports Fandom Breakdown',
        font: { size: 20, weight: 'bold' },
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
      }
    }
  } : null

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

  return (
    <>
      <div className="container">
        <h1>Sports Fandom Pie Chart</h1>
        <p className="subtitle">Calculate and visualize your sports fandom breakdown</p>

        <div className="main-content">
          <div className="input-section">
            <h2>Major Sports</h2>

            {['football', 'basketball', 'hockey', 'baseball'].map(sport => (
              <SportInput
                key={sport}
                sport={sport}
                data={sports[sport]}
                onPercentChange={(val) => updateSportPercent(sport, val)}
                onAddTeam={() => addTeam(sport)}
                onUpdateTeam={(idx, field, val) => updateTeam(sport, idx, field, val)}
                onRemoveTeam={(idx) => removeTeam(sport, idx)}
              />
            ))}

            <h2>Other Sports</h2>
            <div id="other-sports-container">
              {otherSports.map((sport, idx) => (
                <OtherSportInput
                  key={idx}
                  index={idx}
                  data={sport}
                  onUpdate={(field, val) => updateOtherSport(idx, field, val)}
                  onRemove={() => removeOtherSport(idx)}
                  onAddTeam={() => addOtherTeam(idx)}
                  onUpdateTeam={(teamIdx, field, val) => updateOtherTeam(idx, teamIdx, field, val)}
                  onRemoveTeam={(teamIdx) => removeOtherTeam(idx, teamIdx)}
                />
              ))}
            </div>

            <button onClick={addOtherSport} className="primary-btn" id="add-sport-btn">
              + Add Another Sport
            </button>

            <div className="action-buttons">
              <button onClick={generateChart} className="primary-btn generate-btn">
                Generate Chart
              </button>
              <button onClick={resetAll} className="secondary-btn">
                Reset
              </button>
            </div>

            <div className="total-display">
              Total: <span id="total-percent">{total.toFixed(1)}</span>%
              <span className="warning" style={{
                display: total > 100 ? 'inline' : (total < 100 && total > 0 ? 'inline' : 'none'),
                color: total > 100 ? '#dc2626' : '#059669'
              }}>
                {total > 100 ? '(exceeds 100%)' : (total < 100 && total > 0 ? `(${(100 - total).toFixed(1)}% remaining)` : '')}
              </span>
            </div>
          </div>

          <div className="chart-section">
            {chartConfig && chartOptions && <Pie ref={chartRef} data={chartConfig} options={chartOptions} />}
            {chartData && (
              <div className="chart-actions" style={{ display: 'flex' }}>
                <button onClick={shareChart} className="chart-action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Share Link
                </button>
                <button onClick={downloadChart} className="chart-action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Built by <a href="https://jakespurlock.com" target="_blank" rel="noopener">Jake Spurlock</a> · <a href="https://twitter.com/whyisjake" target="_blank" rel="noopener">@whyisjake</a></p>
        <p>Inspired by <a href="https://www.tiktok.com/@__sportsball/video/7563289447702252855" target="_blank" rel="noopener">@__sportsball</a> · <a href="https://github.com/whyisjake/sports-pie" target="_blank" rel="noopener">Credits</a></p>
      </footer>
    </>
  )
}

function SportInput({ sport, data, onPercentChange, onAddTeam, onUpdateTeam, onRemoveTeam }) {
  const emoji = sportEmojis[sport]
  const name = sport.charAt(0).toUpperCase() + sport.slice(1)
  const datalistId = `${sport}-teams-list`

  return (
    <div className="sport-group">
      <div className="sport-header">
        <label>{emoji} {name}</label>
        <input
          type="number"
          className="sport-percent"
          min="0"
          max="100"
          placeholder="0"
          value={data.percent || ''}
          onChange={(e) => onPercentChange(e.target.value)}
        />
        <span>%</span>
      </div>
      <div className="team-inputs">
        {data.teams.map((team, idx) => (
          <div key={idx} className="team-input-group">
            <input
              type="text"
              className="team-name"
              placeholder="Team name"
              list={TEAM_LISTS[sport] ? datalistId : undefined}
              value={team.name}
              onChange={(e) => onUpdateTeam(idx, 'name', e.target.value)}
            />
            <input
              type="number"
              className="team-percent"
              min="0"
              max="100"
              placeholder="0"
              value={team.percent || ''}
              onChange={(e) => onUpdateTeam(idx, 'percent', e.target.value)}
            />
            <span>%</span>
            <button className="remove-team-btn" onClick={() => onRemoveTeam(idx)}>×</button>
          </div>
        ))}
        <button className="add-team-btn" onClick={onAddTeam}>+ Add Team</button>
      </div>

      {TEAM_LISTS[sport] && (
        <datalist id={datalistId}>
          {TEAM_LISTS[sport].map(team => <option key={team} value={team} />)}
        </datalist>
      )}
    </div>
  )
}

function OtherSportInput({ index, data, onUpdate, onRemove, onAddTeam, onUpdateTeam, onRemoveTeam }) {
  return (
    <div className="sport-group other-sport">
      <div className="sport-header">
        <input
          type="text"
          className="other-sport-name"
          placeholder="Sport name"
          value={data.name}
          onChange={(e) => onUpdate('name', e.target.value)}
        />
        <input
          type="number"
          className="sport-percent other-sport-percent"
          min="0"
          max="100"
          placeholder="0"
          value={data.percent || ''}
          onChange={(e) => onUpdate('percent', e.target.value)}
        />
        <span>%</span>
        <button className="remove-sport-btn" onClick={onRemove}>×</button>
      </div>
      <div className="team-inputs">
        {data.teams.map((team, idx) => (
          <div key={idx} className="team-input-group">
            <input
              type="text"
              className="team-name"
              placeholder="Team name"
              value={team.name}
              onChange={(e) => onUpdateTeam(idx, 'name', e.target.value)}
            />
            <input
              type="number"
              className="team-percent"
              min="0"
              max="100"
              placeholder="0"
              value={team.percent || ''}
              onChange={(e) => onUpdateTeam(idx, 'percent', e.target.value)}
            />
            <span>%</span>
            <button className="remove-team-btn" onClick={() => onRemoveTeam(idx)}>×</button>
          </div>
        ))}
        <button className="add-team-btn" onClick={onAddTeam}>+ Add Team</button>
      </div>
    </div>
  )
}
