# JobLink - Portail d'Emploi IA

Un portail d'offres d'emploi généré automatiquement par IA, scrapant quotidiennement des sites tunisiens comme **Tanitjob** et **Keejob**.

## 🚀 Fonctionnalités

- **Scraping automatique** : Récupération des offres d'emploi depuis plusieurs sources
- **Rafraîchissement horaire** : Mise à jour automatique de la base de données
- **Recherche avancée** : Filtrage par titre, localisation, source
- **Interface moderne** : Design responsive et intuitif
- **API REST** : Endpoints pour accéder aux données
- **Base de données SQLite** : Stockage persistant des offres

## 📋 Prérequis

- Node.js 18+
- pnpm (ou npm/yarn)

## 🛠️ Installation

```bash
# Cloner le projet
git clone <repository-url>
cd joblink

# Installer les dépendances
pnpm install

# Créer le fichier .env
cp .env.example .env
```

## ⚙️ Configuration

Éditez le fichier `.env` :

```env
DATABASE_URL=./joblink.db
PORT=3000
NODE_ENV=development
SCRAPER_INTERVAL=3600  # En secondes (1 heure)
```

## 🚀 Démarrage

### Mode développement

```bash
# Démarrer le serveur backend
pnpm start

# Dans un autre terminal, démarrer le frontend (Vite)
cd client
pnpm install
pnpm dev
```

### Mode production

```bash
# Build du frontend
cd client
pnpm build

# Démarrer le serveur
pnpm start
```

## 📚 API Endpoints

### Récupérer les offres d'emploi

```http
GET /api/jobs?page=1&limit=20&search=&location=&source=
```

**Paramètres** :
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'offres par page (défaut: 20)
- `search` : Recherche par titre/description/entreprise
- `location` : Filtrer par localisation
- `source` : Filtrer par source (tanitjob, keejob)

**Réponse** :
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

### Récupérer une offre spécifique

```http
GET /api/jobs/:id
```

### Récupérer les statistiques

```http
GET /api/stats
```

### Déclencher le scraping manuel

```http
POST /api/scrape
```

### Vérifier la santé du serveur

```http
GET /api/health
```

## 🗄️ Structure de la base de données

### Table `jobs`

| Colonne | Type | Description |
|---------|------|-------------|
| id | TEXT | Identifiant unique |
| title | TEXT | Titre du poste |
| company | TEXT | Nom de l'entreprise |
| location | TEXT | Localisation |
| description | TEXT | Description de l'offre |
| salary | TEXT | Salaire proposé |
| job_type | TEXT | Type de contrat (CDI, CDD, etc.) |
| source | TEXT | Source du scraping |
| source_url | TEXT | URL de l'offre originale |
| posted_date | TEXT | Date de publication |
| scraped_date | TEXT | Date du scraping |
| is_active | INTEGER | Statut actif/inactif |

### Table `scraping_logs`

Enregistre les logs de chaque scraping effectué.

## 🔄 Scraping automatique

Le scraping est planifié pour s'exécuter automatiquement **toutes les heures** via `node-cron`.

Pour déclencher manuellement :

```bash
curl -X POST http://localhost:3000/api/scrape
```

## 📁 Structure du projet

```
joblink/
├── server.js              # Serveur Express principal
├── .env                   # Variables d'environnement
├── package.json           # Dépendances
├── db/
│   └── schema.js          # Schéma de la base de données
├── scrapers/
│   ├── tanitjob.js        # Scraper Tanitjob
│   └── keejob.js          # Scraper Keejob
└── client/
    ├── src/
    │   ├── App.jsx        # Composant principal
    │   ├── index.css      # Styles globaux
    │   ├── components/    # Composants React
    │   └── main.jsx       # Point d'entrée
    └── vite.config.js     # Configuration Vite
```

## 🎨 Technologie utilisée

- **Backend** : Express.js, Node.js
- **Frontend** : React, Vite
- **Scraping** : Axios, Cheerio
- **Base de données** : SQLite3, Drizzle ORM
- **Scheduling** : node-cron
- **Styling** : CSS3

## 📝 Licence

MIT

## 👨‍💻 Auteur

Créé avec ❤️ pour les chercheurs d'emploi en Tunisie.

---

**Note** : Ce projet scrape les données publiques. Assurez-vous de respecter les conditions d'utilisation des sites sources.
