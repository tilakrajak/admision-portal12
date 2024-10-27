const e = require("connect-flash");
const CourseModel = require("../modules/course");
const nodemailer = require("nodemailer");


class CourseController {
  static CourseInsert = async (req, res) => {
    try {
      // console.log(req.body)`
      const { id } = req.userdata;
      const { name, email, phone, dob, address, gender, education, course } =
        req.body;
      const data = new CourseModel({
        name:name,
        email:email,
        phone:phone,
        dob:dob,
        address:address,
        gender:gender,
        education:education,
        course:course,
        user_id: id
      });
      await data.save();
      this.sendEmail(name,email,course)
      res.redirect("/display");
      
    } catch (error) {
      console.log(error);
    }
  };
  static CourseDisplay = async (req, res) => {
    try {
      const {  id,name, email, image } = req.userdata;
      const data = await CourseModel.find();
   
      res.render("course/display", { d:data , n: name, i: image,e:email });
    } catch (error) {
      console.log(error);
    }
  };
  static CourseView = async (req, res) => {
    try {
          const{name,email,image}=req.userdata;
          const id = req.params.id;
          const data = await CourseModel.findById(id) ;
          console.log(data);
          res.render("course/view",{d:data,e:email,n:name,i:image});
    } catch (error) {
      console.log(error);
    }
  };
  static CourseEdit = async (req, res) => {
    try {
      const{name,email,image}=req.userdata;
      const id= req.params.id;
      const data = await CourseModel.findById(id);
      res.render("course/edit",{d:data,n:name,i:image,e:email});

    } catch (error) {
      console.log(error);
    }
  };
  static CourseUpdate = async (req, res) => {
    try {
      const id = req.params.id;
      const{name,email,phone,dob,address,gender,education,course}=req.body;
      const data = await CourseModel.findByIdAndUpdate(id,{
        name,
        email,
        phone,
        dob,
        address,
        gender,
        education,
        course
      });
      res.redirect("/display");

    } catch (error) {
      console.log(error);
    }
  };

  static sendEmail = async (name,email,course) =>{

    console.log(name,email,course)
    //connect with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port:587,
      auth:{
        user:"tilakrajak72@gmail.com",
        pass:"qcssvujcrdickmgm",
      },
    });
    let info = await transporter.sendMail({
      from:"test@gmail.com",
      to: email,
      subject: `Course ${course}`,
      text: "hello",
      html:`<br>${name}</b> Course <b>${course}</b> insert successful! <br>`, //html body
    });
  };

}
module.exports = CourseController;
