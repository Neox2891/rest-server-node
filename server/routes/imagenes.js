const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificarToken } = require('../midlewares/autenticacion');
const app = express();


app.get('/imagenes/:tipo/:img', verificarToken, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        let noPathImage = path.resolve(__dirname, `../assets/no-image.jpg`);
        res.sendFile(noPathImage);
    }


});



module.exports = app;