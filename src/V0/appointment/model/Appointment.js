const {Model, DataTypes} = require('sequelize')
const sequelize = require('../../repository/database')
const examForm = require('../../examForm/model/examForm')
const medForm =require('../../medForm/model/MedForm')
const paramsForm = require('../../paramsForm/model/ParamsForm')

class Appointment extends Model {}

Appointment.init({
    date:{
        type: DataTypes.DATE        
    },
    appointment_number:{
        type: DataTypes.BIGINT
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
