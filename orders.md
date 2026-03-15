### Orders CRUD

Para generar una nueva orden, podemos seguir el siguiente esquema:

Una orden contiene:

```
- user (user: ObjectId)
- truck (truck: ObjectId)
- status (string: [created, in transit, completed])
- pickup (location: ObjectId)
- dropoff (location: ObjectId)
```

#### Nota

Crear un ep especifico para cambiar el estatus de la orden
