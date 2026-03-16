import { useRef, useState, useCallback } from 'react'
import Map from './components/Map'
import FeatureForm from './components/FeatureForm'
import FeaturePopup from './components/FeaturePopup'
import Sidebar from './components/Sidebar'
import { useFeatures } from './hooks/useFeatures'

export default function App() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [addMode, setAddMode] = useState(false)
  const [pendingFeature, setPendingFeature] = useState(null)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { loading: saving, loadFeatures, saveFeature } = useFeatures()

  // Load existing features once the map signals it is ready
  const handleMapReady = useCallback(async (mapInstance) => {
    mapInstanceRef.current = mapInstance
    const featureCollection = await loadFeatures()
    if (featureCollection) {
      mapRef.current?.setFeatures(featureCollection)
    }
  }, [loadFeatures])

  // User clicked the map in add mode — create a pending point feature
  const handlePointAdded = useCallback((lngLat) => {
    setAddMode(false)
    setSelectedFeature(null)
    setPendingFeature({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lngLat.lng, lngLat.lat] },
    })
  }, [])

  // Form submitted — save to Supabase and update the map
  const handleFormSave = useCallback(async ({ title, description }) => {
    setSaveError(null)
    const { data, error } = await saveFeature(pendingFeature, { title, description })
    if (error) {
      setSaveError(error)
      return
    }
    mapRef.current?.addSavedFeature({
      type: 'Feature',
      id: data.id,
      geometry: pendingFeature.geometry,
      properties: {
        id: data.id,
        title: data.title,
        description: data.description,
        feature_type: data.feature_type,
        created_at: data.created_at,
      },
    })
    setPendingFeature(null)
  }, [pendingFeature, saveFeature])

  // Form cancelled — discard pending point
  const handleFormCancel = useCallback(() => {
    setPendingFeature(null)
    setSaveError(null)
  }, [])

  // Click on an existing saved point
  const handleFeatureClick = useCallback((feature) => {
    if (pendingFeature) return
    setSelectedFeature(feature)
  }, [pendingFeature])

  const toggleAddMode = useCallback(() => {
    setAddMode((v) => !v)
    setSelectedFeature(null)
  }, [])

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <div className="map-wrapper">
        <Map
          ref={mapRef}
          addMode={addMode}
          onMapReady={handleMapReady}
          onPointAdded={handlePointAdded}
          onFeatureClick={handleFeatureClick}
        />

        {/* Floating add-point button */}
        <button
          className={`add-point-btn${addMode ? ' add-point-btn--active' : ''}`}
          onClick={toggleAddMode}
          title={addMode ? 'Cancel — click to exit add mode' : 'Click to start adding a point'}
        >
          {addMode ? '✕  Cancel' : '+ Add point'}
        </button>

        {selectedFeature && mapInstanceRef.current && (
          <FeaturePopup
            map={mapInstanceRef.current}
            selectedFeature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}

        {pendingFeature && (
          <FeatureForm
            onSave={handleFormSave}
            onCancel={handleFormCancel}
            saving={saving}
          />
        )}

        {saveError && (
          <div className="error-banner">
            Failed to save: {saveError}
            <button onClick={() => setSaveError(null)} className="error-close">✕</button>
          </div>
        )}
      </div>
    </div>
  )
}
