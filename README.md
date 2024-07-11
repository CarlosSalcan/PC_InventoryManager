# Inventario de Equipos

Bienvenido al proyecto "Inventario de Equipos" 🖥️, una aplicación diseñada para gestionar y registrar los equipos de una organización de manera eficiente. Esta aplicación incluye la capacidad de manejar diferentes tipos de equipos, como computadoras de escritorio, portátiles, impresoras y teléfonos.

## Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Autores](#autores)
- [Licencia](#licencia)
- [Contacto](#contacto)

## Descripción del Proyecto

"Inventario de Equipos" es una aplicación web desarrollada para facilitar la gestión de equipos en una organización. Su objetivo es proporcionar una plataforma donde se puedan registrar, actualizar y consultar datos de diferentes tipos de equipos de manera centralizada. La aplicación contiene:

- Gestión de equipos de escritorio, portátiles, impresoras y teléfonos.
- Almacenamiento y consulta de datos de cada equipo.
- Interfaz intuitiva para la gestión de equipos.

## Estructura del Proyecto

La estructura de archivos del proyecto es la siguiente:
```plaintext
inventarioPc/
├── backend/
│ ├── node_modules/
│ ├── src/
│ │ ├── controllers/
│ │ │ ├── equipo.controller.js
│ │ │ └── parametro.controller.js
│ │ │ └── user.controller.js
│ │ ├── models/
│ │ ├── routers/
│ │ │ └── router.server.js
│ │ ├── connection.js
│ │ └── server.js
│ ├── package-lock.json
│ └── package.json
├── frontend/
│ ├── assets/
│ │ └── consultasSQL.txt
│ │ └── imagenes/
│ ├── css/
│ │ └── styles.css
│ ├── js/
│ │ ├── equipo.js
│ │ ├── login.js
│ │ └── parametros.js
│ │ ├── styles.js
│ ├── equipo.html
│ ├── impresora.html
│ ├── index.html
│ ├── parametro.html
│ ├── portatil.html
│ ├── registro.html
│ ├── reportes.html
│ └── telefono.html
```

## Instalación 🗒️

Para clonar y ejecutar este proyecto en tu máquina local, sigue estos pasos:
1. Clona el repositorio 🔗:
    ```sh
    git clone https://github.com/CarlosSalcan/InventoryPc
    ```
2. Navega al directorio del proyecto:
    ```sh
    cd inventarioPc
    ```

3. Instala las dependencias del backend:
    ```sh
    cd backend
    npm install
    ```

4. Inicia el servidor:
    ```sh
    node src/server.js
    ```

5. Abre `index.html` en tu navegador para ver la página principal.

## Uso

- Inicia sesión a través de `index.html`.
- Navega a través del menú para gestionar los diferentes tipos de equipos.
- Añade, actualiza o consulta datos de equipos de escritorio, portátiles, impresoras y teléfonos.

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- MySQL
- [WampServer](https://www.wampserver.com/) para la conexión a la base de datos

## Autor 🤓

- **Carlos Salcán** - *Estudiante y Desarrollador Principal* - [CarlosSalcan](https://github.com/CarlosSalcan)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

## Contacto 📌💻

Para cualquier consulta o sugerencia, puedes contactarnos a través de:

- **Email**: [cdsalcan131@gmail.com](mailto:cdsalcan131@gmail.com)
- **WhatsApp**: (https://wa.me/+5930988667013)

¡Gracias por visitar "InventoryPC"!