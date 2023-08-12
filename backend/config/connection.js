const mongoose = require('mongoose'); //importar la librería

const uri = 'mongodb+srv://LauraAdso:ZGi3b7V9f1CNADek@cluster0.idychtf.mongodb.net/TiendaVirtual?retryWrites=true&w=majority' //uri de la base de datos
mongoose.connect(uri, { useNewUrlParser: true });


module.exports = mongoose //exportar