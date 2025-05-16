const Commentaire = require("../models/Commentaire");
const Recette = require("../models/Recette");

// @desc    Obtenir tous les commentaires d'une recette
// @route   GET /api/recettes/:recetteId/commentaires
// @access  Public
exports.getCommentaires = async (req, res) => {
  try {
    const commentaires = await Commentaire.find({
      recette: req.params.recetteId,
    })
      .sort({ dateCreation: -1 })
      .populate({
        path: "utilisateur",
        select: "nom prenom avatar",
      });

    res.status(200).json({
      success: true,
      count: commentaires.length,
      data: commentaires,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commentaires",
      error: err.message,
    });
  }
};

// @desc    Ajouter un commentaire à une recette
// @route   POST /api/recettes/:recetteId/commentaires
// @access  Private
exports.addCommentaire = async (req, res) => {
  try {
    // Vérifier si la recette existe
    const recette = await Recette.findById(req.params.recetteId);
    if (!recette) {
      return res.status(404).json({
        success: false,
        message: "Recette non trouvée",
      });
    }

    // Créer le commentaire
    const commentaire = await Commentaire.create({
      texte: req.body.texte,
      recette: req.params.recetteId,
      utilisateur: req.user.id,
    });

    // Récupérer le commentaire avec les infos utilisateur
    const commentairePopulated = await Commentaire.findById(
      commentaire._id
    ).populate({
      path: "utilisateur",
      select: "nom prenom avatar",
    });

    res.status(201).json({
      success: true,
      data: commentairePopulated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout du commentaire",
      error: err.message,
    });
  }
};

// @desc    Mettre à jour un commentaire
// @route   PUT /api/commentaires/:id
// @access  Private
exports.updateCommentaire = async (req, res) => {
  try {
    let commentaire = await Commentaire.findById(req.params.id);

    if (!commentaire) {
      return res.status(404).json({
        success: false,
        message: "Commentaire non trouvé",
      });
    }

    // Vérifier si l'utilisateur est l'auteur du commentaire
    if (
      commentaire.utilisateur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Non autorisé à modifier ce commentaire",
      });
    }

    commentaire = await Commentaire.findByIdAndUpdate(
      req.params.id,
      { texte: req.body.texte },
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "utilisateur",
      select: "nom prenom avatar",
    });

    res.status(200).json({
      success: true,
      data: commentaire,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du commentaire",
      error: err.message,
    });
  }
};

// @desc    Supprimer un commentaire
// @route   DELETE /api/commentaires/:id
// @access  Private
exports.deleteCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.findById(req.params.id);

    if (!commentaire) {
      return res.status(404).json({
        success: false,
        message: "Commentaire non trouvé",
      });
    }

    // Vérifier si l'utilisateur est l'auteur du commentaire
    if (
      commentaire.utilisateur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Non autorisé à supprimer ce commentaire",
      });
    }

    await commentaire.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du commentaire",
      error: err.message,
    });
  }
};
