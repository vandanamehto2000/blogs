const express = require("express");
const app = express();
const db = require("./config/dbConfig");

app.use(express.json());

// const adminController = require("./routes/adminRoute");
// const blogController = require("./routes/blogRoute");
// const usersController = require("./routes/usersRoute");
// app.use(adminController, blogController,usersController);
const controllers = require("./routes/route");
app.use(controllers);



app.listen(8000, () => {
    console.log("server has started on port 8000")
})

db();