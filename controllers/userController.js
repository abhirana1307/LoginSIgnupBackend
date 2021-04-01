var db = require('../models');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const multer = require('multer');
const Users = db.users;

/***********Signup***********/ 
function isValidPassword(password) {
  // if (password.length >= 8) {
  //   return true;
  // }
  var regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return regex.test(String(password));
}
function isValidEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

var register =  async (req, res) => {
   
    if (!isValidPassword(req.body.password)) {
      return res.json({status: 'error', message: 'Password must contain uppercase,lowercase,special characters. And it must be of length 8 or more'});
    }
    if (!isValidEmail(req.body.email)) {
      return res.json({status: 'error', message: 'Email address not formed correctly.'});
    }
    try{
    let data = await Users.create({ 
        first_name:req.body.first_name,
        last_name:req.body.first_name,
        email:req.body.email,
        phone_number:req.body.phone_number,
        password: bcrypt.hashSync(req.body.password, 8) }) 
    } catch(err){
      return res.json({status: 'error', message: 'Email address already exists.'});

    }
        
    let response ={
        data:'succesfully registered'
    }
    res.status(200).json(response)

  }


 var login = (req, res) => {
  console.log('Sign-in');
    Users.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "Email Not found." });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
        res.status(200).send({
          message:'Successfully login'
        });
    });
}

var viewUser = (req, res) =>{
  Users.findAll({  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}

var updateUser = (req, res) => {
  var id = req.body.id;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var phone_number = req.body.phone_number;
  var password = req.body.password;
  Users.update(
    {first_name: first_name, last_name: last_name, email: email, phone_number: phone_number, password:password},
    {where: {id: id}
    })
    .then(()=> {
      res.status(200).send('Updated successfully with user_id = '+ id);
    });
}

var deleteUser = (req, res) => {
  var id = req.body.id;
  Users.destroy({
    where:{id: id}
  })
  .then(function(rowDeleted){
    if(rowDeleted ===1) {
      res.status(200).json({
        message: 'Successfully deleted'
      });
    }
  }, function(err){
    console.log(err);
  })
}

//User Profile Picture//
const storage = multer.diskStorage({
  destination:function(req, file, cb) {
      cb(null,"./uploads");
  },
  filename: function(req, file, cb) {
      cb(null, file.originalname);
  }
});
var upload = multer({storage : storage}).single("profile_picture");
var createProfilePic = (req, res) => {
  upload(req, res, function(err){
    if(err)
    console.log(err.message);
    else{
      const filePath = req.file.filename;
      var id = req.body.id;
      Users.update(
        {profile_picture: filePath},
        {where: {id:id}}
      ).then(() => {
        res.status(200).send('Upload successfully with user_id = ' + id);
      });
    }
  });
}

module.exports ={
    register,
    login,
    viewUser,
    updateUser,
    deleteUser,
    createProfilePic,
}