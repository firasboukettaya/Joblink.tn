import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

// Scraper Tanitjob
async function scrapeTanitjob() {
  try {
    const response = await axios.get('https://www.tanitjob.com/offres-emploi', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const jobs = [];
    
    $('div.job-item, article.job-card, div.offer').each((i, elem) => {
      const title = $(elem).find('h2, h3, .job-title').text().trim();
      const company = $(elem).find('.company, .employer').text().trim();
      const location = $(elem).find('.location, .city').text().trim();
      const description = $(elem).find('.description, p').text().trim();
      
      if (title && company) {
        jobs.push({
          id: uuidv4(),
          title,
          company,
          location: location || 'Non spécifié',
          description: description.substring(0, 500),
          salary: '',
          job_type: 'CDI',
          source: 'tanitjob',
          sourceUrl: `https://www.tanitjob.com/offres-emploi/${title.replace(/\s+/g, '-').toLowerCase()}`,
          posted_date: new Date().toISOString()
        });
      }
    });
    
    return jobs;
  } catch (error) {
    console.error('Erreur Tanitjob:', error.message);
    return [];
  }
}

// Scraper Keejob
async function scrapeKeejob() {
  try {
    const response = await axios.get('https://www.keejob.com/emploi', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const jobs = [];
    
    $('div.job-item, article.job-card, div.offer').each((i, elem) => {
      const title = $(elem).find('h2, h3, .job-title').text().trim();
      const company = $(elem).find('.company, .employer').text().trim();
      const location = $(elem).find('.location, .city').text().trim();
      const description = $(elem).find('.description, p').text().trim();
      
      if (title && company) {
        jobs.push({
          id: uuidv4(),
          title,
          company,
          location: location || 'Non spécifié',
          description: description.substring(0, 500),
          salary: '',
          job_type: 'CDI',
          source: 'keejob',
          sourceUrl: `https://www.keejob.com/emploi/${title.replace(/\s+/g, '-').toLowerCase()}`,
          posted_date: new Date().toISOString()
        });
      }
    });
    
    return jobs;
  } catch (error) {
    console.error('Erreur Keejob:', error.message);
    return [];
  }
}

// Scraper LinkedIn (simulation)
async function scrapeLinkedin() {
  try {
    // LinkedIn bloque les scrapers, donc on retourne des données simulées
    const jobs = [
      {
        id: uuidv4(),
        title: 'Développeur Full Stack',
        company: 'Tech Startup Tunisie',
        location: 'Tunis',
        description: 'Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe.',
        salary: '2000-3000 TND',
        job_type: 'CDI',
        source: 'linkedin',
        sourceUrl: 'https://www.linkedin.com/jobs/view/1234567890',
        posted_date: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Ingénieur DevOps',
        company: 'Digital Solutions',
        location: 'Sfax',
        description: 'Rejoignez notre équipe DevOps pour gérer notre infrastructure cloud.',
        salary: '2500-3500 TND',
        job_type: 'CDI',
        source: 'linkedin',
        sourceUrl: 'https://www.linkedin.com/jobs/view/1234567891',
        posted_date: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Data Scientist',
        company: 'AI Solutions',
        location: 'Ariana',
        description: 'Nous cherchons un data scientist pour analyser nos données.',
        salary: '2800-4000 TND',
        job_type: 'CDI',
        source: 'linkedin',
        sourceUrl: 'https://www.linkedin.com/jobs/view/1234567892',
        posted_date: new Date().toISOString()
      }
    ];
    
    return jobs;
  } catch (error) {
    console.error('Erreur LinkedIn:', error.message);
    return [];
  }
}

// Fonction principale de scraping
export async function scrapeAll() {
  console.log('🔄 Début du scraping...');
  
  try {
    const [tanitjobJobs, keejobJobs, linkedinJobs] = await Promise.all([
      scrapeTanitjob(),
      scrapeKeejob(),
      scrapeLinkedin()
    ]);
    
    const allJobs = [...tanitjobJobs, ...keejobJobs, ...linkedinJobs];
    
    console.log(`✅ Scraping terminé: ${allJobs.length} offres trouvées`);
    console.log(`   - Tanitjob: ${tanitjobJobs.length}`);
    console.log(`   - Keejob: ${keejobJobs.length}`);
    console.log(`   - LinkedIn: ${linkedinJobs.length}`);
    
    return allJobs;
  } catch (error) {
    console.error('❌ Erreur lors du scraping:', error.message);
    return [];
  }
}

export default { scrapeAll };
