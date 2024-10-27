const express = require('express')
const app  = express()
const Port = 3000
const web = require('./routes/web') 
const connectDb = require('./db/connectDb')
const fileUpload = require('express-fileupload')
const cookieparser = require('cookie-parser')
app.use(cookieparser())

//connect flash and sessions
const session = require('express-session')
const flash = require('connect-flash');


//fileupload  image
app.use(fileUpload
    ({
       useTempFiles:true,
       
       tempFileDir : '/tmp/'
    }));


//message 
app.use(session({
       secret:'secret',
       resave : true,
       saveUninitialized:true,
}));
//flash messages
app.use(flash());


//parse application/x-www-form-urlencoded data get
app.use(express.urlencoded({extended:false}))

//html css set
app.set('view engine','ejs')

//css image link
app.use(express.static('public'))



//connect db
connectDb()

app.use(express.urlencoded({extended:true}));

//routing 
app.use('/',web)

//server create
app.listen(Port,()=>{
    console.log(`server start localhost: ${Port}`)
})