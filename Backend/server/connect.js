const mongoose = require('mongoose');

async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
        });
        console.log('MongoDB Connection Succeeded.');
    } catch (error) {
        console.log('Error in DB connection: ' + error);
    }
}



module.exports = connectToMongoDB;