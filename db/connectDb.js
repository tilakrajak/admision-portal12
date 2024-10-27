const mongoose = require('mongoose')
const live_url = "mongodb+srv://tilakrajak72:tilak123@cluster0.glze9dq.mongodb.net/admisionportal?retryWrites=true&w=majority";

const Local_Url = 'mongodb://127.0.0.1:27017/admissionPortal'



const connectDb =()=>{
    return mongoose.connect(Local_Url )
    .then(()=>{
        console.log("connect Success")
    }).catch((error)=>{
        console.log(error)
    })
}
module.exports = connectDb