import './Stats.css'

export default function Stats({ stats }) {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <p className="stat-label">Total des offres</p>
          <p className="stat-value">{stats.totalJobs}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🌐</div>
        <div className="stat-content">
          <p className="stat-label">Sources</p>
          <p className="stat-value">{stats.jobsBySource?.length || 0}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">📍</div>
        <div className="stat-content">
          <p className="stat-label">Villes principales</p>
          <p className="stat-value">{stats.jobsByLocation?.length || 0}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🔄</div>
        <div className="stat-content">
          <p className="stat-label">Dernière mise à jour</p>
          <p className="stat-value">
            {stats.recentLogs?.[0] ? 'À l\'instant' : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}
