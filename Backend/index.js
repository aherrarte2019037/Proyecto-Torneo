'use strict'

const mongoose = require("mongoose")
const app = require('./app')

mongoose.Promise = global.Promise;

const USER = 'root';
const PASS = 'root';
const PORT = 27017;
const DB = 'TorneoDeportivo';
const haveCredentials = false;
let URL = '';

if( haveCredentials ) {
    URL = `mongodb://${USER}:${PASS}@localhost:${PORT}/${DB}?authSource=admin`;

} else {
    URL = 'mongodb+srv://root:root@tornaisse.j89lr.mongodb.net/tornaisseDB?retryWrites=true&w=majority';
}

mongoose.connect( URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
    console.log('Successful database connection')

    app.listen(process.env.PORT || 3000, function () {
        console.log('Server running on port 3000')
    })
}).catch(err => console.log(err))