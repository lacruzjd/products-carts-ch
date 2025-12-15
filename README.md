# API REST de Productos y Carritos

Esta es una API REST desarrollada para gestionar productos y carritos de compra. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) tanto para los productos de un inventario como para los carritos de los usuarios.

## Tabla de Contenidos

1. Características
2. Tecnologías Utilizadas
3. Prerrequisitos
4. Instalación y Puesta en Marcha
5. Estructura del Proyecto
6. Documentación de la API (Endpoints)
    * Endpoints de Productos
    * Endpoints de Carritos
7. Detalles del Motor de Vistas
8. Licencia

## Características

* Gestión completa de productos (CRUD).
* Creación y gestión de carritos de compra.
* Posibilidad de agregar, actualizar y eliminar productos de un carrito.
* Rutas de API RESTful bien definidas.
* Vistas dinámicas renderizadas desde el servidor para visualizar productos y carritos.

## Tecnologías Utilizadas

* **Backend**: Node.js, Express.js
* **Base de Datos**: MongoDB con Mongoose
* **Motor de Vistas**: Handlebars (`express-handlebars`)
* **Otros**: Nodemon, Dotenv, Socket.io

## Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

* Node.js (versión 14.x o superior)
* npm o yarn
* MongoDB (una instancia local o un cluster en la nube como MongoDB Atlas)

## Instalación y Puesta en Marcha

Sigue estos pasos para levantar el proyecto en tu máquina local:

1. **Clona el repositorio:**

    ```bash
    git clone https://github.com/lacruzjd/products-carts-ch
    cd tu-repositorio
    ```

2. **Instala las dependencias:**

    ```bash
    npm install
    ```

3. **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables.

    ```
    PORT=8080
    MONGO_URI=...
    ```

4. **Inicia el servidor:**
    Para iniciar el servidor en modo de desarrollo (con reinicio automático):

    ```bash
    npm run dev
    ```

    Para iniciar en modo de producción:

    ```bash
    npm start
    ```

    El servidor estará escuchando en `http://localhost:8080`.

## Estructura del Proyecto

```
productscarts/
├── data/                # Persistencia local en archivo json
├── public/              # Recursos estáticos (CSS, JS, imágenes (img de productos))
├── src/
│   ├── config/              # Configuración de entorno y conexión a la base de datos
│   ├── controllers/         # Controladores para la lógica de productos y carritos
│   ├── dao/                # Lógica de acceso a base de datos
│   ├── dto/                # Objetos para las filtrar la transferencia de datos sensibles
│   ├── entities/            # Definicion de las entidades Product, Cart, User 
│   ├── middlewares/         # Autenticacion y autorizacion 
│   ├── models/              # Modelos de datos (Mongoose)
│   ├── routes/              # Rutas de la API y vistas
│   ├── services/            # Logica de negocio
│   ├── socket/              # Gestion de productos en tiempo real
│   ├── utils/               # Generador de id, hashes y tokens
│   ├── views/               # Plantillas Handlebars
│   └── app.js               # Configuración de la app Express
├── .env                     # Variables de entorno
├── index.js                 # Punto de entrada del servidor
├── package.json             # Dependencias y scripts
└── README.md                # Documentación
```

## Documentación de la API (Endpoints)

La URL base para todos los endpoints de la API es `/api`.

### Endpoints de Productos

Ruta base: `/api/products`

| Método | Ruta                 | Descripción                                  | Body (Ejemplo)                                                              |
| :----- | :------------------- | :------------------------------------------- | :-------------------------------------------------------------------------- |
| `GET`    | `/`                  | Obtiene todos los productos.                 | N/A                                                                         |
| `GET`    | `/:pid`              | Obtiene un producto por su ID.               | N/A                                                                         |
| `POST`   | `/`                  | Crea un nuevo producto.                      | `{"title":"Adaptador HDMI a VGA","description":"Adaptador compacto para conectar HDMI a VGA","code":"ADA020","price":490,"stock":50,"category":"Accesorios","thumbnails": []`                  |
| `PUT`    | `/:pid`              | Actualiza un producto por su ID.             | `{ "price": 160, "stock": 20 }`                                             |
| `DELETE` | `/:pid`              | Elimina un producto por su ID.               | N/A                                                                         |

