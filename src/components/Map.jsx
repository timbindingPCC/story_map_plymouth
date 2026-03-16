import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import mapboxgl from 'mapbox-gl'

const PLYMOUTH_CENTER = [-4.143, 50.376]
const PLYMOUTH_ZOOM = 12

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const Map = forwardRef(function Map({ addMode, onMapReady, onPointAdded, onFeatureClick }, ref) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const addModeRef = useRef(addMode)
  const featureCollectionRef = useRef({ type: 'FeatureCollection', features: [] })

  // Keep addModeRef in sync so the click handler always reads the latest value
  useEffect(() => {
    addModeRef.current = addMode
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = addMode ? 'crosshair' : ''
    }
  }, [addMode])

  useImperativeHandle(ref, () => ({
    setFeatures(featureCollection) {
      featureCollectionRef.current = featureCollection || { type: 'FeatureCollection', features: [] }
      mapRef.current?.getSource('features')?.setData(featureCollectionRef.current)
    },
    addSavedFeature(newFeature) {
      featureCollectionRef.current = {
        ...featureCollectionRef.current,
        features: [...featureCollectionRef.current.features, newFeature],
      }
      mapRef.current?.getSource('features')?.setData(featureCollectionRef.current)
    },
  }))

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: PLYMOUTH_CENTER,
      zoom: PLYMOUTH_ZOOM,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.on('load', () => {
      map.addSource('features', {
        type: 'geojson',
        data: featureCollectionRef.current,
      })

      map.addLayer({
        id: 'features-circle',
        type: 'circle',
        source: 'features',
        paint: {
          'circle-color': '#ef4444',
          'circle-radius': 9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        },
      })

      // Pointer cursor on hover over saved points
      map.on('mouseenter', 'features-circle', () => {
        if (!addModeRef.current) map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'features-circle', () => {
        map.getCanvas().style.cursor = addModeRef.current ? 'crosshair' : ''
      })

      // Single unified click handler
      map.on('click', (e) => {
        const hits = map.queryRenderedFeatures(e.point, { layers: ['features-circle'] })
        if (hits.length > 0) {
          // Clicked an existing saved point → show its info
          onFeatureClick({ properties: hits[0].properties, lngLat: e.lngLat })
          return
        }
        // Otherwise, if in add mode, place a new point
        if (addModeRef.current) {
          onPointAdded(e.lngLat)
        }
      })

      onMapReady(map)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, []) // intentionally empty — stable callbacks via refs

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
})

export default Map
