var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    precio: { type: Number, required: false },
    imagen: { type: String, required: false }
});

module.exports = mongoose.model('Producto', productoSchema);