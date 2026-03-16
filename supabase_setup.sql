-- Run this in the Supabase SQL Editor to set up the database.

-- PostGIS is enabled by default on Supabase; this is a safety net.
CREATE EXTENSION IF NOT EXISTS postgis;

-- Main table for all map features (points and polygons)
CREATE TABLE IF NOT EXISTS map_features (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  description  text,
  geom         geography(Geometry, 4326) NOT NULL,
  feature_type text NOT NULL CHECK (feature_type IN ('point', 'polygon')),
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- Spatial index for efficient bounding-box queries
CREATE INDEX IF NOT EXISTS map_features_geom_idx
  ON map_features USING GIST (geom);

-- Auto-update the updated_at timestamp on row edits
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER map_features_updated_at
  BEFORE UPDATE ON map_features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security: open read + insert for anonymous users.
-- To restrict to authenticated users later, replace USING (true) with
-- USING (auth.uid() IS NOT NULL) and similarly for INSERT.
ALTER TABLE map_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
  ON map_features FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert"
  ON map_features FOR INSERT
  WITH CHECK (true);

-- RPC that returns all features as a GeoJSON FeatureCollection.
-- Called from the app as: supabase.rpc('get_features_geojson')
CREATE OR REPLACE FUNCTION get_features_geojson()
RETURNS json AS $$
  SELECT json_build_object(
    'type', 'FeatureCollection',
    'features', COALESCE(
      json_agg(
        json_build_object(
          'type', 'Feature',
          'id', id,
          'geometry', ST_AsGeoJSON(geom)::json,
          'properties', json_build_object(
            'id', id,
            'title', title,
            'description', description,
            'feature_type', feature_type,
            'created_at', created_at
          )
        )
      ),
      '[]'::json
    )
  )
  FROM map_features;
$$ LANGUAGE sql STABLE;
