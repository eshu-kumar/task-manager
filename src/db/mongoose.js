const mongoose =require('mongoose');
mongoose.connect(process.env.MONGODB_URL,
{
useNewUrlParser:true,
useFindAndModify:false,
useCreateIndex:true
} 
);

const closeConnection=()=>{
    mongoose.disconnect().then(()=>{
        console.log("connection has been closed successfully");
       }).catch((error)=>{
        console.log('Error in closing connection ' , error);
       })
}