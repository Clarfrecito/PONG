// 1. Importamos el pool de conexiones que creamos en database.js.
const { pool } = require("../model/db");
async function getTop10Scores() {
  console.log("📄 Obteniendo el top 10 desde la base de datos...");
  // 2. Definimos la consulta SQL.
  const query =
    "SELECT nombre, puntaje FROM puntaje ORDER BY puntaje DESC LIMIT 10";
  try {
    // 3. Ejecutamos la consulta usando el pool.
    // 'pool.query' nos devuelve un array, donde el primer elemento ([rows]) son los resultados de la tabla.
    const [rows] = await pool.query(query);
    // 4. Devolvemos las filas obtenidas. Este será el ranking.
    return rows;
  } catch (error) {
    // 5. Si algo sale mal durante la consulta, lo mostramos en la consola y lanzamos un error.
    console.error(
      "Error al ejecutar la consulta para obtener el ranking:",
      error
    );
    throw new Error("Error al consultar la base de datos.");
  }
}
// 6. Exportamos la función para que pueda ser importada y utilizada en otros archivos, como server.js.
module.exports = { getTop10Scores };
