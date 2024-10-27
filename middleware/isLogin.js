const jwt = require('jsonwebtoken')
const UserModel = require('../modules/user')
 const isLogin = async(req,res,next) =>{
    //console.log('hello ')
    const{token}= req.cookies
    //console.log(token)
    if(token){
        res.redirect('/home')
    }
    next()
 }
 module.exports = isLogin
 