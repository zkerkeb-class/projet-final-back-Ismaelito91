// Middleware générique pour valider les données avec Joi
const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Collecter toutes les erreurs
      allowUnknown: true, // Permettre des champs non définis dans le schéma
      stripUnknown: true, // Supprimer les champs non définis
    });

    if (error) {
      // Extraire les messages d'erreur
      const errorMessages = error.details.map((detail) => detail.message);

      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: errorMessages,
      });
    }

    // Remplacer les données de la requête par les données validées et nettoyées
    req[property] = value;
    next();
  };
};

module.exports = validate;
