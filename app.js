const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 8080;
var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

require('./models');

var userctrl = require('./controllers/userController');
var postctrl = require('./controllers/postController');
var verifySignUp = require('./middleware/verifySignup');

app.get('/',(res,resp) => {
     resp.send('Home page');
});

app.listen(port,()=>{
    console.log(`App is listing at port number : ${port}`);
})

//USER API'S//
app.post('/register',[verifySignUp.checkDuplicateUserNameOrEmail], userctrl.register);
app.post('/login', userctrl.login);
app.get('/viewdata', userctrl.viewUser);
app.put('/update', userctrl.updateUser);
app.delete('/delete', userctrl.deleteUser);
app.post('/profile', userctrl.createProfilePic);


//POST API'S//
app.post('/createpost', postctrl.createPost);
app.get('/viewpost', postctrl.viewPost);
app.put('/updatepost', postctrl.updatePost);
app.delete('/deletePost', postctrl.deletePost);

//Associations//
app.get('/onetoone', postctrl.OnetoOne); 
app.get('/onetomany', postctrl.OnetoMany);
app.get('/belongsto', postctrl.belongsTo); 