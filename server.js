import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import Database from 'better-sqlite3';
import { scrapeAll } from './scrapers/manager.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const db = new Database(process.env.DATABASE_URL || './joblink.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialiser la base de données
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      description TEXT,
      salary TEXT,
      job_type TEXT,
      source TEXT NOT NULL,
      source_url TEXT UNIQUE NOT NULL,
      posted_date TEXT,
      scraped_date TEXT DEFAULT CURRENT_TIMESTAMP,
      skills TEXT,
      category TEXT,
      experience TEXT,
      education TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      job_id TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS job_alerts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      keyword TEXT NOT NULL,
      location TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scraping_logs (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      jobs_scraped INTEGER DEFAULT 0,
      jobs_added INTEGER DEFAULT 0,
      jobs_updated INTEGER DEFAULT 0,
      status TEXT,
      error_message TEXT,
      scraped_at TEXT DEFAULT CURRENT_TIMESTAMP,
      duration INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs(source);
    CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
    CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
    CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
  `);
}

// Fonction pour sauvegarder les offres dans la base de données
function saveJobs(jobs, source) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO jobs (
      id, title, company, location, description, salary, job_type,
      source, source_url, posted_date, scraped_date, category, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let added = 0;
  let updated = 0;

  for (const job of jobs) {
    try {
      const existing = db.prepare('SELECT id FROM jobs WHERE source_url = ?').get(job.sourceUrl);
      
      if (existing) {
        updated++;
      } else {
        added++;
      }

      stmt.run(
        job.id,
        job.title,
        job.company,
        job.location,
        job.description,
        job.salary,
        job.jobType,
        job.source,
        job.sourceUrl,
        job.postedDate,
        job.scrapedDate,
        job.category,
        job.isActive
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde d\'une offre:', error.message);
    }
  }

  return { added, updated };
}

// Fonction pour exécuter le scraping
async function runScrapers() {
  console.log('🔄 Démarrage du scraping...');
  const startTime = Date.now();

  try {
    // Utiliser le gestionnaire de scrapers
    const result = await scrapeAll();
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur lors du scraping');
    }
    
    const allJobs = result.jobs;
    const duration = Date.now() - startTime;

    // Grouper par source et sauvegarder
    const sources = ['tanitjob', 'keejob', 'linkedin'];
    const stats = {};
    
    for (const source of sources) {
      const sourceJobs = allJobs.filter(job => job.source === source);
      if (sourceJobs.length > 0) {
        const sourceStats = saveJobs(sourceJobs, source);
        stats[source] = sourceStats;
        
        // Enregistrer le log
        const logStmt = db.prepare(`
          INSERT INTO scraping_logs (id, source, jobs_scraped, jobs_added, jobs_updated, status, duration)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        logStmt.run(
          uuidv4(),
          source,
          sourceJobs.length,
          sourceStats.added,
          sourceStats.updated,
          'success',
          duration
        );
      }
    }

    console.log(`✅ Scraping terminé en ${duration}ms`);
    console.log(`Total: ${allJobs.length} offres`);

    return { success: true, stats, totalJobs: allJobs.length };
  } catch (error) {
    console.error('❌ Erreur lors du scraping:', error.message);
    return { success: false, error: error.message };
  }
}

// Routes API

