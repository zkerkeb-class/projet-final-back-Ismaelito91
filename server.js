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

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/recettes", recettesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/commentaires", commentairesRoutes);

// Route de base
app.get("/", (req, res) => {
  res.send("API de MonPetitChef est en ligne!");
});

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connecté à MongoDB");
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB:", err.message);
  });
