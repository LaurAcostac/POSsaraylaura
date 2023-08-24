const mongoose = require('../config/connection');

const SchemaVentas = new mongoose.Schema({ // agregar direccion
  ProductosVenta: {
    type: Array
  },
  SubtotalVenta: {
    type: Number
  },
  FechaVenta: {
    type: Date
  },
  Impuesto: {
    type: Number
  },
  TotalVenta: {
    type: Number
  },
  ClienteVenta: {
    type: String
  },
  VendedorVenta: {
    type: String
  }

});

const venta = mongoose.model('Venta', SchemaVentas);

module.exports = venta;
