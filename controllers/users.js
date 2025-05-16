const User = require("../models/User");
const Recette = require("../models/Recette");

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs",
      error: err.message,
    });
  }
};

// @desc    Obtenir un utilisateur par ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'utilisateur",
      error: err.message,
    });
  }
};

// @desc    Mettre à jour un utilisateur
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error: err.message,
    });
  }
};

// @desc    Supprimer un utilisateur
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'utilisateur",
      error: err.message,
    });
  }
};

// @desc    Obtenir le profil d'un utilisateur avec ses recettes
// @route   GET /api/users/:id/profile
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Récupérer les recettes créées par l'utilisateur
    const recettes = await Recette.find({ createur: req.params.id });

    res.status(200).json({
      success: true,
      data: {
        user,
        recettes,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
      error: err.message,
    });
  }
};

// @desc    Obtenir les recettes favorites d'un utilisateur
// @route   GET /api/users/:id/favoris
// @access  Private
exports.getUserFavoris = async (req, res) => {
  try {
    // Vérifier si l'utilisateur demande ses propres favoris ou si c'est un admin
    if (req.params.id !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Non autorisé à accéder à ces favoris",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Récupérer les recettes favorites avec les détails
    const favoris = await Recette.find({
      _id: { $in: user.recettesFavorites },
    }).populate({
      path: "createur",
      select: "nom prenom avatar",
    });

    res.status(200).json({
      success: true,
      count: favoris.length,
      data: favoris,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des favoris",
      error: err.message,
    });
  }
};

// @desc    Mettre à jour l'avatar de l'utilisateur
// @route   PUT /api/users/:id/avatar
// @access  Private
exports.updateAvatar = async (req, res) => {
  try {
    // Vérifier si l'utilisateur met à jour son propre avatar ou si c'est un admin
    if (req.params.id !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Non autorisé à mettre à jour cet avatar",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Veuillez télécharger une image",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: req.file.filename },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'avatar",
      error: err.message,
    });
  }
};
