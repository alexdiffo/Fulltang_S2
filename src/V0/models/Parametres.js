const {Model, DataTypes} = require('sequelize')
const sequelize = require('../repository/database')
const Consultation = require('./Consultation')
const Personnel = require('./Personnel')

class Parametres extends Model {}

Parametres.init({
    Taille:{
        type: DataTypes.REAL        
    },
    poids:{
        type: DataTypes.REAL        
    },
    temperature:{
        type:DataTypes.REAL
    }, 
    pression_arterielle:{
        type:DataTypes.REAL
    },
    groupe_sanguin:{
        type:DataTypes.TEXT
    }, 
    rhesus:{
        type:DataTypes.TEXT
    }
}, {
    sequelize,
    modelName: 'parametres'
}
)

// Parametres.belongsTo(Consultation)
// Parametres.belongsTo(Personnel)

Personnel.hasMany(Parametres)
Parametres.belongsTo(Personnel)

module.exports = Parametres
