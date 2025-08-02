# Blog Backend

Backend para el proyecto Blog, desarrollado con Node.js, Express, TypeScript, Prisma y Docker.

## Tecnología necesaria

- Node y npm
- Docker / Docker Compose
- Configuraicon de correo

---

## Instalación (desarrollo)

1. Clona el repositorio e instalar dependencias:

```bash
git clone https://github.com/GeraMaldonado/blog-backend.git
cd blog-backend
npm install
```


2. Configura tu archivo .env y .env.production
```bash
#Ejemplo:
DATABASE_URL="mysql://root:root@db:3306/blog"

NODE_ENV=development
PORT=3000

SECRET_JWT_KEY=clave_larga_y_segura_para_producción
SECRET_REFRESH_JWT_KEY=otra_clave_larga_para_refresh

EMAIL_SERVER=miemail@gmail.com
EMAIL_ADMIN=admin@gmail.com
EMAIL_PASSWORD=clave_o_token_de_app

```

3. Levantar en producción con Docker

```bash
docker compose -f docker-compose.prod.yml up --build -d
#El backend se servirá en: http://localhost:3010
```

4. Ejecutar tests

    - 4.1. Levanta la base de datos de prueba

        ```bash
        docker compose -f docker-compose.test.yml up -d
        ```
    
    - 4.2 Aplica migraciones y ejecuta el seed

        ```bash
        npm run migrate:test
        ```

    - 4.3 Ejecuta los tests

        ```bash
        npm test
        ```

## Scripts útiles
|Script                 |   Descripción|
|-----------------------|--------------|
|`npm run dev`          |   Ejecuta el servidor en modo desarrollo con recarga automática (ts-node-dev). Utiliza la base de datos por defecto (MySQL).
|`npm run build`        |   Compila el proyecto TypeScript y genera la carpeta build/|
|`npm start`            |   Ejecuta el proyecto ya compilado, desde la carpeta build/ (Usado para producción)
|`npm test`             |   Ejecuta los tests con jest en entorno de prueba|
|`npm run lint`         |   Revisa el código con ts-standard para asegurar buenas prácticas y estilo|
|`npm run migrate`      |    Aplica las migraciones en desarrollo utilizando Prisma (prisma migrate dev)|
|`npm run migrate:test` |   Aplica migraciones en base de datos de pruebas y corre el archivo de seed|