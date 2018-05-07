var express = require('express');
var app = express();
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//APP CONFIG
// Original Database
// mongoose.connect('mongodb://localhost/myblog');

// Mongo Database 
mongoose.connect('mongodb://aagii:skynet@ds117200.mlab.com:17200/blog2018');
// mongodb://aagii:skynet@ds117200.mlab.com:17200/blog2018
// user: aagii
// password: skynet

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


// MONGOOSE MODEL CONFIG/
let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now}
});

let Blog = mongoose.model("Blog", blogSchema);


//Шинэ мэдээлэл оруулах 

// Blog.create({
//     title: "Test blog",
//     image: "https://cdn.images.express.co.uk/img/dynamic/4/590x/usain-bolt-net-worth-how-much-earn-income-833865.jpg",
//     body: "Эрчим хүч хэмнэх, эрчим хүчний үйлдвэрлэл, дамжуулалт, түгээлт, хэрэглээний бүх түвшинд үр ашгийг дээшлүүлж, хууль, эрх зүй, зохицуулалтын орчинг боловсронгуй болгох, төрийн байгууллагууд хоорондын зохицуулалт, мэдээллийн урсгалыг сайжруулах, бодлого үйл ажиллагааны уялдааг хангах, санхүүжилт, хөрөнгө оруулалтын эх үүсвэрийг оновчтой бүрдүүлэх, олон улсын байгууллагын үүрэг оролцоог тодорхойлох гэх мэт сэдвээр хэлэлцжээ."
// });

// GET ROUTE
app.get("/", function(req, res){
    // res.send("<h1>Hello</h1> <p>How are you my friends</p>");

    res.render("index");
});

// Start of BLOG routes ======================================================
app.get("/blog", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("blog", {blogs: blogs});
        }
    });
});
// ========= Блог Пост Нэмэх ====================
app.get("/blog/new", function(req, res){
    res.render("newBlog");
});
// =============CREATE ROUTE =============================
app.post("/blog", function(req, res){
    // Create Blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("newBlog");
        }else{
            res.redirect("/blog");
        }
    });
})
// ======= SHOW =================
app.get("/blog/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blog");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});

// ========== EDIT ======================== 
app.get("/blog/:id/edit", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect('/blog');
        }else{
            res.render("edit", {blog:foundBlog});
        }
    })
})
// =========== UPDATE ROUTE============================
app.put("/blog/:id", (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blog");
        }else{
            res.redirect("/blog/" +  req.params.id);
        }
    });
    });
// =========== DELETE ROUTE ================================= 
app.delete("/blog/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blog");
        }else{
            res.redirect("/blog");
        }
    });
});
// End of blog routes ==========================================================
app.get("/portfolio", function(req, res){
    res.render("portfolio");
});
app.get("/works", function(req, res){
    res.render("works");
});

app.get("/about", function(req, res){
    res.render("aboutMe");
});

// START SERVER
app.listen(process.env.PORT || 5000);
console.log('Server started');

