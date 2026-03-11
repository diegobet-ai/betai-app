export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  
  const { sport } = req.query;
  const API_KEY = "cf8b575dd9664b4917486edb7c515b39";
  
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59);
  
  try {
    const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal&commenceTimeFrom=${now.toISOString()}&commenceTimeTo=${end.toISOString()}`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch odds" });
  }
}
