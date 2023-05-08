const {Model, DataTypes} = require('sequelize')
const sequelize = require('../repository/database')
const Consultation = require('./Consultation')
const Result = require('./Resultat')

class Examen extends Model {}

Examen.init({
    nom:{
        type: DataTypes.TEXT        
    },
    libelle:{
        type: DataTypes.TEXT        
    },
}, {
    sequelize,
    modelName: 'examen'
}
)

// Examen.belongsToMany(Consultation, {through:Result})
// Consultation.belongsToMany(Examen, {through:Result})

module.exports = Examen
