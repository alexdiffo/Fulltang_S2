const {Model, DataTypes} = require('sequelize')
const Appointment = require('../../appointment/model/Appointment')
const Personnel = require('../../personnel/model/Personnel')
const sequelize = require('../../repository/database')

class examForm extends Model {}

examForm.init({
    examform_number:{
        type: DataTypes.BIGINT      
    },
    diagnostic:{
        type: DataTypes.STRING
    },
    exam_list:{
        type: DataTypes.STRING,
    },
    paid :{
        type: DataTypes.BOOLEAN 
    }
    
}, {
    sequelize,
    modelName: 'examform'
}
)

Appointment.hasMany(examForm)
examForm.belongsTo(Appointment)
Personnel.hasMany(examForm)
examForm.belongsTo(Personnel)
examForm.sync()

module.exports = examForm

