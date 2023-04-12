const {Model, DataTypes} = require('sequelize')
const Appointment = require('../../appointment/model/Appointment')
const examForm = require('../../examForm/model/examForm')
const Personnel = require('../../personnel/model/Personnel')
const sequelize = require('../../repository/database')

class resultForm extends Model {}

resultForm.init({
    resultform_number:{
        type: DataTypes.BIGINT      
    },
    exam_list_result:{
        type: DataTypes.STRING,
    },
    paid :{
        type: DataTypes.BOOLEAN 
    }  
   
}, {
    sequelize,
    modelName: 'resultform'
}
)

Appointment.hasMany(resultForm)
resultForm.belongsTo(Appointment)
examForm.hasOne(resultForm)
resultForm.belongsTo(examForm)
Personnel.hasMany(resultForm)
resultForm.belongsTo(Personnel)
resultForm.sync()

module.exports = resultForm