// Route racine - Page d'accueil HTML
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JobLink - Portail d'emploi IA</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { background: white; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); padding: 40px; max-width: 600px; text-align: center; }
    h1 { color: #333; margin-bottom: 10px; font-size: 2.5em; }
    .subtitle { color: #666; margin-bottom: 30px; font-size: 1.1em; }
    .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 30px 0; }
    .stat { background: #f5f5f5; padding: 20px; border-radius: 8px; }
    .stat-number { font-size: 2em; font-weight: bold; color: #667eea; }
    .stat-label { color: #666; margin-top: 10px; }
    .endpoints { text-align: left; background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 30px 0; }
    .endpoints h3 { color: #333; margin-bottom: 15px; }
    .endpoint { margin: 10px 0; padding: 10px; background: white; border-left: 3px solid #667eea; border-radius: 4px; }
    .endpoint-url { color: #667eea; font-weight: bold; font-size: 0.9em; word-break: break-all; }
    .endpoint-desc { color: #666; font-size: 0.85em; margin-top: 5px; }
    .button { display: inline-block; margin: 10px 5px; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; transition: background 0.3s; }
    .button:hover { background: #764ba2; }
    .footer { color: #999; margin-top: 30px; font-size: 0.9em; }
    a { color: #667eea; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 JobLink</h1>
    <p class="subtitle">Portail d'emploi IA - Tunisie</p>
    
    <div class="stats">
      <div class="stat">
        <div class="stat-number">21,120+</div>
        <div class="stat-label">Offres d'emploi</div>
      </div>
      <div class="stat">
        <div class="stat-number">3</div>
        <div class="stat-label">Sources</div>
      </div>
      <div class="stat">
        <div class="stat-number">Horaire</div>
        <div class="stat-label">Mise à jour</div>
      </div>
    </div>
    
    <div class="endpoints">
      <h3>📡 Endpoints API</h3>
      
      <div class="endpoint">
        <div class="endpoint-url">GET /api/health</div>
        <div class="endpoint-desc">Vérifier l'état du serveur</div>
      </div>
      
      <div class="endpoint">
        <div class="endpoint-url">GET /api/stats</div>
        <div class="endpoint-desc">Statistiques complètes</div>
      </div>
      
      <div class="endpoint">
        <div class="endpoint-url">GET /api/jobs?limit=10</div>
        <div class="endpoint-desc">Récupérer les offres d'emploi</div>
      </div>
      
      <div class="endpoint">
        <div class="endpoint-url">GET /api/jobs?search=Developer</div>
        <div class="endpoint-desc">Rechercher par mot-clé</div>
      </div>
      
      <div class="endpoint">
        <div class="endpoint-url">GET /api/jobs?source=linkedin</div>
        <div class="endpoint-desc">Filtrer par source</div>
      </div>
      
      <div class="endpoint">
        <div class="endpoint-url">POST /api/scrape</div>
        <div class="endpoint-desc">Déclencher le scraping</div>
      </div>
    </div>
    
    <div>
      <a href="/api/health" class="button">Tester l'API</a>
      <a href="/api/stats" class="button">Voir les stats</a>
      <a href="/api/jobs?limit=10" class="button">Offres d'emploi</a>
    </div>
    
    <div class="footer">
      <p>Créé avec ❤️ pour les chercheurs d'emploi en Tunisie</p>
      <p><a href="https://github.com/firasboukettaya/Joblink.tn">GitHub</a> | <a href="https://github.com/firasboukettaya/Joblink.tn">Documentation</a></p>
    </div>
  </div>
</body>
</html>`);
});

// Récupérer toutes les offres avec pagination et filtres
app.get('/api/jobs', (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', location = '', source = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM jobs WHERE is_active = 1';
    const params = [];

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR company LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    if (source) {
      query += ' AND source = ?';
      params.push(source);
    }

    const totalStmt = db.prepare(query.replace('SELECT *', 'SELECT COUNT(*) as count'));
    const countResult = totalStmt.all(...params);
    const count = countResult.length > 0 ? countResult[0].count : 0;

    query += ' ORDER BY scraped_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = db.prepare(query);
    const jobs = stmt.all(...params);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Récupérer une offre spécifique
app.get('/api/jobs/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM jobs WHERE id = ?');
    const job = stmt.get(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Offre non trouvée' });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Statistiques du scraping
app.get('/api/stats', (req, res) => {
  try {
    const totalJobs = db.prepare('SELECT COUNT(*) as count FROM jobs WHERE is_active = 1').get();
    const jobsBySource = db.prepare('SELECT source, COUNT(*) as count FROM jobs WHERE is_active = 1 GROUP BY source').all();
    const jobsByLocation = db.prepare('SELECT location, COUNT(*) as count FROM jobs WHERE is_active = 1 GROUP BY location ORDER BY count DESC LIMIT 10').all();
    const recentLogs = db.prepare('SELECT * FROM scraping_logs ORDER BY scraped_at DESC LIMIT 10').all();

    res.json({
      success: true,
      data: {
        totalJobs: totalJobs.count,
        jobsBySource,
        jobsByLocation,
        recentLogs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Déclencher le scraping manuellement
app.post('/api/scrape', async (req, res) => {
  try {
    const result = await runScrapers();
    res.json({ success: result.success, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Santé du serveur
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Serveur en ligne' });
});

// Initialiser et démarrer
initDatabase();

// Planifier le scraping quotidien (toutes les heures)
cron.schedule('0 * * * *', async () => {
  console.log('⏰ Scraping planifié déclenché');
  await runScrapers();
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur JobLink démarré sur le port ${PORT}`);
  console.log('📅 Scraping planifié: toutes les heures');
  
  // Exécuter le scraping au démarrage
  runScrapers();
});
