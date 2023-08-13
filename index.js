const express = require('express'); //Importar express.
const app = express() //Constructor express, se crea la aplicación.
const path = require('path');
const ruticas = require('./backend/routes/enrutamiento');
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/frontend/views'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.listen(7004, () =>{
    console.log('funciona wii')
}) //.listen: Inicia el servidor, se escucha en el puerto que hay en los parentesis. Se ejecuta la funcion () => cuando el servidor está en línea

app.use('/api/v1/', ruticas)

