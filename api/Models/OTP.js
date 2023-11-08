const mongoose=require('mongoose');

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        required:true
    },
    otp:{
        type:String,
        required:true,
        trim:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now,
        expires:5*60,
    }

});

const mailSender=require('../Configuration/mailSender');

async function sendVerificationMail(email,otp){
    try {
        const mailResponse=await mailSender(email,"Verification Email from StudyNotion",otp);
        console.log("Email sent successfully",mailResponse);
    } catch (error) {
        console.error("error occured while sending the verification email",error)
        throw error;
    }
}

otpSchema.pre("save",async function(next){
    if(this.isNew){
        await sendVerificationMail(this.email,this.otp);
    }
    next();
})

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;