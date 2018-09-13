const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'la descripcion es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    fecha: {
        type: String
    }
});

// categoriaSchema.plugin(uniqueValidator, '{PATH} debe de ser unico');

module.exports = mongoose.model('Categoria', categoriaSchema);