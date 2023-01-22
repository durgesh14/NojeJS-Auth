const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://durgesh14:Durgesh%4014@my-cluster.hrva1w0.mongodb.net/nodejs-auth');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to mongo db'));

db.once('open', function(){
    console.log('Connected to mongo-db');
})

module.exports = db;