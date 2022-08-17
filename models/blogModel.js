const mongoose = require("mongoose");
const blog = require("./users.model");
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    comments: [
        {
            comment: { type: String, default: "" },
            userName:
                { type: mongoose.Schema.Types.ObjectId, ref: "users" }
        }
    ],


})

const blogPost = new mongoose.model("blogPost", blogSchema);
module.exports = blogPost;
