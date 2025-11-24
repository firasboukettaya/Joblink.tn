# 🚀 JobLink - Déploiement Railway

## 📋 Guide complet de déploiement sur Railway

Railway est une plateforme d'hébergement **gratuite, simple et sans carte de crédit** parfaite pour JobLink.

---

## ✅ Prérequis

- ✅ Compte Railway (gratuit)
- ✅ Compte GitHub (gratuit)
- ✅ Projet JobLink (prêt !)

---

## 🎯 Étape 1 : Créer un compte Railway

1. Allez sur https://railway.app/
2. Cliquez sur **"Sign up"**
3. Connectez-vous avec **GitHub** (firasboukettaya)
4. Autorisez Railway à accéder à votre GitHub

---

## 📤 Étape 2 : Créer un repository GitHub

### Option A : Créer manuellement

1. Allez sur https://github.com/new
2. Remplissez :
   - **Repository name** : joblink
   - **Description** : Job portal with automatic scraping
   - **Public** : Cochez cette case
3. Cliquez sur **"Create repository"**

### Option B : Utiliser la ligne de commande

```bash
# Installer GitHub CLI (si nécessaire)
# https://cli.github.com/

# Créer le repository
gh repo create joblink --public --source=. --remote=origin --push
```

---

## 📤 Étape 3 : Pousser le code vers GitHub

```bash
cd /home/ubuntu/joblink

# Ajouter le remote GitHub
git remote add origin https://github.com/firasboukettaya/joblink.git

# Pousser le code
git branch -M main
git push -u origin main
```

---

## 🚀 Étape 4 : Déployer sur Railway

### Méthode 1 : Via le dashboard Railway

1. Allez sur https://railway.app/dashboard
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Deploy from GitHub"**
4. Sélectionnez votre repository **joblink**
5. Railway détectera automatiquement Node.js
6. Cliquez sur **"Deploy"**

### Méthode 2 : Via Railway CLI

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Initialiser le projet
railway init

# Déployer
railway up
```

---

## ⚙️ Étape 5 : Configurer les variables d'environnement

1. Allez dans votre projet Railway
2. Cliquez sur **"Variables"**
3. Ajoutez :
   - `DATABASE_URL` = `./joblink.db`
   - `NODE_ENV` = `production`
   - `SCRAPER_INTERVAL` = `3600`
   - `PORT` = `3000`

---

## ✅ Étape 6 : Vérifier le déploiement

1. Allez dans votre projet Railway
2. Cliquez sur **"Deployments"**
3. Attendez que le déploiement soit terminé (vert)
4. Cliquez sur **"View logs"** pour voir les logs

---

## 🌐 Étape 7 : Obtenir votre URL

1. Allez dans votre projet Railway
2. Cliquez sur **"Settings"**
3. Sous **"Domains"**, vous verrez votre URL :
   ```
   https://joblink-production.up.railway.app/
   ```

---

## ✅ Tester l'application

```bash
# Remplacez URL par votre URL Railway
URL="https://joblink-production.up.railway.app"

# Santé du serveur
curl $URL/api/health

# Récupérer les offres
curl "$URL/api/jobs?limit=5"

# Statistiques
curl $URL/api/stats
```

---

## 📊 Résumé

| Élément | Valeur |
|--------|--------|
| **Plateforme** | Railway |
| **Coût** | Gratuit (500 h/mois) |
| **Domaine** | joblink-production.up.railway.app |
| **Carte de crédit** | Non requise |
| **Facilité** | ⭐⭐⭐⭐⭐ |

---

## 🔄 Mettre à jour l'application

```bash
# Faire des modifications
git add .
git commit -m "Description des changements"

# Pousser vers GitHub
git push origin main

# Railway redéploiera automatiquement !
```

---

## 🆘 Troubleshooting

### L'application ne démarre pas

```bash
# Voir les logs
# Via le dashboard Railway → Logs
```

### Erreur de base de données

La base de données se crée automatiquement au premier démarrage. Attendez 1-2 minutes.

### L'app est lente

Railway gratuit a des limites. Vous pouvez :
- Passer à un plan payant
- Ou utiliser un autre service

---

## 📞 Support

- **Documentation Railway** : https://docs.railway.app/
- **Support Railway** : https://railway.app/support
- **Email JobLink** : tn.joblink@gmail.com

---

## 🎉 Félicitations !

Votre application JobLink est maintenant **en ligne et gratuite** ! 🚀

**URL** : https://joblink-production.up.railway.app/

Partagez ce lien avec vos amis ! 😊

---

**Créé avec ❤️ pour les chercheurs d'emploi en Tunisie**
