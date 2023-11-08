const express=require('express');
const router=express.Router();

const{sendOTP,signUP,login}=require('../Controllers/authentication');

router.post('/signup',signUP);
router.post('/sendotp',sendOTP);
router.post('/login',login);


module.exports=router;