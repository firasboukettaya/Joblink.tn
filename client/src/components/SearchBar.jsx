import { useState } from 'react'
import './SearchBar.css'

export default function SearchBar({ onSearch }) {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({ search, location, source: '' })
  }

  const handleReset = () => {
    setSearch('')
    setLocation('')
    onSearch({ search: '', location: '', source: '' })
  }

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-inputs">
          <div className="input-group">
            <input
              type="text"
              placeholder="Titre du poste, compétences..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <span className="input-icon">🔍</span>
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Ville ou région..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="search-input"
            />
            <span className="input-icon">📍</span>
          </div>
        </div>

        <div className="search-actions">
          <button type="submit" className="btn-search">
            Rechercher
          </button>
          <button type="button" onClick={handleReset} className="btn-reset">
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  )
}
