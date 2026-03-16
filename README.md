# Logistics REST API Challenge

## 📝 Descripción General de la API
Este proyecto es una API REST escalable y robusta para la gestión logística de una flotilla de camiones. Permite administrar de forma centralizada usuarios, camiones, ubicaciones de origen/destino y órdenes de envío. Se han implementado buenas prácticas y arquitectura modular para garantizar seguridad, mantenibilidad y rendimiento óptimo en un entorno de producción.

---

## 🛠 Tecnologías Utilizadas
El proyecto está construido sobre el ecosistema de JavaScript y Node.js, aprovechando herramientas modernas:

- **Node.js**: Entorno de ejecución para el servidor backend.
- **Express.js**: Framework rápido y minimalista para construir la API y definir rutas.
- **TypeScript**: Superconjunto de JavaScript que aporta un tipado estático, reduciendo errores y mejorando la calidad del código.
- **MongoDB**: Base de datos NoSQL, ideal para el almacenamiento de datos logísticos complejos.
- **Mongoose**: Modelado de objetos para MongoDB (ODM), permitiendo esquemas y validaciones embebidas.
- **JSON Web Token (JWT)**: Manejo seguro de autenticación y autorización sin mantener estado en sesión.
- **Express-Validator**: Middleware de validación para garantizar la calidad e integridad de los datos entrantes.
- **Axios**: Cliente HTTP para solicitudes externas (p. ej., a la API de Google Maps).

---

## 🏗 Arquitectura del Proyecto
Se ha elegido una arquitectura dividida en capas lógicas (Patrón Modelo-Controlador-Rutas) para separar las responsabilidades de cada componente:

- `src/models`: Modelos de Mongoose que definen los esquemas de bases de datos y su interacción.
- `src/controllers`: Lógica de negocio (procesamiento de peticiones, llamadas a la base de datos).
- `src/routes`: Definición de los endpoints expuestos y asignación a sus controladores correspondientes.
- `src/middlewares`: Interceptores de tráfico para autenticación, recolección de errores o validación de payload y cabeceras.
- `src/interfaces`: Definiciones TypeScript estrictas (tipos) para garantizar integridad.
- `src/config`: Configuraciones generales como conexión a MongoDB vía Mongoose.

---

## 📦 Explicación de Cada Dominio

### 🧑‍💼 Users
Representa a los usuarios del sistema que tienen permiso para administrar la aplicación o generar nuevas órdenes. Incluye endpoints para crear y administrar la lista de usuarios. El registro y la autenticación generan un JWT.

### 🚛 Trucks
Gestiona la flotilla de vehículos dedicados al transporte. Cada camión tiene un año de manufactura, color y placas de registro exclusivas.

### 📍 Locations
Controla las zonas físicas, en este caso obtenidas y validadas mediante la **Google Places API**.
Provee lógica nativa donde, a partir de proporcionar un `place_id`, se descarga de Google Maps la latitud, longitud y dirección formateada guardándolo de forma validada, previniendo duplicados (almacenando un mismo `place_id` una sola vez).

### 📦 Orders
El dominio principal y núcleo de relaciones de negocio. Vincula de forma integral a un `User` (el solicitante), un `Truck` (el transporte asignado) y dos coordenadas geográficas `Locations` (el origen de recolección y el destino de entrega). Mantiene y rastrea el status histórico (`created`, `in_transit`, `completed`).

---

## 🔒 Autenticación con JWT
Cualquier acción en el ecosistema logístico está estrictamente protegida. Un middleware central (`authenticateJWT`) previene cualquier manipulación no autorizada, validando un token de portador (Bearer Token) contra el `JWT_SECRET`. Únicamente los flujos de creación de cuentas y login (`/auth/register`, `/auth/login`) están expuestos públicamente.

---

## 🛡 Validaciones Implementadas
Se establecieron rigurosos controles utilizando validadores embebidos a la ruta y la base de datos:
- **Prevención de valores nocivos**: Antes de llegar a ningún controlador de procesamiento, los cuerpos de las peticiones (`req.body`) son validados minuciosamente por `express-validator` (obligatoriedad, longitud mínima, correos válidos, etc.).
- **Validación de Identificadores (Mongoose)**: Se comprueba la estructura de objeto id de Mongoose en parámetros de ruta y cuerpos asegurando referencias de documentos válidas.
- **Reglas del Negocio**:
    - Las ubicaciones tienen comprobación semántica de **DUPLICIDAD** evaluando la base de datos previa inserción de la llave `place_id`.
    - Integridad de Estados: Las órdenes están limitadas explícitamente a los strings fijos `'created', 'in_transit', 'completed'`.

