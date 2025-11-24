# 🚀 Déployer sur Railway - Guide Étape par Étape

## 📋 Prérequis

- ✅ Compte Railway (créé)
- ✅ Code poussé sur GitHub (Joblink.tn)
- ✅ Navigateur web

---

## 🎯 Étape 1 : Aller sur Railway

### Action
Ouvrez votre navigateur et allez sur :
```
https://railway.app/dashboard
```

### Vous devriez voir
- Un dashboard avec vos projets
- Un bouton **"New Project"** (bleu)

---

## 📝 Étape 2 : Créer un nouveau projet

### Action
1. Cliquez sur le bouton **"New Project"** (en haut à droite)

### Vous verrez un menu avec plusieurs options :
```
- Deploy from GitHub
- Deploy from Git
- Create a service
- etc.
```

### Cliquez sur
**"Deploy from GitHub"**

---

## 🔗 Étape 3 : Autoriser Railway à accéder à GitHub

### Si c'est la première fois
Railway vous demandera d'autoriser l'accès à GitHub.

### Action
1. Cliquez sur **"Authorize"** ou **"Connect GitHub"**
2. Connectez-vous à GitHub si nécessaire
3. Autorisez Railway à accéder à vos repositories

### Vous verrez ensuite
Une liste de vos repositories GitHub.

---

## 🔍 Étape 4 : Sélectionner votre repository

### Chercher votre repository
Vous verrez une liste de vos repositories. Cherchez :
```
Joblink.tn
```

Ou tapez "joblink" dans la barre de recherche.

### Action
Cliquez sur **"Joblink.tn"** (ou "joblink.tn")

---

## ✅ Étape 5 : Confirmer le déploiement

### Vous verrez
Un écran de confirmation avec :
- Nom du repository : Joblink.tn
- Branche : main
- Bouton **"Deploy"**

### Action
Cliquez sur le bouton **"Deploy"** (bleu)

---

## ⏳ Étape 6 : Attendre le déploiement

### Railway va faire :
1. ✅ Cloner le repository
2. ✅ Installer les dépendances (`pnpm install`)
3. ✅ Construire l'application
4. ✅ Démarrer le serveur

### Vous verrez
- Une barre de progression
- Des logs en direct
- Statut : "Building..." → "Deploying..." → "Running"

### Durée
**2-5 minutes** (première fois peut être plus long)

---

## 🌐 Étape 7 : Obtenir votre URL

### Une fois le déploiement terminé

1. Allez dans votre projet Railway
2. Cliquez sur l'onglet **"Settings"**
3. Cherchez **"Domains"** ou **"Public URL"**
4. Vous verrez une URL comme :

```
https://joblink-production.up.railway.app
```

Ou :
```
https://joblink-xxxxxxxx.up.railway.app
```

---

## ✅ Étape 8 : Tester votre application

### Ouvrir dans le navigateur
Cliquez sur votre URL ou copiez-la dans la barre d'adresse.

### Tester l'API
Ouvrez ces URLs dans votre navigateur :

**Santé du serveur :**
```
https://joblink-production.up.railway.app/api/health
```

Vous devriez voir :
```json
{"success": true, "message": "Serveur en ligne"}
```

**Récupérer les offres :**
```
https://joblink-production.up.railway.app/api/jobs?limit=5
```

**Statistiques :**
```
https://joblink-production.up.railway.app/api/stats
```

---

## 🎉 C'est fait !

Votre application JobLink est maintenant **en ligne et gratuite** ! 🚀

---

## 📊 Résumé des étapes

| Étape | Action |
|-------|--------|
| 1 | Aller sur https://railway.app/dashboard |
| 2 | Cliquer sur "New Project" |
| 3 | Sélectionner "Deploy from GitHub" |
| 4 | Chercher et cliquer sur "Joblink.tn" |
| 5 | Cliquer sur "Deploy" |
| 6 | Attendre 2-5 minutes |
| 7 | Copier votre URL |
| 8 | Tester l'application |

---

## 🆘 Troubleshooting

### L'application ne démarre pas

1. Allez dans votre projet Railway
2. Cliquez sur **"Logs"**
3. Cherchez les erreurs (en rouge)
4. Vérifiez que le Procfile existe

### Erreur : "No Procfile found"

Vérifiez que le fichier **Procfile** existe dans votre repository.

Contenu du Procfile :
```
web: node server.js
```

### L'application est lente

C'est normal sur le plan gratuit. Vous pouvez :
- Passer à un plan payant
- Ou utiliser un autre service

---

## 📞 Support

- **Documentation Railway** : https://docs.railway.app/
- **Support Railway** : https://railway.app/support
- **Email JobLink** : tn.joblink@gmail.com

---

## ✨ Prochaines étapes

1. ✅ Tester votre application
2. ✅ Partager le lien avec vos amis
3. ✅ Configurer un domaine personnalisé (optionnel)
4. ✅ Ajouter le monitoring (optionnel)

---

**Bon déploiement ! 🚀**

Créé avec ❤️ pour les chercheurs d'emploi en Tunisie
