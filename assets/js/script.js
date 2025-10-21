// Global state
let chart = null;
let teamCounter = 0;
let otherSportCounter = 0;

// Team ID mappings for compact URL encoding
const TEAM_IDS = {
    // NFL
    'Arizona Cardinals': 'ARI', 'Atlanta Falcons': 'ATL', 'Baltimore Ravens': 'BAL',
    'Buffalo Bills': 'BUF', 'Carolina Panthers': 'CAR', 'Chicago Bears': 'CHI',
    'Cincinnati Bengals': 'CIN', 'Cleveland Browns': 'CLE', 'Dallas Cowboys': 'DAL',
    'Denver Broncos': 'DEN', 'Detroit Lions': 'DET', 'Green Bay Packers': 'GB',
    'Houston Texans': 'HOU', 'Indianapolis Colts': 'IND', 'Jacksonville Jaguars': 'JAX',
    'Kansas City Chiefs': 'KC', 'Las Vegas Raiders': 'LV', 'Los Angeles Chargers': 'LAC',
    'Los Angeles Rams': 'LAR', 'Miami Dolphins': 'MIA', 'Minnesota Vikings': 'MIN',
    'New England Patriots': 'NE', 'New Orleans Saints': 'NO', 'New York Giants': 'NYG',
    'New York Jets': 'NYJ', 'Philadelphia Eagles': 'PHI', 'Pittsburgh Steelers': 'PIT',
    'San Francisco 49ers': 'SF', 'Seattle Seahawks': 'SEA', 'Tampa Bay Buccaneers': 'TB',
    'Tennessee Titans': 'TEN', 'Washington Commanders': 'WAS',

    // NBA
    'Atlanta Hawks': 'HAWK', 'Boston Celtics': 'BOS', 'Brooklyn Nets': 'BKN',
    'Charlotte Hornets': 'CHA', 'Chicago Bulls': 'BULL', 'Cleveland Cavaliers': 'CAVS',
    'Dallas Mavericks': 'MAVS', 'Denver Nuggets': 'NUGS', 'Detroit Pistons': 'PIST',
    'Golden State Warriors': 'GSW', 'Houston Rockets': 'ROCK', 'Indiana Pacers': 'PACE',
    'LA Clippers': 'CLIP', 'Los Angeles Lakers': 'LAL', 'Memphis Grizzlies': 'MEM',
    'Miami Heat': 'HEAT', 'Milwaukee Bucks': 'MIL', 'Minnesota Timberwolves': 'TIMB',
    'New Orleans Pelicans': 'PELS', 'New York Knicks': 'NICK', 'Oklahoma City Thunder': 'OKC',
    'Orlando Magic': 'ORL', 'Philadelphia 76ers': '76ER', 'Phoenix Suns': 'PHX',
    'Portland Trail Blazers': 'POR', 'Sacramento Kings': 'SAC', 'San Antonio Spurs': 'SAS',
    'Toronto Raptors': 'TOR', 'Utah Jazz': 'UTAH', 'Washington Wizards': 'WIZ',

    // NHL
    'Anaheim Ducks': 'ANA', 'Arizona Coyotes': 'AZ', 'Boston Bruins': 'BRU',
    'Buffalo Sabres': 'SABR', 'Calgary Flames': 'CGY', 'Carolina Hurricanes': 'CANE',
    'Chicago Blackhawks': 'HAWK', 'Colorado Avalanche': 'COL', 'Columbus Blue Jackets': 'CBJ',
    'Dallas Stars': 'STAR', 'Detroit Red Wings': 'DRW', 'Edmonton Oilers': 'EDM',
    'Florida Panthers': 'FLA', 'Los Angeles Kings': 'LAK', 'Minnesota Wild': 'WILD',
    'Montreal Canadiens': 'MTL', 'Nashville Predators': 'NSH', 'New Jersey Devils': 'NJD',
    'New York Islanders': 'NYI', 'New York Rangers': 'NYR', 'Ottawa Senators': 'OTT',
    'Philadelphia Flyers': 'FLY', 'Pittsburgh Penguins': 'PENG', 'San Jose Sharks': 'SJS',
    'Seattle Kraken': 'KRAK', 'St. Louis Blues': 'STL', 'Tampa Bay Lightning': 'TBL',
    'Toronto Maple Leafs': 'LEAF', 'Vancouver Canucks': 'VAN', 'Vegas Golden Knights': 'VGK',
    'Washington Capitals': 'CAPS', 'Winnipeg Jets': 'JETS',

    // MLB
    'Arizona Diamondbacks': 'DBACK', 'Atlanta Braves': 'BRAV', 'Baltimore Orioles': 'ORI',
    'Boston Red Sox': 'RSX', 'Chicago Cubs': 'CUBS', 'Chicago White Sox': 'WSX',
    'Cincinnati Reds': 'REDS', 'Cleveland Guardians': 'GUAR', 'Colorado Rockies': 'ROCK',
    'Detroit Tigers': 'TIG', 'Houston Astros': 'ASTR', 'Kansas City Royals': 'ROY',
    'Los Angeles Angels': 'ANG', 'Los Angeles Dodgers': 'DOD', 'Miami Marlins': 'MAR',
    'Milwaukee Brewers': 'BREW', 'Minnesota Twins': 'TWIN', 'New York Mets': 'METS',
    'New York Yankees': 'YANK', 'Oakland Athletics': 'OAK', 'Philadelphia Phillies': 'PHIL',
    'Pittsburgh Pirates': 'PIR', 'San Diego Padres': 'PAD', 'San Francisco Giants': 'GIAN',
    'Seattle Mariners': 'MAR', 'St. Louis Cardinals': 'CARD', 'Tampa Bay Rays': 'RAYS',
    'Texas Rangers': 'RANG', 'Toronto Blue Jays': 'JAYS', 'Washington Nationals': 'NAT'
};

