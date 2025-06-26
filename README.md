# MonPetitChef API

**Nom Prénom:** Ismael CEREZO

API backend pour l'application de recettes de cuisine MonPetitChef.

## Liste des fonctionnalités

### ✅ Fonctionnalités principales

- **Authentification complète** : Inscription, connexion, déconnexion avec JWT
- **CRUD Recettes** : Création, lecture, mise à jour, suppression des recettes
- **CRUD Commentaires** : Système de commentaires complet sur les recettes
- **Gestion utilisateurs** : Profils, mise à jour des informations personnelles
- **Upload d'images** : Images pour recettes et avatars utilisateurs (Multer)
- **Système de notation** : Notes de 1 à 5 étoiles pour les recettes
- **Favoris** : Ajout/suppression de recettes favorites
- **Recherche et filtrage** : Par nom, ingrédients, catégories, difficulté
- **Pagination** : Navigation efficace dans les listes de recettes
- **Validation** : Validation complète des données avec Joi
- **Gestion d'erreurs** : Middleware de gestion d'erreurs centralisé
- **Sécurité** : Protection des routes, authentification JWT, hachage bcrypt

### 🎯 Fonctionnalités avancées

- **Recettes populaires** : Tri par note moyenne
- **Recettes récentes** : Tri par date de création
- **Calcul automatique** : Note moyenne des recettes
- **Relations de données** : Population des références utilisateurs/recettes
- **Middleware personnalisés** : Authentification, autorisation, upload
- **Structure MVC** : Architecture propre et organisée

## Liste des bonus

### 🚀 Bonus implémentés

- **Gestion des catégories** : Catégorisation flexible des recettes
- **Système de tags** : Tags personnalisés pour les recettes
- **Temps de préparation/cuisson** : Gestion détaillée des temps
- **Portions** : Nombre de portions par recette
- **Niveaux de difficulté** : Facile, Moyen, Difficile
- **Profils utilisateurs** : Avatar, nom, prénom, email
- **API RESTful complète** : Codes de statut HTTP appropriés
- **Base de données optimisée** : Index et relations MongoDB
- **Upload sécurisé** : Limitation de taille (5MB) et types de fichiers
- **Validation robuste** : Messages d'erreur personnalisés en français
- **CORS configuré** : Support pour applications front-end
- **Logging** : Middleware de logging des requêtes
- **Environnement configurable** : Variables d'environnement (.env)

### 🔧 Bonus techniques

- **Middleware de validation** : Validation centralisée avec Joi
- **Gestion des erreurs async** : Try/catch sur toutes les routes
- **Sécurité des uploads** : Filtrage des types MIME
- **Nommage unique** : Fichiers uploadés avec timestamp
- **Population automatique** : Relations utilisateur/recette/commentaire
- **Recherche flexible** : Regex pour recherche insensible à la casse
- **Structure modulaire** : Séparation claire des responsabilités

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
