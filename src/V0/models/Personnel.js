const {Model, DataTypes} = require('sequelize')
const sequelize = require('../repository/database')

class Personnel extends Model {}

Personnel.init({
    name:{
        type: DataTypes.STRING        
    },
    surname:{
        type: DataTypes.STRING
    },
    address:{
        type: DataTypes.STRING
    },
    phone:{
        type:DataTypes.STRING
    },
    birthdate:{
        type:DataTypes.DATE
    },
    role:{
        type:DataTypes.ENUM,
        values: ['Doctor', 'LabTechnician', 'Receptionnist', 'Cashier']
    },
    personnel_number:{
        type:DataTypes.BIGINT
    }
}, {
    sequelize,
    modelName: 'users'
}
)

module.exports = Personnel
