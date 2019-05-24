const express=require('express');
const Task=require('../models/task');
const auth=require('../middleware/auth')
const router=new express.Router();
router.post("/tasks" , auth,async (request,response)=>{
    const task=new Task(
        {
        //the below is called spread operator in Es6
        ...request.body,
        owner:request.user._id
    });
    try{
        const result= await task.save();
        console.log("task have been saved successfully the saved object is below")
        console.log(result)
        response.status(201).send(result);
    }catch(error){
     console.log("task could not be saved error object is below");
     console.log('Error ! ',error);
     response.status(400).send(error);
    }
})
///tasks?completed=true
//tasks?limit=10&skip=20
//tasks?sortBy=createdAt:desc
router.get("/tasks" ,auth,async (request,response)=>{
    const match={};
    const sort={}
        if(request.query.completed){
         match.completed = request.query.completed==='true';
        }
        if(request.query.sortBy){
            const parts=request.query.sortBy.split(':');
            sort[parts[0]]=parts[1]==='desc'?-1:1
        }
        try{
             await  request.user.populate({
                 path:'tasks',
                 match,
                 options:{
                     limit:parseInt(request.query.limit),
                     skip:parseInt(request.query.skip),
                     sort
                 }
                }).execPopulate();
             response.send(request.user.tasks);
        }catch(error){
          response.send(error);
        }
    })

router.get("/tasks/:id",auth,async (request,response)=>{
        const _id=request.params.id;
      try{
            const task= await Task.findOne({_id,owner:request.user._id});
            if(!task){
                return response.status(404).send("no task found for provided id")
              }  
             response.send(task)
        }catch(error){
            response.send(error);
        }
    })
    
router.patch("/tasks/:id" ,auth,async (request,response)=>{
     const updates = Object.keys(request.body);
     const allowedUpdates=['completed' ,'description'];
     const isValidOperation= updates.every(update=>allowedUpdates.includes(update));
     if(!isValidOperation){
         return response.status(404).send("Error ! this is not allowed update ");
     }
     try{
         const task = await Task.findOne({_id:request.params.id,owner:request.user._id});
         if(!task){
            return response.status(404).send("Error could not find the desired result");
        }
         updates.forEach(update => task[update]=request.body[update]);
         await task.save();
         response.send(task);
        }catch(error){
          response.status(500).send(error);
         }
      })
      
 router.delete("/tasks/:id",auth,async (request,response)=>{
        try{
            const task= await Task.findOne({_id:request.params.id,owner:request.user._id});
            await task.remove();
            if(!task){
                return response.status(404).send("error ! could not find the task");
            }
            response.send(task);
        }catch(error){
            response.status(500).send(error);
        }
      
    })

module.exports=router;