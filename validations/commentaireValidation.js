const Joi = require("joi");

// Schéma de validation pour créer un commentaire
const createCommentaireSchema = Joi.object({
  texte: Joi.string().min(5).max(500).required().messages({
    "string.empty": "Le texte du commentaire est obligatoire",
    "string.min": "Le commentaire doit contenir au moins 5 caractères",
    "string.max": "Le commentaire ne peut pas dépasser 500 caractères",
    "any.required": "Le texte du commentaire est obligatoire",
  }),
});

// Schéma de validation pour mettre à jour un commentaire
const updateCommentaireSchema = Joi.object({
  texte: Joi.string().min(5).max(500).required().messages({
    "string.empty": "Le texte du commentaire est obligatoire",
    "string.min": "Le commentaire doit contenir au moins 5 caractères",
    "string.max": "Le commentaire ne peut pas dépasser 500 caractères",
    "any.required": "Le texte du commentaire est obligatoire",
  }),
});

module.exports = {
  createCommentaireSchema,
  updateCommentaireSchema,
};
