//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar Variables
var app = express();


//Avilitar CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//Importar Rutas
var appRoutes = require('./routes/app');
var appUsuario = require('./routes/admin-usuarios/usuario');
var appProducto = require('./routes/admin-productos/producto');
var appLogin = require('./routes/admin-usuarios/login');

//conexione a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/Administracion', (err, res) => {
	if(err)throw err;
	console.log('Base de datos Administracion online');
});

//Rutas
app.use('/adm/usuario', appUsuario);
app.use('/adm/producto', appProducto);
app.use('/adm/login', appLogin);
app.use('/', appRoutes);

//Escuchar peticiones
app.listen(3200, ()=> {
	console.log('Express server puerto 3200 online');
});