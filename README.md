# MonPetitChef API

API backend pour l'application de recettes de cuisine MonPetitChef.

## Technologies utilisées

- Node.js
- Express
- MongoDB avec Mongoose
- JWT pour l'authentification
- Multer pour l'upload d'images

## Installation

1. Cloner le dépôt

```
git clone <url-du-repo>
cd monpetitchef-api
```

2. Installer les dépendances

```
npm install
```

3. Configurer les variables d'environnement
   Créer un fichier `.env` à la racine du projet avec les variables suivantes :

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/monpetitchef
JWT_SECRET=votre_secret_jwt
JWT_EXPIRE=30d
```

4. Lancer le serveur

```
npm run dev
```

## Structure du projet

- `server.js` - Point d'entrée de l'application
- `/models` - Modèles de données Mongoose
- `/controllers` - Logique métier
- `/routes` - Définition des routes API
- `/middleware` - Middleware personnalisé (auth, upload, etc.)
- `/uploads` - Stockage des images uploadées

## Routes API

### Authentification

- POST `/api/auth/register` - Inscription d'un utilisateur
- POST `/api/auth/login` - Connexion d'un utilisateur
- GET `/api/auth/logout` - Déconnexion
- GET `/api/auth/me` - Obtenir le profil de l'utilisateur connecté
- PUT `/api/auth/updatedetails` - Mettre à jour les informations de l'utilisateur
- PUT `/api/auth/updatepassword` - Mettre à jour le mot de passe

### Recettes

- GET `/api/recettes` - Obtenir toutes les recettes (avec filtrage, tri et pagination)
- GET `/api/recettes/:id` - Obtenir une recette spécifique
- POST `/api/recettes` - Créer une nouvelle recette
- PUT `/api/recettes/:id` - Mettre à jour une recette
- DELETE `/api/recettes/:id` - Supprimer une recette
- GET `/api/recettes/populaires` - Obtenir les recettes les plus populaires
- GET `/api/recettes/recentes` - Obtenir les recettes les plus récentes
- POST `/api/recettes/:id/notes` - Noter une recette
- POST `/api/recettes/:id/favoris` - Ajouter une recette aux favoris
- DELETE `/api/recettes/:id/favoris` - Retirer une recette des favoris

### Commentaires

- GET `/api/recettes/:recetteId/commentaires` - Obtenir tous les commentaires d'une recette
- POST `/api/recettes/:recetteId/commentaires` - Ajouter un commentaire
- PUT `/api/commentaires/:id` - Mettre à jour un commentaire
- DELETE `/api/commentaires/:id` - Supprimer un commentaire

### Utilisateurs

- GET `/api/users` - Obtenir tous les utilisateurs (admin)
- GET `/api/users/:id` - Obtenir un utilisateur spécifique (admin)
- PUT `/api/users/:id` - Mettre à jour un utilisateur (admin)
- DELETE `/api/users/:id` - Supprimer un utilisateur (admin)
- GET `/api/users/:id/profile` - Obtenir le profil d'un utilisateur avec ses recettes
- GET `/api/users/:id/favoris` - Obtenir les recettes favorites d'un utilisateur
- PUT `/api/users/:id/avatar` - Mettre à jour l'avatar d'un utilisateur

## Fonctionnalités

- CRUD complet pour les recettes
- Système d'authentification sécurisé
- Upload d'images pour les recettes et avatars
- Système de notation et commentaires
- Gestion des favoris
- Filtrage, tri et pagination des recettes
- Recherche par nom, ingrédient ou catégorie
