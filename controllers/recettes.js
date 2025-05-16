const Recette = require("../models/Recette");
const User = require("../models/User");

// @desc    Obtenir toutes les recettes
// @route   GET /api/recettes
// @access  Public
exports.getRecettes = async (req, res) => {
  try {
    // Copier req.query pour ne pas le modifier directement
    const reqQuery = { ...req.query };

    // Champs à exclure
    const removeFields = ["select", "sort", "page", "limit", "search"];
    removeFields.forEach((param) => delete reqQuery[param]);

    // Créer la chaîne de requête
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Recherche par mot-clé (titre ou description)
    let query = Recette.find(JSON.parse(queryStr));

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query = query.or([
        { titre: searchRegex },
        { description: searchRegex },
        { "ingredients.nom": searchRegex },
        { categories: searchRegex },
      ]);
    }

    // Sélectionner des champs spécifiques
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Trier
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-dateCreation");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Recette.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Exécuter la requête
    const recettes = await query.populate({
      path: "createur",
      select: "nom prenom avatar",
    });

    // Informations de pagination
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: recettes.length,
      pagination,
      data: recettes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des recettes",
      error: err.message,
    });
  }
};

// @desc    Obtenir une seule recette
// @route   GET /api/recettes/:id
// @access  Public
exports.getRecette = async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.id).populate([
      {
        path: "createur",
        select: "nom prenom avatar",
      },
      {
        path: "notes.utilisateur",
        select: "nom prenom avatar",
      },
    ]);

    if (!recette) {
      return res.status(404).json({
        success: false,
        message: "Recette non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      data: recette,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la recette",
      error: err.message,
    });
  }
};

// @desc    Créer une nouvelle recette
// @route   POST /api/recettes
// @access  Private
exports.createRecette = async (req, res) => {
  try {
    // Ajouter l'utilisateur à la requête
    req.body.createur = req.user.id;

    // Traiter l'image si elle existe
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const recette = await Recette.create(req.body);

    res.status(201).json({
      success: true,
      data: recette,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la recette",
      error: err.message,
    });
  }
};

// @desc    Mettre à jour une recette
// @route   PUT /api/recettes/:id
// @access  Private
exports.updateRecette = async (req, res) => {
  try {
    let recette = await Recette.findById(req.params.id);

    if (!recette) {
      return res.status(404).json({
        success: false,
        message: "Recette non trouvée",
      });
    }

    // Vérifier si l'utilisateur est le créateur de la recette
    if (
      recette.createur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Non autorisé à mettre à jour cette recette",
      });
    }

    // Traiter l'image si elle existe
    if (req.file) {
      req.body.image = req.file.filename;
    }

    recette = await Recette.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: recette,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la recette",
      error: err.message,
    });
  }
};

// @desc    Supprimer une recette
// @route   DELETE /api/recettes/:id
// @access  Private
exports.deleteRecette = async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.id);

    if (!recette) {
      return res.status(404).json({
        success: false,
        message: "Recette non trouvée",
      });
    }

    // Vérifier si l'utilisateur est le créateur de la recette
    if (
      recette.createur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Non autorisé à supprimer cette recette",
      });
    }

    await recette.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la recette",
      error: err.message,
    });
  }
};

// @desc    Ajouter une note à une recette
// @route   POST /api/recettes/:id/notes
// @access  Private
exports.addNote = async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.id);

    if (!recette) {
      return res.status(404).json({
        success: false,
        message: "Recette non trouvée",
      });
    }

    // Vérifier si l'utilisateur a déjà noté cette recette
    const noteExistante = recette.notes.find(
      (note) => note.utilisateur.toString() === req.user.id
    );

    if (noteExistante) {
      // Mettre à jour la note existante
      noteExistante.valeur = req.body.valeur;
    } else {
      // Ajouter une nouvelle note
      recette.notes.push({
        utilisateur: req.user.id,
        valeur: req.body.valeur,
      });
    }

    // Calculer la note moyenne
    recette.calculerNoteMoyenne();

    await recette.save();

    res.status(200).json({
      success: true,
      data: recette,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de la note",
      error: err.message,
    });
  }
};

// @desc    Obtenir les recettes populaires
// @route   GET /api/recettes/populaires
// @access  Public
exports.getRecettesPopulaires = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const recettes = await Recette.find()
      .sort({ noteMoyenne: -1 })
      .limit(limit)
      .populate({
        path: "createur",
        select: "nom prenom avatar",
      });

    res.status(200).json({
      success: true,
      count: recettes.length,
      data: recettes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des recettes populaires",
      error: err.message,
    });
  }
};

// @desc    Obtenir les recettes récentes
// @route   GET /api/recettes/recentes
// @access  Public
exports.getRecettesRecentes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const recettes = await Recette.find()
      .sort({ dateCreation: -1 })
      .limit(limit)
      .populate({
        path: "createur",
        select: "nom prenom avatar",
      });

    res.status(200).json({
      success: true,
      count: recettes.length,
      data: recettes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des recettes récentes",
      error: err.message,
    });
  }
};

// @desc    Ajouter une recette aux favoris
// @route   POST /api/recettes/:id/favoris
// @access  Private
exports.ajouterFavori = async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.id);

    if (!recette) {
      return res.status(404).json({
        success: false,
        message: "Recette non trouvée",
      });
    }

    const user = await User.findById(req.user.id);
    user.ajouterFavori(recette._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Recette ajoutée aux favoris",
      data: user.recettesFavorites,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout aux favoris",
      error: err.message,
    });
  }
};

// @desc    Retirer une recette des favoris
// @route   DELETE /api/recettes/:id/favoris
// @access  Private
exports.retirerFavori = async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.id);

    if (!recette) {
      return res.status(404).json({
        success: false,
        message: "Recette non trouvée",
      });
    }

    const user = await User.findById(req.user.id);
    user.retirerFavori(recette._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Recette retirée des favoris",
      data: user.recettesFavorites,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du retrait des favoris",
      error: err.message,
    });
  }
};
