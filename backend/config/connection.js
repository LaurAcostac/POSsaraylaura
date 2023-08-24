const mongoose = require('mongoose'); // importar la librería
require('dotenv').config();
const uri = `mongodb+srv://${process.env.USERDB}:${process.env.PASSWORDDB}@cluster0.idychtf.mongodb.net/${process.env.NAMEDB}?retryWrites=true&w=majority`;
// uri de la base de datos
mongoose.connect(uri, { useNewUrlParser: true });
// exportar
module.exports = mongoose;
