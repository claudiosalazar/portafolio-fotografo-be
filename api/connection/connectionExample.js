const mysql = require('mysql2');

/**
 * ARCHIVO DE EJEMPLO - CONFIGURACIÓN DE CONEXIÓN A BASE DE DATOS
 * 
 * Este archivo muestra cómo configurar la conexión a MySQL usando variables de entorno
 * para proteger información sensible cuando el proyecto se sube a repositorios públicos.
 * 
 * INSTRUCCIONES DE USO:
 * 1. Copia este archivo como 'connection.js' en la misma carpeta
 * 2. Configura las variables de entorno en tu archivo .env
 * 3. Nunca subas el archivo connection.js real al repositorio público
 */

const pool = mysql.createPool({
  // Configuración usando variables de entorno para proteger datos sensibles
  host: process.env.DB_HOST || "localhost",          // IP o dominio del servidor MySQL
  user: process.env.DB_USER || "tu_usuario_mysql",  // Usuario de la base de datos
  password: process.env.DB_PASSWORD || "tu_contraseña_mysql", // Contraseña del usuario
  database: process.env.DB_NAME || "nombre_de_tu_base_de_datos", // Nombre de la base de datos
  
  // Configuración del pool de conexiones para optimizar rendimiento
  waitForConnections: true,    // Esperar conexiones disponibles si el pool está lleno
  connectionLimit: 10,         // Máximo 10 conexiones simultáneas
  queueLimit: 0,              // Sin límite en la cola de espera
  
  // Configuraciones adicionales recomendadas para producción
  acquireTimeout: 60000,      // Tiempo máximo para obtener conexión (60 segundos)
  timeout: 60000,             // Tiempo máximo para consultas (60 segundos)
  reconnect: true,            // Reconectar automáticamente si se pierde la conexión
  
  // Configuración de zona horaria (opcional)
  timezone: 'Z'               // UTC timezone
});

// Función para probar la conexión y mostrar información útil
const testConnection = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('❌ Error al conectar a la base de datos:');
      
      // Mensajes de error específicos para facilitar debugging
      switch(err.code) {
        case 'ER_ACCESS_DENIED_ERROR':
          console.error('   🔒 Credenciales de acceso incorrectas');
          console.error('   💡 Verifica DB_USER y DB_PASSWORD en tu archivo .env');
          break;
        case 'ER_BAD_DB_ERROR':
          console.error('   🗃️  La base de datos no existe');
          console.error('   💡 Verifica DB_NAME en tu archivo .env');
          break;
        case 'ECONNREFUSED':
          console.error('   🔌 No se puede conectar al servidor MySQL');
          console.error('   💡 Verifica que MySQL esté ejecutándose y DB_HOST sea correcto');
          break;
        case 'ENOTFOUND':
          console.error('   🌐 Host no encontrado');
          console.error('   💡 Verifica DB_HOST en tu archivo .env');
          break;
        default:
          console.error('   📋 Error:', err.message);
      }
      
      console.error('\n📝 Variables de entorno actuales:');
      console.error(`   DB_HOST: ${process.env.DB_HOST || 'NO DEFINIDA'}`);
      console.error(`   DB_USER: ${process.env.DB_USER || 'NO DEFINIDA'}`);
      console.error(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***DEFINIDA***' : 'NO DEFINIDA'}`);
      console.error(`   DB_NAME: ${process.env.DB_NAME || 'NO DEFINIDA'}`);
      
    } else {
      console.log('✅ Conexión exitosa a la base de datos MySQL');
      console.log(`   🗃️  Base de datos: ${process.env.DB_NAME || 'default'}`);
      console.log(`   🌐 Host: ${process.env.DB_HOST || 'localhost'}`);
      console.log(`   👤 Usuario: ${process.env.DB_USER || 'default'}`);
      
      // Liberar la conexión de prueba
      connection.release();
    }
  });
};

// Ejecutar prueba de conexión al cargar el módulo
testConnection();

// Manejo de eventos del pool para logging adicional
pool.on('connection', (connection) => {
  console.log(`🔗 Nueva conexión establecida: ${connection.threadId}`);
});

pool.on('error', (err) => {
  console.error('💥 Error en el pool de conexiones MySQL:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Intentando reconectar...');
  }
});

// Función para cerrar todas las conexiones (útil para tests o shutdown graceful)
const closePool = () => {
  return new Promise((resolve, reject) => {
    pool.end((err) => {
      if (err) {
        console.error('❌ Error al cerrar el pool de conexiones:', err);
        reject(err);
      } else {
        console.log('✅ Pool de conexiones cerrado correctamente');
        resolve();
      }
    });
  });
};

// Exportar el pool para uso en controladores y rutas
module.exports = pool;

// Exportar también la función de cierre para casos especiales
module.exports.closePool = closePool;

/**
 * EJEMPLO DE USO EN CONTROLADORES:
 * 
 * const mysqlConnection = require('../connection/connection');
 * 
 * // Consulta simple
 * mysqlConnection.query('SELECT * FROM tabla', (err, results) => {
 *   if (err) {
 *     console.error('Error en consulta:', err);
 *     return;
 *   }
 *   console.log('Resultados:', results);
 * });
 * 
 * // Consulta con parámetros (más segura)
 * mysqlConnection.query('SELECT * FROM tabla WHERE id = ?', [userId], (err, results) => {
 *   // Manejar resultado
 * });
 */