### Endpoints de Carritos

Ruta base: `/api/carts`

| Método | Ruta                       | Descripción                                      | Body (Ejemplo)                               |
| :----- | :------------------------- | :----------------------------------------------- | :------------------------------------------- |
| `POST`   | `/`                        | Crea un nuevo carrito vacío.                     | N/A                                          |
| `GET`    | `/:cid`                    | Obtiene un carrito por su ID con sus productos.  | N/A                                          |
| `POST`   | `/:cid/product/:pid`       | Agrega un producto a un carrito.                 | N/A                                          |
| `DELETE` | `/:cid/product/:pid`       | Elimina una unidad de un producto del carrito.   | N/A                                          |
| `PUT`    | `/:cid`                    | Actualiza el carrito con un array de productos.  | `[{ "product": "id_producto", "quantity": 3 }]` |
| `DELETE` | `/:cid`                    | Vacía completamente un carrito.                  | N/A                                          |

---

### Endpoints de Usuarios

Ruta base: `/api/users`

| Método | Ruta                       | Descripción                                      | Body (Ejemplo)                               |
| :----- | :------------------------- | :----------------------------------------------- | :------------------------------------------- |
| `POST`   | `/`                        | Registra un usuario.                     | `{"first_name": "Nombre", "last_name": "Apellido", "email": "email@email.com", "age": 20, "password": "123"}`           |
| `POST`   | `/:email`                        | Actualiza Usuario Logeado.                     | `{"first_name": "Nombre", "last_name": "Apellido", "age": 20}`           |
| `DELETE`   | `/:email`                        | Elimina Usuario  Logeado.                     | N/A           |
| `POST`   | `/recoverpasswordSendEmail`                        | Envia link para restaurar password al email del usuario.                     | `{"email": "email@email.com"}`        |
| `POST`   | `/recoverpassword`                        | Actualiza la contrasena del usuario.                     | `{"email": "email@email.com", "password": "Nueva contrasena"}`        |

---

### Endpoints de Sessions

Ruta base: `/api/sessions`

| Método | Ruta                       | Descripción                                      | Body (Ejemplo)                               |
| :----- | :------------------------- | :----------------------------------------------- | :------------------------------------------- |
| `POST`   | `/login`                        | Inicia de sesion.                     | `{"email": "email@email.com"}`           |
| `GET`   | `/logout`                        | Cierre de sesion.                     | N/A           |
| `POST`   | `/current`                        | Muestra Usuario Logeado.                     | `{"first_name": "Nombre", "last_name": "Apellido"}`           |

---

### Endpoints de Ticket

Ruta base: `/api/tickets`

| Método | Ruta                       | Descripción                                      | Body (Ejemplo)                               |
| :----- | :------------------------- | :----------------------------------------------- | :------------------------------------------- |
| `GET`   | `/`                        | Genera ticket de compra y realiza actualizacion del stock, guarda el ticket en la base de datos.                   | json con el ticket de compra.          |
| `GET`   | `/:id`                        | Obtiene ticket de compra por su ID.                   | json con el ticket de compra.          |

---

## Endpoints de Vistas (Renderizado con Handlebars)

Estas rutas renderizan plantillas HTML dinámicas utilizando el motor de vistas Handlebars.

| Método | Ruta                 | Descripción                                      | Plantilla Asociada          |
| :----- | :------------------- | :----------------------------------------------- | :-------------------------- |
| `GET`    | `/`          | Muestra una lista de todos los productos.        | `index.handlebars`       |
| `GET`    | `/products/:pid`          | Muestra detalles de un producto productos.        | `productsdetail.handlebars`       |
| `GET`    | `/carts/:cid`        | Muestra el contenido de un carrito específico.   | `cart.handlebars`           |
| `GET`    | `/realtimeproducts`  | Muestra una lista de productos en tiempo real (actualizada con WebSockets). | `realTimeProducts.handlebars` |

## Licencia

Este proyecto está bajo la Licencia MIT.
