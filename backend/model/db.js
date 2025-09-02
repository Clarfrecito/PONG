const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
async function setupDatabase() {
  let connection;
  try {
    // 1. Conexión temporal al servidor MySQL (sin seleccionar una base de datos)
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      multipleStatements: true,
    });
    // 2. Leemos el archivo db.sql
    const sqlPath = path.join(__dirname, "db.sql");
    const sqlScript = fs.readFileSync(sqlPath, "utf8");
    // 3. Ejecutamos el script
    await connection.query(sqlScript);
    console.log("✅ Script de base de datos ejecutado correctamente.");
  } catch (error) {
    if (error.code === "ER_DB_CREATE_EXISTS") {
      console.log("ℹ️  La base de datos ya existe. Omitiendo creación.");
    } else {
      console.error("❌ Error al ejecutar el script SQL:", error);
      throw error;
    }
  } finally {
    // 4. Cerramos la conexión temporal en cualquier caso.
    if (connection) {
      await connection.end();
    }
  }
}
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "Pong",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
module.exports = { setupDatabase, pool };