// Reverse mapping for decoding
const ID_TO_TEAM = Object.fromEntries(
    Object.entries(TEAM_IDS).map(([name, id]) => [id, name])
);

// Color palette for the chart
const colorPalette = [
    '#1E3A8A', // Navy Blue
    '#DC2626', // Red
    '#059669', // Green
    '#D97706', // Orange
    '#7C3AED', // Purple
    '#DB2777', // Pink
    '#0891B2', // Cyan
    '#65A30D', // Lime
    '#EA580C', // Deep Orange
    '#8B5CF6', // Violet
];

// Helper function to generate color shades
function generateColorShades(baseColor, count) {
    // Parse hex color
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const shades = [];

    if (count === 1) {
        shades.push(baseColor);
        return shades;
    }

    // Create more distinct variations using both lighter and darker shades
    for (let i = 0; i < count; i++) {
        let newR, newG, newB, alpha;

        if (i === 0) {
            // First shade is brighter (team segment)
            const brightFactor = 1.3;
            newR = Math.min(255, Math.round(r * brightFactor));
            newG = Math.min(255, Math.round(g * brightFactor));
            newB = Math.min(255, Math.round(b * brightFactor));
            alpha = 1;
        } else if (i === count - 1) {
            // Last shade is the base color (parent/other segment)
            newR = r;
            newG = g;
            newB = b;
            alpha = 0.75;
        } else {
            // Middle shades: create distinct variations
            const step = i / (count - 1);
            const factor = 1.3 - (step * 0.5); // Range from 1.3 to 0.8
            newR = Math.min(255, Math.round(r * factor));
            newG = Math.min(255, Math.round(g * factor));
            newB = Math.min(255, Math.round(b * factor));
            alpha = 1;
        }

        shades.push(`rgba(${newR}, ${newG}, ${newB}, ${alpha})`);
    }
    return shades;
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadFromURL();
    updateTotal();
});

