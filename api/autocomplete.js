export default async function handler(req, res) {
  const { input } = req.query;
  if (!input) return res.status(400).json({ predictions: [] });

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_API_KEY}&types=address`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Only send predictions to the frontend
    res.status(200).json({ predictions: data.predictions || [] });
  } catch (err) {
    console.error("Google Places API error:", err);
    res.status(500).json({ predictions: [] });
  }
}



