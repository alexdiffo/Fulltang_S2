const {Model, DataTypes} = require('sequelize')
const sequelize = require('../repository/database')
const Examen = require('./Examen')
const Consultation = require('./Consultation')


class Result extends Model {}

Result.init({
    desciption:{
        type: DataTypes.TEXT        
    },
    paye:{
        type: DataTypes.BOOLEAN        
    },
    examenId:{
        type: DataTypes.INTEGER,
        references: { model: Examen ,key: "id"}    
    },
    consultationId:{
        type: DataTypes.INTEGER ,
        references: { model: Consultation ,key: "id"}      
    },
}, {
    sequelize,
    modelName: 'result'
}
)

module.exports = Result
