const express = require('express');
const app = express();
const port = 3000;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const session = require("express-session");
const dbUrl = 'mongodb://localhost:27017/tw9';
//const io=require('socket.io');
mongoose.connect(dbUrl, { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('database connected');
})
const server = app.listen(port, () => console.log("Server listening on port " + port));
const io=require("socket.io")(server,{pingTimeout:60000});
app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "bbq chips",
    resave: true,
    saveUninitialized: false
}))

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const postRoute=require('./routes/postRoutes');
const profileRoute=require('./routes/profileRoutes');
const uploadRoutes=require('./routes/uploadRoutes');
const messagesRoute=require('./routes/messagesRoutes');
// Api routes
const postsApiRoute = require('./routes/api/posts');
const userApiRoute=require('./routes/api/users');
const chatsApiRoute=require('./routes/api/chats');
const messagesApiRoute=require('./routes/api/messages');

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/posts", postRoute);
app.use("/profile", middleware.requireLogin,profileRoute);
app.use("/uploads",uploadRoutes);
app.use('/api/users',userApiRoute);
app.use("/api/posts", postsApiRoute);
app.use("/api/messages",messagesApiRoute);
app.use('/messages',middleware.requireLogin,messagesRoute);
app.use('/api/chats',chatsApiRoute);
app.get("/", middleware.requireLogin, (req, res, next) => {

    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }

    res.status(200).render("home", payload);
})
app.get('/logout',(req,res)=>{
    if(req.session)
    {
        req.session.destroy();
        res.redirect('/login');
    }
})

io.on("connection",(socket)=>{
//console.log("Socket.io is running")
socket.on('setup',userData=>{
   // console.log(userData.firstName)
   socket.join(userData._id);
   socket.emit("connected");

})
socket.on('join room',(room)=>{
    socket.join(room);
})
socket.on('typing',(room)=>{
    socket.in(room).emit('typing');
})
socket.on("stop typing",(room)=>{
    socket.in(room).emit("stop typing");
})

})