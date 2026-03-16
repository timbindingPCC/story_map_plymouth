import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'

export default function FeaturePopup({ map, selectedFeature, onClose }) {
  const popupRef = useRef(null)

  useEffect(() => {
    if (!map || !selectedFeature) return

    const { properties, lngLat } = selectedFeature
    const date = properties.created_at
      ? new Date(properties.created_at).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric',
        })
      : ''

    const html = `
      <div class="popup-content">
        <strong class="popup-title">${escapeHtml(properties.title)}</strong>
        ${properties.description ? `<p class="popup-description">${escapeHtml(properties.description)}</p>` : ''}
        <div class="popup-meta">
          <span class="popup-type">${properties.feature_type}</span>
          ${date ? `<span class="popup-date">${date}</span>` : ''}
        </div>
      </div>
    `

    const popup = new maplibregl.Popup({ closeButton: true, maxWidth: '280px' })
      .setLngLat(lngLat)
      .setHTML(html)
      .addTo(map)

    popup.on('close', onClose)
    popupRef.current = popup

    return () => {
      if (popupRef.current && !popupRef.current._removed) {
        popupRef.current.remove()
      }
    }
  }, [selectedFeature]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

function escapeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
