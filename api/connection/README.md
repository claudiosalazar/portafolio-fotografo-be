# Configuración de Base de Datos

Este directorio contiene los archivos necesarios para configurar la conexión a la base de datos MySQL.

## 📁 Archivos

- **`connectionExample.js`** - Archivo de ejemplo que muestra cómo configurar la conexión
- **`connection.js`** - Archivo real de configuración (NO incluido en el repositorio)

## 🔧 Configuración Inicial

### 1. Crear archivo de conexión

```bash
# Copiar el archivo de ejemplo
cp connectionExample.js connection.js
```

### 2. Configurar variables de entorno

Asegúrate de tener configurado tu archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=nombre_base_de_datos
```

### 3. Verificar configuración

El archivo `connection.js` incluye una función de prueba automática que se ejecuta al cargar el módulo. Verás mensajes como:

```
✅ Conexión exitosa a la base de datos MySQL
   🗃️  Base de datos: nombre_base_de_datos
   🌐 Host: localhost
   👤 Usuario: tu_usuario
```

## 🔒 Seguridad

- **NUNCA** subas el archivo `connection.js` real al repositorio
- El archivo está incluido en `.gitignore` para protección adicional
- Usa siempre variables de entorno para datos sensibles
- En producción, usa credenciales diferentes a las de desarrollo

## 🚨 Solución de Problemas

### Error: Access Denied
```
❌ 🔒 Credenciales de acceso incorrectas
💡 Verifica DB_USER y DB_PASSWORD en tu archivo .env
```

### Error: Base de datos no existe
```
❌ 🗃️  La base de datos no existe
💡 Verifica DB_NAME en tu archivo .env
```

### Error: Conexión rechazada
```
❌ 🔌 No se puede conectar al servidor MySQL
💡 Verifica que MySQL esté ejecutándose y DB_HOST sea correcto
```

## 📋 Pool de Conexiones

La configuración incluye un pool de conexiones optimizado:

- **Límite de conexiones**: 10 simultáneas
- **Timeout**: 60 segundos
- **Reconexión automática**: Habilitada
- **Cola sin límite**: Para manejar picos de tráfico

## 🛠️ Uso en Controladores

```javascript
const mysqlConnection = require('../connection/connection');

// Consulta simple
mysqlConnection.query('SELECT * FROM tabla', (err, results) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log(results);
});

// Consulta con parámetros (recomendado)
mysqlConnection.query(
  'SELECT * FROM tabla WHERE id = ?', 
  [userId], 
  (err, results) => {
    // Manejar resultado
  }
);
```
