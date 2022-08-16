const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        require:true
    },
    description: {
        type: String,
        require:true
    },
    comments:[
        {
            comment:{type: String , default:""},
        }
    ]
})

const blogPost = new mongoose.model("blogPost", blogSchema);
module.exports = blogPost;
