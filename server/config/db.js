const mongoose = require('mongoose');
const { MONGO_URL } = require('./ENV_VARS');
function connect() {
    try {
       mongoose.connect(MONGO_URL);
        console.log('mongodb connected');   

    } catch (error) {
        console.log('error in mongodb connect');
        process.exit(1);
    }
}
module.exports = connect;