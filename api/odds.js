export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { sport } = req.query;
  const API_KEY = "b4ae8c510b00a8c669c20073c01e92e5";

  try {
    const markets = "h2h,totals,spreads,btts";
    const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${API_KEY}&regions=eu&markets=${markets}&oddsFormat=decimal`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: "Failed" });
  }
}
