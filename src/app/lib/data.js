// Team ID mappings for compact URL encoding
export const TEAM_IDS = {
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
}

// Reverse mapping for decoding
export const ID_TO_TEAM = Object.fromEntries(
  Object.entries(TEAM_IDS).map(([name, id]) => [id, name])
)

// Color palette for the chart
export const colorPalette = [
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
]

export const sportEmojis = {
  football: '🏈',
  basketball: '🏀',
  hockey: '🏒',
  baseball: '⚾'
}

export const TEAM_LISTS = {
  football: Object.keys(TEAM_IDS).filter(name => ['Cardinals', 'Falcons', 'Ravens', 'Bills', 'Panthers', 'Bears', 'Bengals', 'Browns', 'Cowboys', 'Broncos', 'Lions', 'Packers', 'Texans', 'Colts', 'Jaguars', 'Chiefs', 'Raiders', 'Chargers', 'Rams', 'Dolphins', 'Vikings', 'Patriots', 'Saints', 'Giants', 'Jets', 'Eagles', 'Steelers', '49ers', 'Seahawks', 'Buccaneers', 'Titans', 'Commanders'].some(team => name.includes(team)) && !name.includes('Diamondbacks')),
  basketball: Object.keys(TEAM_IDS).filter(name => ['Hawks', 'Celtics', 'Nets', 'Hornets', 'Bulls', 'Cavaliers', 'Mavericks', 'Nuggets', 'Pistons', 'Warriors', 'Rockets', 'Pacers', 'Clippers', 'Lakers', 'Grizzlies', 'Heat', 'Bucks', 'Timberwolves', 'Pelicans', 'Knicks', 'Thunder', 'Magic', '76ers', 'Suns', 'Trail Blazers', 'Kings', 'Spurs', 'Raptors', 'Jazz', 'Wizards'].some(team => name.includes(team))),
  hockey: Object.keys(TEAM_IDS).filter(name => ['Ducks', 'Coyotes', 'Bruins', 'Sabres', 'Flames', 'Hurricanes', 'Blackhawks', 'Avalanche', 'Blue Jackets', 'Stars', 'Red Wings', 'Oilers', 'Panthers', 'Wild', 'Canadiens', 'Predators', 'Devils', 'Islanders', 'Rangers', 'Senators', 'Flyers', 'Penguins', 'Sharks', 'Kraken', 'Blues', 'Lightning', 'Maple Leafs', 'Canucks', 'Golden Knights', 'Capitals', 'Jets'].some(team => name.includes(team)) && name.includes('Kings') === false),
  baseball: Object.keys(TEAM_IDS).filter(name => ['Diamondbacks', 'Braves', 'Orioles', 'Red Sox', 'Cubs', 'White Sox', 'Reds', 'Guardians', 'Rockies', 'Tigers', 'Astros', 'Royals', 'Angels', 'Dodgers', 'Marlins', 'Brewers', 'Twins', 'Mets', 'Yankees', 'Athletics', 'Phillies', 'Pirates', 'Padres', 'Giants', 'Mariners', 'Cardinals', 'Rays', 'Rangers', 'Blue Jays', 'Nationals'].some(team => name.includes(team)))
}
