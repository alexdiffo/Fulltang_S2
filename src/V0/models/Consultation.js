const {Model, DataTypes} = require('sequelize')
const sequelize = require('../repository/database')
const Examen = require('./Examen')
const Medicament = require('./Medicament')
const Parametres = require('./Parametres')
const Patient = require('./Patient')
const Personnel = require('./Personnel')
const Prescription = require('./Prescription')
const Result = require('./Resultat')


class Consultation extends Model {}

Consultation.init({
    montant:{
        type:DataTypes.TEXT
    },
    date:{
        type: DataTypes.DATE        
    },
    observation:{
        type: DataTypes.TEXT
    },
    diagnostic:{
        type:DataTypes.TEXT
    },
    specialite:{
        type:DataTypes.TEXT
    },
    paye:{
        type:DataTypes.BOOLEAN
    }
}, {
    sequelize,
    modelName: 'consultation'
}
)

// Consultation.belongsTo(Patient)
// Consultation.hasOne(Parametres)
// Consultation.belongsToMany(Examen, {through:Result})
// Consultation.belongsToMany(Medicament, {through:Prescription})
// Examen.belongsToMany(Consultation, {through:Result})

Consultation.belongsToMany(Examen, {through: Result })
Examen.belongsToMany(Consultation, {through: Result })

Consultation.belongsToMany(Medicament, {through:Prescription})
Medicament.belongsToMany(Consultation, {through:Prescription})

Consultation.hasOne(Parametres)
Parametres.belongsTo(Consultation)






module.exports = Consultation
