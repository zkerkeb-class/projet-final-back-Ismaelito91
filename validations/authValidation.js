const Joi = require("joi");

// Schéma de validation pour l'inscription
const registerSchema = Joi.object({
  nom: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Le nom est obligatoire",
    "string.min": "Le nom doit contenir au moins 2 caractères",
    "string.max": "Le nom ne peut pas dépasser 50 caractères",
    "any.required": "Le nom est obligatoire",
  }),

  prenom: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Le prénom est obligatoire",
    "string.min": "Le prénom doit contenir au moins 2 caractères",
    "string.max": "Le prénom ne peut pas dépasser 50 caractères",
    "any.required": "Le prénom est obligatoire",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "L'email est obligatoire",
    "string.email": "Veuillez fournir un email valide",
    "any.required": "L'email est obligatoire",
  }),

  password: Joi.string().min(6).max(128).required().messages({
    "string.empty": "Le mot de passe est obligatoire",
    "string.min": "Le mot de passe doit contenir au moins 6 caractères",
    "string.max": "Le mot de passe ne peut pas dépasser 128 caractères",
    "any.required": "Le mot de passe est obligatoire",
  }),
});

// Schéma de validation pour la connexion
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "L'email est obligatoire",
    "string.email": "Veuillez fournir un email valide",
    "any.required": "L'email est obligatoire",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Le mot de passe est obligatoire",
    "any.required": "Le mot de passe est obligatoire",
  }),
});

// Schéma de validation pour la mise à jour du profil
const updateDetailsSchema = Joi.object({
  nom: Joi.string().min(2).max(50).optional(),
  prenom: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
});

// Schéma de validation pour la mise à jour du mot de passe
const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Le mot de passe actuel est obligatoire",
    "any.required": "Le mot de passe actuel est obligatoire",
  }),

  newPassword: Joi.string().min(6).max(128).required().messages({
    "string.empty": "Le nouveau mot de passe est obligatoire",
    "string.min": "Le nouveau mot de passe doit contenir au moins 6 caractères",
    "string.max": "Le nouveau mot de passe ne peut pas dépasser 128 caractères",
    "any.required": "Le nouveau mot de passe est obligatoire",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateDetailsSchema,
  updatePasswordSchema,
};
