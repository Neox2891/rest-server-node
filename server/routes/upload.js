const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
let path = require('path');
let fs = require('fs');
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    let validarTipo = ['productos', 'usuarios'];

    if (validarTipo.indexOf(tipo) < 0) {

        return res.json({
            ok: false,
            err: {
                message: 'Especifique donde guardar, tipos validos: ' + validarTipo.join(', ')
            }
        });
    }

    if (!req.files) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Archivo no encontrado'
            }
        });

    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    let extValida = ['jpg', 'png', 'gif', 'jpeg'];

    if (extValida.indexOf(extension) < 0) {

        return res.json({
            ok: false,
            err: {
                message: 'No se pudo cargar el archivo, extensiones validas: ' + extValida.join(', '),
                extType: `La extension: ${extension} no es soportada`
            }
        });
    }

    let idDiferenciador = new Date();
    let nombreArchivo = `${ id }-${ idDiferenciador.getMilliseconds() }.${ extension }`;


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, function(err) {
        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (tipo === 'usuarios') {
            imgUsuario(id, res, nombreArchivo);
        } else {
            imgProducto(id, res, nombreArchivo);
        }

    });

});



let imgUsuario = (id, res, nombreArchivo) => {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarImagen('usuarios', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarImagen('usuarios', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario ID no existe'
                }
            });
        }

        borrarImagen('usuarios', usuarioDB.img);

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioSave) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioSave
            });

        });


    });

}

let imgProducto = (id, res, nombreArchivo) => {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrarImagen('productos', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarImagen('productos', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto ID no existe'
                }
            });
        }

        borrarImagen('productos', productoDB.img);

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoSave) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoSave
            });

        });
    });

}

let borrarImagen = (tipo, nombreImagen) => {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}
module.exports = app;