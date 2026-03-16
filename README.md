# Story Map Plymouth

An interactive map for placing and sharing stories, landmarks, and points of interest across Plymouth. Click the map to drop a pin, add a title and description, and it's saved for everyone to see.

## Features

- Click **+ Add point** to drop a marker anywhere on the map
- Fill in a title and description for each point
- Points are saved to a shared database — visible to all visitors
- Click any existing marker to view its details
- Collapsible sidebar with instructions

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Map | Mapbox GL JS v3 (Standard style) |
| Database | Supabase (PostgreSQL + PostGIS) |
| Hosting | Netlify |

## Getting started

### 1. Clone and install

```bash
git clone <repo-url>
cd story_map_plymouth
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Open the **SQL Editor** in your project dashboard
3. Paste in the contents of `supabase_setup.sql` and run it — this creates the `map_features` table, PostGIS extension, spatial index, and public read/insert policies

### 3. Get a Mapbox token

1. Sign up or log in at [account.mapbox.com](https://account.mapbox.com)
2. Copy your **Default public token** (starts with `pk.`)

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_MAPBOX_TOKEN=pk.your-mapbox-public-token-here
```

Your Supabase URL and anon key are under **Project Settings → API** in the Supabase dashboard.

### 5. Run locally

```bash
npm run dev
```

## Environment variables

| Variable | Description | Where to find it |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | Supabase dashboard → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase dashboard → Project Settings → API |
| `VITE_MAPBOX_TOKEN` | Mapbox public access token | [account.mapbox.com](https://account.mapbox.com) |

## Deploying to Netlify

1. Push the repo to GitHub
2. Connect the repo in the [Netlify dashboard](https://app.netlify.com)
3. Under **Site configuration → Environment variables**, add the three variables above
4. Netlify will build and deploy automatically on every push (build command: `npm run build`, publish directory: `dist`)
