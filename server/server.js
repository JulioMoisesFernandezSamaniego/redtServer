require('./config/config');

const express = require('express');

const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser')

//para las rutas ya lo tiene node por defecto
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//habilitamos la carpeta piblic para hacer publica el html
app.use(express.static(path.resolve( __dirname, '../public')));

//llamamos a las rutas ya creadas
app.use(require('./routes/index'));

//coneccion con la base de datos    
mongoose.connect(process.env.URLDB,(err,res)=>{
    if(err)throw err;
    console.log("Base de datos online")
});

app.listen(process.env.PORT,(err)=>{
    if(err)throw new Error
    console.log('Escuchando el puerto',3000);
});
