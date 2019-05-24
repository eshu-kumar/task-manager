const express=require('express');
const User=require('../models/user');
const router=new express.Router();
const auth=require('../middleware/auth');
const multer=require('multer');
const sharp=require('sharp');
const {sendWelcomeEmail,sendCancelationEmail} = require('../emails/account');
router.post("/users" , async (request,response)=>{
    let user=new User(request.body);
    //this is async call you can use the await method but there is no need to wait for it 
    sendWelcomeEmail(user.email,user.name);
    try{
       
         await user.save();
        const token= await user.generateAuthToken();
        console.log("data has been saved and the saved object is");
        console.log(user);
        response.status(201).send({user,token});
    }catch(error){
      console.log("data could not be saved and error object is below");
      console.log("Error ! "+error);
      response.status(400).send(error);
    }   
})
router.post('/users/login',async (request,response)=>{
    try{
    const user = await User.findByCredentials(request.body.email,request.body.password);
    const token=await user.generateAuthToken();
    response.send({user,token})
    }catch(error){
     response.status(400).send(error);
    }
})
router.post('/users/logout', auth ,async (request,response)=>{
try{
  request.user.tokens=request.user.tokens.filter(element=>{
    return element.token!==request.token;
})
await request.user.save();
response.send("successfully logged out");
}catch(error){
    console.log(error);
response.status(500).send({Error:error});
}
})
router.post('/users/logoutAll',auth,async (request,response)=>{
    try{
     request.user.tokens=[];
     await request.user.save();
     response.send('successfully logged out from all devices');
    }catch(error){
      response.status(500).send(error);
    }
})
router.get("/users/me", auth ,async (request,response)=>{
   response.send(request.user);
})

router.patch("/users/me" ,auth, async (request ,response)=>{
    //to run only the allowed operations
    const updates= Object.keys(request.body);
    const allowedUpdates=['name','age','password'];
    const isValidOperation=updates.every(update=>allowedUpdates.includes(update));
    if(!isValidOperation){
        return response.status(404).send("Error ! not allowed update");
    }
    try{
     const user = request.user;
     updates.forEach(update=>user[update]=request.body[update])
     await user.save();
    console.log(user);
    response.send(user);
    }catch(error){
        console.log(error)
     response.status(404).send(error);
    }
})
router.delete("/users/me",auth,async (request,response)=>{
    try{
        await request.user.remove();
        //this is the cancelation email that will be used when te user will deleted
        sendCancelationEmail(request.user.email,request.user.name)
        response.send(request.user);
    }catch(error){
        response.status(500).send(error);
    }
  
})
//we are creating the route to upload the user profile
//the below function actualy configure multer to do the differnt purpose work
//multer works like the  middleware  
//we ahve to link this image to the user profile also so we can use this 
const upload = multer({
  // dest:'avatars',if we want to save image then we can uncomment it 
  //but we are going to save our image in database as binary data buffer
   limits:{
       fileSize:1000000//it is megabyte if a user upload more it will be restricted 
   },
   fileFilter(request,file,cb){//file variable holdes information regarding the file
    //cb is to tell the multer we are done here
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
       return cb(new Error('only the jpg format is expected')); 
    }
    cb(undefined,true)
   }

})
//parameter in single function is an key value pair in request form-data type body
//we are providing auth middleware before it so it waill validate the request user before 
//it actually saves it
router.post("/users/me/avatar",auth,upload.single('avatar'),async (request,response)=>{
    const buffer=await sharp(request.file.buffer).resize({width:250,height:250}).png().toBuffer() ;
    request.user.avatar = buffer;
    await request.user.save();
    response.send({message:"image uploaded successfully"});//any error would be handeled by the express error handeling function 
    //that has been provided right now as the fourth parameter of the function
},(error,request,response,next)=>{
    //this is the error handeling function for error in express 
    //if something happens in api then you will need to address that isssue in this 
    //we can use next to tell the express we are done with it
    response.status(500).send({error:error.message});
})
//we are going to get the image and creating an url to do te stuff
router.get("/users/:id/avatar",async (request,response)=>{
    try{
        const user =await User.findById(request.params.id) ;
        if(!user||!user.avatar){
            throw new Error('image or user not found');
        }
        //this sets the type of response in our previous cases express was intelligent and used
        //to put Content-Type='application/json' 
        response.set('Content-Type',"image/jpg");
        response.send(user.avatar);
    }catch(error){
        console.log(error.message);
        response.status(404).send({error:error.message});
    }
})
//we are going to delete the avatar field 
router.delete("/users/me/avatar",auth,async (request,response)=>{
    if(request.user.avatar){
        request.user.avatar=undefined;
    }
    await request.user.save();
    response.send({message:"avatar has been deleted"});
},(error,request,response,next)=>{
    response.status(500).send({error:error.message});
})
module.exports=router;
