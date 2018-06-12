const jwt = require('jsonwebtoken');

let verificarToken = (req, res, next) => {
    // obtener informacion del header
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalido!'
                }
            });
        }
        // crea una propiedad en la solicitud
        req.usuario = decoded.usuario;
        next();
    })

};

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

    next();
};

module.exports = {
    verificarToken,
    verificaAdminRole
};