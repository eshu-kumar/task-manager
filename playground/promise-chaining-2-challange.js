require('../src/db/mongoose');
const Task=require('../src/models/task');
const findDeleteCountBoth= async (_id,completed)=>{
  const user = await Task.findOneAndDelete({_id});
  const count = await Task.countDocuments({completed});
  return {user,count};
}
findDeleteCountBoth('5cc0140382eb2f1c186fdb77',true).then((both)=>{
    console.log(both);
}).catch((error)=>{
    console.log("Error ! "+error);
})