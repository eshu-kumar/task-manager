require('../src/db/mongoose');
const User=require("../src/models/user");
const findAndUpdateBoth = async (_id,age)=>{
     const user = await User.findOneAndUpdate({_id},{age}) ;
     const count =await User.countDocuments(age);
     return {user,count};
}
findAndUpdateBoth('5cc00ef81169301a55cb671b',320).then((both)=>{
console.log(both);
}).catch((error)=>{
    console.log("Error ! "+error)
})