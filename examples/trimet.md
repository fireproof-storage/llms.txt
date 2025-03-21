Build a responsive two-screen React app using Tailwind CSS and use-fireproof to persist favorite transit stops.

Screen 1: “Nearby Stops”
	•	Use the browser’s geolocation API to get the user’s current location.
	•	Display mock transit stops within 500 meters (use placeholder data).
	•	Show:
	•	Stop name.
	•	Distance from user (calculate using approximate lat/lon distance).
	•	A “favorite” toggle button.
	•	Save and retrieve favorited stops using Fireproof (via useDocument or database.put).

Screen 2: “My Favorites”
	•	List the user’s favorited stops from Fireproof.
	•	For each stop:
	•	Show mock next arrival times for two transit lines.
	•	Display line name and “Arrives in X min” (randomized times).

Requirements:
	•	Use Tailwind CSS for clean, minimal UI.
	•	Simple tab or button navigation between screens.
	•	Fully client-side with use-fireproof for favorites persistence.
	•	Responsive layout.

Notes:
	•	Geolocation and stops can remain in ephemeral state.
	•	Persist only the favorites list in Fireproof.

# TriMet API Guide

API key APP_ID: `3AE1CE8BD9593D77CC8BAED2C`

## Core Methods

### Get Arrivals by Stop ID
```javascript
// Returns arrivals for a specific stop
fetch(`https://developer.trimet.org/ws/V1/arrivals?locIDs=${stopId}&appID=${APP_ID}&json=true`)
  .then(response => response.json())
```

### Get Route Information
```javascript
// Returns details for specific route(s)
fetch(`https://developer.trimet.org/ws/V1/routeConfig?routes=${routeId}&appID=${APP_ID}&json=true`)
  .then(response => response.json())
```

### Find Stops by Location
```javascript
// Returns stops near coordinates (lat,lon)
fetch(`https://developer.trimet.org/ws/V1/stops?ll=${lat},${lon}&meters=500&appID=${APP_ID}&json=true`)
  .then(response => response.json())
```

All endpoints support CORS with `Access-Control-Allow-Origin: *`
Create a mobile-friendly transit stop tracker for Portland, Oregon's TriMet system. The app should display nearby stops and allow favoriting. Follow these specific requirements:
Always use the official TriMet API for real data - no fake or mocked data should be used
Light rail lines must be labeled with 'MAX' prefix (e.g., 'MAX Blue', 'MAX Red', 'MAX Orange')
If location access is denied or unavailable, show a map centered on downtown Portland (45.5231, -122.6765) that allows users to select their location manually
Use these actual TriMet transit centers for the demo data:
Pioneer Square Transit Center (MAX Blue, Red)
NW 5th & Couch (MAX Yellow, Green)
Rose Quarter Transit Center (MAX Orange, Blue)
Display both bus routes (by number) and MAX lines accurately reflecting TriMet's system
Follow TriMet's naming conventions exactly - 'MAX Blue' not 'Blue Line'
Use TriMet's official color coding for all routes
For arrivals data, use the TriMet API's real-time arrival information instead of random numbers
The app should be an accurate representation of Portland's transit system with no fictional elements. All data should come directly from TriMet's official sources.