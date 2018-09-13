const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido!'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Es necesario el nombre!']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Es necesario el email!']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria!']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos,
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    fecha: {
        type: String
    }
});

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;

}

usuarioSchema.plugin(uniqueValidator, '{PATH} debe de ser unico');

module.exports = mongoose.model('Usuario', usuarioSchema);