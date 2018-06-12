const express = require('express');
const Productos = require('../models/producto');
const { verificarToken } = require('../midlewares/autenticacion');
const app = express();


// obtener todos los productos
app.get('/productos', verificarToken, (req, res) => {

    Productos.find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            })
        })

});
// busqueda de produtos
app.get('/productos/buscar/:termino', (req, res) => {

    let termino = req.params.termino;
    // esxpresiones regulares para que la busqueda sea mas flexible
    let regEx = new RegExp(termino, 'i'); // "i" insensible a las mayusculas y minusculas

    Productos.find({ nombre: regEx })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            })

        });

});

// obtener un producto por ID
app.get('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Productos.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'producto no encontrado o ID incorrecto'
                    }
                });
            }

            res.json({
                ok: true,
                productoDB
            });

        });

});

// Crear un producto 
app.post('/productos', verificarToken, (req, res) => {

    let body = req.body;
    let usuario = req.usuario;

    let producto = new Productos({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            productoDB
        })
    })

});

// actualizar un producto 
app.put('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Productos.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'producto no encontrado o ID incorrecto'
                }
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    });

});
// deshabilitar un producto
app.delete('/productos/:id', (req, res) => {

    let id = req.params.id;
    // let disponibilidad = {
    //     disponible: false
    // }

    Productos.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'producto no encontrado o ID incorrecto'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoRemove) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoRemove
            })
        });
    });

    // Productos.findByIdAndUpdate(id, disponibilidad, { new: true }, (err, productoDB) => {

    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!productoDB) {
    //         return res.status(404).json({
    //             ok: false,
    //             err: {
    //                 message: 'producto no encontrado o ID incorrecto'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         productoDB
    //     });
    // });

});

module.exports = app;