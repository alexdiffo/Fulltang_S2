const {Model, DataTypes} = require('sequelize')
const sequelize = require('../repository/database')

class Result extends Model {}

Result.init({
    desciption:{
        type: DataTypes.TEXT        
    },
    paye:{
        type: DataTypes.BOOLEAN        
    },
}, {
    sequelize,
    modelName: 'result'
}
)

module.exports = Result
