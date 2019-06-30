var express = require('express');
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var Usuario = require('../../models/usuario');




/*
 nesesita token como medida de seguridad
 */
//Obtener Usuarios
app.get('/', mdAutenticacion.verificarToken, (req, res, next) => {


	/*Busca todo de la coleccion de usuario*/
	Usuario.find({}, 'nombre email imagen role').exec((err, usuario) => {
        if (err) {
            return res.status(500).json({
				ok: true,
				mensaje: 'Error al buscar usuarios',
				error: err
			});
        }
        res.status(200).json({
			ok: true,
			mensaje: 'Get de usuarios',
			usuario
		});
	});
});



//Actualizar usuarios
app.put('/:id', mdAutenticacion.verificarToken, (req, res) => {
	var id = req.params.id;
	var body = req.body;

	Usuario.findById(id, (err, usuario) => {

		if(!usuario){
			return res.status(400).json({
				ok: false,
				mensaje: 'No se encontro ningun usuario con este ID '+id
			});
		}

		if(err){
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar usuario',
				err
			});
        }

        //Solo administradores pueden modificar usuarios
        var role = req.usuario.role;
        if (!(role == "ADMIN_ROLE")) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No autorizado para actualizar usuario-USER_ROLE'
            });
        }


		usuario.nombre = body.nombre;
		usuario.email = body.email;
		usuario.role = body.role;
		
		usuario.save((err, usuarioGuardado) => {
			if(err){
				return res.status(400).json({
					ok: false,
					mensaje: 'Error al guardar usuario',
					err
				});
			}
			
			res.status(200).json({
				ok: true,
				mensaje: 'Usuario Actualizado',
                usuarioGuardado,
                Admin: req.usuario
			});
		});
	});
});


//Crear un nuevo usuario
app.post('/', mdAutenticacion.verificarToken, (req, res, next) => {
    var body = req.body;

    //Solo administradores pueden modificar usuarios
    var role = req.usuario.role;
    if (!(role == "ADMIN_ROLE")) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No autorizado para crear usuario-USER_ROLE'
        });
    }
    
	var usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		imagen: body.imagen,
		role:body.role
    });

    /*
     * cuidado!!
     * cambiar el codigo para que no se envie el password en la respuesta
     */

	usuario.save((err, usuarioGuardado) => {
		if(err){
            return res.status(400).json({
				ok: false,
				mensaje: 'Error al crear usuario',
				err
			});
		}
        res.status(201).json({
			ok: true,
			mensaje: 'Usuario creado correctamente',
            usuarioGuardado,
            Admin: req.usuario
		});
	});
});


//Borrar usuario
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
	var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        //Solo administradores pueden modificar usuarios
        var role = req.usuario.role;
        if (!(role == "ADMIN_ROLE")) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No autorizado para borrar usuario-USER_ROLE'
            });
        }

		if(!usuarioBorrado){
			return res.status(400).json({
				ok: false,
				mensaje: 'No existe ningun usuario con este ID '+id
			});
		}

		if(err){
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar usuario',
				err
			});
		}
		
		res.status(200).json({
			ok: true,
            usuarioBorrado,
            Admin: req.usuario
		});
	});
});

module.exports = app;


























