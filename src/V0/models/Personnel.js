const {Model, DataTypes} = require('sequelize')
const sequelize = require('../repository/database')
const Consultation = require('./Consultation')
const Parametres = require('./Parametres')
const Patient = require('./Patient')

class Personnel extends Model {}

Personnel.init({
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
    },
    specialite:{
        type:DataTypes.TEXT
    },
    email:{
        type:DataTypes.TEXT
    },
    password:{
        type:DataTypes.TEXT
    },
    url_image:{
        type:DataTypes.TEXT
    },
    
}, {
    sequelize,
    modelName: 'personnel'
}
)

// Personnel.hasMany(Patient)
// Personnel.hasMany(Consultation)



module.exports = Personnel
