//Requires
var express = require('express');
var mongoose = require('mongoose');

//Inicializar Variables
var app = express();

//Importar Rutas
var appRoutes = require('./routes/app');
var appUsuario = require('./routes/usuario');
var appLogin = require('./routes/login');

//conexione a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/Administracion', (err, res) => {
	if(err)throw err;
	console.log('Base de datos Administracion online');
});

//Rutas
app.use('/usuario', appUsuario);
app.use('/login', appLogin);
app.use('/', appRoutes);

//Escuchar peticiones
app.listen(3200, ()=> {
	console.log('Express server puerto 3200 online');
});