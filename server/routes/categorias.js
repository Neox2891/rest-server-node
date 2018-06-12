const express = require('express');
const Categoria = require('../models/categoria');
const { verificarToken, verificaAdminRole } = require('../midlewares/autenticacion');
const app = express();

// mostrar todas las categorias sin paginar
app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                categoriaDB
            });
        });
});

// mostrar una categoria por ID
app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            categoriaDB
        });

    });

});
// Crear una categoria
app.post('/categoria', [verificarToken, verificaAdminRole], (req, res) => {

    let body = req.body;
    let idUsuario = req.usuario._id;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: idUsuario
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });
});
// actualizar una categoria
app.put('/categoria/:id', [verificarToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    })

});
// eliminar una categoria
app.delete('/categoria/:id', [verificarToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaRemove) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaRemove) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoriaRemove,
            message: 'Categoria eliminada'
        });
    });

});

module.exports = app;