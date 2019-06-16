//Requires
var express = require('express');
var mongoose = require('mongoose');

//Inicializar Variables
var app = express();

//conexione a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/Administracion', (err, res) => {
	if(err)throw err;
	console.log('Base de datos Administracion online');
});

//Rutas
app.get('/', (request, response, next)=> {
	response.status(200).json({
		ok: true,
		mensaje: "otra prueba"
	});
});

//Escuchar peticiones
app.listen(3200, ()=> {
	console.log('Express server puerto 3200 online');
});