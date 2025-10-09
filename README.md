# Quote Calculator

A web-based **Quote Calculator** for moving services that calculates estimated work time, 
travel distance, and total cost based on selected items, trailer size, crew size, and addresses. 
Includes live item selection, autocomplete for addresses (Canada only), and route calculation using Google APIs.

## Features

* Dynamic item selection with quantity input.
* Live search and autocomplete for items (loaded from a Google Sheet).
* Address autocomplete (Canada-only) using Google Places API.
* Route calculation (start → load → unload → return) using Google Routes API.
* Trailer and crew selection with customizable options.
* Elevator option affecting work time.
* Real-time calculation of:
  * Cubic feet of items
  * Number of trips
  * Trailer usage percentage
  * Work time and travel time
  * Total distance
  * Total time
  * Crew hourly rate and total quote
* Fully responsive, modern UI with gradients and shadows.

## Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js API routes (Vercel Serverless Functions)
* APIs:
  * Google Sheets API (for items data)
  * Google Places API (for autocomplete)
  * Google Routes API (for distance and duration)

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies

If using a Node.js framework like Next.js:

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root with your Google API key:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

Make sure this key has access to:

* Places API
* Routes API

### 4. Configure Google Sheet

* Ensure your Google Sheet is public or shared with view access.
* Update the `loadItemsData()` function in the frontend with your Sheet ID:

```javascript
const url = "https://docs.google.com/spreadsheets/d/<YOUR_SHEET_ID>/gviz/tq?tqx=out:json&sheet=Sheet1";
```

* Sheet should have at least two columns: `name` and `cubicFeet`.

### 5. Deploy on Vercel

* Push your repository to GitHub.
* Import the repository into [Vercel](https://vercel.com/).
* Set the `GOOGLE_API_KEY` in Vercel Environment Variables.
* Deploy.

## Usage

1. Open the app in your browser.
2. Search and add items from the item list.
3. Enter start, load, and unload addresses.
4. Click **Calculate** to calculate travel time and distance.
5. Select trailer type, crew size, and elevator option.

All totals, including work time, travel time, distance, and final quote, will update in real-time.

## File Structure

```
/public          # Static assets (optional)
pages/
  index.html     # Main HTML
  api/
    autocomplete.js  # Serverless API for Google Places Autocomplete
    distance.js      # Serverless API for Google Routes distance calculation
styles/         # CSS (optional if separated)
```
## Notes

* All route calculations are cached in memory on the serverless functions to reduce API calls.
* The app currently restricts autocomplete suggestions to Canada only.
* Elevator increases work time by 30%.
* Crew size affects both hourly rate and time per trip.

## License

MIT License
