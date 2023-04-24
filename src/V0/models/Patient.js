const {Model, DataTypes} = require('sequelize')
const Appointment = require('./Appointment')
const sequelize = require('../repository/database')

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
    sex:{
        type: DataTypes.STRING
    },
    phone:{
        type:DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    CNI:{
        type: DataTypes.STRING
    },
    birthdate:{
        type:DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'patient'
}
)

Patient.hasMany(Appointment)
Appointment.belongsTo(Patient)
//Appointment.sync()

module.exports = Patient
