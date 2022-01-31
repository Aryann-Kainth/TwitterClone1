const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name:"dsfv2vtbu",
    api_key:"692464783615969",
    api_secret:"8EDQLYV6p70Ij24W87rMfMRqW1k"
})
const storage=new CloudinaryStorage({
    cloudinary,
    params:{
    folder:'Twitter',
    allowedFormats:['jpeg','png','jpg']
    }
})
module.exports={
    cloudinary,
    storage
} 