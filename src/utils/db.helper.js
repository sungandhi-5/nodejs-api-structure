const mongoose = require('mongoose');
const { error_log } = require('./lib/log.lib');
mongoose.set('strictQuery', false);


const connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
    } catch (error) {
        error_log("There is an error for mongoDB connection:", error.message);
        throw error;
    }
}

module.exports = {
    connect
};