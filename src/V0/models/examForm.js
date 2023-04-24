const {Model, DataTypes} = require('sequelize')

const Personnel = require('./Personnel')
const sequelize = require('../repository/database')

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


Personnel.hasMany(examForm)
examForm.belongsTo(Personnel)
//examForm.sync()

module.exports = examForm

