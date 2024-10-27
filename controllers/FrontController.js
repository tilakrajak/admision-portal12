const UserModel = require("../modules/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const CourseModel = require("../modules/course");

cloudinary.config({
  cloud_name: "dawjokma2",
  api_key: "927489688623582",
  api_secret: "PQMaqV7e_7S-jWKLwzRAecwP08g", // Click 'View API Keys' above to copy your API secret
});
class FrontController {
  static home = async (req, res) => {
    try {
      const { name, email, image, id, role } = req.userdata;
      const btech = await CourseModel.findOne({ user_id: id, course: "btech" });
      const bca = await CourseModel.findOne({ user_id: id, course: "bca" });
      const mca = await CourseModel.findOne({ user_id: id, course: "mca" });
      res.render("home", {
        n: name,
        i: image,
        e: email,
        btech: btech,
        bca: bca,
        mca: mca,
        r: role,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static login = async (req, res) => {
    try {
      res.render("login", {
        mssage: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", { msg: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      res.render("contact", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  //user insert
  static userInsert = async (req, res) => {
    try {
      // console.log(req.files.image)
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      console.log(imageUpload);
      const { n, e, p } = req.body;
      const user = await UserModel.findOne({ email: e });
      //console.log(user)
      if (user) {
        req.flash("error", "email already Exist");
        res.redirect("/register");
      } else {
        if (n && e && p) {
          const hashpassword = await bcrypt.hash(p, 10);
          const result = new UserModel({
            name: n,
            email: e,
            password: hashpassword,
            image: {
              public_id: imageUpload.public_id,
              url: imageUpload.secure_url,
            },
          });
          await result.save();
          req.flash("success", "Register succesfully Insert please login");
          res.redirect("/");
        } else {
          req.flash("error", "All fields are required");
          res.redirect("/register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //verifylogin user
  static verifyLogin = async (req, res) => {
    try {
      // console.log(req.body);
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log(isMatch)
        if (isMatch) {
          if (user.role == "admin") {
            //token create
            var token = jwt.sign({ ID: user._id }, "gddhudfgfyu3gr78324");
            // console.log(token)
            res.cookie("token", token);
            res.redirect("/admin/dashboard");
          }
          if (user.role == "user") {
            //token create
            var token = jwt.sign({ ID: user._id }, "gddhudfgfyu3gr78324");
            // console.log(token)
            res.cookie("token", token);
            res.redirect("/home");
          }

          res.redirect("/home");
        } else {
          req.flash("error", "your email or password is not match");
          res.redirect("/");
        }
      } else {
        req.flash("error", "you are not register user ,please register");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static profile = async (req, res) => {
    try {
      const { name, image, email } = req.userdata;
      res.render("profile", { n: name, i: image, e: email });
    } catch (error) {
      console.log(error);
    }
  };

  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  static changePassword = async (req, res) => {
    try {
      const { id } = req.userdata;
      console.log(req.body);
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "newpassword and confirmpassword not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "All Fields are required");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static updateProfile = async (req, res) => {
    try {
      const { id } = req.userdata;
      const { name, email } = req.body;
      if (req.file) {
        const user = await UserModel.findById(id);
        const imageId = user.image.public_id;
        console.log(imageId);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageId);
        //new image update
        const imagefile = req.files.image;
        const imageUpload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageUpload.public_id,
            url: imageUpload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "update Profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = FrontController;
