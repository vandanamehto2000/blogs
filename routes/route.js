const Admin = require("../models/adminModel");
const Blog = require("../models/blogModel");
const Users = require("../models/users.model");
const express = require("express");
const app = express();
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/users.model");

// signUp for admin
router.post("/signUp", async (req, res) => {
    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
        return res.json({
            message: "This email is already exists, please login your account"
        })
    } else {
        const saltRound = 10;
        const password = req.body.password;
        const encryptedPassword = await bcrypt.hash(password, saltRound);
        admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: encryptedPassword
        })
        admin.save();
        console.log("you have register successfully", admin);
        res.json({
            message: "you have register successfully",
            admin
        })
    }
})


// login for admin
router.post("/login", async (req, res) => {
    let admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
        return res.json({
            message: "This email is incorrect."
        })
    }
    const SECRETKEY = "vandana";
    let comparePassword = await bcrypt.compare(req.body.password, admin.password);
    console.log(comparePassword, "yyyyyyyyyyyyy")
    if (comparePassword) {
        const token = jwt.sign({ email: req.body.email }, SECRETKEY)

        res.json({
            message: "login successfully.",
            token: token
        })
    } else {
        res.json({
            message: "password does not match"
        })
    }

})

// admin need to verify
router.get("/verifyAdmin", (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer") || !req.headers.authorization.split(' ')[1]) {
        return res.json({
            message: "please provide the token"
        })
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, "vandana");
    res.json({
        message: "fatch successfully",
        decoded
    })

})

// Blog post by admin
router.post("/blogPost", (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        description: req.body.description,

    })
    blog
        .save(blog)
        .then(data => {
            console.log(data)
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.send(err)
        });

})


// Blog read by all the users
router.get("/readAllBlog", (req, res) => {
    Blog.find()
        .then(data => {
            res.json({
                data
            })
        })
        .catch(err => {
            res.json({ err })
        })
})

// comment on post
router.post("/commentOnPost/:id", (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndUpdate(id, req.body)
    .then(data => {
        res.json({
            message:"comment has posted....", data});
    })
    .catch(err => {
        res.send(err)
    })
})


// router.post("/blogPost", (req, res) => {
//     const blog = new Blog({
//         title: req.body.title,
//         description: req.body.description,

//     })
//     blog
//         .save(blog)
//         .then(data => {
//             console.log(data)
//             res.send(data);
//         })
//         .catch(err => {
//             console.log(err);
//             res.send(err)
//         });

// })



// exports.post = (req, res) => {
//     const id = req.params.id;
//     Employee.findByIdAndUpdate(id, req.body)
//       .then(data => {
//         console.log("employee was updated successfully......")
//         res.send("employee was updated successfully......")
//       })
//       .catch(err => {
//         console.log(err);
//         res.send(err);
//       })
//   }



// register by users
router.post("/signUpAsUser", async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        return res.json({
            message: "This email is already exists, please login your account"
        })
    } else {
        const saltRound = 10;
        const password = req.body.password;
        const encryptedPassword = await bcrypt.hash(password, saltRound);
        user = new Users({
            userName: req.body.userName,
            email: req.body.email,
            password: encryptedPassword
        })
        user.save();
        console.log("you have register successfully", user);
        res.json({
            message: "you have register successfully",
            user
        })
    }
})

// login by users
router.post("/loginAsUser", async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (!user) {
        return res.json({
            message: "This email is incorrect."
        })
    }
    const SECRETKEY = "vandana";
    let comparePassword = await bcrypt.compare(req.body.password, user.password);
    console.log(comparePassword, "yyyyyyyyyyyyy")
    if (comparePassword) {
        const token = jwt.sign({ email: req.body.email }, SECRETKEY)

        res.json({
            message: "login successfully.",
            token: token
        })
    } else {
        res.json({
            message: "password does not match"
        })
    }

})

// need to verify of users
router.get("/verifyAdmin", (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer") || !req.headers.authorization.split(' ')[1]) {
        return res.json({
            message: "please provide the token"
        })
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, "vandana");
    res.json({
        message: "fatch successfully",
        decoded
    })

})



module.exports = router;