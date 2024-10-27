
const UserModel = require("../../modules/user");
const CourseModel = require("../../modules/course")
const nodemailer = require('nodemailer')

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dawjokma2",
  api_key: "927489688623582",
  api_secret: "PQMaqV7e_7S-jWKLwzRAecwP08g", // Click 'View API Keys' above to copy your API secret
});



class AdminController {
  static dashboard = async (req, res) => {
    try {
      const{name,image} = req.userdata
      res.render("admin/dashboard",{n:name,i:image});
    } catch (error) {
      console.log(error);
    }
  };
  static display = async (req, res) => {
    try {
      const{name,image} = req.userdata
      const data = await UserModel.find();
      // console.log(data)
      res.render("admin/display", { d: data ,n:name,i:image});
    } catch (error) {
      console.log(error);
    }
  };
  static Adduser = async (req, res) => {
    try {
      const{name,image} = req.userdata
      res.render("admin/Adduser",{n:name,i:image});
    } catch (error) {
      console.log(error);
    }
  };
  static viewUser = async (req, res) => {
    try {
      const{name,image} = req.userdata
      const id = req.params.id;
      //console.log(id)
      const data = await UserModel.findById(id);
      // console.log(data)
      res.render("admin/viewUser", { d: data,n:name,i:image });
    } catch (error) {
      console.log(error);
    }
  };
  static editUser = async (req, res) => {
    try {
      const{name,image} = req.userdata
      const id = req.params.id;
      //console.log(id)
      const data = await UserModel.findById(id);
      // console.log(data)
      res.render("admin/editUser", { d: data,n:name,i:image });
    } catch (error) {
      console.log(error);
    }
  };
  static UserUpdate = async (req, res) => {
    try {
      const id = req.params.id;
      const { n, e, p } = req.body;
      const data = await UserModel.findByIdAndUpdate(id, {
        name: n,
        email: e,
        password: p,
      });
      res.redirect("/admin/studentDisplay");
    } catch (error) {
      console.log(error);
    }
  };
  static DeleteUser = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await UserModel.findByIdAndDelete(id);
      res.redirect("/admin/studentDisplay");
    } catch (error) {
      console.log(error);
    }
  };

  static userInsert = async (req, res) => {
    try {
      console.log(req.files.image)
      const file  = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath,{
        folder:"profile"
      })
      console.log(imageUpload)
      const { n, e, p, } = req.body;
      const result = new UserModel({
        name: n,
        email: e,
        password: p,
        image:{
          public_id:imageUpload.public_id,
          url:imageUpload.secure_url
        }
     });
      await result.save();
      res.redirect("/admin/studentDisplay");         //router ka url
    } catch (error) {
      console.log(error);
    }
  };

  //course display
  static Coursedisplay = async (req, res) => {
    try {
      const{id,name,image} = req.userdata
      const data = await CourseModel.find();
      // console.log(data)
      res.render("admin/course/display", { d: data,n:name,i:image,msg1:req.flash('success') });
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
          res.render("/admin/course/view",{d:data,e:email,n:name,i:image});
    } catch (error) {
      console.log(error);
    }
  };
  static CourseDelete = async (req, res) => {
    try {
      const id=req.params.id;
      const data = await CourseModel.findByIdAndDelete(id);
      res.redirect('/admin/CourseDisplay');
    } catch (error) {
      console.log(error);
    }
  };
  static updateStatus = async (req, res) => {
    try {
    const {name,email,status,comment} = req.body;
    const id = req.params.id;
    await CourseModel.findByIdAndUpdate(id,{
      status: status,
      comment:comment,
    });
    this.sendEmail(name,email,status,comment);
    res.redirect('/admin/CourseDisplay')
    } catch (error) {
      console.log(error);
    }
  };
  static sendEmail = async (name,email,status,comment) =>{

    // console.log(name,email,status,comment)
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
      subject: `Course ${status}`,
      text: "hello",
      html:`<br>${name}</b> Course <b>${status}</b> insert successful! <br>Comment from Admin</b> ${comment}`, //html body
    });
  };

}
module.exports = AdminController;
