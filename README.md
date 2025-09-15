# 📦 Proyecto Node.js con Express, Mongoose y Swagger

Este proyecto es una API básica construida con **Node.js**, **Express** y **Mongoose** para conectarse a MongoDB. Además, se incluye integración con **Swagger** para documentar los endpoints.

---

## ⚙️ Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v16 o superior recomendado)
- [npm](https://www.npmjs.com/)
- Una instancia de **MongoDB** (local o en la nube, por ejemplo [MongoDB Atlas](https://www.mongodb.com/atlas))

---

## 🚀 Instalación y configuración

1. **Crear el proyecto Node.js**
   
   ```
   npm init --yes
3. **Instalar dependencias principales**
   ```
   npm i express mongoose dotenv
4. **Instalar dependencias de desarrollo**
   ```
   npm install nodemon -D
5. **Configurar scripts en package.json**
   ```
   "scripts": {
       "start": "nodemon src/index.js"
    }
---

## 📂 Estructura del proyecto
    
    ├── src/
    │   ├── index.js        # Punto de entrada del servidor
    │   ├── routes/         # Rutas de la API
    │   │   └── product.js
    │   └── models/         # Modelos Mongoose
    │       └── products.js
    ├── .env                # Variables de entorno
    ├── package.json
    └── README.md

---

## 🎯 Ejecutar el proyecto
    
    npm run start
