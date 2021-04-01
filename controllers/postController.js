var db = require('../models');
const multer = require('multer');

const Users = db.users;
const Posts = db.posts;


//Create Post//
const storage = multer.diskStorage({
    destination:function(req, file, cb) {
        cb(null,"./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({storage : storage}).single("picture");
var createPost = (req, res) => {
    upload(req, res, function(err){
        if(err)
        console.log(err.message);
        else{
            try{
                let data = Posts.create({
                    user_id: req.body.user_id,
                    picture: req.file.filename,
                    caption: req.body.caption,
                }).then(()=>{
                    res.status(200).send("Upload successfully");
                })
            }
            catch(err){
                return res.json({status: 'error', message: err.message});
            }
        }
    });
}


//View Post//
var viewPost = (req, res) => {
    Posts.findAll({})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
              err.message || "Error occurred..."
          });
    });
}


//Update Post//
var updatePost = (req, res) => {
    var id = req.body.id;
    var caption = req.body.caption;
    Posts.update(
        {caption: caption},
        {where: {id:id}
    }).then(() => {
        res.status(200).send('Updated successfully with post_id = '+ id);
    });
}


//Delete Post//
var deletePost = (req, res) => {
    var id = req.body.id;
    Posts.destroy({
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
    });
}

//Associations// 
var OnetoOne = async (req, res) => {
    let data = await Users.findAll({
      attributes:['first_name','last_name','email'],
      include:{
        model: Posts,
        as:'postDetail',
        attributes: ['user_id','picture','caption']
      },
      where: {id:1}});
    res.status(200).json(data);
  }
  
var belongsTo = async (req, res) => {
    let data = await Posts.findAll({
      attributes: ['picture', 'caption'],
      include: {
        model: Users,
        as: 'userDetail',
        attributes: ['first_name', 'last_name', 'email']
      }
    });
    res.status(200).json(data);
}
  
var OnetoMany = async (req, res) => {
    let data = await Users.findAll({
      attributes:['first_name','last_name','email'],
      include:{
        model: Posts,
        as:'postDetail',
        attributes: ['user_id','picture','caption']
      },
      where: {id:1}});
    res.status(200).json(data);
}
  
module.exports = {
    createPost,
    viewPost,
    updatePost,
    deletePost,
    OnetoOne,
    belongsTo,
    OnetoMany
}