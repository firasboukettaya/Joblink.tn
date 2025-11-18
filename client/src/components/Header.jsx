import './Header.css'

export default function Header({ onManualScrape }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <h1 className="logo">
            💼 JobLink
          </h1>
          <p className="tagline">Portail d'emploi généré par IA</p>
        </div>
        
        <button 
          onClick={onManualScrape}
          className="scrape-btn"
          title="Déclencher le scraping manuel"
        >
          🔄 Rafraîchir les offres
        </button>
      </div>
    </header>
  )
}
