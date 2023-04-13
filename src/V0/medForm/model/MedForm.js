const {Model, DataTypes} = require('sequelize')
const Personnel = require('../../personnel/model/Personnel')
const sequelize = require('../../repository/database')

class medForm extends Model {}

medForm.init({
    medform_number:{
        type: DataTypes.BIGINT      
    },
    med_list:{
        type: DataTypes.STRING,
    },
    paid :{
        type: DataTypes.BOOLEAN 
    }
    
   
}, {
    sequelize,
    modelName: 'medform'
}
)


Personnel.hasMany(medForm)
medForm.belongsTo(Personnel)
//medForm.sync()

module.exports = medForm


