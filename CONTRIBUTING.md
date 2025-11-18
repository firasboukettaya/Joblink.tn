# Guide de contribution - JobLink

Merci de votre intérêt pour contribuer à JobLink ! Ce guide vous aidera à contribuer efficacement au projet.

## 🤝 Comment contribuer

### 1. Signaler un bug

Si vous trouvez un bug, créez une issue GitHub avec :
- Description claire du problème
- Étapes pour reproduire
- Comportement attendu vs réel
- Environnement (OS, Node.js version, etc.)

### 2. Proposer une fonctionnalité

Avant de développer une nouvelle fonctionnalité :
1. Créez une issue pour discuter de l'idée
2. Attendez l'approbation des mainteneurs
3. Forkez le repository
4. Créez une branche : `git checkout -b feature/ma-fonctionnalite`
5. Développez et testez
6. Créez une pull request

### 3. Améliorer la documentation

- Corrigez les fautes de frappe
- Clarifiez les instructions
- Ajoutez des exemples
- Traduisez en d'autres langues

## 📋 Checklist avant de soumettre

- [ ] Code testé localement
- [ ] Pas d'erreurs console
- [ ] Documentation mise à jour
- [ ] Commit messages clairs
- [ ] Pas de fichiers sensibles (`.env`, `*.db`)

## 🛠️ Configuration de développement

```bash
# Cloner et installer
git clone https://github.com/votre-username/joblink.git
cd joblink
pnpm install

# Démarrer le serveur
pnpm start

# Démarrer le frontend
cd client
pnpm dev
```

## 📝 Conventions de code

### JavaScript/Node.js
- Utilisez `const` par défaut, `let` si nécessaire
- Noms de variables explicites
- Commentaires pour la logique complexe
- Gestion des erreurs robuste

### React
- Composants fonctionnels avec hooks
- Props bien typées (JSDoc)
- Noms de fichiers en PascalCase
- Styles CSS modulaires

### Commits
```
feat: ajouter la gestion des favoris
fix: corriger le bug de pagination
docs: mettre à jour le README
style: formater le code
test: ajouter les tests unitaires
```

## 🧪 Tests

```bash
# Tester l'API
curl http://localhost:3000/api/health

# Tester le scraping
curl -X POST http://localhost:3000/api/scrape

# Tester les filtres
curl "http://localhost:3000/api/jobs?search=Developer&source=linkedin"
```

## 📚 Ressources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Express Documentation](https://expressjs.com/)

## 🎯 Domaines d'amélioration

- [ ] Ajouter les tests unitaires
- [ ] Améliorer le scraping LinkedIn
- [ ] Ajouter l'authentification utilisateur
- [ ] Implémenter les favoris
- [ ] Ajouter les notifications par email
- [ ] Créer une application mobile
- [ ] Ajouter le support multilingue

## 📞 Questions ?

- Créez une issue GitHub
- Envoyez un email : Tn.joblink@gmail.com
- Consultez la documentation

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT.

---

**Merci de contribuer à JobLink ! 🙏**
