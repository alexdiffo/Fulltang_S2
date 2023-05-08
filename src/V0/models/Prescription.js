const {Model, DataTypes} = require('sequelize')
const sequelize = require('../repository/database')

class Prescription extends Model {}

Prescription.init({
    Posologie:{
        type: DataTypes.TEXT        
    },
    paye:{
        type: DataTypes.BOOLEAN        
    },
}, {
    sequelize,
    modelName: 'prescription'
}
)


module.exports = Prescription
