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
  var searchObj={userTo:req.session.user._id,notificationType:{$ne:"new message"}}
  if(req.query.unReadOnly!==undefined&&req.query.unReadOnly=="true")
        {
           searchObj.opened=false;
        }
  Notification.find(searchObj)
  .populate('userTo')
  .populate('userFrom')
  .sort({createdAt:-1})
  .then(results=>res.status(200).send(results))
  .catch(err=>{
      console.log(err);
      res.sendStatus(400);
  })
})
router.get('/latest',async(req,res)=>{
  // res.status(200).send('works');
  
  Notification.findOne({userTo:req.session.user._id})
  .populate('userTo')
  .populate('userFrom')
  .sort({createdAt:-1})
  .then(results=>res.status(200).send(results))
  .catch(err=>{
      console.log(err);
      res.sendStatus(400);
  })
})

router.put('/:id/markAsOpened',async(req,res)=>{
  // res.status(200).send('works');
  Notification.findByIdAndUpdate(req.params.id,{opened:true})
  
  .then(()=>res.sendStatus(204))
  .catch(err=>{
      console.log(err);
      res.sendStatus(400);
  })
})
router.put('/markAsOpened',async(req,res)=>{
  // res.status(200).send('works');
  Notification.updateMany({userTo:req.session.user._id},{opened:true})
  
  .then(()=>res.sendStatus(204))
  .catch(err=>{
      console.log(err);
      res.sendStatus(400);
  })
})


module.exports = router;