function applySetup(sequelize) {
	const { consultation, examen, medicament, parametres, patient,
    personnel, prescription, result } = sequelize.models;

	consultation.belongsToMany(examen, {through: result })
    examen.belongsToMany(consultation, {through: result })
    consultation.belongsToMany(medicament, {through:prescription})
    medicament.belongsToMany(consultation, {through:prescription})
    consultation.hasOne(parametres)
    parametres.belongsTo(consultation)
    personnel.hasMany(parametres)
    parametres.belongsTo(personnel)
    consultation.belongsTo(patient)
    patient.hasMany(consultation)

}

module.exports = { applySetup };