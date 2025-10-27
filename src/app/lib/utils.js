import { TEAM_IDS, ID_TO_TEAM } from './data'

// Helper function to generate color shades
export function generateColorShades(baseColor, count) {
  const hex = baseColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  const shades = []

  if (count === 1) {
    shades.push(baseColor)
    return shades
  }

  for (let i = 0; i < count; i++) {
    let newR, newG, newB, alpha

    if (i === 0) {
      const brightFactor = 1.3
      newR = Math.min(255, Math.round(r * brightFactor))
      newG = Math.min(255, Math.round(g * brightFactor))
      newB = Math.min(255, Math.round(b * brightFactor))
      alpha = 1
    } else if (i === count - 1) {
      newR = r
      newG = g
      newB = b
      alpha = 0.75
    } else {
      const step = i / (count - 1)
      const factor = 1.3 - (step * 0.5)
      newR = Math.min(255, Math.round(r * factor))
      newG = Math.min(255, Math.round(g * factor))
      newB = Math.min(255, Math.round(b * factor))
      alpha = 1
    }

    shades.push(`rgba(${newR}, ${newG}, ${newB}, ${alpha})`)
  }
  return shades
}

// Encode state to URL
export function encodeStateToURL(sports, otherSports) {
  const parts = []
  const sportCodes = { 'football': 'f', 'basketball': 'b', 'hockey': 'h', 'baseball': 'a' }

  // Encode major sports
  const majorSports = ['football', 'basketball', 'hockey', 'baseball']
  majorSports.forEach(sport => {
    const sportData = sports[sport]
    if (sportData.percent > 0) {
      const sportCode = sportCodes[sport]
      let sportPart = `${sportCode}:${sportData.percent}`

      if (sportData.teams.length > 0) {
        const teamParts = sportData.teams
          .filter(team => team.name && team.percent > 0)
          .map(team => {
            const teamId = TEAM_IDS[team.name] || `~${encodeURIComponent(team.name)}`
            return `${teamId}:${team.percent}`
          })
        if (teamParts.length > 0) {
          sportPart += ':' + teamParts.join(',')
        }
      }
      parts.push(sportPart)
    }
  })

  // Encode other sports
  otherSports.forEach(sportData => {
    if (sportData.percent > 0 && sportData.name) {
      let sportPart = `c:${encodeURIComponent(sportData.name)}:${sportData.percent}`

      if (sportData.teams.length > 0) {
        const teamParts = sportData.teams
          .filter(team => team.name && team.percent > 0)
          .map(team => {
            const teamId = TEAM_IDS[team.name] || `~${encodeURIComponent(team.name)}`
            return `${teamId}:${team.percent}`
          })
        if (teamParts.length > 0) {
          sportPart += ':' + teamParts.join(',')
        }
      }
      parts.push(sportPart)
    }
  })

  const encoded = parts.join('|')
  return `${window.location.origin}?d=${encoded}`
}

// Load from URL
export function loadFromURL(dataParam) {
  const sportCodes = { 'f': 'football', 'b': 'basketball', 'h': 'hockey', 'a': 'baseball' }
  const sports = {
    football: { percent: 0, teams: [] },
    basketball: { percent: 0, teams: [] },
    hockey: { percent: 0, teams: [] },
    baseball: { percent: 0, teams: [] }
  }
  const otherSports = []

  const parts = dataParam.split('|')

  parts.forEach(part => {
    const segments = part.split(':')
    const sportCode = segments[0]

    if (sportCode === 'c') {
      // Custom sport
      const sportName = decodeURIComponent(segments[1])
      const sportPercent = parseFloat(segments[2])
      const teams = []

      if (segments.length > 3) {
        const teamsStr = segments.slice(3).join(':')
        const teamPairs = teamsStr.split(',')
        teamPairs.forEach(pair => {
          const [teamId, percent] = pair.split(':')
          let teamName = teamId.startsWith('~')
            ? decodeURIComponent(teamId.substring(1))
            : (ID_TO_TEAM[teamId] || teamId)
          teams.push({ name: teamName, percent: parseFloat(percent) })
        })
      }

      otherSports.push({ name: sportName, percent: sportPercent, teams })
    } else if (sportCodes[sportCode]) {
      // Major sport
      const sport = sportCodes[sportCode]
      const sportPercent = parseFloat(segments[1])
      const teams = []

      if (segments.length > 2) {
        const teamsStr = segments.slice(2).join(':')
        const teamPairs = teamsStr.split(',')
        teamPairs.forEach(pair => {
          const [teamId, percent] = pair.split(':')
          let teamName = teamId.startsWith('~')
            ? decodeURIComponent(teamId.substring(1))
            : (ID_TO_TEAM[teamId] || teamId)
          teams.push({ name: teamName, percent: parseFloat(percent) })
        })
      }

      sports[sport] = { percent: sportPercent, teams }
    }
  })

  return { sports, otherSports }
}
