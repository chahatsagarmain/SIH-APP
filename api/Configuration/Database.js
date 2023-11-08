const mongoose=require('mongoose');

require('dotenv').config();

exports.dbConnect=async(req,res)=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>{console.log("db connection successfully established")})
    .catch((error)=>{
        console.error(error);
        console.log("DB connection failed");
        process.exit(1);
    })
}