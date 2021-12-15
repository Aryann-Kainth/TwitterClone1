const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Chat = require('../../schemas/chatSchema');
const Message=require('../../schemas/MessageSchema');
const Notification=require('../../schemas/notificationSchema');
app.use(bodyParser.urlencoded({ extended: false }));
router.get('/',async(req,res)=>{
  // res.status(200).send('works');
  Notification.find({userTo:req.session.user._id,notificationType:{$ne:"new message"}})
  .populate('userTo')
  .populate('userFrom')
  .sort({createdAt:-1})
  .then(results=>res.status(200).send(results))
  .catch(err=>{
      console.log(err);
      res.sendStatus(400);
  })
})


module.exports = router;