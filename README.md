# Map App

A React web app for finding places on an interactive map, filtering venues by cuisine, price, and atmosphere, and organizing meetings. Built with Mapbox for maps and routing, and Supabase as the backend.

## Features

**Interactive map** powered by Mapbox GL
**Search venues** by name
**Filters** - narrow places down by cuisine, price range, and atmosphere
**Routing** - draw a route from your location to a selected venue
**Meetings** - create and browse meetings tied to a venue and date
Backend powered by Supabase (database + API)

## Tech Stack

- **React 18** + **Vite**
- **Mapbox GL JS** - maps and routing
- **Supabase** - database and API
- **React Router** - navigation

## Getting Started

### Prerequisites

You need API keys for:
- [Mapbox](https://www.mapbox.com/) - an access token
- [Supabase](https://supabase.com/) - a project URL and anon key

### Installation

```bash
# Clone the repository
git clone https://github.com/mordekay15/map-app.git
cd map-app/mmapp

# Install dependencies
npm install
```

### Configuration

Add your API keys before running the app:

- **Mapbox** in `src/components/Map.jsx`:
  ```js
  mapboxgl.accessToken = 'YOUR_MAPBOX_API_KEY'
  ```

- **Supabase** in `src/components/SupabaseClient.jsx`:
  ```js
  const supabaseUrl = 'YOUR_SUPABASE_URL'
  const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
  ```

### Running the app

```bash
npm run dev      # start the development server
npm run build    # build for production
npm run preview  # preview the production build
npm run lint     # run ESLint
```

The dev server runs at `http://localhost:5173` by default.

## Project Structure

```
mmapp/
├── src/
│   ├── components/
│   │   ├── Map.jsx              # Main map view with markers and routing
│   │   ├── SearchAndFilters.jsx # Venue search and filtering
│   │   ├── Meetings.jsx         # Meetings list
│   │   ├── Header.jsx           # App header
│   │   └── SupabaseClient.jsx   # Supabase client setup
│   ├── App.jsx                  # Routes
│   └── main.jsx                 # Entry point
└── package.json
```

## Routes

- `/` - the main map with search, filters, and routing
- `/meeting` - the list of matching meetings
