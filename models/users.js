const { Sequelize } = require(".")

module.exports = (sequelize,DataTypes) => {
    const Users = sequelize.define("userdata",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
           },
        first_name:DataTypes.STRING,
        last_name:DataTypes.STRING,
        email:DataTypes.STRING,
        phone_number:DataTypes.STRING,
        password:DataTypes.STRING,
        profile_picture:{
            type:DataTypes.STRING,
            defaultValue:'NULL'
        },
    },{
        // timestamps:false   for removing createdAt and updatedAt
        //  createdAt:false    for removing only one
        createdAt: 'created_at', // for rename
        updatedAt: 'updated_at'
    })
    return Users
}