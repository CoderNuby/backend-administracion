var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../../config/config').SEED;

var app = express();

app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


var Usuario = require('../../models/usuario');

/*
	se envia por el body el email y password
*/

app.post('/', (req, res) => {
	var body = req.body;

	Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
		if(err){
			return res.status(400).json({
				ok: false,
				mensaje: 'Error al buscar usuario',
				err
			});
		}
		if(!usuarioDB){
			return res.status(400).json({
				ok: false,
				mensaje: 'Credenciales incorrectas-Email',
				err
			});
		}
		if(!bcrypt.compareSync(body.password, usuarioDB.password)){
			return res.status(400).json({
				ok: false,
				mensaje: 'Credenciales incorrectas-Password',
				err
			});
		}

		//Crear token
		var token = jwt.sign({ usuario: usuarioDB}, SEED, {expiresIn: 14400});

        /*
         * Cuidado con enviar la contraseña por la respuesta
         */

		res.status(200).json({
			ok: true,
			usuario: usuarioDB,
			token,
			id: usuarioDB._id
		});
	});
});


module.exports = app;