// Middleware de gestion d'erreurs global
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log des erreurs en développement
  if (process.env.NODE_ENV === "development") {
    console.error("Error Stack:", err.stack);
    console.error("Error Details:", err);
  }

  // Erreur de validation Mongoose
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      message: "Erreur de validation",
      error: message,
    });
  }

  // Erreur de duplicata (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} déjà existant`;
    return res.status(409).json({
      success: false,
      message: "Ressource déjà existante",
      error: message,
    });
  }

  // Erreur de cast MongoDB (ObjectId invalide)
  if (err.name === "CastError") {
    const message = "Ressource non trouvée - ID invalide";
    return res.status(400).json({
      success: false,
      message,
      error: "Format d'ID invalide",
    });
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token invalide",
      error: "Accès non autorisé",
    });
  }

  // Token expiré
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expiré",
      error: "Veuillez vous reconnecter",
    });
  }

  // Erreur par défaut
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Erreur interne du serveur",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