function setupEventListeners() {
    // Add team buttons
    document.querySelectorAll('.add-team-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const sport = this.dataset.sport;
            addTeamInput(sport);
        });
    });

    // Add sport button
    document.getElementById('add-sport-btn').addEventListener('click', addOtherSport);

    // Generate chart button
    document.getElementById('generate-btn').addEventListener('click', generateChart);

    // Reset button
    document.getElementById('reset-btn').addEventListener('click', resetAll);

    // Share button
    document.getElementById('share-btn').addEventListener('click', shareChart);

    // Download button
    document.getElementById('download-btn').addEventListener('click', downloadChartImage);

    // Listen to all sport percentage changes
    document.querySelectorAll('.sport-percent').forEach(input => {
        input.addEventListener('input', updateTotal);
    });
}

function addTeamInput(sport) {
    teamCounter++;
    const teamInputsContainer = document.getElementById(`${sport}-teams`);
    const addButton = teamInputsContainer.querySelector('.add-team-btn');

    const teamDiv = document.createElement('div');
    teamDiv.className = 'team-input-group';
    teamDiv.dataset.teamId = teamCounter;

    // Determine the datalist to use for autocomplete
    const datalistId = `${sport}-teams-list`;
    const datalistAttr = document.getElementById(datalistId) ? `list="${datalistId}"` : '';

    teamDiv.innerHTML = `
        <input type="text" class="team-name" placeholder="Team name" data-sport="${sport}" ${datalistAttr} autocomplete="off">
        <input type="number" class="team-percent" min="0" max="100" value="0" placeholder="0" data-sport="${sport}">
        <span>%</span>
        <button class="remove-team-btn" data-team-id="${teamCounter}">×</button>
    `;

    teamInputsContainer.insertBefore(teamDiv, addButton);

    // Add event listener to remove button
    teamDiv.querySelector('.remove-team-btn').addEventListener('click', function() {
        teamDiv.remove();
        validateTeamPercentages(sport);
    });

    // Add event listener to team percentage input
    teamDiv.querySelector('.team-percent').addEventListener('input', function() {
        validateTeamPercentages(sport);
    });
}

function addOtherSport() {
    otherSportCounter++;
    const container = document.getElementById('other-sports-container');

    const sportDiv = document.createElement('div');
    sportDiv.className = 'sport-group other-sport';
    sportDiv.dataset.sportId = otherSportCounter;
    const sportId = `other-sport-${otherSportCounter}`;

    sportDiv.innerHTML = `
        <div class="sport-header">
            <input type="text" class="other-sport-name" placeholder="Sport name" data-sport-id="${sportId}">
            <input type="number" class="sport-percent other-sport-percent" id="${sportId}-percent" min="0" max="100" value="0" placeholder="0" data-sport-id="${sportId}">
            <span>%</span>
            <button class="remove-sport-btn" data-sport-id="${otherSportCounter}">×</button>
        </div>
        <div class="team-inputs" id="${sportId}-teams">
            <button class="add-team-btn" data-sport="${sportId}">+ Add Team</button>
        </div>
    `;

    container.appendChild(sportDiv);

    // Add event listeners
    sportDiv.querySelector('.remove-sport-btn').addEventListener('click', function() {
        sportDiv.remove();
        updateTotal();
    });

    sportDiv.querySelector('.add-team-btn').addEventListener('click', function() {
        addTeamInput(sportId);
    });

    sportDiv.querySelector('.other-sport-percent').addEventListener('input', updateTotal);
}

function validateTeamPercentages(sport) {
    const teamInputs = document.querySelectorAll(`input.team-percent[data-sport="${sport}"]`);
    let total = 0;

    teamInputs.forEach(input => {
        total += parseFloat(input.value) || 0;
    });

    const sportHeader = document.getElementById(`${sport}-percent`) ||
                       document.querySelector(`input[data-sport-id="${sport}"]`);

    if (sportHeader) {
        const parentGroup = sportHeader.closest('.sport-group');
        const warning = parentGroup.querySelector('.team-warning') || createWarning(parentGroup);

        if (total > 100) {
            warning.textContent = `Team percentages total ${total}% (max 100%)`;
            warning.style.display = 'block';
        } else {
            warning.style.display = 'none';
        }
    }
}

