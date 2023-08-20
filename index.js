const express = require('express'); // Importar express.
const app = express();// Constructor express, se crea la aplicación.
const path = require('path');
const ruticas = require('./backend/routes/enrutamiento');
require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/frontend/views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || 7988, () => {
  console.log('funciona ' + process.env.PORT);
});// .listen: Inicia el servidor, se escucha en el puerto que hay en los parentesis. Se ejecuta la funcion () => cuando el servidor está en línea

app.use('/api/v1/', ruticas);
