import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

export async function scrapeTanitjob() {
  const jobs = [];
  const baseUrl = 'https://www.tanitjob.com';
  
  try {
    console.log('Scraping Tanitjob...');
    
    // Scraper la page d'accueil des offres d'emploi
    const response = await axios.get(`${baseUrl}/offres-emploi`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Adapter les sélecteurs selon la structure HTML réelle de Tanitjob
    const jobElements = $('.job-item, .offer-item, [data-job-id]');
    
    jobElements.each((index, element) => {
      try {
        const $element = $(element);
        
        const title = $element.find('.job-title, h2, .title').text().trim();
        const company = $element.find('.company-name, .company, .employer').text().trim();
        const location = $element.find('.location, .city, .place').text().trim();
        const salary = $element.find('.salary, .price, .remuneration').text().trim();
        const description = $element.find('.description, .summary, p').text().trim();
        const jobUrl = $element.find('a').attr('href');
        
        if (title && company && jobUrl) {
          const fullUrl = jobUrl.startsWith('http') ? jobUrl : `${baseUrl}${jobUrl}`;
          
          jobs.push({
            id: uuidv4(),
            title,
            company,
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
        console.error('Erreur lors du scraping d\'un élément:', error.message);
      }
    });
    
    console.log(`✓ ${jobs.length} offres trouvées sur Tanitjob`);
    return jobs;
  } catch (error) {
    console.error('Erreur lors du scraping de Tanitjob:', error.message);
    return [];
  }
}
