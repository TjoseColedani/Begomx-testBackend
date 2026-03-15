# Logistics API

## 1. Introducción del Proyecto

Esta API fue desarrollada para proporcionar una solución integral en la gestión y administración de un sistema logístico. Su propósito principal es resolver la necesidad de coordinar eficientemente vehículos de carga (camiones), ubicaciones geográficas y usuarios, para consolidar todo en órdenes de transporte (viajes). Permite llevar un control detallado sobre qué camión está asignado a qué ruta (origen y destino) y en qué estado se encuentra la operación, facilitando la operatividad logística de principio a fin.

## 2. Funcionalidad de la API

La API cuenta con las siguientes capacidades principales:
- **Gestión de Usuarios (CRUD):** Registro, autenticación mediante JWT y administración de usuarios.
- **Gestión de Camiones (Trucks):** Creación y administración de camiones, controlando características como número de placa, modelo, año, capacidad y estado actual (disponible, ocupado, en mantenimiento).
- **Control de Ubicaciones (Locations):** Integración con la API de Google Places para crear y obtener coordenadas geográficas (latitud, longitud) a partir de un `place_id`, garantizando que no se dupliquen ubicaciones.
- **Operación de Órdenes (Orders):** Creación de órdenes que vinculan un camión con una ubicación de origen (pickup) y una ubicación de destino (dropoff). 
- **Control de Estados:** Gestión y actualización explícita de los estados de las órdenes (ej. creada, en tránsito, completada) para un seguimiento fidedigno del transporte.

## 3. Dominios del Proyecto

El proyecto se divide en las siguientes entidades o dominios principales, cada uno con una responsabilidad única y definida:

- **Auth:** Encargado de manejar el registro y la autenticación de usuarios. Emite los tokens (JWT) necesarios para asegurar las rutas protegidas.
- **Users (Usuarios):** Mantiene la información de las personas que utilizan el sistema.
- **Trucks (Camiones):** Responsable de administrar la base de vehículos y su disponibilidad. Un camión es la unidad principal para ejecutar una orden.
- **Locations (Ubicaciones):** Administra los puntos geográficos exactos. Utiliza servicios externos (Google) para registrar direcciones y coordenadas reales que actuarán como origen o destino.
- **Orders (Órdenes):** El núcleo operativo del sistema. Agrupa los demás dominios al asignar un camión a un viaje entre dos ubicaciones, y gestiona su evolución mediante estados transaccionales.

## 4. Enfoque de Desarrollo

El desarrollo de la API se llevó a cabo aplicando buenas prácticas y patrones de diseño modernos, tomando las siguientes decisiones arquitectónicas:
- **Separación de Responsabilidades (Separation of Concerns):** La lógica está subdividida limpiamente a través del uso de controladores (lógica de negocio), rutas (mapeo de endpoints), modelos (esquemas de datos) y middlewares (filtros y validaciones intermedios).
- **Estructura Basada en Dominios:** El código está organizado por funcionalidad o entidad (Auth, Users, Trucks, Locations, Orders), lo cual incrementa la cohesión y facilita la mantenibilidad.
- **Validación de Datos:** Se implementó `express-validator` como middleware para garantizar que los datos cumplan con los formatos esperados y las reglas de negocio antes de siquiera intentar la inserción en la base de datos.
- **Uso de Variables de Entorno:** Toda configuración sensible (claves privadas, URIs de base de datos) reside en el archivo `.env` externo, manteniendo el código seguro y fácilmente adaptable a diferentes entornos.
- **Flujo de Trabajo con Git:** Se utilizaron ramas individuales y separadas por dominio durante el versionamiento del proyecto, lo cual permite un desarrollo paralelo ordenado y reduce los conflictos al combinar cambios.

## 5. Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución para JavaScript en el servidor.
- **Express.js** - Framework minimalista para la gestión de rutas y servidores web.
- **TypeScript** - Superconjunto de JavaScript que aporta tipado estático, mejorando la robustez del código.
- **MongoDB** - Base de datos NoSQL orientada a documentos.
- **Mongoose** - Librería para el modelado de objetos de MongoDB (ODM) en Node.js.
- **JSON Web Token (JWT) & bcryptjs** - Para autenticación segura sin estado y encriptación de contraseñas.
- **express-validator** - Validaciones a nivel de middleware.
- **axios** - Cliente HTTP para la comunicación con la API de Google Places.

## 6. Configuración del Entorno

Sigue estos pasos para instalar y ejecutar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/begomx/backendTest1.git
   cd backendTest1
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno (.env):**
   Crea un archivo `.env` en la raíz del proyecto. Deberá contener al menos lo siguiente:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/logistics
   JWT_SECRET=tu_secreto_super_seguro
   GOOGLE_PLACES_API_KEY=tu_api_key_de_google  # Necesaria para el dominio Locations
   ```

4. **Ejecutar el servidor localmente en desarrollo (con recarga automática):**
   ```bash
   npm run dev
   ```
   *El servidor debería iniciar y conectarse a la base de datos.*

5. **Compilar para producción:**
   ```bash
   npm run build
   npm start
   ```

## 7. Ejemplos de Endpoints

Todas las respuestas manejan un formato estandarizado para brindar consistencia, por ejemplo:
```json
{
  "success": true,
  "data": { ... }
}
```

A continuación algunos ejemplos prácticos (recuerda enviar el Header `Authorization: Bearer <token>` para rutas protegidas):

- **`POST /api/auth/login` - Iniciar Sesión**
  - **Body:** `{ "email": "admin@bego.com", "password": "password123" }`
  - **Uso:** Autentica a un usuario existente y devuelve el token JWT necesario para las demás llamadas.

- **`POST /api/locations` - Crear Ubicación**
  - **Body:** `{ "place_id": "ChIJiRp93iEC0oURvJVqErpVVHw" }`
  - **Uso:** A través del `place_id`, la API se comunica internamente con Google Places, extrae la dirección y lat/lng correspondientes, y los guarda en la base de datos si es que no existe previamente.

- **`POST /api/orders` - Crear una Orden logística**
  - **Body:** 
    ```json
    {
      "truck": "60d0fe4f5311236168a109ca",
      "pickup": "60d0fe4f5311236168a109cb",
      "dropoff": "60d0fe4f5311236168a109cc"
    }
    ```
  - **Uso:** Genera un nuevo viaje asignando un camión específico a una ruta con origen (pickup) y destino (dropoff). Inicializa el estado por defecto a `created` o `pending`.

- **`PATCH /api/orders/:id/status` - Actualizar el Estado de la Orden**
  - **Body:** `{ "status": "in transit" }`
  - **Uso:** Un endpoint específico para modificar únicamente el estado operativo del viaje, útil para el seguimiento por parte de los conductores o administradores.