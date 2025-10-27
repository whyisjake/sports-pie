export const config = {
  runtime: 'edge',
};

// Team ID mappings (same as in script.js)
const ID_TO_TEAM = {
  // NFL
  'ARI': 'Arizona Cardinals', 'ATL': 'Atlanta Falcons', 'BAL': 'Baltimore Ravens',
  'BUF': 'Buffalo Bills', 'CAR': 'Carolina Panthers', 'CHI': 'Chicago Bears',
  'CIN': 'Cincinnati Bengals', 'CLE': 'Cleveland Browns', 'DAL': 'Dallas Cowboys',
  'DEN': 'Denver Broncos', 'DET': 'Detroit Lions', 'GB': 'Green Bay Packers',
  'HOU': 'Houston Texans', 'IND': 'Indianapolis Colts', 'JAX': 'Jacksonville Jaguars',
  'KC': 'Kansas City Chiefs', 'LV': 'Las Vegas Raiders', 'LAC': 'Los Angeles Chargers',
  'LAR': 'Los Angeles Rams', 'MIA': 'Miami Dolphins', 'MIN': 'Minnesota Vikings',
  'NE': 'New England Patriots', 'NO': 'New Orleans Saints', 'NYG': 'New York Giants',
  'NYJ': 'New York Jets', 'PHI': 'Philadelphia Eagles', 'PIT': 'Pittsburgh Steelers',
  'SF': 'San Francisco 49ers', 'SEA': 'Seattle Seahawks', 'TB': 'Tampa Bay Buccaneers',
  'TEN': 'Tennessee Titans', 'WAS': 'Washington Commanders',
  // NBA
  'HAWK': 'Atlanta Hawks', 'BOS': 'Boston Celtics', 'BKN': 'Brooklyn Nets',
  'CHA': 'Charlotte Hornets', 'BULL': 'Chicago Bulls', 'CAVS': 'Cleveland Cavaliers',
  'MAVS': 'Dallas Mavericks', 'NUGS': 'Denver Nuggets', 'PIST': 'Detroit Pistons',
  'GSW': 'Golden State Warriors', 'ROCK': 'Houston Rockets', 'PACE': 'Indiana Pacers',
  'CLIP': 'LA Clippers', 'LAL': 'Los Angeles Lakers', 'MEM': 'Memphis Grizzlies',
  'HEAT': 'Miami Heat', 'MIL': 'Milwaukee Bucks', 'TIMB': 'Minnesota Timberwolves',
  'PELS': 'New Orleans Pelicans', 'NICK': 'New York Knicks', 'OKC': 'Oklahoma City Thunder',
  'ORL': 'Orlando Magic', '76ER': 'Philadelphia 76ers', 'PHX': 'Phoenix Suns',
  'POR': 'Portland Trail Blazers', 'SAC': 'Sacramento Kings', 'SAS': 'San Antonio Spurs',
  'TOR': 'Toronto Raptors', 'UTAH': 'Utah Jazz', 'WIZ': 'Washington Wizards',
  // NHL
  'ANA': 'Anaheim Ducks', 'AZ': 'Arizona Coyotes', 'BRU': 'Boston Bruins',
  'SABR': 'Buffalo Sabres', 'CGY': 'Calgary Flames', 'CANE': 'Carolina Hurricanes',
  'COL': 'Colorado Avalanche', 'CBJ': 'Columbus Blue Jackets',
  'STAR': 'Dallas Stars', 'DRW': 'Detroit Red Wings', 'EDM': 'Edmonton Oilers',
  'FLA': 'Florida Panthers', 'LAK': 'Los Angeles Kings', 'WILD': 'Minnesota Wild',
  'MTL': 'Montreal Canadiens', 'NSH': 'Nashville Predators', 'NJD': 'New Jersey Devils',
  'NYI': 'New York Islanders', 'NYR': 'New York Rangers', 'OTT': 'Ottawa Senators',
  'FLY': 'Philadelphia Flyers', 'PENG': 'Pittsburgh Penguins', 'SJS': 'San Jose Sharks',
  'KRAK': 'Seattle Kraken', 'STL': 'St. Louis Blues', 'TBL': 'Tampa Bay Lightning',
  'LEAF': 'Toronto Maple Leafs', 'VAN': 'Vancouver Canucks', 'VGK': 'Vegas Golden Knights',
  'CAPS': 'Washington Capitals', 'JETS': 'Winnipeg Jets',
  // MLB
  'DBACK': 'Arizona Diamondbacks', 'BRAV': 'Atlanta Braves', 'ORI': 'Baltimore Orioles',
  'RSX': 'Boston Red Sox', 'CUBS': 'Chicago Cubs', 'WSX': 'Chicago White Sox',
  'REDS': 'Cincinnati Reds', 'GUAR': 'Cleveland Guardians', 'ROCK': 'Colorado Rockies',
  'TIG': 'Detroit Tigers', 'ASTR': 'Houston Astros', 'ROY': 'Kansas City Royals',
  'ANG': 'Los Angeles Angels', 'DOD': 'Los Angeles Dodgers', 'MAR': 'Miami Marlins',
  'BREW': 'Milwaukee Brewers', 'TWIN': 'Minnesota Twins', 'METS': 'New York Mets',
  'YANK': 'New York Yankees', 'OAK': 'Oakland Athletics', 'PHIL': 'Philadelphia Phillies',
  'PIR': 'Pittsburgh Pirates', 'PAD': 'San Diego Padres', 'GIAN': 'San Francisco Giants',
  'CARD': 'St. Louis Cardinals', 'RAYS': 'Tampa Bay Rays',
  'RANG': 'Texas Rangers', 'JAYS': 'Toronto Blue Jays', 'NAT': 'Washington Nationals'
};

const sportCodes = { 'f': 'Football', 'b': 'Basketball', 'h': 'Hockey', 'a': 'Baseball' };
const sportEmojis = { 'f': '🏈', 'b': '🏀', 'h': '🏒', 'a': '⚾' };

function parseChartData(dataParam) {
  if (!dataParam) return null;

  const sports = [];
  const parts = dataParam.split('|');

  parts.forEach(part => {
    const segments = part.split(':');
    const sportCode = segments[0];

    if (sportCode === 'c') {
      // Custom sport
      const sportName = decodeURIComponent(segments[1]);
      const sportPercent = parseFloat(segments[2]);
      sports.push({ name: sportName, percent: sportPercent, emoji: null });
    } else if (sportCodes[sportCode]) {
      // Major sport
      const sportName = sportCodes[sportCode];
      const sportPercent = parseFloat(segments[1]);
      const emoji = sportEmojis[sportCode];

      // Parse teams if present
      const teams = [];
      if (segments.length > 2) {
        const teamsStr = segments.slice(2).join(':');
        const teamPairs = teamsStr.split(',');
        teamPairs.forEach(pair => {
          const [teamId, percent] = pair.split(':');
          let teamName = teamId.startsWith('~')
            ? decodeURIComponent(teamId.substring(1))
            : (ID_TO_TEAM[teamId] || teamId);
          teams.push({ name: teamName, percent: parseFloat(percent) });
        });
      }

      sports.push({ name: sportName, percent: sportPercent, emoji, teams });
    }
  });

  return sports;
}

export default async function handler(req) {
  try {
    const { ImageResponse } = await import('@vercel/og');
    const { searchParams } = new URL(req.url);
    const dataParam = searchParams.get('d');

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
      );
    }

    const sports = parseChartData(dataParam);

    // Create a summary for display
    const topSports = sports
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 4);

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
    );
  } catch (e) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