function createWarning(parentGroup) {
    const warning = document.createElement('div');
    warning.className = 'warning team-warning';
    parentGroup.querySelector('.team-inputs').appendChild(warning);
    return warning;
}

function updateTotal() {
    let total = 0;

    // Major sports
    document.querySelectorAll('.sport-percent').forEach(input => {
        total += parseFloat(input.value) || 0;
    });

    document.getElementById('total-percent').textContent = total.toFixed(1);

    const warning = document.getElementById('total-warning');
    if (total > 100) {
        warning.textContent = '(exceeds 100%)';
        warning.style.display = 'inline';
    } else if (total < 100 && total > 0) {
        warning.textContent = `(${(100 - total).toFixed(1)}% remaining)`;
        warning.style.display = 'inline';
        warning.style.color = '#059669';
    } else {
        warning.style.display = 'none';
    }
}

function generateChart() {
    const chartData = collectChartData();

    if (chartData.labels.length === 0) {
        alert('Please add some sports and teams with percentages greater than 0');
        return;
    }

    renderChart(chartData);
}

function collectChartData() {
    const labels = [];
    const data = [];
    const colors = [];
    const offsets = [];
    const emojis = [];
    let colorIndex = 0;

    // Process major sports
    const majorSports = ['football', 'basketball', 'hockey', 'baseball'];
    const sportEmojis = {
        'football': '🏈',
        'basketball': '🏀',
        'hockey': '🏒',
        'baseball': '⚾'
    };

    majorSports.forEach(sport => {
        const sportPercent = parseFloat(document.getElementById(`${sport}-percent`).value) || 0;

        if (sportPercent > 0) {
            const teams = collectTeamsForSport(sport);
            const baseColor = colorPalette[colorIndex % colorPalette.length];
            const sportName = sport.charAt(0).toUpperCase() + sport.slice(1);

            if (teams.length > 0) {
                // Calculate total team percentage
                let totalTeamPercent = 0;
                teams.forEach(team => {
                    totalTeamPercent += team.percent;
                });

                // Generate color shades for teams
                const teamCount = totalTeamPercent < 100 ? teams.length + 1 : teams.length;
                const shades = generateColorShades(baseColor, teamCount);
                let shadeIndex = 0;

                // Add teams with their share of the sport percentage
                teams.forEach(team => {
                    const teamShare = (sportPercent * team.percent) / 100;
                    if (teamShare > 0) {
                        labels.push(`${sportEmojis[sport]} ${team.name}`);
                        data.push(teamShare);
                        colors.push(shades[shadeIndex]);
                        emojis.push(sportEmojis[sport]);
                        // Team segments are exploded more
                        offsets.push(20);
                        shadeIndex++;
                    }
                });

                // Add "Other [Sport]" segment if teams don't total 100%
                if (totalTeamPercent < 100) {
                    const otherShare = (sportPercent * (100 - totalTeamPercent)) / 100;
                    labels.push(`${sportEmojis[sport]} Other ${sportName}`);
                    data.push(otherShare);
                    colors.push(shades[shadeIndex]);
                    emojis.push(sportEmojis[sport]);
                    // Parent sport segment has less offset
                    offsets.push(5);
                }
            } else {
                // No teams specified, show sport as a whole
                labels.push(`${sportEmojis[sport]} ${sportName}`);
                data.push(sportPercent);
                colors.push(baseColor);
                emojis.push(sportEmojis[sport]);
                offsets.push(5);
            }

            colorIndex++;
        }
    });

    // Process other sports
    const otherSports = document.querySelectorAll('.other-sport');
    otherSports.forEach(sportDiv => {
        const sportNameInput = sportDiv.querySelector('.other-sport-name');
        const sportPercentInput = sportDiv.querySelector('.other-sport-percent');
        const sportName = sportNameInput.value.trim();
        const sportPercent = parseFloat(sportPercentInput.value) || 0;
        const sportId = sportPercentInput.dataset.sportId;

        if (sportPercent > 0 && sportName) {
            const teams = collectTeamsForSport(sportId);
            const baseColor = colorPalette[colorIndex % colorPalette.length];

            if (teams.length > 0) {
                // Calculate total team percentage
                let totalTeamPercent = 0;
                teams.forEach(team => {
                    totalTeamPercent += team.percent;
                });

                // Generate color shades for teams
                const teamCount = totalTeamPercent < 100 ? teams.length + 1 : teams.length;
                const shades = generateColorShades(baseColor, teamCount);
                let shadeIndex = 0;

                teams.forEach(team => {
                    const teamShare = (sportPercent * team.percent) / 100;
                    if (teamShare > 0) {
                        labels.push(`${sportName}: ${team.name}`);
                        data.push(teamShare);
                        colors.push(shades[shadeIndex]);
                        emojis.push(null); // No emoji for custom sports
                        offsets.push(20);
                        shadeIndex++;
                    }
                });

                // Add "Other [Sport]" segment if teams don't total 100%
                if (totalTeamPercent < 100) {
                    const otherShare = (sportPercent * (100 - totalTeamPercent)) / 100;
                    labels.push(`Other ${sportName}`);
                    data.push(otherShare);
                    colors.push(shades[shadeIndex]);
                    emojis.push(null);
                    offsets.push(5);
                }
            } else {
                labels.push(sportName);
                data.push(sportPercent);
                colors.push(baseColor);
                emojis.push(null); // No emoji for custom sports
                offsets.push(5);
            }

            colorIndex++;
        }
    });

    return { labels, data, colors, offsets, emojis };
}

