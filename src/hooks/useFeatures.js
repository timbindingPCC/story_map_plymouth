import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useFeatures() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadFeatures = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: rpcError } = await supabase.rpc('get_features_geojson')
      if (rpcError) throw rpcError
      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const saveFeature = useCallback(async (geojsonFeature, { title, description }) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: insertError } = await supabase
        .from('map_features')
        .insert({
          title: title.trim(),
          description: description?.trim() || null,
          geom: geojsonFeature.geometry,
          feature_type: geojsonFeature.geometry.type === 'Point' ? 'point' : 'polygon',
        })
        .select()
        .single()

      if (insertError) throw insertError
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, loadFeatures, saveFeature }
}
