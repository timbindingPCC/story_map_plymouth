import { useState } from 'react'

export default function FeatureForm({ onSave, onCancel, saving }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title, description })
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Add details</h2>
        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            className="field-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short label for this location"
            required
            autoFocus
          />

          <label className="field-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="field-input field-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any additional notes…"
            rows={4}
          />

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || !title.trim()}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
