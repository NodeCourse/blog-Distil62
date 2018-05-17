const express           = require("express");
const cookieParser      = require('cookie-parser');
const session           = require('express-session');
const bodyParser        = require('body-parser')
const hash              = require('hash.js')
const Database          = require('./database.js');
const Authentification  = require('./authentification.js');

const app = express();

const PORT = 8777;

app.use(express.urlencoded({extended: true}));
app.use(cookieParser(Authentification.cookie));
app.use(session({
    secret: Authentification.cookie,
    resave: false,
    saveUninitialized: false
}));
app.set('view engine', 'pug');
app.use(express.static('public'))
app.use(Authentification.passport.initialize());
app.use(Authentification.passport.session());

app.get("/", (req, res) => {
    Database.getAllArticles((data)=>{
        Database.getAllResponse((responses) => {
            res.render("index", {data : data, resp : responses, user : req.user});
        })
    })
});

app.get("/write", (req, res) => {
    res.render("write", {user : req.user});
});

app.get("/login", (req, res) => {
    res.render("login", {user : req.user});
});

app.get("/register", (req, res) => {
    res.render("register", {user : req.user});
});

app.get("/profile", (req, res) => {
    console.log(req.user);
    if (req.user !== undefined)
        Database.getAllArticlesById(req.user.id, (response)=>{
            res.render("profile", {user : req.user, articles : response});
        })
    else
        res.redirect('/');
});

app.get("/logout", (req, res)=> {
    req.logout();
    res.redirect("/");
})

app.post("/api/post/add", (req, res)=> {
    Database.getUserByName(req.body.author, (res)=>{
        Database.createArticle({
            title : req.body.title,
            author : req.body.author,
            userId : res.id,
            imgSrc : req.body.imgSrc,
            description : req.body.description
        })
    }).then(res.redirect("/"));
});

app.post("/api/post/ask", (req, res)=> {
    Database.createResponse(req.body);
    res.redirect("/");
});

app.post("/api/post/login", Authentification.passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.post("/api/post/register", (req, res)=> {
    req.body.password = hash.sha256().update(req.body.password).digest('hex');
    Database.createUser(req.body);
    res.redirect("/login");
});

app.post("/api/post/:type/:id", (req, res)=>{
    Database.likeArticle(req.user.id, req.params.id, req.params.type);
})

app.listen(PORT, console.log("The server is listen on http://localhost:" + PORT));