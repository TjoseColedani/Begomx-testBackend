### Locations CRUD

Crear un **CRUD** para el dominio de locations con los cuales podremos indicar el origen y el destino de una orden.

Requisitos:

- Crear un location a partir de un place_id de Google Maps
- Obtener las coordenadas y dirección de los place_id utilizando la API de Google Maps.
- No crear la misma location dos veces.
- Poder listar, modificar y eliminar las locations creadas por el usuario

```
- address (string)
- place_id (string)
- latitude (number)
- longitude (number)
```

### Nota

Para acceder a Places API será necesario obtener un API KEY

**IMPORTANTE:** Durante el proceso de registro, se te pedirá que agregues un método de pago. Sin embargo, no se realizará ningún cargo mientras no superes el límite gratuito de 10,000 solicitudes proporcionado por Google.

A continuación se muestran los pasos para obtener un API KEY

1. Accede a [Google Cloud](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. En la parte superior, haz clic en el selector de proyecto, después en "Nuevo proyecto"
4. Asigna un nombre a tu proyecto y créalo
5. Ingresa al apartado **APIs y servicios**
6. Busca **Places API** y habilita el servicio
7. Ingresa la información necesaria para validar tu identidad
8. Una vez ingresados los datos, se habrá generado un API KEY para poder consumir el servicio
9. La informacion detallada sobre cómo utilizarla, se encuentra dentro de la documentación propia de del servicio en el siguiente enlace: [Documentación de Places API](https://developers.google.com/maps/documentation/places/web-service/place-id)

Una vez completado el proceso, estos son algunos ejemplos de place_id que puedes usar

- ChIJiRp93iEC0oURvJVqErpVVHw
- ChIJsUDXn2od0oURpAnsjV2k44A
- ChIJGQkBCFIAzoURlLaQUWnuYZc
