const express = require("express");
const userRouter=require("./routers/user");
const taskRouter=require("./routers/task");
//we just want to run this file to connect to database
require('./db/mongoose');
const app = express();///setting up middleware 
//always remember that we need to call next once our do something finshes in middleware function
//using json helps you to get the all the request parsed into directly json format
// app.use((request,response,next)=>{
//    response.status(503).send("site is under maintence");
// })
app.use(express.json()); 
//setting up the routers
app.use(userRouter);
app.use(taskRouter);
const port = process.env.PORT;
// const bcrypt = require("bcryptjs");
// const myfunction = async ()=>{
// const password="red12345!";
// try{
//     const hashedPassword= await bcrypt.hash(password,8);
//     console.log(password);
//     console.log(hashedPassword);
//     const ismatched = await bcrypt.compare('red12345!',hashedPassword);
//     console.log(ismatched);
// }catch(error){
//     console.log("below is the error");
//     console.log(error);
// }

// }
// myfunction();
// const jwt=require('jsonwebtoken');
//  const myFunction = async ()=>{
//  const token = jwt.sign({_id:"abc123"},"this is secret" ,{expiresIn:"10 seconds"});
//  //json web token has three periods,this is base 64 json header it contains the meta info what type of token
//  //which algorithm created it ,
//  //second part is json 64 encoded part that contains information provided by us
//  //the last part is json signature for verification
//  console.log(token);
//  const data=jwt.verify(token,'this is secret')
//  console.log(data);
// }
// myFunction()

app.listen(port ,()=>{
    console.log(`server has been started at port ${port}`);
})
//this is what exactly happening because of defining toJSON METHOD ON USER
//ONCE YOU STRINGIFY user to send back to client it deleted password and tokens property automatically
//an send the user to the client because we have customised it to do it so
// const pet={
// name:"pussy",
// food:"milk"
// }
// pet.toJSON=function(){
// delete this.food;
// return this;
// }
// console.log(JSON.stringify(pet));
//delaing with task user relationship
// const Task=require("./models/task")
// const User=require('./models/user')
// const main=async ()=>{
//     //process of getting the task and finding the user
// // const task = await Task.findById("5cc59ab3a6efff1252e1e000");
// // await task.populate('owner').execPopulate();
// // console.log(task.owner);
// const user = await User.findById('5cc59a8da6efff1252e1dffe');
// await user.populate('tasks').execPopulate();
// console.log(user.tasks);
// }
// main()
//this is multer and it helps you uploading the files it is express based npm 
// const multer = require('multer');
// const upload =multer({
//     dest:'images'
// })
// app.post('/upload',upload.single('upload'),(request,response)=>{
// response.send()
// })