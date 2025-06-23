require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Afficher les variables d'environnement pour le débogage
console.log("MONGODB_URI:", process.env.MONGODB_URI);

// Import des routes
const recettesRoutes = require("./routes/recettes");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const commentairesRoutes = require("./routes/commentaires");
const testRoutes = require("./routes/test");

// Import du middleware d'erreur
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware de logging pour déboguer les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Body:", req.body);
  next();
});

// Routes
app.use("/api/recettes", recettesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/commentaires", commentairesRoutes);
app.use("/api/test", testRoutes);

// Route de base
app.get("/", (req, res) => {
  res.send("API de MonPetitChef est en ligne!");
});

// Middleware de gestion d'erreurs (doit être après toutes les routes)
app.use(errorHandler);

// Configuration de MongoDB
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

// Connexion à MongoDB avec plus de logs
console.log(
  "Tentative de connexion à MongoDB avec URI:",
  process.env.MONGODB_URI
);

// Ajouter des listeners d'événements MongoDB
mongoose.connection.on("connected", () => {
  console.log("Mongoose est connecté");
});

mongoose.connection.on("error", (err) => {
  console.log("Erreur de connexion Mongoose:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose est déconnecté");
});

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, mongooseOptions)
  .then(async () => {
    console.log("Connecté à MongoDB avec succès");

    // Lister les collections existantes
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections dans la base de données:",
      collections.map((c) => c.name)
    );

    // Créer le dossier uploads s'il n'existe pas
    const fs = require("fs");
    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }

    // Démarrer le serveur une fois connecté à MongoDB
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB:", err.message);
    process.exit(1);
  });
