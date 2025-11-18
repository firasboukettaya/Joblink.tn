# JobLink - Documentation Complète

## 📋 Vue d'ensemble

**JobLink** est un portail d'offres d'emploi moderne et entièrement automatisé, généré par IA et scrapant quotidiennement les sites d'emploi tunisiens majeurs. Le projet combine un backend robuste, une base de données SQLite, et un frontend React élégant.

## 🎯 Fonctionnalités principales

### Scraping automatique
- **Tanitjob** : 20+ offres par scraping
- **Keejob** : 20+ offres par scraping
- **LinkedIn Tunisie** : 50+ offres par scraping
- **Total** : 309+ offres actuellement en base de données
- **Rafraîchissement** : Toutes les heures (configurable)

### API REST complète
- Récupération des offres avec pagination
- Filtrage par source, localisation, mot-clé
- Statistiques en temps réel
- Scraping manuel à la demande
- Endpoint de santé du serveur

### Interface utilisateur
- Design moderne avec gradients et animations
- Recherche avancée avec filtres
- Affichage responsive (mobile, tablet, desktop)
- Pagination intuitive
- Statistiques en direct

## 🏗️ Architecture

```
joblink/
├── server.js                 # Serveur Express principal
├── .env                      # Configuration
├── package.json              # Dépendances
├── db/
│   └── schema.js            # Schéma SQLite
├── scrapers/
│   ├── manager.js           # Gestionnaire unifié
│   ├── tanitjob-v2.js       # Scraper Tanitjob
│   ├── keejob-v2.js         # Scraper Keejob
│   ├── linkedin.js          # Scraper LinkedIn
│   └── demo.js              # Données de démonstration
└── client/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        └── components/
            ├── Header.jsx
            ├── SearchBar.jsx
            ├── JobList.jsx
            ├── JobCard.jsx
            ├── Sidebar.jsx
            └── Stats.jsx
```

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+
- pnpm (ou npm/yarn)

### Installation
```bash
cd joblink
pnpm install
```

### Configuration
Créez un fichier `.env` :
```env
DATABASE_URL=./joblink.db
PORT=3000
NODE_ENV=development
SCRAPER_INTERVAL=3600
```

### Démarrage
```bash
# Backend
pnpm start

# Frontend (dans un autre terminal)
cd client
pnpm dev
```

## 📚 API Endpoints

### Récupérer les offres
```http
GET /api/jobs?page=1&limit=20&search=&location=&source=
```

**Paramètres** :
- `page` : Numéro de page (défaut: 1)
- `limit` : Offres par page (défaut: 20)
- `search` : Recherche par titre/description/entreprise
- `location` : Filtrer par localisation
- `source` : Filtrer par source (tanitjob, keejob, linkedin)

**Réponse** :
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Développeur Full Stack",
      "company": "TechStart",
      "location": "Tunis",
      "description": "...",
      "salary": "2500 - 3500 TND",
      "jobType": "CDI",
      "source": "tanitjob",
      "sourceUrl": "https://...",
      "postedDate": "2025-11-16T...",
      "scrapedDate": "2025-11-16T..."
    }
  ],
  "pagination": {
    "total": 309,
    "page": 1,
    "limit": 20,
    "pages": 16
  }
}
```

### Récupérer une offre
```http
GET /api/jobs/:id
```

### Statistiques
```http
GET /api/stats
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "totalJobs": 309,
    "jobsBySource": [
      {"source": "tanitjob", "count": 20},
      {"source": "keejob", "count": 20},
      {"source": "linkedin", "count": 49}
    ],
    "jobsByLocation": [
      {"location": "Tunis", "count": 24},
      {"location": "Sfax", "count": 8}
    ],
    "recentLogs": [...]
  }
}
```

### Déclencher le scraping
```http
POST /api/scrape
```

### Santé du serveur
```http
GET /api/health
```

## 🗄️ Base de données

### Table `jobs`
| Colonne | Type | Description |
|---------|------|-------------|
| id | TEXT | UUID unique |
| title | TEXT | Titre du poste |
| company | TEXT | Nom de l'entreprise |
| location | TEXT | Localisation |
| description | TEXT | Description |
| salary | TEXT | Salaire proposé |
| job_type | TEXT | Type de contrat |
| source | TEXT | Source du scraping |
| source_url | TEXT | URL originale |
| posted_date | TEXT | Date de publication |
| scraped_date | TEXT | Date du scraping |
| is_active | INTEGER | Statut actif |

### Table `scraping_logs`
Enregistre chaque scraping avec :
- Nombre d'offres scrapées
- Nombre d'offres ajoutées
- Nombre d'offres mises à jour
- Statut (success/failed)
- Durée d'exécution

## 🔄 Scraping automatique

Le scraping s'exécute automatiquement **toutes les heures** via `node-cron`.

### Système de fallback
1. **Essai 1** : API officielle
2. **Essai 2** : Scraping HTML
3. **Essai 3** : Données de démonstration

### Retry logic
- Jusqu'à 2 tentatives par source
- Délai de 1 seconde entre les tentatives
- Gestion des erreurs Cloudflare (403)

## 🎨 Frontend

### Composants React
- **Header** : Logo et bouton de rafraîchissement
- **SearchBar** : Recherche et filtres
- **Stats** : Statistiques en direct
- **Sidebar** : Filtres par source
- **JobList** : Liste des offres
- **JobCard** : Détails d'une offre

### Design
- Gradients modernes (bleu → gris)
- Animations fluides (slideIn, fadeIn, hover effects)
- Responsive design (mobile-first)
- Accessibilité optimisée

## 📊 Statistiques actuelles

- **Total offres** : 309
- **Sources** : 3 (Tanitjob, Keejob, LinkedIn)
- **Villes principales** : 10
- **Dernière mise à jour** : Automatique toutes les heures

## 🔐 Sécurité

- CORS configuré pour les requêtes cross-origin
- Validation des paramètres API
- Gestion des erreurs robuste
- Logs détaillés des scraping

## 📈 Performance

- Scraping parallèle (3 sources simultanément)
- Pagination pour limiter les transferts de données
- Index SQLite sur les colonnes fréquemment interrogées
- Compression des réponses

## 🚀 Déploiement

### Heroku
```bash
git push heroku main
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
CMD ["pnpm", "start"]
```

### VPS
```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cloner et démarrer
git clone <repo>
cd joblink
pnpm install
pnpm start
```

## 🐛 Troubleshooting

### Erreur Cloudflare (403)
Le système utilise automatiquement les données de démonstration.

### Base de données verrouillée
Redémarrez le serveur : `pnpm start`

### Pas d'offres affichées
Vérifiez que le scraping s'est exécuté : `GET /api/stats`

## 📧 Contact

Pour toute question ou suggestion : **Tn.joblink@gmail.com**

## 📝 Licence

MIT

---

**JobLink v1.0** - Créé avec ❤️ pour les chercheurs d'emploi en Tunisie.
