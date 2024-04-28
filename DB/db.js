const mongoose=require('mongoose')
const connect=()=>{
    try{
        mongoose.connect(process.env.URI)
    }
    catch(error)
    {
        console.log('connection error')
    }
}
module.exports=connect
