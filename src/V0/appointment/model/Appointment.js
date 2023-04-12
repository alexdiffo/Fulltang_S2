const {Model, DataTypes} = require('sequelize')
const sequelize = require('../../repository/database')

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

module.exports = Appointment
