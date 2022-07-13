const mongoose = require("mongoose");


//https://mongoosejs.com/docs/connections.html#multiple_connections
const connectDatabase = () => { //promise döndürüyor
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDb Connection Succesful")
    })
    .catch(err => {
        console.log(err);
    });
}

module.exports = connectDatabase;