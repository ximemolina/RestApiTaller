const express = require('express');
const productSchema = require('../models/product');
const router = express.Router();

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

//obtener un producto por ID
router.get('/products/:id', (req, res) => {
  const { id } = req.params;
  productSchema
    .findById(id)
    .then((data) => { data ? res.json(data) : res.status(404).json({ message: 'Product not found' }); })
    .catch((err) => { res.status(500).json({ message: err.message }); });
});

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

//adjustar stock de un producto por ID
router.patch('/products/:id/adjust-stock', (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  productSchema
    .updateOne({ _id: id }, { $set: { stock } })
    .then((data) => { res.json(data); })
    .catch((err) => { res.status(500).json({ message: err.message }); });
});

//eliminar un producto por ID
router.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  productSchema
    .deleteOne({ _id: id })
    .then((data) => { res.json(data); })
    .catch((err) => { res.status(500).json({ message: err.message }); });
});

module.exports = router;