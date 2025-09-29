export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { input } = req.query;
  if (!input || input.length < 3) {
    return res.json({ predictions: [] });
  }

  if (!global.autocompleteCache) global.autocompleteCache = {};
  if (global.autocompleteCache[input]) {
    return res.json(global.autocompleteCache[input]);
  }

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
        "X-Goog-FieldMask":
          "suggestions.placePrediction.place.formattedAddress,suggestions.placePrediction.place.id"
      },
      body: JSON.stringify({ input })
    });

    const data = await response.json();

    const formatted = {
      predictions: (data.suggestions || []).map(s => ({
        description: s.placePrediction?.place?.formattedAddress || "",
        place_id: s.placePrediction?.place?.id || ""
      }))
    };

    global.autocompleteCache[input] = formatted;
    res.json(formatted);
  } catch (err) {
    console.error("Autocomplete error:", err);
    res.status(500).json({ error: "Failed to fetch autocomplete" });
  }
}

