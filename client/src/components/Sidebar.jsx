import { useState } from 'react'
import './Sidebar.css'

export default function Sidebar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    source: '',
    jobType: ''
  })

  const handleSourceChange = (source) => {
    const newFilters = { ...filters, source }
    setFilters(newFilters)
    onFilterChange({
      search: '',
      location: '',
      source: source
    })
  }

  const handleReset = () => {
    setFilters({ source: '', jobType: '' })
    onFilterChange({
      search: '',
      location: '',
      source: ''
    })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Filtres</h3>

        {/* Filtre par source */}
        <div className="filter-group">
          <h4 className="filter-title">Source</h4>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="radio"
                name="source"
                value=""
                checked={filters.source === ''}
                onChange={() => handleSourceChange('')}
              />
              <span>Toutes les sources</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="source"
                value="tanitjob"
                checked={filters.source === 'tanitjob'}
                onChange={() => handleSourceChange('tanitjob')}
              />
              <span>Tanitjob</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="source"
                value="keejob"
                checked={filters.source === 'keejob'}
                onChange={() => handleSourceChange('keejob')}
              />
              <span>Keejob</span>
            </label>
          </div>
        </div>

        {/* Bouton réinitialiser */}
        <button onClick={handleReset} className="btn-reset-sidebar">
          Réinitialiser les filtres
        </button>
      </div>

      {/* Section d'information */}
      <div className="sidebar-section info-section">
        <h3 className="sidebar-title">À propos</h3>
        <p className="info-text">
          JobLink scrape automatiquement les offres d'emploi depuis les sites tunisiens majeurs.
        </p>
        <p className="info-text">
          Les données sont rafraîchies toutes les heures.
        </p>
      </div>
    </aside>
  )
}
