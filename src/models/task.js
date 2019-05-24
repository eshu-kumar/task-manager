const mongoose=require('mongoose');
const validate=require('validator');
const taskSchema=new mongoose.Schema( {
    description:{
       type:String,
       trim:true,
       required:true
    },
    completed:{
     type:Boolean,
     default:false
    },
    owner:{//this field will be used to create the relationship betweeen task and the user
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})
taskSchema.pre('save',async function(next){
 const task=this;
 console.log('before saving or updating the task middleware just demo using function');
 next();
})
const Task=new mongoose.model('Task' ,taskSchema);
module.exports=Task;