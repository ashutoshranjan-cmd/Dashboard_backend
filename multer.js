

const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');



const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dzwci1fjt', 
    api_key: '676928827956358', 
    api_secret: 'dvLPJDfElp5lxBoE14CArGcu43c'
});


// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'uploads', // Cloudinary folder where files will be stored
      allowedFormats: ['jpeg', 'png', 'jpg', 'gif'], // Allowed file formats
      public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Generate unique file name
  },
});

const upload = multer({ storage: storage });


module.exports = upload;