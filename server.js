// 1. Importaciones
const express = require("express");
const path = require("path");
const cors = require("cors");
const { setupDatabase, pool } = require("./backend/model/db");
const { findAvailablePort } = require("./findAvailablePort");
const { getTop10Scores } = require("./backend/controller/ranking");
const app = express();
const PORT = 3000;
// 2. Configuración de Express (Middleware y rutas estáticas)
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));
app.use("/scripts", express.static(path.join(__dirname, "backend/controller")));
// 3. Definición de Rutas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});
app.get("/api/ranking", async (req, res) => {
  try {
    const ranking = await getTop10Scores();
    res.json(ranking);
  } catch (error) {
    console.error("Error al procesar la solicitud para /api/ranking:", error);
    res.status(500).json({ message: "No se pudo obtener el ranking." });
  }
});
app.post("/api/ranking", async (req, res) => {
  const { nombre, puntuacion } = req.body;
  if (!nombre || puntuacion === undefined) {
    return res
      .status(400)
      .json({ message: "Faltan datos (nombre o puntuación)." });
  }
  const sql = "INSERT INTO puntaje (nombre, puntaje) VALUES (?, ?)";
  pool.query(sql, [nombre, puntuacion], (error, results) => {
    if (error) {
      console.error("Error al insertar en la base de datos:", error);
      return res.status(500).json({
        message: "Error al guardar la puntuación en la base de datos.",
      });
    }
    res.sendStatus(201);
  });
});
// 4. Función de Arranque Asíncrona
async function startServer() {
  try {
    console.log("🚀 Iniciando la configuración de la base de datos...");
    await setupDatabase();
    console.log("✅ La base de datos está lista.");
    findAvailablePort().then((port) => {
      app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
      });
    });
  } catch (error) {
    console.error("💥 Error fatal: No se pudo iniciar el servidor.", error);
    process.exit(1);
  }
}
// 5. Iniciar el servidor
startServer();
