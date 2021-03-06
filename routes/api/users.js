const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Notification = require('../../schemas/notificationSchema');
const multer=require('multer');
const {storage}=require('../../cloudinary/index')
const upload=multer({storage});
const path=require('path');
const fs=require('fs');
app.use(bodyParser.urlencoded({ extended: false }));
router.get("/", async (req, res, next) => {
    var searchObj = req.query;

    if(req.query.search !== undefined) {
        searchObj = {
            $or: [
                { firstName: { $regex: req.query.search, $options: "i" }},
                { lastName: { $regex: req.query.search, $options: "i" }},
                { username: { $regex: req.query.search, $options: "i" }},
            ]
        }
    }

    User.find(searchObj)
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
});

router.put("/:userId/follow", async (req, res, next) => {

    var userId = req.params.userId;

    var user = await User.findById(userId);
    
    if (user == null) return res.sendStatus(404);

    var isFollowing = user.followers && user.followers.includes(req.session.user._id);
    var option = isFollowing ? "$pull" : "$addToSet";

    req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [option]: { following: userId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    User.findByIdAndUpdate(userId, { [option]: { followers: req.session.user._id } })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    //sending notifications
    if(!isFollowing)
    {
        await Notification.insertNotification(userId,req.session.user._id,"follow",req.session.user._id)
        
    }
    res.status(200).send(req.session.user);
})

router.get("/:userId/following", async (req, res, next) => {
    User.findById(req.params.userId)
    .populate("following")
    .then(results => {
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
});

router.get("/:userId/followers", async (req, res, next) => {
    User.findById(req.params.userId)
    .populate("followers")
    .then(results => {
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
});
router.post('/profilePicture',upload.single("croppedImage"),async(req,res)=>{
    if(!req.file){
        console.log("No files");
        return;
    }
   console.log(req.file)
   const url=req.file.path;
   const filename=req.file.filename
        req.session.user=await User.findByIdAndUpdate(req.session.user._id,{profilePic:url},{new:true})
        return res.sendStatus(204);

    })
   // res.send(req.file);
router.post('/coverPhoto',upload.single("croppedImage"),async(req,res)=>{
    if(!req.file){
        console.log("No files");
        return;
    }
    const url=req.file.path;
   const filename=req.file.filename
        
        req.session.user=await User.findByIdAndUpdate(req.session.user._id,{coverPhoto:url},{new:true})
        return res.sendStatus(204);

    })
   // res.send(req.file);

module.exports = router;