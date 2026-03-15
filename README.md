# Logistics API

A complete backend API for managing a logistics system. It allows users to register, log in, manage trucks, locations, and place orders linking trucks and locations together.

## Tech Stack
- **Node.js**: JavaScript Runtime Environment.
- **Express**: Fast, unopinionated, minimalist web framework.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **MongoDB**: NoSQL Document Database.
- **Mongoose**: Elegant mongodb object modeling for node.js.
- **JWT Authentication**: JSON Web Tokens for stateless secure authentication.
- **express-validator**: Express middleware for the express-validator.

## Environment Variables
Create a `.env` file in the root directory and configure the following variables. The application checks for these before starting.

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/logistics
JWT_SECRET=supersecretjwtkey
```

## Installation Instructions
1. Clone the repository.
2. Install the dependencies using npm:
   ```bash
   npm install
   ```
3. Ensure you have MongoDB running locally on `localhost:27017` or update the `MONGO_URI` in the `.env` file to point to your MongoDB instance.

## How to Run the Project
To run the project in development mode using `ts-node-dev`:
```bash
npm run dev
```
To compile TypeScript into JavaScript:
```bash
npm run build
```
To run the production build (after compiling):
```bash
npm start
```

## API Endpoints Explanation

Responses follow this consistent JSON format:
```json
{
  "success": true,
  "data": { ... }
}
```

### Authentication
- `POST /auth/register` - Register a new user (`name`, `email`, `password`).
- `POST /auth/login` - Authenticate a user and receive a JWT token (`email`, `password`).

**Notice:** To access any of the protected endpoints below, you must include the JWT token in your HTTP headers:
`Authorization: Bearer <TOKEN>`

### Users
- `GET /users` - Retrieve all users.
- `GET /users/:id` - Retrieve a user by their ID.
- `POST /users` - Create a user directly.
- `PUT /users/:id` - Update a user's information.
- `DELETE /users/:id` - Remove a user.

### Trucks
Trucks have a `status` which can be `available`, `busy`, or `maintenance`.
- `GET /trucks` - Retrieve all trucks.
- `GET /trucks/:id` - Retrieve a single truck by ID.
- `POST /trucks` - Create a new truck (`plate`, `model`, `capacity`, `status`).
- `PUT /trucks/:id` - Update a truck's details.
- `DELETE /trucks/:id` - Remove a truck.

### Locations
- `GET /locations` - Retrieve all locations.
- `GET /locations/:id` - Retrieve a single location by ID.
- `POST /locations` - Create a new location (`city`, `address`).
- `PUT /locations/:id` - Update a location.
- `DELETE /locations/:id` - Remove a location.

### Orders
Orders map a `truck` to an `origin` location and a `destination` location. It tracks `status` explicitly (`pending`, `in_route`, `delivered`).
- `GET /orders/details` - Get aggregated detailed info of all orders, pulling in complete nested schema details for trucks, origins, and destinations.
- `GET /orders` - Retrieve all orders (populated using Mongoose).
- `GET /orders/:id` - Retrieve a single order by ID.
- `POST /orders` - Create an order using referenced IDs (`truck`, `origin`, `destination`). 
- `PUT /orders/:id` - Update an order's status.
- `DELETE /orders/:id` - Remove an order.
