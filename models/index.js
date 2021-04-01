const {Sequelize,DataTypes} = require('sequelize');
const sequelize = new Sequelize('myvitrines','phpmyadmin','codebrew',{
    host:'localhost',
    dialect:'mysql',
    pool:{max:5,min:0,idle:10000}
});


sequelize.authenticate()
.then(()=>{
    console.log("Database connected");
})
.catch(err =>{
    console.log("Error"+err);
})


const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize.sync({force:false})    // ({force:true}) for create again and again after run
.then(() =>{
    console.log("Yes re-sync");
})

//Tables//
db.users = require('./users')(sequelize,DataTypes);
db.posts = require('./posts')(sequelize,DataTypes);

// //Associations//
// db.users.hasOne(db.posts,{foreignKey: 'user_id', as: 'postDetail'});
db.users.hasMany(db.posts,{foreignKey: 'user_id', as: 'postDetail'});
db.posts.belongsTo(db.users,{foreignKey: 'user_id', as: 'userDetail'});

module.exports = db;