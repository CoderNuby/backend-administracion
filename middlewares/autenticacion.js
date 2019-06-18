var SEED = require('../config/config').SEED;
var jwt = require('jsonwebtoken');


//Verificar token
exports.verificarToken = function (req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no valido',
                err
            });
        }

        //usuario en request
        req.usuario = decoded.usuario;
        next();
    });
}
