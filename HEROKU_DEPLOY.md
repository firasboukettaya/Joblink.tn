# Guide de déploiement Heroku - JobLink

## 🚀 Déploiement rapide (3 étapes)

### Étape 1 : Créer un compte Heroku

1. Allez sur https://www.heroku.com/
2. Cliquez sur **"Sign up"**
3. Remplissez le formulaire avec :
   - **Email** : tn.joblink@gmail.com
   - **Password** : Joblink30101986
   - **Company name** : (optionnel)
   - **Primary development language** : Node.js
4. Confirmez votre email

### Étape 2 : Installer Heroku CLI

**Sur Windows** :
```bash
# Télécharger depuis : https://cli-assets.heroku.com/heroku-x64.exe
# Ou utiliser Chocolatey :
choco install heroku-cli
```

**Sur macOS** :
```bash
brew tap heroku/brew && brew install heroku
```

**Sur Linux** :
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

### Étape 3 : Déployer JobLink

```bash
# 1. Se connecter à Heroku
heroku login

# 2. Cloner ou naviguer vers le projet
cd joblink

# 3. Créer une nouvelle application Heroku
heroku create joblink-tunisia

# 4. Déployer le code
git push heroku master

# 5. Ouvrir l'application
heroku open
```

## 📋 Détails du déploiement

### Nom de l'application
```
joblink-tunisia
```

### URL finale
```
https://joblink-tunisia.herokuapp.com
```

### Variables d'environnement

Les variables suivantes sont automatiquement configurées :

```bash
heroku config:set DATABASE_URL=./joblink.db
heroku config:set NODE_ENV=production
heroku config:set SCRAPER_INTERVAL=3600
```

Ou via le dashboard Heroku :
1. Allez sur https://dashboard.heroku.com/apps/joblink-tunisia
2. Cliquez sur **Settings**
3. Cliquez sur **Reveal Config Vars**
4. Ajoutez les variables

## 🔍 Vérifier le déploiement

```bash
# Voir les logs
heroku logs --tail

# Vérifier l'état de l'application
heroku ps

# Tester l'API
curl https://joblink-tunisia.herokuapp.com/api/health
```

## 🔄 Mise à jour après déploiement

```bash
# Faire des modifications
git add .
git commit -m "Description des changements"

# Redéployer
git push heroku master
```

## 🆘 Troubleshooting

### L'application ne démarre pas

```bash
# Voir les erreurs
heroku logs --tail

# Redémarrer l'application
heroku restart
```

### Erreur de base de données

```bash
# La base de données est créée automatiquement
# Si problème, supprimez et redéployez :
heroku destroy --app joblink-tunisia
heroku create joblink-tunisia
git push heroku master
```

### Augmenter les ressources

```bash
# Passer à un dyno payant (si nécessaire)
heroku dyno:type standard-1x --app joblink-tunisia
```

## 📊 Monitoring

### Voir les métriques

```bash
heroku metrics --app joblink-tunisia
```

### Configurer les alertes

Via le dashboard Heroku :
1. Settings → Alerts
2. Configurez les seuils

## 🔐 Sécurité

### Ajouter un domaine personnalisé

```bash
heroku domains:add www.joblink.tn --app joblink-tunisia
```

### Configurer SSL

```bash
# Heroku fournit SSL gratuit
heroku certs:auto:enable --app joblink-tunisia
```

## 💾 Sauvegardes

```bash
# Télécharger la base de données
heroku pg:backups:capture --app joblink-tunisia
heroku pg:backups:download --app joblink-tunisia
```

## 📞 Support Heroku

- Documentation : https://devcenter.heroku.com/
- Support : https://help.heroku.com/

---

**Bon déploiement ! 🚀**

Pour toute question : tn.joblink@gmail.com
