const express=require('express')
const server=express()
const connect=require('./DB/db')
const cors=require('cors')
const router=require('./routes/route')
const passport=require('passport')
const user=require('./DB/models/user')
require('dotenv').config()

server.use(cors({origin:[process.env.ORIGIN]}))
server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(router)
server.use(passport.initialize())

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    const User=user.findOne({_id: jwt_payload._id})
    if(User)
    {
        return done(null,User)
    }
    else
    {
        return done(null,false)
    }

}))

connect()

server.listen(9000,()=>{
    console.log('served')
})
