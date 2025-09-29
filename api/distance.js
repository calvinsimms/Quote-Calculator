export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { origin, destination } = req.query;
  if (!origin || !destination) {
    return res.status(400).json({ error: "Missing origin or destination" });
  }

  const key = `${origin}-${destination}`;
  if (!global.distanceCache) global.distanceCache = {};
  if (global.distanceCache[key]) {
    return res.json(global.distanceCache[key]);
  }

  try {
    const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
      },
      body: JSON.stringify({
        origin: { address: origin },
        destination: { address: destination },
        travelMode: "DRIVE"
      })
    });

    const data = await response.json();
    const route = data.routes?.[0];

    // Convert duration from seconds to minutes (rounded)
    const durationMinutes = route?.duration?.seconds ? Math.round(route.duration.seconds / 60) : 0;
    const formatted = {
      rows: [
        {
          elements: [
            {
              status: route ? "OK" : "NOT_FOUND",
              duration: { value: durationMinutes },
              distance: { value: route?.distanceMeters || 0 }
            }
          ]
        }
      ]
    };

    global.distanceCache[key] = formatted;
    res.json(formatted);
  } catch (err) {
    console.error("Distance error:", err);
    res.status(500).json({ error: "Failed to fetch distance" });
  }
}


