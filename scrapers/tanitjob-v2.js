import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

// Configuration pour contourner Cloudflare
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

export async function scrapeTanitjobV2() {
  const jobs = [];
  const baseUrl = 'https://www.tanitjobs.com';
  
  try {
    console.log('🔍 Scraping Tanitjob (v2)...');
    
    // Essayer plusieurs pages
    for (let page = 1; page <= 5; page++) {
      try {
        const url = `${baseUrl}/jobs/?page=${page}`;
        console.log(`  Fetching page ${page}...`);
        
        const response = await axiosInstance.get(url);
        const $ = cheerio.load(response.data);
        
        // Sélecteurs possibles pour les offres d'emploi
        const jobSelectors = [
          '.job-item',
          '.job-card',
          '.job-listing',
          '[data-job-id]',
          '.listing-item',
          'article.job',
          '.job-row',
          '.vacancy-item'
        ];
        
        let found = false;
        for (const selector of jobSelectors) {
          const elements = $(selector);
          if (elements.length > 0) {
            console.log(`    Found ${elements.length} jobs with selector: ${selector}`);
            found = true;
            
            elements.each((index, element) => {
              try {
                const $el = $(element);
                
                // Extraire les informations avec plusieurs sélecteurs possibles
                const title = $el.find('h2, h3, .job-title, .title, a[href*="/job/"]').first().text().trim();
                const company = $el.find('.company, .employer, .company-name, .organization').first().text().trim();
                const location = $el.find('.location, .city, .place, .region').first().text().trim();
                const salary = $el.find('.salary, .wage, .price, .compensation').first().text().trim();
                const description = $el.find('.description, .summary, .excerpt, p').first().text().trim();
                
                // Trouver le lien
                let jobUrl = $el.find('a[href*="/job/"]').attr('href');
                if (!jobUrl) {
                  jobUrl = $el.find('a').first().attr('href');
                }
                
                if (title && company && jobUrl) {
                  const fullUrl = jobUrl.startsWith('http') ? jobUrl : `${baseUrl}${jobUrl}`;
                  
                  jobs.push({
                    id: uuidv4(),
                    title: title.substring(0, 200),
                    company: company.substring(0, 150),
                    location: location || 'Non spécifié',
                    description: description.substring(0, 500),
                    salary: salary || 'Non spécifié',
                    jobType: 'CDI',
                    source: 'tanitjob',
                    sourceUrl: fullUrl,
                    postedDate: new Date().toISOString(),
                    scrapedDate: new Date().toISOString(),
                    category: 'Général',
                    isActive: 1
                  });
                }
              } catch (error) {
                console.error('    Erreur lors du parsing d\'un élément:', error.message);
              }
            });
            
            if (found) break;
          }
        }
        
        if (!found) {
          console.log(`    ⚠️ Aucune offre trouvée page ${page}`);
        }
        
        // Attendre un peu entre les requêtes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (pageError) {
        console.error(`  Erreur page ${page}:`, pageError.message);
      }
    }
    
    console.log(`✓ ${jobs.length} offres trouvées sur Tanitjob`);
    return jobs;
  } catch (error) {
    console.error('❌ Erreur lors du scraping de Tanitjob:', error.message);
    return [];
  }
}

// Fonction alternative utilisant une API si disponible
export async function scrapeTanitjobAPI() {
  try {
    console.log('🔍 Tentative de scraping via API Tanitjob...');
    
    // Essayer d'accéder à une API JSON si elle existe
    const response = await axiosInstance.get('https://www.tanitjobs.com/api/jobs', {
      params: {
        limit: 100,
        offset: 0
      }
    });
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(job => ({
        id: uuidv4(),
        title: job.title || job.job_title || '',
        company: job.company || job.employer || '',
        location: job.location || job.city || 'Non spécifié',
        description: job.description || job.summary || '',
        salary: job.salary || 'Non spécifié',
        jobType: job.job_type || 'CDI',
        source: 'tanitjob',
        sourceUrl: job.url || job.link || '',
        postedDate: job.posted_date || new Date().toISOString(),
        scrapedDate: new Date().toISOString(),
        category: job.category || 'Général',
        isActive: 1
      }));
    }
  } catch (error) {
    console.log('API non disponible, utilisation du scraper HTML');
  }
  
  return [];
}
