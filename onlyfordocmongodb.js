//we are here going to create the CRUD features for mongodb create read update and delete
const mongodb=require('mongodb');
const {MongoClient , ObjectID} = mongodb;
const connectionURL="mongodb://127.0.0.1:27017";
const databaseName='task-manager';
//connecting to database is an asynchronus operation so it has an callback function
MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log("script failed to create the connection ");
    }
    console.log("connection has been established");
    const db = client.db(databaseName);
//     const updatePromise = db.collection('users').updateOne({
//         _id:new ObjectID("5cbea7aa28374510773a5fbb")
//     },
//     {
//         $inc:{
//           age:3
//         }
// })
// updatePromise.then((result)=>{
// console.log(result);
// }).catch((error)=>{
// console.log(error);
// })
// db.collection('tasks').updateMany({
//     completed:false
// },{
//     $set:{
//         completed:true
//     }
// }).then((result)=>{
//     console.log(result);
// }).catch((error)=>{
//     console.log(error);
// })
//delete demo D for delete in crud
// db.collection("tasks").deleteMany({
//     completed:false
// }).then((result)=>{
//     console.log(result);
// }).catch((error)=>{
//     console.log(error);
// })
// db.collection("tasks").insertMany([{
//     description:"this task will be deleted",
//     delete:true,
//     completed:false

// },{
//     description:"today you have to start rest api task",
//     completed:false
// }]).then((result)=>{
//     console.log(result);
// }).catch((error)=>{
//     console.log(error);
// })
db.collection("tasks").deleteOne({
    delete:true
}).then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log(error);
})
    
//closing the connection 
console.log("connection have been closed");
client.close();

})