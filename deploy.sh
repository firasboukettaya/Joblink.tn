#!/bin/bash

# Script de déploiement automatique JobLink sur Heroku
# Usage: ./deploy.sh

set -e

echo "🚀 ========================================="
echo "   JobLink - Heroku Deployment Script"
echo "========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
HEROKU_APP_NAME="joblink-tunisia"
HEROKU_EMAIL="tn.joblink@gmail.com"
GIT_BRANCH="master"

echo -e "${YELLOW}📋 Étape 1 : Vérification des prérequis${NC}"
echo ""

# Vérifier Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git installé${NC}"

# Vérifier Heroku CLI
if ! command -v heroku &> /dev/null; then
    echo -e "${RED}❌ Heroku CLI n'est pas installé${NC}"
    echo "Installez-le depuis : https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi
echo -e "${GREEN}✓ Heroku CLI installé${NC}"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js installé ($(node --version))${NC}"

echo ""
echo -e "${YELLOW}📋 Étape 2 : Vérification du repository Git${NC}"
echo ""

# Vérifier si c'est un repository Git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Initialisation du repository Git${NC}"
    git init
    git config user.email "$HEROKU_EMAIL"
    git config user.name "JobLink Tunisia"
    git add .
    git commit -m "Initial commit: JobLink v1.0"
fi
echo -e "${GREEN}✓ Repository Git configuré${NC}"

echo ""
echo -e "${YELLOW}📋 Étape 3 : Vérification de la connexion Heroku${NC}"
echo ""

# Vérifier la connexion Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vous n'êtes pas connecté à Heroku${NC}"
    echo "Veuillez vous connecter :"
    heroku login
fi
echo -e "${GREEN}✓ Connecté à Heroku${NC}"

echo ""
echo -e "${YELLOW}📋 Étape 4 : Création de l'application Heroku${NC}"
echo ""

# Vérifier si l'app existe
if heroku apps:info --app "$HEROKU_APP_NAME" &> /dev/null; then
    echo -e "${GREEN}✓ Application '$HEROKU_APP_NAME' existe déjà${NC}"
else
    echo -e "${YELLOW}⚠️  Création de l'application '$HEROKU_APP_NAME'${NC}"
    heroku create "$HEROKU_APP_NAME" || true
    echo -e "${GREEN}✓ Application créée${NC}"
fi

echo ""
echo -e "${YELLOW}📋 Étape 5 : Configuration des variables d'environnement${NC}"
echo ""

heroku config:set DATABASE_URL=./joblink.db --app "$HEROKU_APP_NAME"
heroku config:set NODE_ENV=production --app "$HEROKU_APP_NAME"
heroku config:set SCRAPER_INTERVAL=3600 --app "$HEROKU_APP_NAME"

echo -e "${GREEN}✓ Variables d'environnement configurées${NC}"

echo ""
echo -e "${YELLOW}📋 Étape 6 : Déploiement du code${NC}"
echo ""

# Ajouter le remote Heroku
git remote remove heroku 2>/dev/null || true
heroku git:remote --app "$HEROKU_APP_NAME"

# Déployer
echo -e "${YELLOW}Envoi du code vers Heroku...${NC}"
git push heroku "$GIT_BRANCH" --force

echo ""
echo -e "${GREEN}✓ Code déployé avec succès${NC}"

echo ""
echo -e "${YELLOW}📋 Étape 7 : Vérification du déploiement${NC}"
echo ""

# Attendre que l'app démarre
echo -e "${YELLOW}Attente du démarrage de l'application...${NC}"
sleep 10

# Tester l'API
APP_URL="https://$HEROKU_APP_NAME.herokuapp.com"
echo -e "${YELLOW}Test de l'API : $APP_URL/api/health${NC}"

if curl -s "$APP_URL/api/health" | grep -q "success"; then
    echo -e "${GREEN}✓ Application en ligne et fonctionnelle${NC}"
else
    echo -e "${YELLOW}⚠️  L'application démarre, attendez quelques secondes...${NC}"
    sleep 5
fi

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✅ Déploiement réussi !${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${YELLOW}📊 Informations de l'application :${NC}"
echo ""
echo "  Application : $HEROKU_APP_NAME"
echo "  URL : $APP_URL"
echo "  Email : $HEROKU_EMAIL"
echo ""
echo -e "${YELLOW}📝 Prochaines étapes :${NC}"
echo ""
echo "  1. Ouvrir l'application :"
echo "     heroku open --app $HEROKU_APP_NAME"
echo ""
echo "  2. Voir les logs :"
echo "     heroku logs --tail --app $HEROKU_APP_NAME"
echo ""
echo "  3. Tester l'API :"
echo "     curl $APP_URL/api/health"
echo "     curl $APP_URL/api/stats"
echo ""
echo "  4. Configurer un domaine personnalisé :"
echo "     heroku domains:add www.joblink.tn --app $HEROKU_APP_NAME"
echo ""
echo -e "${YELLOW}📧 Support :${NC}"
echo "  Email : tn.joblink@gmail.com"
echo "  Documentation : https://devcenter.heroku.com/"
echo ""
