const {Model, DataTypes} = require('sequelize')
const sequelize = require('../repository/database')
const Consultation = require('./Consultation')
const Personnel = require('./Personnel')

class Patient extends Model {}

Patient.init({
    nom:{
        type: DataTypes.TEXT        
    },
    prenom:{
        type: DataTypes.TEXT        
    },
    date_naissance:{
        type:DataTypes.DATE
    }, 
    sexe:{
        type:DataTypes.TEXT
    },
    domicile:{
        type:DataTypes.TEXT
    }, 
    telephone:{
        type:DataTypes.TEXT
    }
}, {
    sequelize,
    modelName: 'patient'
}
)

// Patient.hasMany(Consultation)
// Patient.belongsTo(Personnel)

Consultation.belongsTo(Patient)
Patient.hasMany(Consultation)

module.exports = Patient
