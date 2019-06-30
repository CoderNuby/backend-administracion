var express = require('express');
var app = express();

var mdAutentication = require('../../middlewares/autenticacion');

var Producto = require('../../models/producto');

//Obtener todos los productos
app.get('/', mdAutentication.verificarToken, (req, res, next) => {
    Producto.find({}, '').exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                err
            });
        }
        if (!productos) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontro ningun producto'
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Get de productos',
            productos
        });
    });
});

//Actualizar producto
app.put('/:id', mdAutentication.verificarToken, (req, res, next) => {
    var body = req.body;
    var id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al actualizar producto:V',
                err
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.precio = body.precio;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al guardar usuario',
                    err
                });
            }
            res.status(200).json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
});


//Crear producto
app.post('/', (req, res, next) => {
    var body = req.body;
    var producto = new Producto({
        nombre: body.nombre,
        precio: body.precio,
        imagen: body.imagen
    });

    producto.save((err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear producto:)',
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto
        });
    });
});

app.delete('/:id', (req, res, next) => {
    var id = req.params.id;

    Producto.findByIdAndRemove(id, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borra producto',
                err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje:'Producto no encontrado'
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Producto borrado',
            producto
        });
    });
});

module.exports = app;