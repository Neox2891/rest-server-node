const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const _ = require('underscore');
const { verificarToken, verificaAdminRole } = require('../midlewares/autenticacion');

app.get('/usuario', verificarToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre
    // });

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Usuario.find({ estado: true }, 'nombre email role estado google img fecha')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, noRegistros) => {

                if (err) {

                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    noRegistros,
                    usuarios
                });
            });


        });
});

app.post('/usuario', [verificarToken, verificaAdminRole], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        fecha: Date()
    });

    usuario.save((err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuario.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/:id', [verificarToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, 'nombre', 'email', 'img', 'role', 'estado');

    // delete body.password;
    // delete body.google;

    // let bodycopy = _.omit(body, 'google', 'password');
    // console.log(bodycopy);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado',
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', [verificarToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let cambiarEstado = {
        estado: false
    };
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado',
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

    // Usuario.findById(id, (err, usuarioDB) => {
    //     if (err) {

    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     usuarioDB.estado = false;
    //     usuarioDB.save((err, usuarioInactivo) => {
    //         if (err) {

    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }
    //         res.json({
    //             ok: true,
    //             usuarioInactivo
    //         });
    //     });
    // });

});

module.exports = app;