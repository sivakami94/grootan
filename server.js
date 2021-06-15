const express=require("express")
const app=express();
const axios = require('axios')
const fs = require('fs');
const path = require('path');
const expressLayout=require("express-ejs-layouts")
const session=require("express-session")
const baseurl="https://userdetails.free.beeceptor.com";
app.use(express.static("public"))
app.use(expressLayout)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


app.use(session({
    secret:"GrootanTask",
    resave:true,
    saveUninitialized:true,
    
}))

const isLoggedIn = function (req, res, next) {
    if (req.session.user)
        next()
    else
        res.redirect('/login')
}

app.use((req, res, next)=>{
    res.locals.curuser = req.session.user;
    next();
})

app.get("/",isLoggedIn ,(req,res)=>{
    res.render("user");
})


//mock API, which will return a list of users.
app.get('/users', isLoggedIn,async (req, res) => {
    
    const users = await axios.get("https://userdetails.free.beeceptor.com/users")
    
    // let rawdata = fs.readFileSync(path.resolve(__dirname, 'user.json'));
    //  let users = JSON.parse(rawdata);
     
    res.json(users.data.data)
})


app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    req.session.user = req.body.email;
    res.redirect('/')
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/login')
})


app.get('/show/:mailid/', isLoggedIn, async (req, res) => {
    const users = await axios.get('https://userdetails.free.beeceptor.com/users')
    
    // let rawdata = fs.readFileSync(path.resolve(__dirname, 'user.json'));
    //  let users = JSON.parse(rawdata);
    var index = users.data.data.map(u => u.email)
    res.render('show', {user: users.data.data[index.indexOf(req.params.mailid)]})
})

app.listen(process.env.PORT||4000, () => {
    console.log("server stated");
})