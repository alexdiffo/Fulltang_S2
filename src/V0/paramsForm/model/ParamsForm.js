const {Model, DataTypes} = require('sequelize')

const Personnel = require('../../personnel/model/Personnel')
const sequelize = require('../../repository/database')

class paramsForm extends Model {}

paramsForm.init({
    paramsform_number:{
        type: DataTypes.BIGINT      
    },
    weight:{
        type: DataTypes.DOUBLE
    },
    height:{
        type: DataTypes.DOUBLE,
    },
    bloodgroup :{
        type: DataTypes.STRING 
    },
    bloodpressure :{
        type: DataTypes.DOUBLE
    },
    temperature :{
        type:DataTypes.DOUBLE
    }
    
   
}, {
    sequelize,
    modelName: 'paramsform'
}
)


Personnel.hasMany(paramsForm)
paramsForm.belongsTo(Personnel)
//paramsForm.sync()

module.exports = paramsForm


