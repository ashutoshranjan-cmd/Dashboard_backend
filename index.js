const express = require('express')
const cors = require("cors")
const path = require('path')
require('./db/config')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2

const User = require('./db/Users')
const Product = require('./db/Product')
const app = express();
const Jwt = require('jsonwebtoken')
const jwtKey = 'e-comm'
const multer = require('multer');
const { log } = require('console')
const upload = require('./multer')



app.use(express.json())// this is the middleware 
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // console.log(cb);
        
//         cb(null, './uploads'); // Destination folder for uploaded files
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // Keep the original file name
//     }
// });

// // Initialize multer middleware
// const upload = multer({ storage: storage });

const PORT = process.env.PORT || 5000


app.post('/register',upload.single('choco'),async (req,res)=>{
    const {name,email,password} = req.body
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password,salt)
    const cloudStore = await cloudinary.uploader.upload(req.file.path)
    const photo = req.file.originalname;
    // const result = await User.create({name,email,password:hash,filePath:`/uploads/${req.file.filename}`})
    const result = await User.create({name,email,password:hash,filePath:cloudStore.secure_url})
    Jwt.sign({result},jwtKey,{expiresIn:"2h"},(err,token)=>{
        if(err)
        {
            
            res.send({result:"something went wrong , please try after sometime"})
        }
        res.send({result,auth:token})
    })
})

app.post("/login",async (req,res)=>{

    if(req.body.password && req.body.email)
    {
        let email = req.body.email
        let user = await User.findOne({email});
        // console.log(email);
        let match = bcrypt.compare(req.body.password,user.password)
        if(match)
        {
            Jwt.sign({user},jwtKey,{expiresIn:"2h"},(err,token)=>{
                if(err)
                {
                    res.send({result:"something went wrong , please try after sometime"})
                }
                res.send({user,auth:token})
            })
        }
        else{
            res.send({result:'no user found'})
        }
    
    }
    else{
        res.send({result:'no user found'})
    }

   
})

app.post('/add-product', verfifyToken, upload.single('productImage'), async (req, res) => {
    try {
        // Destructure form data from request body
        const { name, price, category, company, userId,photo } = req.body;
        console.log(name,price,category,company,userId,photo);
        console.log(req.file.filename);
        // Check if the file was uploaded successfully
        // if (!req.file) {
        //     return res.status(400).send({ error: "File upload failed" });
        // }
        const cloudStore = await cloudinary.uploader.upload(req.file.path);
        
        

        // Create a new product with the form data and file path
        const result = await Product.create({
            name: name,
            price: price,
            category: category,
            userId: userId,
            company: company,
            // filePath:`/uploads/${req.file.filename}`
            filePath:cloudStore.secure_url

            // filePath: `/uploads/${req.file.filename}` // Make sure to use filename here
        });
        // const result = await product.save();

        // Send back the created product as a response
        console.log(result);
        
        res.send(result);
    } catch (error) {
        // Catch and handle errors
        console.error("Error creating product:", error);
        res.status(500).send({ error: "Server error" });
    }
});


app.get("/products",verfifyToken,async (req,res)=>{

    let products = await Product.find();
    if(products.length>0)
    {
        res.send(products)
    }
    else{
        res.send({result:"No Products Found"})
    }

})

app.delete("/product/:id",verfifyToken,async (req,res)=>{
    const result = await Product.deleteOne({_id:req.params.id})
    res.send(result)
})

app.get('/product/:id',async(req,res)=>{
    let result = await Product.find({_id:req.params.id})
    if(result)
    {
        res.send(result)
    }
    else{
        res.send({result:"No record found"})
    }
})

app.put("/product/:id",verfifyToken,async(req,res)=>{
    let result = await Product.updateOne(
        {
            _id:req.params.id
        },
        {
            $set:req.body
        }
    )
    res.send(result)
})

app.get("/search/:key",verfifyToken,async(req,res)=>{
    let result = await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {company:{$regex:req.params.key}}
        ]
    })
    res.send(result)
})
//creating a middleware function
function verfifyToken(req,res,next){
    let token = req.headers['authorization']
    if(token){
        token = token.split(' ')[1]
        // console.warn("middle ware called",token)
        Jwt.verify(token,jwtKey,(err,valid)=>{
            if(err){
                res.status(401).send({result:"please prodive a valid token"})

            }
            else{
                next()
            }
        })

    }
    else{
        res.status(403).send({result:"Please add token with header"})
    }
}

app.listen(PORT,()=>{
    console.log("This is working fine");
    
});