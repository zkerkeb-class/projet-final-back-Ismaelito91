const User = require("../models/User");

// @desc    Inscrire un utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà",
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      nom,
      prenom,
      email,
      password,
    });

    // Générer le token et renvoyer la réponse
    sendTokenResponse(user, 201, res, "Inscription réussie");
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);

    // Gérer les erreurs de validation Mongoose
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur lors de l'inscription",
    });
  }
};

// @desc    Connecter un utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier si le mot de passe correspond
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Générer le token et renvoyer la réponse
    sendTokenResponse(user, 200, res, "Connexion réussie");
  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur lors de la connexion",
    });
  }
};

// @desc    Déconnecter l'utilisateur
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (err) {
    console.error("Erreur lors de la déconnexion:", err);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur lors de la déconnexion",
    });
  }
};

// @desc    Obtenir l'utilisateur actuellement connecté
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profil récupéré avec succès",
      data: user,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération du profil:", err);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur lors de la récupération du profil",
    });
  }
};

// @desc    Mettre à jour les informations de l'utilisateur
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
    };

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (req.body.email) {
      const existingUser = await User.findOne({
        email: req.body.email,
        _id: { $ne: req.user.id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Cet email est déjà utilisé par un autre utilisateur",
        });
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profil mis à jour avec succès",
      data: user,
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du profil:", err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur lors de la mise à jour du profil",
    });
  }
};

// @desc    Mettre à jour le mot de passe
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Vérifier le mot de passe actuel
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Le mot de passe actuel est incorrect",
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Mot de passe mis à jour avec succès");
  } catch (err) {
    console.error("Erreur lors de la mise à jour du mot de passe:", err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Erreur interne du serveur lors de la mise à jour du mot de passe",
    });
  }
};

// Fonction utilitaire pour envoyer le token de réponse
const sendTokenResponse = (
  user,
  statusCode,
  res,
  message = "Opération réussie"
) => {
  try {
    // Créer le token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
      success: true,
      message,
      token,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        dateInscription: user.dateInscription,
      },
    });
  } catch (err) {
    console.error("Erreur lors de la génération du token:", err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la génération du token d'authentification",
    });
  }
};
