const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");

require("dotenv").config();

//swagger
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// Options
const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: { title: 'Products API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:5000' }], 
  },
  apis: [path.resolve(__dirname, './routes/products.js')],
};
const swaggerSpec = swaggerJsDoc(swaggerOptions); 


const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json()); //para que el servidor entienda json

app.use("/api", productRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// útil para depurar
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));


//routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//MONGOOSE CONECTION
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

