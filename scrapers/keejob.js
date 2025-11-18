import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

export async function scrapeKeejob() {
  const jobs = [];
  const baseUrl = 'https://www.keejob.com';
  
  try {
    console.log('Scraping Keejob...');
    
    // Scraper la page d'accueil des offres d'emploi
    const response = await axios.get(`${baseUrl}/offres`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Adapter les sélecteurs selon la structure HTML réelle de Keejob
    const jobElements = $('.job-card, .offer-card, .job-listing, [data-offer]');
    
    jobElements.each((index, element) => {
      try {
        const $element = $(element);
        
        const title = $element.find('.job-title, h3, .title').text().trim();
        const company = $element.find('.company, .employer, .organization').text().trim();
        const location = $element.find('.location, .city, .region').text().trim();
        const salary = $element.find('.salary, .wage, .compensation').text().trim();
        const description = $element.find('.description, .summary, .details').text().trim();
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
            source: 'keejob',
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
    
    console.log(`✓ ${jobs.length} offres trouvées sur Keejob`);
    return jobs;
  } catch (error) {
    console.error('Erreur lors du scraping de Keejob:', error.message);
    return [];
  }
}
