const express = require("express");
const User = require("../models/User");
const Recette = require("../models/Recette");
const Commentaire = require("../models/Commentaire");

const router = express.Router();

// Route pour voir toutes les données de test
router.get("/database-content", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const recettes = await Recette.find().populate(
      "createur",
      "nom prenom email"
    );
    const commentaires = await Commentaire.find().populate([
      { path: "utilisateur", select: "nom prenom email" },
      { path: "recette", select: "titre" },
    ]);

    res.status(200).json({
      success: true,
      message: "Contenu de la base de données",
      data: {
        totalUsers: users.length,
        totalRecettes: recettes.length,
        totalCommentaires: commentaires.length,
        users: users,
        recettes: recettes,
        commentaires: commentaires,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des données",
      error: err.message,
    });
  }
});

// Route pour vider la base de données (ATTENTION : à utiliser avec précaution)
router.delete("/clear-database", async (req, res) => {
  try {
    await User.deleteMany({});
    await Recette.deleteMany({});
    await Commentaire.deleteMany({});

    res.status(200).json({
      success: true,
      message: "Base de données vidée avec succès",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du vidage de la base",
      error: err.message,
    });
  }
});

module.exports = router;
