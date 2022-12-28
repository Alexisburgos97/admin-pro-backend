require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

//Crear servidor express
const app = express();

//Configurar CORS
app.use( cors() );

//Base de datos
dbConnection();

//Rutas
app.get("/", (req, resp) => {
    resp.status(200).json({
        ok: true,
        msg: "Hola mundo"
    });
});

app.listen( process.env.PORT, () => {
    console.log( "Servidor corriendo en el puerto " + process.env.PORT );
});
