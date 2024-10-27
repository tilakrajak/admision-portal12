const express = require("express");
const FrontController = require("../controllers/FrontController");
const AdminController = require("../controllers/admin/AdminController");
const CourseController = require("../controllers/CourseController");
const route = express.Router();
const verifyAuth = require("../middleware/verifyAuth");
const adminRole = require('../middleware/adminRole')
const isLogin = require('../middleware/isLogin')

//frontcontroller route
route.get("/home",verifyAuth, FrontController.home);
route.get("/about",verifyAuth, FrontController.about);
route.get("/",FrontController.login);
route.get("/register", FrontController.register);
route.get("/contact",verifyAuth, FrontController.contact);
route.get("/profile", verifyAuth,FrontController.profile);
//user insert
route.post("/userInsert",FrontController.userInsert);
route.post("/verifyLogin",FrontController.verifyLogin);
route.get('/logout',FrontController.logout)


//admincontroller
route.get("/admin/dashboard",verifyAuth,AdminController.dashboard);
route.get("/admin/studentDisplay",verifyAuth, AdminController.display);
route.get("/admin/Adduser",verifyAuth, AdminController.Adduser);
route.get("/admin/viewUser/:id",verifyAuth, AdminController.viewUser);
route.get("/admin/editUser/:id",verifyAuth, AdminController.editUser);
route.post("/admin/UserUpdate/:id",verifyAuth, AdminController.UserUpdate);
route.get("/admin/DeleteUser/:id",verifyAuth, AdminController.DeleteUser);
route.post("/admin/userInsert",verifyAuth,AdminController.userInsert)

//coursecontroller
route.get("/admin/CourseDisplay",verifyAuth, AdminController.Coursedisplay);
route.post('/admin/updateStatus/:id',verifyAuth,AdminController.updateStatus);
route.get('/admin/CourseView/:id',verifyAuth,AdminController.CourseView)
route.get('/admin/CourseDelete/:id',verifyAuth,AdminController.CourseDelete)
//course
route.post('/course_insert',verifyAuth,CourseController.CourseInsert)
route.get('/display',verifyAuth,CourseController.CourseDisplay)
route.get('/CourseView/:id',verifyAuth,CourseController.CourseView)
route.get('/CourseEdit/:id',verifyAuth,CourseController.CourseEdit)
route.post('/CourseUpdate/:id',verifyAuth,CourseController.CourseUpdate)


//profile update
// route.get('/profile',verifyAuth,FrontController.profile)
route.post('/updateProfile',verifyAuth,FrontController.updateProfile)
route.post('/changePassword',verifyAuth,FrontController.changePassword)

 
route.post('/')

module.exports = route;
