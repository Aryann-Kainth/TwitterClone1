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
        pageTitle: "Messages",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    };
    res.status(200).render("inboxPage",payload);
})
router.get('/new',async (req,res)=>{
    var payload = {
        pageTitle: " New Message",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    };
    res.status(200).render("newMessage",payload);
})

router.get('/:chatId',async(req,res)=>{
    var userId = req.session.user._id;
    var chatId = req.params.chatId;
    var isValidId = mongoose.isValidObjectId(chatId);


    var payload = {
        pageTitle: "Chat",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    };

    if(!isValidId) {
        payload.errorMessage = "Chat does not exist or you do not have permission to view it.";
        return res.status(200).render("chatPage", payload);
    }

    var chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: userId } } })
    .populate("users");

    if(chat == null) {
        // Check if chat id is really user id
        var userFound = await User.findById(chatId);

        if(userFound != null) {
            // get chat using user id
            chat=await getChatByUserId(userFound._id,userId)
        }
    }

    if(chat == null) {
        payload.errorMessage = "Chat does not exist or you do not have permission to view it.";
    }
    else {
        payload.chat = chat;
    }

    res.status(200).render("chatPage", payload);
})
function getChatByUserId(userLoggedInId,otherUserId)
{
    return Chat.findOneAndUpdate({
        isGroupChat:false,
        users:{
            $size:2,
            $all:[
                {
                    $elemMatch:{$eq:mongoose.Types.ObjectId(userLoggedInId)}
,                },
                {
                    $elemMatch:{$eq:mongoose.Types.ObjectId(otherUserId)}
,                }

            ]
        }
    },{
        $setOnInsert:{
            users:[
                userLoggedInId,otherUserId
            ]
        }
    },{
        new:true,
        upsert:true
    })
    .populate("users")
}

module.exports=router;