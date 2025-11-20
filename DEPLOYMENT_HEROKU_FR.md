# 🚀 Déploiement JobLink sur Heroku - Guide Complet

## 📋 Vue d'ensemble

Ce guide vous montre comment déployer **JobLink** sur **Heroku** de manière permanente et gratuite (avec limites).

**Durée estimée** : 10-15 minutes  
**Coût** : Gratuit (avec limites)  
**Domaine** : joblink-tunisia.herokuapp.com

---

## ✅ Prérequis

- ✅ Email : tn.joblink@gmail.com
- ✅ Mot de passe : Joblink30101986
- ✅ Git installé
- ✅ Node.js 18+
- ✅ Heroku CLI

---

## 🎯 Étape 1 : Créer un compte Heroku

### 1.1 Inscription

1. Allez sur **https://www.heroku.com/**
2. Cliquez sur **"Sign up"** (en haut à droite)
3. Remplissez le formulaire :
   - **Email** : `tn.joblink@gmail.com`
   - **Password** : `Joblink30101986`
   - **Company name** : JobLink Tunisia (optionnel)
   - **Primary development language** : Node.js
4. Cliquez sur **"Create free account"**
5. **Confirmez votre email** (vérifiez votre boîte mail)

### 1.2 Connexion

1. Allez sur **https://dashboard.heroku.com/**
2. Connectez-vous avec vos identifiants
3. Vous devriez voir le dashboard

---

## 🛠️ Étape 2 : Installer Heroku CLI

### Sur Windows

**Option 1 : Télécharger l'installateur**
1. Allez sur https://cli-assets.heroku.com/heroku-x64.exe
2. Téléchargez et exécutez l'installateur
3. Suivez les instructions

**Option 2 : Avec Chocolatey**
```bash
choco install heroku-cli
```

### Sur macOS

```bash
brew tap heroku/brew && brew install heroku
```

### Sur Linux

```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

### Vérification

```bash
heroku --version
# Devrait afficher : heroku/X.X.X
```

---

## 📦 Étape 3 : Préparer le projet

### 3.1 Cloner ou télécharger le projet

```bash
# Option 1 : Si vous avez le fichier joblink.tar.gz
tar -xzf joblink.tar.gz
cd joblink

