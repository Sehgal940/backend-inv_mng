const mongoose=require('mongoose')
const schema=new mongoose.Schema({
    
    userid:{type:mongoose.Schema.Types.ObjectId,ref:'Users'},
    name:{type:String},
    quantity:{type:String},
    date:{type:String},
    src:{type:String},
    dispatch:{type:String,default:'-----'},
    status:{type:String,default:'pending'},
    pending:{type:Number,default:0},
    createdAt:{type:String,default:Date.now()},
    done:{type:Boolean,default:true},
    
})
const allData=mongoose.model('allData',schema);
module.exports=allData