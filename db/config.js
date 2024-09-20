const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://kumarashu493:03E49UT8w3mqJ3dF@dashboard.cwh8e.mongodb.net/?retryWrites=true&w=majority&appName=DashBoard")
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