# Option 2 : Si vous avez le dossier
cd /chemin/vers/joblink
```

### 3.2 Vérifier les fichiers nécessaires

Les fichiers suivants doivent être présents :

```
joblink/
├── Procfile              ✓ (définit comment démarrer l'app)
├── .env.example          ✓ (exemple de configuration)
├── package.json          ✓ (dépendances)
├── server.js             ✓ (serveur principal)
└── client/               ✓ (frontend)
```

### 3.3 Initialiser Git (si nécessaire)

```bash
# Vérifier si Git est initialisé
git status

# Si erreur, initialiser :
git init
git config user.email "tn.joblink@gmail.com"
git config user.name "JobLink Tunisia"
git add .
git commit -m "Initial commit: JobLink v1.0"
```

---

## 🔐 Étape 4 : Se connecter à Heroku

```bash
heroku login
```

Cela ouvrira un navigateur pour vous connecter. Utilisez :
- **Email** : tn.joblink@gmail.com
- **Password** : Joblink30101986

Après la connexion, vous verrez :
```
Logged in as tn.joblink@gmail.com
```

---

## 🚀 Étape 5 : Créer l'application Heroku

```bash
# Créer une nouvelle application
heroku create joblink-tunisia

# Vous devriez voir :
# Creating ⬢ joblink-tunisia... done
# https://joblink-tunisia.herokuapp.com/ | https://git.heroku.com/joblink-tunisia.git
```

---

## ⚙️ Étape 6 : Configurer les variables d'environnement

```bash
# Définir les variables
heroku config:set DATABASE_URL=./joblink.db --app joblink-tunisia
heroku config:set NODE_ENV=production --app joblink-tunisia
heroku config:set SCRAPER_INTERVAL=3600 --app joblink-tunisia

# Vérifier les variables
heroku config --app joblink-tunisia
```

---

## 📤 Étape 7 : Déployer le code

```bash
# Ajouter le remote Heroku (si pas fait automatiquement)
heroku git:remote --app joblink-tunisia

# Déployer
git push heroku master

# Vous verrez le processus de déploiement :
# Enumerating objects: 39, done.
# Counting objects: 100% (39/39), done.
# Delta compression using up to 4 threads
# ...
# remote: Verifying deploy... done.
# remote: https://joblink-tunisia.herokuapp.com/ deployed to Heroku
```

---

## ✅ Étape 8 : Vérifier le déploiement

### 8.1 Ouvrir l'application

```bash
heroku open --app joblink-tunisia
```

Cela ouvrira votre navigateur sur :
```
https://joblink-tunisia.herokuapp.com/
```

### 8.2 Tester l'API

```bash
# Santé du serveur
curl https://joblink-tunisia.herokuapp.com/api/health

# Récupérer les offres
curl "https://joblink-tunisia.herokuapp.com/api/jobs?limit=5"

# Statistiques
curl https://joblink-tunisia.herokuapp.com/api/stats
```

### 8.3 Voir les logs

```bash
heroku logs --tail --app joblink-tunisia
```

---

## 🎯 Résumé du déploiement

| Élément | Valeur |
|--------|--------|
| **Nom de l'app** | joblink-tunisia |
| **URL** | https://joblink-tunisia.herokuapp.com |
| **Email** | tn.joblink@gmail.com |
| **Région** | US (par défaut) |
| **Type de dyno** | Free (gratuit, avec limites) |
| **Base de données** | SQLite (local) |

---

## 📊 Limites du plan gratuit Heroku

- ⏸️ **Dormance** : L'app s'endort après 30 min d'inactivité
- 💾 **Stockage** : Limité à 512 MB
- 🔄 **Scraping** : Fonctionne mais peut être ralenti
- ⏱️ **Uptime** : 550 heures/mois

**Pour éviter la dormance** :
```bash
# Utiliser un service de "keep-alive"
# https://www.uptimerobot.com/ (gratuit)
```

---

## 🔄 Mettre à jour l'application

Après avoir fait des modifications :

```bash
# Ajouter les changements
git add .
git commit -m "Description des changements"

# Redéployer
git push heroku master
```

---

## 🆘 Troubleshooting

### L'application ne démarre pas

```bash
# Voir les erreurs
heroku logs --tail --app joblink-tunisia

# Redémarrer
heroku restart --app joblink-tunisia
```

### Erreur "Application error"

```bash
# Vérifier les logs
heroku logs --app joblink-tunisia

# Vérifier les variables d'environnement
heroku config --app joblink-tunisia

# Redéployer
git push heroku master --force
```

### La base de données ne se crée pas

```bash
# Vérifier les logs
heroku logs --tail --app joblink-tunisia

# La base de données se crée automatiquement au premier démarrage
# Attendez 1-2 minutes
```

---

## 🔐 Sécurité

### Ajouter un domaine personnalisé

```bash
# Ajouter votre domaine
heroku domains:add www.joblink.tn --app joblink-tunisia

# Configurer votre registrar DNS pour pointer vers Heroku
# Voir : https://devcenter.heroku.com/articles/custom-domains
```

### Configurer SSL/HTTPS

```bash
# Heroku fournit SSL gratuit
heroku certs:auto:enable --app joblink-tunisia
```

---

## 📞 Support et ressources

- **Documentation Heroku** : https://devcenter.heroku.com/
- **Aide Heroku** : https://help.heroku.com/
- **Email JobLink** : tn.joblink@gmail.com

---

## ✨ Prochaines étapes

1. ✅ Configurer un domaine personnalisé
2. ✅ Ajouter le monitoring (Uptime Robot)
3. ✅ Configurer les sauvegardes
4. ✅ Ajouter l'authentification utilisateur
5. ✅ Implémenter les favoris

---

## 🎉 Félicitations !

Votre application JobLink est maintenant **en ligne et accessible 24/7** !

**URL** : https://joblink-tunisia.herokuapp.com/

Partagez ce lien avec vos amis et collègues ! 🚀

---

**Créé avec ❤️ pour les chercheurs d'emploi en Tunisie**
