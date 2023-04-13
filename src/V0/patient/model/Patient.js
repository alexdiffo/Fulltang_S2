const {Model, DataTypes} = require('sequelize')
const Appointment = require('../../appointment/model/Appointment')
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
