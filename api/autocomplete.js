async function handler(req, res) {
  const { input } = req.query;

  if (!input) return res.status(400).json({ error: "Missing input" });

  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
      `input=${encodeURIComponent(input)}` +
      `&types=address` +
      `&components=country:ca` + 
      `&key=${apiKey}`
    );

    const data = await response.json();

    const predictions = data.predictions.map(p => ({
      description: p.description,
      place_id: p.place_id
    }));

    res.status(200).json({ predictions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Autocomplete failed" });
  }
}

module.exports = handler;

