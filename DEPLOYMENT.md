# Guide de déploiement - JobLink

## 🚀 Options de déploiement

### 1. Déploiement sur Heroku (Recommandé pour commencer)

#### Prérequis
- Compte Heroku (gratuit)
- Heroku CLI installé

#### Étapes
```bash
# 1. Créer un compte Heroku et installer la CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Se connecter à Heroku
heroku login

# 3. Créer une nouvelle application
heroku create joblink-tunisia

# 4. Ajouter les variables d'environnement
heroku config:set DATABASE_URL=./joblink.db
heroku config:set NODE_ENV=production
heroku config:set SCRAPER_INTERVAL=3600

# 5. Déployer
git push heroku main

# 6. Vérifier les logs
heroku logs --tail
```

### 2. Déploiement sur Vercel (Frontend uniquement)

#### Prérequis
- Compte Vercel
- Vercel CLI

#### Étapes
```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer le frontend
cd client
vercel

# 3. Configurer les variables d'environnement
# Dans le dashboard Vercel, ajouter :
# VITE_API_URL=https://votre-api.com
```

### 3. Déploiement sur VPS (DigitalOcean, Linode, etc.)

#### Prérequis
- VPS avec Ubuntu 20.04+
- SSH access
- Domaine (optionnel)

#### Étapes

**1. Configurer le serveur**
```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer pnpm
npm install -g pnpm

# Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2
```

**2. Cloner et configurer l'application**
```bash
# Cloner le repository
git clone https://github.com/votre-username/joblink.git
cd joblink

# Installer les dépendances
pnpm install

# Créer le fichier .env
cat > .env << EOF
DATABASE_URL=./joblink.db
PORT=3000
NODE_ENV=production
SCRAPER_INTERVAL=3600
EOF

# Créer la base de données
node server.js &
sleep 5
kill %1
```

**3. Configurer PM2**
```bash
# Créer un fichier ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'joblink',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Démarrer avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**4. Configurer Nginx (reverse proxy)**
```bash
# Installer Nginx
sudo apt install -y nginx

# Créer la configuration
sudo cat > /etc/nginx/sites-available/joblink << EOF
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Activer la configuration
sudo ln -s /etc/nginx/sites-available/joblink /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**5. Configurer SSL (Let's Encrypt)**
```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir un certificat
sudo certbot --nginx -d votre-domaine.com

# Renouvellement automatique
sudo systemctl enable certbot.timer
```

### 4. Déploiement avec Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["pnpm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  joblink:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=./joblink.db
      - NODE_ENV=production
      - SCRAPER_INTERVAL=3600
    volumes:
      - ./joblink.db:/app/joblink.db
    restart: unless-stopped
```

#### Déployer
```bash
# Build et démarrer
docker-compose up -d

# Vérifier les logs
docker-compose logs -f joblink
```

### 5. Déploiement sur AWS

#### Avec Elastic Beanstalk
```bash
# Installer AWS CLI et EB CLI
pip install awsebcli

# Initialiser
eb init -p node.js-18 joblink

# Créer l'environnement
eb create joblink-env

# Déployer
eb deploy

# Ouvrir l'application
eb open
```

## 📋 Checklist de déploiement

- [ ] Vérifier que `.env` est configuré correctement
- [ ] Tester l'API localement : `curl http://localhost:3000/api/health`
- [ ] Vérifier que la base de données est initialisée
- [ ] Tester le scraping manuel : `POST /api/scrape`
- [ ] Configurer les logs
- [ ] Mettre en place une sauvegarde de la base de données
- [ ] Configurer le monitoring
- [ ] Tester la pagination et les filtres
- [ ] Vérifier les performances
- [ ] Configurer les alertes

## 🔒 Sécurité en production

### Variables d'environnement
```env
NODE_ENV=production
DATABASE_URL=./joblink.db
PORT=3000
SCRAPER_INTERVAL=3600
```

### Sauvegarde de la base de données
```bash
# Créer une sauvegarde quotidienne
0 2 * * * cp /app/joblink.db /backups/joblink-$(date +\%Y\%m\%d).db
```

### Monitoring
```bash
# Installer PM2 Plus pour le monitoring
pm2 plus
```

## 📊 Logs et monitoring

### Avec PM2
```bash
# Voir les logs
pm2 logs joblink

# Voir les statistiques
pm2 monit
```

### Avec Nginx
```bash
# Logs d'accès
tail -f /var/log/nginx/access.log

# Logs d'erreur
tail -f /var/log/nginx/error.log
```

## 🔄 Mise à jour

### Mettre à jour l'application
```bash
# Récupérer les dernières modifications
git pull origin main

# Installer les dépendances
pnpm install

# Redémarrer
pm2 restart joblink
```

## 🆘 Troubleshooting

### L'application ne démarre pas
```bash
# Vérifier les logs
pm2 logs joblink

# Vérifier le port
lsof -i :3000

# Vérifier les permissions
ls -la joblink.db
```

### Erreur de base de données
```bash
# Supprimer et recréer la base de données
rm joblink.db
node server.js &
sleep 5
kill %1
```

### Problème de mémoire
```bash
# Augmenter la limite de mémoire
pm2 start server.js --max-memory-restart 500M
```

## 📞 Support

Pour toute question : **Tn.joblink@gmail.com**

---

**Bon déploiement ! 🚀**
