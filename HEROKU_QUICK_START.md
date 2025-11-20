# 🚀 JobLink - Déploiement Heroku Rapide

## 📋 Informations du compte

```
Email:        tn.joblink@gmail.com
Mot de passe: Joblink30101986
App name:     joblink-tunisia
URL finale:   https://joblink-tunisia.herokuapp.com
```

## ⚡ 8 étapes pour déployer

### 1️⃣ Créer un compte Heroku
- Allez sur https://www.heroku.com/
- Cliquez sur "Sign up"
- Utilisez l'email et le mot de passe ci-dessus
- Confirmez votre email

### 2️⃣ Installer Heroku CLI

**Windows** : https://cli-assets.heroku.com/heroku-x64.exe  
**macOS** : `brew tap heroku/brew && brew install heroku`  
**Linux** : `curl https://cli-assets.heroku.com/install.sh | sh`

### 3️⃣ Se connecter
```bash
heroku login
```

### 4️⃣ Télécharger le projet
```bash
tar -xzf joblink.tar.gz
cd joblink
```

### 5️⃣ Créer l'app
```bash
heroku create joblink-tunisia
```

### 6️⃣ Configurer les variables
```bash
heroku config:set DATABASE_URL=./joblink.db --app joblink-tunisia
heroku config:set NODE_ENV=production --app joblink-tunisia
heroku config:set SCRAPER_INTERVAL=3600 --app joblink-tunisia
```

### 7️⃣ Déployer
```bash
git push heroku master
```

### 8️⃣ Ouvrir
```bash
heroku open --app joblink-tunisia
```

## ✅ Vérifier le déploiement

```bash
# Santé du serveur
curl https://joblink-tunisia.herokuapp.com/api/health

# Voir les logs
heroku logs --tail --app joblink-tunisia
```

## 📊 Résumé

| Élément | Valeur |
|---------|--------|
| URL | https://joblink-tunisia.herokuapp.com |
| Offres | 309+ |
| Sources | 3 (Tanitjob, Keejob, LinkedIn) |
| API | 6 endpoints |
| Coût | Gratuit (avec limites) |

## 📞 Support

- Documentation : DEPLOYMENT_HEROKU_FR.md
- Email : tn.joblink@gmail.com

**Bon déploiement ! 🎉**
