require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        data: 'get usuario',
        id
    })
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            message: 'Es necesario el nombre'
        });

    } else {
        res.json({
            data: 'post usuario',
            persona: body
        });
    }

});

app.put('/usuario', (req, res) => {
    res.json({
        data: 'put usuario'
    })
});

app.delete('/usuario', (req, res) => {
    res.json({
        data: 'delete usuario'
    })
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});