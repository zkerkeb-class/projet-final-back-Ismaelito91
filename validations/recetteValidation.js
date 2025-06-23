const Joi = require("joi");

// Schéma pour un ingrédient
const ingredientSchema = Joi.object({
  nom: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Le nom de l'ingrédient est obligatoire",
    "string.min": "Le nom de l'ingrédient doit contenir au moins 1 caractère",
    "string.max": "Le nom de l'ingrédient ne peut pas dépasser 100 caractères",
    "any.required": "Le nom de l'ingrédient est obligatoire",
  }),

  quantite: Joi.string().required().messages({
    "string.empty": "La quantité est obligatoire",
    "any.required": "La quantité est obligatoire",
  }),

  unite: Joi.string().allow("").optional(),
});

// Schéma de validation pour la création d'une recette
const createRecetteSchema = Joi.object({
  titre: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Le titre est obligatoire",
    "string.min": "Le titre doit contenir au moins 3 caractères",
    "string.max": "Le titre ne peut pas dépasser 100 caractères",
    "any.required": "Le titre est obligatoire",
  }),

  description: Joi.string().min(10).max(1000).required().messages({
    "string.empty": "La description est obligatoire",
    "string.min": "La description doit contenir au moins 10 caractères",
    "string.max": "La description ne peut pas dépasser 1000 caractères",
    "any.required": "La description est obligatoire",
  }),

  ingredients: Joi.array().items(ingredientSchema).min(1).required().messages({
    "array.min": "Au moins un ingrédient est requis",
    "any.required": "Les ingrédients sont obligatoires",
  }),

  etapesPreparation: Joi.array()
    .items(
      Joi.string().min(5).max(500).messages({
        "string.min": "Chaque étape doit contenir au moins 5 caractères",
        "string.max": "Chaque étape ne peut pas dépasser 500 caractères",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Au moins une étape de préparation est requise",
      "any.required": "Les étapes de préparation sont obligatoires",
    }),

  tempsPreparation: Joi.number()
    .integer()
    .min(1)
    .max(1440) // Max 24 heures en minutes
    .required()
    .messages({
      "number.base": "Le temps de préparation doit être un nombre",
      "number.integer": "Le temps de préparation doit être un nombre entier",
      "number.min": "Le temps de préparation doit être d'au moins 1 minute",
      "number.max":
        "Le temps de préparation ne peut pas dépasser 1440 minutes (24h)",
      "any.required": "Le temps de préparation est obligatoire",
    }),

  tempsCuisson: Joi.number().integer().min(0).max(1440).optional().messages({
    "number.base": "Le temps de cuisson doit être un nombre",
    "number.integer": "Le temps de cuisson doit être un nombre entier",
    "number.min": "Le temps de cuisson ne peut pas être négatif",
    "number.max": "Le temps de cuisson ne peut pas dépasser 1440 minutes (24h)",
  }),

  portions: Joi.number().integer().min(1).max(50).required().messages({
    "number.base": "Le nombre de portions doit être un nombre",
    "number.integer": "Le nombre de portions doit être un nombre entier",
    "number.min": "Le nombre de portions doit être d'au moins 1",
    "number.max": "Le nombre de portions ne peut pas dépasser 50",
    "any.required": "Le nombre de portions est obligatoire",
  }),

  difficulte: Joi.string()
    .valid("Facile", "Moyen", "Difficile")
    .optional()
    .messages({
      "any.only": "La difficulté doit être Facile, Moyen ou Difficile",
    }),

  categories: Joi.array()
    .items(Joi.string().min(2).max(50))
    .min(1)
    .required()
    .messages({
      "array.min": "Au moins une catégorie est requise",
      "any.required": "Les catégories sont obligatoires",
    }),

  tags: Joi.array().items(Joi.string().min(2).max(30)).optional(),
});

// Schéma de validation pour la mise à jour d'une recette
const updateRecetteSchema = Joi.object({
  titre: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(10).max(1000).optional(),
  ingredients: Joi.array().items(ingredientSchema).min(1).optional(),
  etapesPreparation: Joi.array()
    .items(Joi.string().min(5).max(500))
    .min(1)
    .optional(),
  tempsPreparation: Joi.number().integer().min(1).max(1440).optional(),
  tempsCuisson: Joi.number().integer().min(0).max(1440).optional(),
  portions: Joi.number().integer().min(1).max(50).optional(),
  difficulte: Joi.string().valid("Facile", "Moyen", "Difficile").optional(),
  categories: Joi.array().items(Joi.string().min(2).max(50)).min(1).optional(),
  tags: Joi.array().items(Joi.string().min(2).max(30)).optional(),
});

// Schéma de validation pour ajouter une note
const addNoteSchema = Joi.object({
  valeur: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "La note doit être un nombre",
    "number.integer": "La note doit être un nombre entier",
    "number.min": "La note doit être au minimum de 1",
    "number.max": "La note doit être au maximum de 5",
    "any.required": "La note est obligatoire",
  }),
});

module.exports = {
  createRecetteSchema,
  updateRecetteSchema,
  addNoteSchema,
};
