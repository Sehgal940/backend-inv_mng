const express=require('express')
const router=express.Router()
const passport=require('passport')
const multer=require('multer')
const path=require('path')
const {Register,Signin,Send,Records,Delrec,Compare,SendUp,RecUp}=require('./controllers')

const storage=multer.diskStorage({
destination: function (req, file,cb) {
    cb(null, 'uploads')
  },
filename: function (req, file,cb) {
    cb(null, `${file.originalname}`)
  }
})
const upload=multer({storage})

router.post('/register',Register)
router.post('/signin',Signin)
router.post('/send',passport.authenticate('jwt',{session:false}),Send)
router.post('/sendup',passport.authenticate('jwt',{session:false}),SendUp)
router.get('/records',passport.authenticate('jwt',{session:false}),Records)
router.get('/recUp',passport.authenticate('jwt',{session:false}),RecUp)
router.post('/deleterec',passport.authenticate('jwt',{session:false}),Delrec)
router.post('/compare',passport.authenticate('jwt',{session:false}),upload.single('file'),Compare)

module.exports=router