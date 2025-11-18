import { useState } from 'react'
import './JobCard.css'

export default function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getSourceBadgeColor = (source) => {
    const colors = {
      tanitjob: 'badge-primary',
      keejob: 'badge-success',
      linkedin: 'badge-warning'
    }
    return colors[source] || 'badge-primary'
  }

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-info">
          <h3 className="job-title">{job.title}</h3>
          <p className="job-company">{job.company}</p>
        </div>
        <div className="job-badges">
          <span className={`badge ${getSourceBadgeColor(job.source)}`}>
            {job.source.charAt(0).toUpperCase() + job.source.slice(1)}
          </span>
          {job.job_type && (
            <span className="badge badge-primary">{job.job_type}</span>
          )}
        </div>
      </div>

      <div className="job-meta">
        {job.location && (
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span>{job.location}</span>
          </div>
        )}
        {job.salary && job.salary !== 'Non spécifié' && (
          <div className="meta-item">
            <span className="meta-icon">💰</span>
            <span>{job.salary}</span>
          </div>
        )}
        <div className="meta-item">
          <span className="meta-icon">📅</span>
          <span>{formatDate(job.posted_date)}</span>
        </div>
      </div>

      {job.description && (
        <div className="job-description">
          <p className={expanded ? 'expanded' : 'collapsed'}>
            {job.description}
          </p>
          {job.description.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="expand-btn"
            >
              {expanded ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </div>
      )}

      <div className="job-footer">
        <a
          href={job.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-apply"
        >
          Voir l'offre complète →
        </a>
        <button className="btn-favorite" title="Ajouter aux favoris">
          ❤️
        </button>
      </div>
    </div>
  )
}
