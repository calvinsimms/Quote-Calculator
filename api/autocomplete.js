import { NextRequest, NextResponse } from 'next/server';

export default async function handler(req, res) {
  const { input } = req.query;
  if (!input) return res.status(400).json({ predictions: [] });

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  // New Places API (New) endpoint
  const url = 'https://places.googleapis.com/v1/places:autocomplete';

  try {
    const apiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
      },
      body: JSON.stringify({
        input,
        languageCode: 'en',
        types: ['address'],
        // You can add locationBias or sessionToken if needed
      }),
    });
    const data = await apiRes.json();
    // The new API returns 'suggestions' array
    // Map to the old format for frontend compatibility
    const predictions = (data.suggestions || []).map(s => ({
      description: s.formattedSuggestion,
      place_id: s.placePrediction.placeId,
      // Add more fields if needed
    }));
    res.status(200).json({ predictions });
  } catch (err) {
    console.error('Places API (New) error:', err);
    res.status(500).json({ predictions: [] });
  }
}

