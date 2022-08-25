const Admin = require("../models/adminModel");
const Blog = require("../models/blogModel");
const Users = require("../models/users.model");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");


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
        admin
            .save(admin)
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
            res.send(data);
        })
        .catch(err => {
            res.send(err)
        });
})

// delete post by id
router.delete("/deletePost/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send("deleted successfully!")

        }
    })
})

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
router.get("/verifyUsers", (req, res) => {
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

// comment on blogs by users
router.post("/commentOnPost/:id", (req, res) => {
    try {
        const { comment, userId } = req.body

        let data = { "comment": comment, "userId": userId }

        Blog.findByIdAndUpdate({ _id: req.params.id }, { $push: { 'comments': data } }, (err, result) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(result)
            }
        })
    }
    catch (err) {
        res.send(err);
    }

})

// read all comments  with username
router.get("/allData", (req, res) => {
    Blog.find()
        .populate({ path: "comments.userId", select: 'userName' })
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.send(err)
        })
})

// delete comment on blogs by users
router.post("/deleteComment/:id", async (req, res) => {
    try {
        let remove_id = ['6303280957c4b28dee944922'];
        await Blog.findByIdAndUpdate({ _id: req.params.id }, {
            $pull: {
                comments: {
                    _id: remove_id
                }
            }
        }, (err, result) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(result)
            }

        })
    }
    catch (err) {
        res.send(err)
    }
})

module.exports = router;



