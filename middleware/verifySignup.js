var db = require('../models');
const Users = db.users;


checkDuplicateUserNameOrEmail = (req, res, next) => {
		
		// -> Check Email is already in use
		console.log("req.body.email", req.body)
		Users.findOne({ 
			where: {
				email: req.body.email
			} 
		}).then(user => {
			if(user){
				res.status(400).send("Fail -> Email is already in use!");
				return;
			}
				
			next();
		});
}
const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
module.exports = signUpVerify;