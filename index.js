const express = require('express');
const mongoose = require('mongoose');
const PORT = 3000;
const app = express();

//Middleware; todo lo pasa a json
app.use(express.json());

//Base de datos (Mongo)
mongoose.connect("mongodb://localhost/pro-autorenta-appv", {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', error => console.error('An error has ocurred conecting to the DB, ', error));
db.once('open', () => console.log('The connection to the DB was successfull'));

//Rutas
const routes = require('./routes/routes');
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});