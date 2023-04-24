const {Model, DataTypes} = require('sequelize')
const sequelize = require('../repository/database')
const examForm = require('./examForm')
const medForm =require('./MedForm')
const paramsForm = require('./ParamsForm')

class Appointment extends Model {}

Appointment.init({
    date:{
        type: DataTypes.DATE        
    },
    appointment_number:{
        type: DataTypes.BIGINT
    },
    patientstate:{
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'appointment'
}
)

Appointment.hasMany(examForm)
examForm.belongsTo(Appointment, { onDelete: 'cascade' })
Appointment.hasMany(medForm)
medForm.belongsTo(Appointment,  { onDelete: 'cascade' })
Appointment.hasOne(paramsForm)
paramsForm.belongsTo(Appointment,  { onDelete: 'cascade' })

module.exports = Appointment
