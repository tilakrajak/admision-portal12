const mongoose = require('mongoose')

const TeacherSchema = mongoose.Schema({
    name:{
        type:String,
        Required:true,
    },
    email:{
        type:String,
        Required:true,
    },               
    phoneno:{
        type:Number,
        Required:true,
    },
    city:{
        type:String,
        default:'true'
    },
}
,{ timestamps: true})

const TeacherModel = mongoose.model('teacher',TeacherSchema)
module.exports = TeacherModel