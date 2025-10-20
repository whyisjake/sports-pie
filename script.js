// Global state
let chart = null;
let teamCounter = 0;
let otherSportCounter = 0;

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
                    // Parent sport segment has less offset
                    offsets.push(5);
                }
            } else {
                // No teams specified, show sport as a whole
                labels.push(`${sportEmojis[sport]} ${sportName}`);
                data.push(sportPercent);
                colors.push(baseColor);
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
                    offsets.push(5);
                }
            } else {
                labels.push(sportName);
                data.push(sportPercent);
                colors.push(baseColor);
                offsets.push(5);
            }

            colorIndex++;
        }
    });

    return { labels, data, colors, offsets };
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
                }
            }
        }
    });
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