function collectTeamsForSport(sport) {
    const teams = [];
    const teamInputs = document.querySelectorAll(`input.team-name[data-sport="${sport}"]`);

    teamInputs.forEach(nameInput => {
        const teamName = nameInput.value.trim();
        const percentInput = nameInput.nextElementSibling;
        const teamPercent = parseFloat(percentInput.value) || 0;

        if (teamName && teamPercent > 0) {
            teams.push({ name: teamName, percent: teamPercent });
        }
    });

    return teams;
}

function renderChart(chartData) {
    const ctx = document.getElementById('fandomChart').getContext('2d');

    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }

    // Create emoji overlay plugin
    const emojiPlugin = {
        id: 'emojiOverlay',
        afterDatasetsDraw(chart) {
            const { ctx, chartArea } = chart;
            const meta = chart.getDatasetMeta(0);
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;

            ctx.save();
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            meta.data.forEach((arc, index) => {
                const emoji = chartData.emojis[index];
                if (!emoji) return;

                // Calculate the angle for this segment
                const startAngle = arc.startAngle;
                const endAngle = arc.endAngle;
                const midAngle = (startAngle + endAngle) / 2;

                // Calculate radius (70% of outer radius to position emoji in middle of segment)
                const radius = (arc.outerRadius + arc.innerRadius) / 2;

                // Adjust for offset (exploded segments)
                const offset = chartData.offsets[index] || 0;
                const adjustedRadius = radius + (offset * 0.3);

                // Convert to cartesian coordinates
                const x = centerX + adjustedRadius * Math.cos(midAngle);
                const y = centerY + adjustedRadius * Math.sin(midAngle);

                // Draw emoji
                ctx.fillText(emoji, x, y);
            });

            ctx.restore();
        }
    };

    // Create new chart
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
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
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                title: {
                    display: true,
                    text: 'Your Sports Fandom Breakdown',
                    font: {
                        size: 20,
                        weight: 'bold'
                    },
                    padding: 20
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value.toFixed(1)}%`;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    bodyFont: {
                        size: 14
                    }
                },
                emojiOverlay: {}
            }
        },
        plugins: [emojiPlugin]
    });

    // Show chart action buttons
    document.getElementById('chart-actions').style.display = 'flex';
}

function resetAll() {
    // Reset all sport percentages
    document.querySelectorAll('.sport-percent').forEach(input => {
        input.value = 0;
    });

    // Remove all team inputs
    document.querySelectorAll('.team-input-group').forEach(group => {
        group.remove();
    });

    // Remove all other sports
    document.getElementById('other-sports-container').innerHTML = '';

    // Reset counters
    teamCounter = 0;
    otherSportCounter = 0;

    // Update total
    updateTotal();

    // Destroy chart
    if (chart) {
        chart.destroy();
        chart = null;
    }
}

// ===== URL Sharing Functions =====

function encodeStateToURL() {
    const parts = [];

    // Sport code mapping
    const sportCodes = { 'football': 'f', 'basketball': 'b', 'hockey': 'h', 'baseball': 'a' };

    // Encode major sports
    const majorSports = ['football', 'basketball', 'hockey', 'baseball'];
    majorSports.forEach(sport => {
        const percent = parseFloat(document.getElementById(`${sport}-percent`).value) || 0;
        if (percent > 0) {
            const teams = collectTeamsForSport(sport);
            const sportCode = sportCodes[sport];
            let sportPart = `${sportCode}:${percent}`;

            if (teams.length > 0) {
                const teamParts = teams.map(team => {
                    const teamId = TEAM_IDS[team.name] || `~${encodeURIComponent(team.name)}`;
                    return `${teamId}:${team.percent}`;
                });
                sportPart += ':' + teamParts.join(',');
            }
            parts.push(sportPart);
        }
    });

    // Encode other sports (custom sports)
    const otherSports = document.querySelectorAll('.other-sport');
    otherSports.forEach(sportDiv => {
        const sportNameInput = sportDiv.querySelector('.other-sport-name');
        const sportPercentInput = sportDiv.querySelector('.other-sport-percent');
        const sportName = sportNameInput.value.trim();
        const sportPercent = parseFloat(sportPercentInput.value) || 0;
        const sportId = sportPercentInput.dataset.sportId;

        if (sportPercent > 0 && sportName) {
            const teams = collectTeamsForSport(sportId);
            let sportPart = `c:${encodeURIComponent(sportName)}:${sportPercent}`;

            if (teams.length > 0) {
                const teamParts = teams.map(team => {
                    const teamId = TEAM_IDS[team.name] || `~${encodeURIComponent(team.name)}`;
                    return `${teamId}:${team.percent}`;
                });
                sportPart += ':' + teamParts.join(',');
            }
            parts.push(sportPart);
        }
    });

    const encoded = parts.join('|');
    return `${window.location.origin}${window.location.pathname}?d=${encoded}`;
}

function loadFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const compactData = urlParams.get('d');
    const legacyData = urlParams.get('data');

    // Try new compact format first
    if (compactData) {
        try {
            decodeCompactFormat(compactData);
            setTimeout(() => generateChart(), 100);
            return;
        } catch (e) {
            console.error('Failed to load compact data:', e);
        }
    }

    // Fallback to legacy format for backwards compatibility
    if (legacyData) {
        try {
            decodeLegacyFormat(legacyData);
            setTimeout(() => generateChart(), 100);
        } catch (e) {
            console.error('Failed to load legacy data:', e);
        }
    }
}

function decodeCompactFormat(encoded) {
    const sportCodes = { 'f': 'football', 'b': 'basketball', 'h': 'hockey', 'a': 'baseball' };
    const parts = encoded.split('|');

    parts.forEach(part => {
        const segments = part.split(':');
        const sportCode = segments[0];

        if (sportCode === 'c') {
            // Custom sport: c:SportName:percent[:team:pct,team:pct...]
            const sportName = decodeURIComponent(segments[1]);
            const sportPercent = parseFloat(segments[2]);

            addOtherSport();
            const otherSports = document.querySelectorAll('.other-sport');
            const lastSport = otherSports[otherSports.length - 1];
            lastSport.querySelector('.other-sport-name').value = sportName;
            lastSport.querySelector('.other-sport-percent').value = sportPercent;

            const sportId = lastSport.querySelector('.other-sport-percent').dataset.sportId;

            // Decode teams if present
            if (segments.length > 3) {
                const teamsStr = segments.slice(3).join(':');
                decodeTeams(teamsStr, sportId);
            }
        } else if (sportCodes[sportCode]) {
            // Major sport: f:percent[:team:pct,team:pct...]
            const sport = sportCodes[sportCode];
            const sportPercent = parseFloat(segments[1]);

            document.getElementById(`${sport}-percent`).value = sportPercent;

            // Decode teams if present
            if (segments.length > 2) {
                const teamsStr = segments.slice(2).join(':');
                decodeTeams(teamsStr, sport);
            }
        }
    });
}

function decodeTeams(teamsStr, sport) {
    const teamPairs = teamsStr.split(',');
    teamPairs.forEach(pair => {
        const [teamId, percent] = pair.split(':');
        let teamName;

        if (teamId.startsWith('~')) {
            // Custom team name
            teamName = decodeURIComponent(teamId.substring(1));
        } else {
            // Known team ID
            teamName = ID_TO_TEAM[teamId] || teamId;
        }

        addTeamInput(sport);
        const teamInputs = document.querySelectorAll(`input.team-name[data-sport="${sport}"]`);
        const lastTeamInput = teamInputs[teamInputs.length - 1];
        lastTeamInput.value = teamName;
        lastTeamInput.nextElementSibling.value = parseFloat(percent);
    });
}

function decodeLegacyFormat(encodedData) {
    const jsonString = decodeURIComponent(atob(encodedData));
    const state = JSON.parse(jsonString);

    // Load major sports
    const majorSports = ['football', 'basketball', 'hockey', 'baseball'];
    majorSports.forEach(sport => {
        if (state.sports[sport]) {
            const sportData = state.sports[sport];
            document.getElementById(`${sport}-percent`).value = sportData.percent;

            // Add teams
            sportData.teams.forEach(team => {
                addTeamInput(sport);
                const teamInputs = document.querySelectorAll(`input.team-name[data-sport="${sport}"]`);
                const lastTeamInput = teamInputs[teamInputs.length - 1];
                lastTeamInput.value = team.name;
                lastTeamInput.nextElementSibling.value = team.percent;
            });
        }
    });

    // Load other sports
    if (state.other && state.other.length > 0) {
        state.other.forEach(sportData => {
            addOtherSport();
            const otherSports = document.querySelectorAll('.other-sport');
            const lastSport = otherSports[otherSports.length - 1];

            lastSport.querySelector('.other-sport-name').value = sportData.name;
            lastSport.querySelector('.other-sport-percent').value = sportData.percent;

            const sportId = lastSport.querySelector('.other-sport-percent').dataset.sportId;

            // Add teams
            sportData.teams.forEach(team => {
                addTeamInput(sportId);
                const teamInputs = document.querySelectorAll(`input.team-name[data-sport="${sportId}"]`);
                const lastTeamInput = teamInputs[teamInputs.length - 1];
                lastTeamInput.value = team.name;
                lastTeamInput.nextElementSibling.value = team.percent;
            });
        });
    }
}

function shareChart() {
    const url = encodeStateToURL();

    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!');
        }).catch(() => {
            promptCopyURL(url);
        });
    } else {
        promptCopyURL(url);
    }
}

function promptCopyURL(url) {
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    try {
        document.execCommand('copy');
        showNotification('Link copied to clipboard!');
    } catch (e) {
        prompt('Copy this link to share:', url);
    }
    document.body.removeChild(input);
}

function downloadChartImage() {
    if (!chart) {
        alert('Please generate a chart first!');
        return;
    }

    const url = chart.toBase64Image();
    const link = document.createElement('a');
    link.download = 'sports-fandom-chart.png';
    link.href = url;
    link.click();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}
