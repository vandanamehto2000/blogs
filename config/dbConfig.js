const mongoose = require("mongoose");
const db = () =>{
    mongoose.connect(
        "mongodb://localhost:27017/blogs"
    )
    .then(data => {
        console.log("connected to the database");
    })
    .catch(err => {
        console.log("cannot conected to the database", err);
    })
}

module.exports = db;