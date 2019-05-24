const mongoose =require('mongoose');
const validator=require('validator');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Task=require('./task');
//models help you to implement validation and sanitization on data 
//before saving it to database
//it provides you nice interface also to perform operations on databse just like objects
//you all have to deal with objects only 
//still all the mogoose model is built on mogodb library underlying
const userSchema=mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
  age :{
    type:Number,
    default:0,
    validate(value){
      if(value<0){
        throw new Error("Age must be a positive number");
      }
    }
  },
  email:{
    type:String,
    required:true,
    unique:true,//keep in mind it creates aunique index into the databse to identify the uniquness
    //so if you are creating such kind of constraint after creating te database it wont work
    //so nice thing is if you created the database then wipe it out  create new and save the values again
    trim:true,
    lowercase:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("not a valid email")
      }
    }
},
password: {
   type:String,
   required:true,
   trim:true,
   validate(value){
     if(value.includes("password")){
       throw new Error("password can not include the string password");
     }
     if(value.length<8){
       throw new Error("password must be more then or equal to 8 characters")
     }
   }
},
tokens:[
  {
    token:{
      type:String,
      required:true
    }
  }
],
avatar:{
  type:Buffer//we need no more validation because we have already done it multer middleware file uploading time
}
},{
  timestamps:true
});
//we are creating realtionship between user and task
//we are defining static methods on schema it can be directly invoked on model insted of 
//a particulr instance
//we are going to set a virtual property for tasks
//this virtual field does not exist in reality it just the info for mongoose that 
//task and user have this kind of relationship
userSchema.virtual('tasks',{
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})
userSchema.statics.findByCredentials=async (email,password)=>{
  const user= await User.findOne({email});
  if(!user){
    throw new Error('unable to login');
  }
  //this function is matching the plain password to the hashed password already saved in user
  //if does not match dont try to provide much information just say unable to login
  const isMatch= await bcryptjs.compare(password,user.password);
  if(!isMatch){
    throw new Error('unable to login');
  }
  return user;
}
//this is we are defining methods on the user instanses
userSchema.methods.generateAuthToken = async function(){
  const user=this;
  const token= jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);
  user.tokens=user.tokens.concat({token});
  await user.save();
  return token;
}
userSchema.methods.toJSON=function(){
  const user=this;
  const userObject=user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
}


//this is middleware function that is performed after or before some event occuring 
//save is one of the mongoose supported event
userSchema.pre('save',async function(next){
  //just beacuse of this keyword  problem with nodejs we are using function 
    const user=this;
    if(user.isModified('password')){
     user.password= await bcryptjs.hash(user.password,8);
    }
    //you should call next() to  tell that te code is over in case of asynchronus function
    next()
})
//this is another middleware function for the delete task cascading delete
//and this is going to delete all the user tasks and this supports delete event
userSchema.pre('remove',async function(next){
  const user=this;
  await Task.deleteMany({owner:user._id});
  next()
})
//now we have to pass schema to create the user model
const User = mongoose.model('User' , userSchema)
module.exports = User ;