const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true
    },
    brand: {
      type: String
    },
    category: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true,
      enum: ["pz", "caja", "m", "kg", "lt"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    cost: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    minStock: {
      type: Number,
      min: 0,
      default: 0,
    },
    location: {
      type: String,
    },
    supplierId: {
      type: String
    },
    tags: {
      type: [String],
    },
    imageUrl: {
      type: String
    },
    active: {
      type: Boolean,
      default: true,
    },
    attributes: [ {
        key: { type: String, required: true },
        value: { type: String, required: true },
    } ],
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Product', productSchema);