import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

const axiosInstance = axios.create({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9',
    'Accept-Encoding': 'gzip, deflate',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  }
});

export async function scrapeLinkedInTunisia() {
  const jobs = [];
  
  try {
    console.log('🔍 Scraping LinkedIn Tunisia...');
    
    // LinkedIn a une protection stricte, on va essayer une approche alternative
    // Utiliser les paramètres de recherche publics
    const keywords = ['Tunisia', 'Tunisie', 'Tunis'];
    
    for (const keyword of keywords) {
      try {
        // Essayer de scraper les résultats de recherche LinkedIn
        const url = `https://www.linkedin.com/jobs/search/?keywords=${keyword}&location=Tunisia`;
        console.log(`  Searching for: ${keyword}`);
        
        const response = await axiosInstance.get(url);
        const $ = cheerio.load(response.data);
        
        // Sélecteurs LinkedIn
        const jobSelectors = [
          '.jobs-search__results-list li',
          '.base-card',
          '.job-card-container',
          '[data-job-id]'
        ];
        
        for (const selector of jobSelectors) {
          const elements = $(selector);
          if (elements.length > 0) {
            console.log(`    Found ${elements.length} jobs`);
            
            elements.each((index, element) => {
              try {
                const $el = $(element);
                
                const title = $el.find('.base-search-card__title, h3').first().text().trim();
                const company = $el.find('.base-search-card__subtitle, .company-name').first().text().trim();
                const location = $el.find('.job-search-card__location, .location').first().text().trim();
                const description = $el.find('.base-search-card__snippet, .description').first().text().trim();
                const jobUrl = $el.find('a').first().attr('href');
                
                if (title && company && jobUrl) {
                  jobs.push({
                    id: uuidv4(),
                    title: title.substring(0, 200),
                    company: company.substring(0, 150),
                    location: location || 'Tunisia',
                    description: description.substring(0, 500),
                    salary: 'Non spécifié',
                    jobType: 'CDI',
                    source: 'linkedin',
                    sourceUrl: jobUrl.startsWith('http') ? jobUrl : `https://www.linkedin.com${jobUrl}`,
                    postedDate: new Date().toISOString(),
                    scrapedDate: new Date().toISOString(),
                    category: 'Général',
                    isActive: 1
                  });
                }
              } catch (error) {
                console.error('    Erreur lors du parsing:', error.message);
              }
            });
            
            if (elements.length > 0) break;
          }
        }
        
        // Attendre entre les requêtes
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`  Erreur pour ${keyword}:`, error.message);
      }
    }
    
    console.log(`✓ ${jobs.length} offres trouvées sur LinkedIn`);
    return jobs;
  } catch (error) {
    console.error('❌ Erreur lors du scraping de LinkedIn:', error.message);
    return [];
  }
}

// Fonction alternative utilisant une API tierce
export async function scrapeLinkedInViaAPI() {
  try {
    console.log('🔍 Tentative de scraping LinkedIn via API tierce...');
    
    // Vous pouvez utiliser des services comme:
    // - RapidAPI LinkedIn Jobs
    // - ScraperAPI
    // - Bright Data
    
    // Exemple avec un endpoint générique
    const response = await axiosInstance.get('https://api.example.com/linkedin/jobs', {
      params: {
        location: 'Tunisia',
        limit: 100
      }
    });
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(job => ({
        id: uuidv4(),
        title: job.title || '',
        company: job.company || '',
        location: job.location || 'Tunisia',
        description: job.description || '',
        salary: job.salary || 'Non spécifié',
        jobType: job.jobType || 'CDI',
        source: 'linkedin',
        sourceUrl: job.url || '',
        postedDate: job.postedDate || new Date().toISOString(),
        scrapedDate: new Date().toISOString(),
        category: job.category || 'Général',
        isActive: 1
      }));
    }
  } catch (error) {
    console.log('API tierce non disponible');
  }
  
  return [];
}
