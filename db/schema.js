import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: text('location'),
  description: text('description'),
  salary: text('salary'),
  jobType: text('job_type'), // CDI, CDD, Stage, etc.
  source: text('source').notNull(), // tanitjob, keejob, linkedin
  sourceUrl: text('source_url').notNull().unique(),
  postedDate: text('posted_date'),
  scrapedDate: text('scraped_date').default(sql`CURRENT_TIMESTAMP`),
  skills: text('skills'), // JSON array
  category: text('category'),
  experience: text('experience'),
  education: text('education'),
  isActive: integer('is_active').default(1),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const favorites = sqliteTable('favorites', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  jobId: text('job_id').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const jobAlerts = sqliteTable('job_alerts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  keyword: text('keyword').notNull(),
  location: text('location'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const scrapingLogs = sqliteTable('scraping_logs', {
  id: text('id').primaryKey(),
  source: text('source').notNull(),
  jobsScraped: integer('jobs_scraped').default(0),
  jobsAdded: integer('jobs_added').default(0),
  jobsUpdated: integer('jobs_updated').default(0),
  status: text('status'), // success, failed, partial
  errorMessage: text('error_message'),
  scrapedAt: text('scraped_at').default(sql`CURRENT_TIMESTAMP`),
  duration: integer('duration'), // en millisecondes
});
