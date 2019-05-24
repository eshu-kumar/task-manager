const User=require('../models/user');
const jwt=require('jsonwebtoken');

const auth= async (request,response,next)=>{
    try{
    const token=request.header('Authorization').replace('Bearer ','');
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const user=await User.findOne({_id:decoded._id,'tokens.token':token});
    request.token=token;
    request.user=user;
    if(!user){
        throw new Error('please authenticate');
    }
    next()
    }catch(error){
        response.status(404).send(error.message);
    }
    
}
module.exports = auth;