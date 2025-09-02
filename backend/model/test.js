// 1. Importamos SOLAMENTE el pool desde nuestro módulo de base de datos.
const { pool } = require("./db");
async function testDatabaseConnection() {
  console.log("🧪  Iniciando prueba de conexión del pool...");
  try {
    // 2. Usamos 'pool.query()'. Esta es la forma más fácil y segura.
    const [results] = await pool.query("SELECT 1 + 1 AS solution");
    console.log("✅ Conexión exitosa y consulta realizada.");
    console.log("------------------------------------------");
    console.log("Resultado de la prueba:", results[0]);
    console.log("------------------------------------------");
    // 3. Verificamos el resultado para estar 100% seguros.
    if (results[0].solution === 2) {
      console.log(
        "👍 La base de datos respondió correctamente (1 + 1 = 2). ¡El pool funciona!"
      );
    } else {
      console.error(
        "👎 La base de datos respondió, pero el resultado es inesperado."
      );
    }
  } catch (error) {
    console.error(
      "❌ Error al intentar conectar o consultar la base de datos:",
      error
    );
  } finally {
    // 4. Cerramos el pool. Esto es importante en un script de prueba para que el proceso termine.
    await pool.end();
    console.log("🚪 Pool de conexiones cerrado.");
  }
}
// 5. Ejecutamos la función de prueba.
testDatabaseConnection();
