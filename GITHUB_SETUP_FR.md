# 📚 Guide : Créer un Repository GitHub

## 🎯 Objectif

Créer un repository GitHub pour votre projet JobLink afin de pouvoir le déployer sur Railway.

---

## ✅ Prérequis

- ✅ Compte GitHub (firasboukettaya)
- ✅ Accès à https://github.com/

---

## 🚀 Étape 1 : Aller sur GitHub

1. Ouvrez votre navigateur
2. Allez sur **https://github.com/**
3. Connectez-vous avec vos identifiants :
   - **Username** : firasboukettaya
   - **Password** : (votre mot de passe GitHub)

---

## 📝 Étape 2 : Créer un nouveau repository

### Méthode 1 : Via le bouton "+" (Recommandé)

1. En haut à droite de GitHub, cliquez sur le **"+"** (plus)
2. Sélectionnez **"New repository"**

### Méthode 2 : Via le lien direct

Allez directement sur : **https://github.com/new**

---

## 📋 Étape 3 : Remplir le formulaire

Vous verrez un formulaire. Remplissez-le comme suit :

### 1. Repository name (Nom du repository)
```
joblink
```
⚠️ **Important** : Utilisez exactement ce nom

### 2. Description (Optionnel)
```
Job portal with automatic scraping from Tunisian job sites
```

### 3. Public ou Private ?
- ✅ Sélectionnez **"Public"**
- (Cela permet à Railway de y accéder)

### 4. Initialize this repository with
- ❌ **Ne cochez RIEN** (vous avez déjà le code)

### 5. Cliquez sur "Create repository"

---

## ✅ Étape 4 : Votre repository est créé !

Vous verrez une page avec :
- URL : `https://github.com/firasboukettaya/joblink`
- Instructions pour pousser le code

---

## 📤 Étape 5 : Pousser votre code vers GitHub

Maintenant, vous devez envoyer votre code local vers GitHub.

### Option A : Avec les commandes Git (Recommandé)

Ouvrez un terminal et exécutez :

```bash
# Aller dans le dossier du projet
cd /home/ubuntu/joblink

# Ajouter le remote GitHub
git remote add origin https://github.com/firasboukettaya/joblink.git

# Renommer la branche en "main"
git branch -M main

# Pousser le code
git push -u origin main
```

**Vous verrez :**
```
Enumerating objects: 39, done.
Counting objects: 100% (39/39), done.
Delta compression using up to 4 threads
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **C'est bon !** Votre code est maintenant sur GitHub.

### Option B : Avec GitHub Desktop (Plus facile)

1. Téléchargez **GitHub Desktop** : https://desktop.github.com/
2. Installez et connectez-vous
3. Cliquez sur **"Add"** → **"Add Existing Repository"**
4. Sélectionnez le dossier `/home/ubuntu/joblink`
5. Cliquez sur **"Publish repository"**
6. Sélectionnez **"Public"**
7. Cliquez sur **"Publish Repository"**

---

## ✅ Vérifier que tout est bon

1. Allez sur **https://github.com/firasboukettaya/joblink**
2. Vous devriez voir :
   - ✅ Tous vos fichiers
   - ✅ Les commits (messages Git)
   - ✅ Le README.md

---

## 🎯 Prochaine étape : Déployer sur Railway

Une fois que votre code est sur GitHub, vous pouvez :

1. Allez sur https://railway.app/dashboard
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Deploy from GitHub"**
4. Sélectionnez **joblink**
5. Cliquez sur **"Deploy"**

Railway fera le reste automatiquement ! 🚀

---

## 🆘 Troubleshooting

### Erreur : "fatal: remote origin already exists"

```bash
# Supprimer le remote existant
git remote remove origin

# Ajouter le nouveau
git remote add origin https://github.com/firasboukettaya/joblink.git

# Pousser
git push -u origin main
```

### Erreur : "Permission denied (publickey)"

Vous devez configurer votre clé SSH GitHub :

1. Allez sur https://github.com/settings/keys
2. Cliquez sur **"New SSH key"**
3. Suivez les instructions : https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Le code ne s'affiche pas sur GitHub

Attendez quelques secondes et rafraîchissez la page (F5).

---

## 📊 Résumé

| Étape | Action |
|-------|--------|
| 1 | Aller sur https://github.com/new |
| 2 | Remplir le formulaire (joblink, Public) |
| 3 | Cliquer sur "Create repository" |
| 4 | Exécuter les commandes Git |
| 5 | Vérifier sur GitHub |

---

## ✨ Prochaines étapes

1. ✅ Créer le repository GitHub
2. ✅ Pousser le code
3. ✅ Déployer sur Railway
4. ✅ Partager votre URL !

---

## 📞 Support

- **Documentation GitHub** : https://docs.github.com/
- **Email JobLink** : tn.joblink@gmail.com

---

**C'est simple ! Vous y êtes presque ! 🚀**