---

## 📊 Uso de MongoDB y Agregaciones
Además el manejo tradicional en búsquedas y escrituras (CRUD) usando esquemas indexados, el dominio de `Orders` emplea **MongoDB Aggregations Pipeplines**:
1. Para el endpoint  `/orders/details`: Efectúa la consolidación dinámica de modelos ($lookup) evitando múltiples y costosas queries consecutivas por aplicación.
2. Para el endpoint generalizado de estadísticas `/orders/stats`: Explota el uso de agrupaciones (`$group`) a nivel de máquina de la base de datos incrementando las cuentas ($sum) proveyendo una cuenta global muy performante optimizada hacia volumen histórico de la operación.

---

## 🌐 Variables de Entorno Necesarias (.env)
Se necesita un archivo `.env` en la raíz del proyecto para cargar de forma segura las configuraciones y dependencias que no deben versionarse. 

```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/test
JWT_SECRET=tu_super_secreto_seguro_y_complejo_123!
GOOGLE_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 Cómo Instalar y Correr el Proyecto

1. **Clonar este repositorio y acceder a la carpeta:**
   ```bash
   git clone <repo_url>
   cd <nombre_de_la_carpeta>
   ```
2. **Instalar las dependencias:**
   ```bash
   npm install
   ```
3. **Configurar el Entorno:** Crea el archivo `.env` en la raíz del proyecto con las claves previamente especificadas.
4. **Ejecutar el Modo Desarrollo:**
   ```bash
   npm run dev
   ```
5. **Transpilar a código de validación:** (opcional)
   ```bash
   npm run build
   ```
La aplicación correrá, por lo normal, en el puerto `3000` o en el estipulado en el archivo `.env`.

---

## ⚡ Ejemplos Básicos de Endpoints

- **Registro de Usuario (Público)**
  - `POST /auth/register`
  - Body: `{ "email": "test@test.com", "password": "password123" }`

- **Login de Usuario (Público)** -> *(devuelve token JWT)*
  - `POST /auth/login`
  - Body: `{ "email": "test@test.com", "password": "password123" }`

Todos los siguientes endpoints de la cadena requieren inyectar el token Bearer en el Request Header -> `Authorization: Bearer <TOKEN>`.

- **Registrar nueva Location (Requiere JWT)**
  - `POST /locations`
  - Body: `{ "place_id": "ChIJb_k45R-KXIYR9xU611-FvwY" }`

- **Crear una Order (Requiere JWT)**
  - `POST /orders`
  - Body: 
    ```json
    {
      "truck": "603e83b48232981a...d1",
      "pickup": "773e83b48232981a...f2",
      "dropoff": "883e83b48232981a...g3"
    }
    ```

- **Estadísticas de Órdenes usando Aggregations (Requiere JWT)**
  - `GET /orders/stats`

---

## 🧠 Enfoque de Desarrollo
Para resolver la estructuración de este Challenge Back-End, me enfoqué en una **Filosofía basada en la Prevención de Errores y Mantenibilidad**.
Utilizando las capacidades estáticas robustas de TypeScript preparamos una pasarela a prueba de fallos desde antes que inicie en el framework Express.
1. Se analizaron primero los objetos del mundo real y sus interconexiones de base de datos para no cruzar dependencias.
2. Cada endpoint se enjauló validando entradas rigurosamente con expreso-validator antes de tocar en sí la base de datos (Ej: `place_id`, tipos de `status` válidos y protección por tokens robustos).
3. Optamos por aprovechar las mejores capacidades de nuestra de la DB implementando Aggregation pipelines donde es sensato optimizar volumen o cruces de llaves externas (`$lookup`, `$group`). Escogí este camino para ofrecer una API escalable que no se degrade mientras las tablas en Mongo comiencen a escalar brutalmente.
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
