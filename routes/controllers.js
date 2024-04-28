const user=require('../DB/models/user')
const allData=require('../DB/models/data')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const qr=require('qrcode')
const QrCode = require('qrcode-reader');
const path=require('path')
const Jimp = require('jimp');
const fs=require('fs')

const Register=async(req,res)=>{
    const{firstname,lastname,email,password}=req.body
    const foundEmail=await user.findOne({email})
    if(foundEmail)
    {
        res.send('User already exists');
        res.end()
    }
    else
    {
        const hashPass=await bcrypt.hash(password,10)
        user.create({firstname:firstname,lastname:lastname,email:email,password:hashPass})
        res.send('User created')
        res.end()
    }
}
const Signin=async(req,res)=>{
    const{email,password}=req.body
    const foundUser=await user.findOne({email})
    if(foundUser)
    {
        const hashPass=foundUser.password
        const passValid=await bcrypt.compare(password,hashPass)
        if(passValid)
        {
            const _id=foundUser._id
            const payload={
                _id:_id,
                email:foundUser.email
            }
            const token=jwt.sign(payload,'secret',{expiresIn:'60m'})
            
            res.send({token,_id})
            res.end()
        }
        else
        {
            res.send('Wrong password');
            res.end()
        }
    }
    else
    {
        res.send('User not found')
        res.end()
    }
}
const Send=async(req,res)=>{
   const{name,quantity,date}=req.body;
   const {_id}=req.headers
   const genData=await allData.create({
    userid:_id,
    name:name,
    quantity:quantity,
    date:date
   })
    const qrcode=JSON.stringify(genData._id)
    qr.toDataURL(qrcode,async(err, src) => {
       await allData.updateOne({_id:genData._id},{src:src})
       allData.save
    });
    res.end()
}
const Records=async(req,res)=>{
     const{_id}=req.headers
     const records=await allData.find({userid:_id}).sort({cretatedAt:1})
     res.send(records)
 }
const Delrec=async(req,res)=>{
    const a=req.body
    let id;
    for(let key in a)
    {
        id=key
    }
    await allData.deleteOne({_id:id})
    allData.save
    res.end()
}
const Compare=async(req,res)=>{
    const name=req.file.filename
    if(path.extname(name)!=='.png')return
    fs.readFile(`uploads/${name}`,async(err, data) => {
        if (err) {
            console.error('Error reading image file');
            res.send('not done')
        }
            const qr = new QrCode();
            const image = await Jimp.read(data)
            qr.callback = async(error, result) => {
                if (error) {
                    console.error('Error decoding QR code:');
                }
                if (result && result.result) 
                {
                    const resl=result.result.substr(1,24)
                    const findId=await allData.findOne({_id:resl})
                    const q=findId.quantity
                    const r=(Math.random() * q).toFixed(0)
                    const givenDate=new Date(findId.date)
                    const futureDate=new Date(givenDate)
                    futureDate.setDate(givenDate.getDate()+Math.random()*60)
                    const p=q-r
                    const don=findId?.done
                    let ans;
                    if(q===r)ans='delivered'
                    else ans='pending'
                    if(don===true)
                    {
                            findId.done=false,
                            findId.status=ans,
                            findId.dispatch=`${futureDate.getFullYear()}-${futureDate.getMonth()}-${futureDate.getDate()} / ${r}`,
                            findId.pending=p,
                            findId.save()
                            res.send('done')
                    }
                    else
                    {
                        res.send('not done')
                    }
                }
               }
                qr.decode(image.bitmap); 
})
}
const SendUp=async(req,res)=>{
    const{name,quantity,date}=req.body;
    const {_id}=req.headers
    await allData.updateOne({_id:_id},{
     name:name,
     quantity:quantity,
     date:date,
     status:'pending',
     pending:0,
     dispatch:'-----',
     done:true,
    })
    allData.save
    res.end()
}
const RecUp=async(req,res)=>{
    const {_id}=req.headers
    const record=await allData.find({_id:_id})
    res.send(record)
}

module.exports={Register,Signin,Send,Records,Delrec,Compare,SendUp,RecUp}