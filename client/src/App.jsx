import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import JobList from './components/JobList'
import Sidebar from './components/Sidebar'
import Stats from './components/Stats'

function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    source: ''
  })
  const [stats, setStats] = useState(null)
  const [totalPages, setTotalPages] = useState(1)

  // Récupérer les offres d'emploi
  const fetchJobs = async (pageNum = 1, filterParams = filters) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: 20,
        search: filterParams.search,
        location: filterParams.location,
        source: filterParams.source
      })

      const response = await fetch(`/api/jobs?${params}`)
      const data = await response.json()

      if (data.success) {
        setJobs(data.data)
        setTotalPages(data.pagination.pages)
        setPage(pageNum)
      } else {
        setError('Erreur lors de la récupération des offres')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Récupérer les statistiques
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des stats:', err)
    }
  }

  // Charger les données au démarrage
  useEffect(() => {
    fetchJobs(1)
    fetchStats()
  }, [])

  // Gérer la recherche
  const handleSearch = (newFilters) => {
    setFilters(newFilters)
    fetchJobs(1, newFilters)
  }

  // Gérer la pagination
  const handlePageChange = (newPage) => {
    fetchJobs(newPage, filters)
  }

  // Déclencher le scraping manuel
  const handleManualScrape = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/scrape', { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        alert('Scraping déclenché avec succès!')
        fetchJobs(1, filters)
        fetchStats()
      }
    } catch (err) {
      alert('Erreur lors du scraping')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header onManualScrape={handleManualScrape} />
      
      <main className="main-content">
        <div className="container">
          {/* Section des statistiques */}
          {stats && <Stats stats={stats} />}

          {/* Barre de recherche */}
          <SearchBar onSearch={handleSearch} />

          {/* Contenu principal */}
          <div className="content-wrapper">
            {/* Sidebar */}
            <Sidebar onFilterChange={handleSearch} />

            {/* Liste des offres */}
            <div className="jobs-section">
              {error && <div className="error-message">{error}</div>}
              
              {loading ? (
                <div className="loading">
                  <div className="loader"></div>
                  <p>Chargement des offres...</p>
                </div>
              ) : jobs.length > 0 ? (
                <>
                  <div className="jobs-header">
                    <h2>{jobs.length} offres trouvées</h2>
                  </div>
                  <JobList jobs={jobs} />
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button 
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="pagination-btn"
                      >
                        ← Précédent
                      </button>
                      
                      <span className="pagination-info">
                        Page {page} sur {totalPages}
                      </span>
                      
                      <button 
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="pagination-btn"
                      >
                        Suivant →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-results">
                  <p>Aucune offre trouvée. Essayez de modifier vos filtres.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
