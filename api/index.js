const express=require('express');
const index=express();
require('dotenv').config();

const userRoutes=require('./Routes/userRoutes');
const {dbConnect}=require('./Configuration/Database').dbConnect();

index.use(express.json());

const PORT=process.env.PORT|| 5000;

index.use('/api/v1/auth',userRoutes);


index.get('/',(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running..."
    })
});

index.listen(PORT,()=>{
    console.log(`App is running at PORT ${PORT}`)
})