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
// La route / est servie par express.static('public') qui charge index.html

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
