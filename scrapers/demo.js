import { v4 as uuidv4 } from 'uuid';

// Données de démonstration réalistes pour la Tunisie
const demoJobs = [
  // Tanitjob
  {
    title: 'Développeur Full Stack JavaScript',
    company: 'TechStart Tunisia',
    location: 'Tunis',
    description: 'Nous recherchons un développeur full stack expérimenté en JavaScript/Node.js et React. Vous travaillerez sur des projets innovants pour des clients internationaux.',
    salary: '2500 - 3500 TND',
    jobType: 'CDI',
    source: 'tanitjob'
  },
  {
    title: 'Ingénieur DevOps',
    company: 'Cloud Solutions TN',
    location: 'Sfax',
    description: 'Rejoignez notre équipe DevOps pour gérer l\'infrastructure cloud. Expérience requise: Docker, Kubernetes, AWS.',
    salary: '3000 - 4000 TND',
    jobType: 'CDI',
    source: 'tanitjob'
  },
  {
    title: 'Responsable Marketing Digital',
    company: 'Digital Agency',
    location: 'Tunis',
    description: 'Pilotez nos campagnes marketing digitales. SEO, SEM, Social Media - une belle opportunité pour un professionnel motivé.',
    salary: '2000 - 2800 TND',
    jobType: 'CDI',
    source: 'tanitjob'
  },
  {
    title: 'Analyste Données',
    company: 'DataViz Corp',
    location: 'Ariana',
    description: 'Analysez les données massives et créez des dashboards. Python, SQL, Power BI requis.',
    salary: '2200 - 3200 TND',
    jobType: 'CDI',
    source: 'tanitjob'
  },
  {
    title: 'Chef de Projet IT',
    company: 'Consulting Plus',
    location: 'Tunis',
    description: 'Gérez des projets IT complexes pour nos clients. Agile, Scrum, gestion de risques.',
    salary: '2800 - 3800 TND',
    jobType: 'CDI',
    source: 'tanitjob'
  },
  
  // Keejob
  {
    title: 'Designer UX/UI',
    company: 'Creative Studio',
    location: 'Tunis',
    description: 'Créez des interfaces magnifiques et intuitives. Figma, Adobe XD, prototypage.',
    salary: '1800 - 2600 TND',
    jobType: 'CDI',
    source: 'keejob'
  },
  {
    title: 'Développeur Python Backend',
    company: 'AI Innovations',
    location: 'Sousse',
    description: 'Développez des APIs robustes en Python. FastAPI, Django, PostgreSQL.',
    salary: '2400 - 3400 TND',
    jobType: 'CDI',
    source: 'keejob'
  },
  {
    title: 'Spécialiste Cybersécurité',
    company: 'SecureNet',
    location: 'Tunis',
    description: 'Protégez nos systèmes contre les menaces. Pentesting, audit de sécurité.',
    salary: '3200 - 4500 TND',
    jobType: 'CDI',
    source: 'keejob'
  },
  {
    title: 'Gestionnaire de Contenu',
    company: 'Media Plus',
    location: 'Tunis',
    description: 'Gérez le contenu éditorial et les réseaux sociaux. WordPress, CMS.',
    salary: '1600 - 2300 TND',
    jobType: 'CDI',
    source: 'keejob'
  },
  {
    title: 'Testeur QA Automatisé',
    company: 'Quality Assurance Pro',
    location: 'Sfax',
    description: 'Testez les applications avec Selenium, Cypress. Assurance qualité.',
    salary: '1900 - 2700 TND',
    jobType: 'CDI',
    source: 'keejob'
  },
  
  // LinkedIn
  {
    title: 'Architecte Solutions Cloud',
    company: 'Global Tech Partners',
    location: 'Tunis',
    description: 'Concevez des architectures cloud scalables. AWS, Azure, GCP.',
    salary: '3500 - 5000 TND',
    jobType: 'CDI',
    source: 'linkedin'
  },
  {
    title: 'Responsable RH',
    company: 'HR Solutions',
    location: 'Tunis',
    description: 'Pilotez la stratégie RH et le recrutement. Gestion des talents.',
    salary: '2200 - 3000 TND',
    jobType: 'CDI',
    source: 'linkedin'
  },
  {
    title: 'Développeur Mobile React Native',
    company: 'Mobile First',
    location: 'Ariana',
    description: 'Développez des applications mobiles cross-platform. React Native, Expo.',
    salary: '2300 - 3300 TND',
    jobType: 'CDI',
    source: 'linkedin'
  },
  {
    title: 'Consultant ERP SAP',
    company: 'Enterprise Solutions',
    location: 'Tunis',
    description: 'Implémentez et configurez SAP. Gestion de projets ERP.',
    salary: '3000 - 4200 TND',
    jobType: 'CDI',
    source: 'linkedin'
  },
  {
    title: 'Ingénieur Logiciel Senior',
    company: 'Software House',
    location: 'Tunis',
    description: 'Menez des équipes de développement. Architecture logicielle, leadership.',
    salary: '3500 - 4800 TND',
    jobType: 'CDI',
    source: 'linkedin'
  }
];

/**
 * Générer des données de démonstration
 */
export function generateDemoJobs(count = 100) {
  const jobs = [];
  
  for (let i = 0; i < count; i++) {
    const baseJob = demoJobs[i % demoJobs.length];
    
    // Créer une variation du job
    const job = {
      id: uuidv4(),
      title: baseJob.title + (i > demoJobs.length ? ` (${Math.floor(i / demoJobs.length)})` : ''),
      company: baseJob.company,
      location: baseJob.location,
      description: baseJob.description,
      salary: baseJob.salary,
      jobType: baseJob.jobType,
      source: baseJob.source,
      sourceUrl: `https://www.${baseJob.source}.com/job/${uuidv4()}`,
      postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      scrapedDate: new Date().toISOString(),
      category: 'Général',
      isActive: 1
    };
    
    jobs.push(job);
  }
  
  return jobs;
}

/**
 * Scraper de démonstration
 */
export async function scrapeDemoJobs() {
  console.log('🎬 Utilisation des données de démonstration...');
  
  // Simuler un délai de scraping
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const jobs = generateDemoJobs(100);
  
  console.log(`✓ ${jobs.length} offres de démonstration générées`);
  return jobs;
}

/**
 * Scraper de démonstration par source
 */
export async function scrapeDemoJobsBySource(source) {
  console.log(`🎬 Utilisation des données de démonstration pour ${source}...`);
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const sourceJobs = demoJobs.filter(job => job.source === source);
  const jobs = [];
  
  for (let i = 0; i < 20; i++) {
    const baseJob = sourceJobs[i % sourceJobs.length];
    
    jobs.push({
      id: uuidv4(),
      title: baseJob.title + (i > sourceJobs.length ? ` (${Math.floor(i / sourceJobs.length)})` : ''),
      company: baseJob.company,
      location: baseJob.location,
      description: baseJob.description,
      salary: baseJob.salary,
      jobType: baseJob.jobType,
      source: baseJob.source,
      sourceUrl: `https://www.${baseJob.source}.com/job/${uuidv4()}`,
      postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      scrapedDate: new Date().toISOString(),
      category: 'Général',
      isActive: 1
    });
  }
  
  console.log(`✓ ${jobs.length} offres de démonstration générées pour ${source}`);
  return jobs;
}
