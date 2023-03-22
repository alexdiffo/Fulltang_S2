const {Model, DataTypes} = require('sequelize')
const sequelize = require('../../repository/database')

class Patient extends Model {}

Patient.init({
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
    state:{
        type:DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'patient'
}
)

module.exports = Patient
