const {Model, DataTypes} = require('sequelize')
const sequelize = require('../repository/database')
const Consultation = require('./Consultation')
const Prescription = require('./Prescription')

class Medicament extends Model {}

Medicament.init({
    nom:{
        type: DataTypes.TEXT        
    },
}, {
    sequelize,
    modelName: 'medicament'
}
)

// Medicament.belongsToMany(Consultation, {through:Prescription})

module.exports = Medicament
