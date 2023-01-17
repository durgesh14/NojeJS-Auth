const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/nodejs-auth');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to mongo db'));

db.once('open', function(){
    console.log('Connected to mongo-db');
})

module.exports = db;