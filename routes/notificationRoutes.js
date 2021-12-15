const express = require('express');
const mongoose=require('mongoose');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Chat=require('../schemas/chatSchema');
router.get('/',async (req,res)=>{
    var payload = {
        pageTitle: "Notifications",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
        
    };
    res.status(200).render("notificationsPage",payload);
})

module.exports=router;