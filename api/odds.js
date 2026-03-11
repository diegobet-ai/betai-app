export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { sport } = req.query;
  const API_KEY = "cf8b575dd9664b4917486edb7c515b39";

  try {
    // Nessun filtro data — prende tutte le prossime partite disponibili
    const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed" });
  }
}
