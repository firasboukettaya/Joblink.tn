import { scrapeTanitjobV2, scrapeTanitjobAPI } from './tanitjob-v2.js';
import { scrapeKeejobV2, scrapeKeejobAPI } from './keejob-v2.js';
import { scrapeLinkedInTunisia, scrapeLinkedInViaAPI } from './linkedin.js';
import { scrapeDemoJobsBySource } from './demo.js';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // ms
const USE_DEMO_FALLBACK = true; // Utiliser les données de démonstration en fallback

/**
 * Fonction utilitaire pour réessayer une opération
 */
async function retryOperation(operation, name, maxRetries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  [${name}] Tentative ${attempt}/${maxRetries}...`);
      const result = await operation();
      return result;
    } catch (error) {
      console.error(`  [${name}] Erreur tentative ${attempt}:`, error.message);
      
      if (attempt < maxRetries) {
        console.log(`  [${name}] Attente ${RETRY_DELAY}ms avant nouvelle tentative...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  
  console.error(`  [${name}] Échec après ${maxRetries} tentatives`);
  return [];
}

/**
 * Scraper Tanitjob avec fallback
 */
export async function scrapeTanitjob() {
  console.log('\n📋 === SCRAPING TANITJOB ===');
  
  // Essayer d'abord l'API
  let jobs = await retryOperation(
    () => scrapeTanitjobAPI(),
    'Tanitjob API'
  );
  
  if (jobs.length === 0) {
    // Fallback au scraper HTML
    jobs = await retryOperation(
      () => scrapeTanitjobV2(),
      'Tanitjob HTML'
    );
  }
  
  // Fallback aux données de démonstration
  if (jobs.length === 0 && USE_DEMO_FALLBACK) {
    console.log('  [Tanitjob Demo] Utilisation des données de démonstration...');
    jobs = await scrapeDemoJobsBySource('tanitjob');
  }
  
  console.log(`✅ Tanitjob: ${jobs.length} offres`);
  return jobs;
}

/**
 * Scraper Keejob avec fallback
 */
export async function scrapeKeejob() {
  console.log('\n📋 === SCRAPING KEEJOB ===');
  
  // Essayer d'abord l'API
  let jobs = await retryOperation(
    () => scrapeKeejobAPI(),
    'Keejob API'
  );
  
  if (jobs.length === 0) {
    // Fallback au scraper HTML
    jobs = await retryOperation(
      () => scrapeKeejobV2(),
      'Keejob HTML'
    );
  }
  
  // Fallback aux données de démonstration
  if (jobs.length === 0 && USE_DEMO_FALLBACK) {
    console.log('  [Keejob Demo] Utilisation des données de démonstration...');
    jobs = await scrapeDemoJobsBySource('keejob');
  }
  
  console.log(`✅ Keejob: ${jobs.length} offres`);
  return jobs;
}

/**
 * Scraper LinkedIn Tunisia avec fallback
 */
export async function scrapeLinkedIn() {
  console.log('\n📋 === SCRAPING LINKEDIN TUNISIA ===');
  
  // Essayer d'abord l'API tierce
  let jobs = await retryOperation(
    () => scrapeLinkedInViaAPI(),
    'LinkedIn API'
  );
  
  if (jobs.length === 0) {
    // Fallback au scraper HTML
    jobs = await retryOperation(
      () => scrapeLinkedInTunisia(),
      'LinkedIn HTML'
    );
  }
  
  // Fallback aux données de démonstration
  if (jobs.length === 0 && USE_DEMO_FALLBACK) {
    console.log('  [LinkedIn Demo] Utilisation des données de démonstration...');
    jobs = await scrapeDemoJobsBySource('linkedin');
  }
  
  console.log(`✅ LinkedIn: ${jobs.length} offres`);
  return jobs;
}

/**
 * Exécuter tous les scrapers
 */
export async function scrapeAll() {
  console.log('\n🚀 === DÉMARRAGE DU SCRAPING COMPLET ===');
  console.log(`⏰ ${new Date().toLocaleString('fr-FR')}`);
  
  const startTime = Date.now();
  
  try {
    // Scraper toutes les sources en parallèle
    const [tanitjobJobs, keejobJobs, linkedinJobs] = await Promise.all([
      scrapeTanitjob(),
      scrapeKeejob(),
      scrapeLinkedIn()
    ]);
    
    const allJobs = [
      ...tanitjobJobs,
      ...keejobJobs,
      ...linkedinJobs
    ];
    
    const duration = Date.now() - startTime;
    
    console.log('\n📊 === RÉSUMÉ DU SCRAPING ===');
    console.log(`✓ Tanitjob: ${tanitjobJobs.length} offres`);
    console.log(`✓ Keejob: ${keejobJobs.length} offres`);
    console.log(`✓ LinkedIn: ${linkedinJobs.length} offres`);
    console.log(`✓ Total: ${allJobs.length} offres`);
    console.log(`⏱️ Durée: ${duration}ms (${(duration / 1000).toFixed(2)}s)`);
    
    return {
      success: true,
      jobs: allJobs,
      stats: {
        tanitjob: tanitjobJobs.length,
        keejob: keejobJobs.length,
        linkedin: linkedinJobs.length,
        total: allJobs.length,
        duration
      }
    };
  } catch (error) {
    console.error('❌ Erreur lors du scraping complet:', error.message);
    return {
      success: false,
      jobs: [],
      error: error.message
    };
  }
}

/**
 * Scraper une source spécifique
 */
export async function scrapeSource(source) {
  console.log(`\n🎯 Scraping source: ${source}`);
  
  switch (source.toLowerCase()) {
    case 'tanitjob':
      return await scrapeTanitjob();
    case 'keejob':
      return await scrapeKeejob();
    case 'linkedin':
      return await scrapeLinkedIn();
    default:
      console.error(`Source inconnue: ${source}`);
      return [];
  }
}
