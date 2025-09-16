const express = require('express');
const productSchema = require('../models/product');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         sku:
 *           type: string
 *           description: Código único del producto
 *           example: "ABC123"
 *         name:
 *           type: string
 *           description: Nombre comercial del producto
 *           example: "Camiseta"
 *         brand:
 *           type: string
 *           description: Marca del producto (opcional)
 *           example: "Nike"
 *         category:
 *           type: string
 *           description: Categoría del producto
 *           example: "Ropa"
 *         unit:
 *           type: string
 *           description: Unidad de venta
 *           enum: [pz, caja, m, kg, lt]
 *           example: "pz"
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Precio de venta (≥ 0)
 *           example: 29.99
 *         cost:
 *           type: number
 *           minimum: 0
 *           description: Costo del producto (opcional, ≥ 0)
 *           example: 15.00
 *         stock:
 *           type: integer
 *           minimum: 0
 *           description: Existencias actuales (≥ 0)
 *           example: 100
 *         minStock:
 *           type: integer
 *           minimum: 0
 *           description: Nivel mínimo de inventario (opcional, default 0)
 *           example: 10
 *         location:
 *           type: string
 *           description: Ubicación en bodega (opcional)
 *           example: "Pasillo A, Estante 3"
 *         supplierId:
 *           type: string
 *           description: ID de proveedor asociado (opcional)
 *           example: "SUP123"
 *         tags:
 *           type: array
 *           description: Etiquetas de búsqueda (opcional)
 *           items:
 *             type: string
 *           example: ["verano", "ropa", "descuento"]
 *         imageUrl:
 *           type: string
 *           description: URL de imagen del producto (opcional)
 *           example: "https://example.com/producto.jpg"
 *         active:
 *           type: boolean
 *           description: Estado activo/inactivo (default true)
 *           example: true
 *         attributes:
 *           type: array
 *           description: Atributos libres en formato clave/valor
 *           items:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 example: "color"
 *               value:
 *                 type: string
 *                 example: "rojo"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación (automática)
 *           example: "2025-09-16T14:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización (automática)
 *           example: "2025-09-16T14:35:00.000Z"
 *       required:
 *         - sku
 *         - name
 *         - category
 *         - unit
 *         - price
 *         - stock
 */


/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error en los datos enviados
 */
//crear un producto
router.post('/products', async (req, res) => {
    const product = new productSchema(req.body);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body recibido:", req.body);
    product
        .save()
        .then((result) => { res.status(201).json(result); })
        .catch((err) => { res.status(400).json({ message: err.message }); });
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar productos con filtros y paginación
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Búsqueda parcial en nombre, marca o categoría
 *       - in: query
 *         name: minStockAlert
 *         schema:
 *           type: boolean
 *         description: Filtrar productos cuyo stock sea menor o igual al mínimo
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número máximo de productos a devolver
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Número de productos a saltar (para paginación)
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
//listar productos con filtros // el nombre, la marca o la categoría // y paginacion
router.get('/products', async (req, res) => {
  try {
    const { q,minStockAlert,limit,skip } = req.query;

    const query = {};

    if (q) { //revisar nombre/marca/categoria
      query.$or = [
        { name: new RegExp(String(q), 'i') },
        { brand: new RegExp(String(q), 'i') },
        { category: new RegExp(String(q), 'i') }
      ];
    }

    if (minStockAlert === 'true') { //revisar stock minimo
      query.$expr = { $lte: ["$stock", "$minStock"] };
    }

    if (limit !== undefined) { //verificación que limit sea un numero entero
      const n = Number(limit);
      if (!Number.isFinite(n) || !Number.isInteger(n)) {
        return res.status(400).json({ message: 'limit must be an integer' });
      }
    }

    if (skip !== undefined) {//verificación que skip sea un numero entero
      const n2 = Number(skip);
      if (!Number.isFinite(n2) || !Number.isInteger(n2)) {
        return res.status(400).json({ message: 'skip must be an integer' });
      }
    }

    const products = await productSchema.find(query).limit(limit).skip(skip);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
//obtener un producto por ID
router.get('/products/:id', (req, res) => {
  const { id } = req.params;
  productSchema
    .findById(id)
    .then((data) => { data ? res.json(data) : res.status(404).json({ message: 'Product not found' }); })
    .catch((err) => { res.status(500).json({ message: err.message }); });
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       500:
 *         description: Error interno del servidor
 */

//actualizar parcialmente un producto por ID
// si no se desea actualizar un campo, no enviarlo en el body
router.patch('/products/:id', (req, res) => {
  const { id } = req.params;
  const { sku, name, brand, category, unit, price, cost, stock, minStock, location, supplierId, tags, imageUrl, active, attributes } = req.body;
  productSchema
    .updateOne({ _id: id }, { $set: { sku, name, brand, category, unit, price, cost, stock, minStock, location, supplierId, tags, imageUrl, active, attributes } })
    .then((data) => { res.json(data); })
    .catch((err) => { res.status(500).json({ message: err.message }); });
});

/**
 * @swagger
 * /api/products/{id}/adjust-stock:
 *   patch:
 *     summary: Ajustar stock de un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       200:
 *         description: Stock actualizado
 *       500:
 *         description: Error interno del servidor
 */
//adjustar stock de un producto por ID
router.patch('/products/:id/adjust-stock', (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  productSchema
    .updateOne({ _id: id }, { $set: { stock } })
    .then((data) => { res.json(data); })
    .catch((err) => { res.status(500).json({ message: err.message }); });
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       500:
 *         description: Error interno del servidor
 */
//eliminar un producto por ID
router.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  productSchema
    .deleteOne({ _id: id })
    .then((data) => { res.json(data); })
    .catch((err) => { res.status(500).json({ message: err.message }); });
});

module.exports = router;