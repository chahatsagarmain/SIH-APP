const User=require('../Models/User');
const OTP=require('../Models/OTP');
const otpGenerator=require('otp-generator');
const bcrypt=require('bcrypt');


exports.sendOTP=async(req,res)=>{
    try {
        const {email}=req.body;
        const checkUserPresent=await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"Email is already registered"
            })
        }

        var otp=otpGenerator.generate(4,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });

        var result=await OTP.findOne({otp:otp});
        while(result){
            otp=otpGenerator.generate(4,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            }); 
        };

        const otpPayload={email,otp};
        const otpBody=await OTP.create(otpPayload);
        console.log(otpBody);

        return res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp
        })


    } catch (error) {
        console.error(error);
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }


};


exports.signUP=async(req,res)=>{
    try {
        const{name,
        email,
        otp,password,conformPassword}=req.body;
        
        if(!name||!email||!password||!conformPassword||!otp){
            return res.status(403).json({
                success:false,
                message:"Please fill all the fields"
            })
        }

        if(conformPassword !== password){
            return res.status(400).json({
                // success:false,
                msg:"Password doesn't match"
            })
        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                msg:"User already registered"
            })
        }

        const recentOTP=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOTP);

        if(recentOTP.length===0){
            return res.status(400).json({
                success:false,
                msg:"OTP Error"
            })
        }else if(otp !==recentOTP[0].otp){
            return res.status(400).json({
                success:false,
                msg:"OTP invalid"
            })
        }

        var hashedPassword=await bcrypt.hash(password,10);
        console.log("hashed password:",hashedPassword);


        // const profileData=await Profile.create({
        //     gender:null,
        //     dateOfBirth:null,
        //     about:null,
        //     email:null
        // });

        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
        })

        console.log(user);
        return res.status(200).json({
            success:true,
            msg:"User is Registered Successfully",
            user,
        })

    } catch (error) {
        console.error(error);
        console.log(error.message);
        return res.status(500).json({
            msg:"Signup process went wrong",
            error:error.message
        })

    }
}

exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({
                success:false,
                message:"Please fields all the details"
            })
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not registered"
            })
        }

        if(await bcrypt.compare(password,user.password)){
            // const payload={
            //     email:user.email,
            //     id:user._id,
            //     accountType:user.accountType
            // }

            // const token=jwt.sign(payload,process.env.JWT_SECRET,{
            //     expiresIn:"2h",
            // });
            // user.token=token;
            user.password=undefined;

            // const options={
            //     expires:new Date(Date.now()+3*24*60*60),
            //     httpOnly:true
            // }
            res.status(200).json({
                success:true,
                user,
                msg:"LoggedIn successfully"
            })
        }
        else{
            return res.status(400).json({
                success:false,
                msg:"Passwords doesn't match"
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            msg:"Login Failure"
        })
    }
}

