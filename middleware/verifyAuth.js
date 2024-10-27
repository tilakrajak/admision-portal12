const jwt = require('jsonwebtoken');
const userModel = require('../modules/user')
const verifyAuth = async(req,res,next) =>{
// console.log("hello")
    const{token} = req.cookies
    // console.log(token)
    if(!token){
        req.flash('error',"unauthorised user please login")
        res.redirect('/')
    }else{
        const verifyToken = jwt.verify(token,'gddhudfgfyu3gr78324')
        const data = await userModel.findOne({_id:verifyToken.ID})
        // console.log(data)
        req.userdata = data
        // console.log(verifyToken)
        next();
    }
    
}
module.exports = verifyAuth