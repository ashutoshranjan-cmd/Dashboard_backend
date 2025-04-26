const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://kumarashu493:auijzbkQ59PvrNXH@cluster0.bk1dit0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then((data)=>
{
    console.log('successfully connected to mongodb');
    
})
.catch((error)=>{
    console.log(error);
    
})
// mongoose.connect("mongodb://localhost:27017/e-commerce")
// .then((data)=>
// {
//     console.log('successfully connected to mongodb');
    
// })
// .catch((error)=>{
//     console.log(error);
    
// })


