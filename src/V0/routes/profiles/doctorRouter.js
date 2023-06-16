const express = require('express')
const router = express.Router()
const Patient = require('../../models/Patient')
const Consultation = require('../../models/Consultation')
const Parametre = require('../../models/Parametres')
const Examen = require('../../models/Examen')
const Medicament = require('../../models/Medicament')
const Prescription = require('../../models/Prescription')
const Resultat = require('../../models/Resultat')
const { EMPTY } = require('sqlite3')
const { Op } = require('sequelize')
const Personnel = require('../../models/Personnel')

router.use(express.json())

router.use((req,res,next)=>{
    if(req.session.profil!="doctor"){ 
      res.redirect("/fulltang/V0/"+req.session.profil)
    }else{
        next()
    }
})

// all receptionnist routes implemented here



//liste des patient a consulter
.get('/',  async (req, res)=>{
    const list = await Consultation.findAll({ include: {model: Patient,required: true}, where: { [Op.or]:[{paye: "payer", specialite: "generaliste",date: null},{rendez_vous: "oui", specialite: "generaliste",date: null}] },order: [["id","DESC"]] }) 
    res.render("medecin/patient-list",{ consultation: list})    
})


//consulter un patient
.get('/consultation/:id',  async (req, res)=>{
    const requestedID = req.params.id
    const list = await Consultation.findOne({ include: {model: Patient,required: true}, where: { [Op.or]:[{id: requestedID ,paye: "payer",date: null, specialite: "generaliste"},{id: requestedID ,rendez_vous: "oui",date: null, specialite: "generaliste"}]  } })

    if(list){
        const carnet = await Consultation.findAll({ include:[{model: Examen,attributes: ["nom"],required: true},{model: Personnel,attributes: ["nom"],required: true},{model: Medicament,attributes: ["nom"],required: true},{model: Parametre, required: true}],attributes:["date","observation","diagnostic"] ,where:{ date: {[Op.not]: null},patientId: "list.patient.id"},order: [["id","DESC"]] }) 
        const examen= await Examen.findAll()
        const medicament = await Medicament.findAll()
        res.render("medecin/consultation",{patient: list.patient,medicament: medicament,examen: examen,carnet:carnet})  
    }else{
        res.redirect("/fulltang/V0/doctor")
    }  

   
 })


//enregistrer la consultation
.post('/consultation/:id',  async (req, res)=>{

    let id=req.params.id;

    await Parametre.create({
        consultationId: id, 
        poids:req.body.poids,
        temperature:req.body.temperature ,
        pression_arterielle: req.body.tension,
        groupe_sanguin: req.body.groupe_s,
        rhesus: req.body.rhesus,
    })

    await Consultation.update({date: new Date(), diagnostic: req.body.diagnostic, observation: req.body.observation, personnelId: req.session.ID},{where: { id: id }})

    if(req.body.medicament){
        Array.from(req.body.medicament).forEach( async (i)=> {
            await Prescription.create({
                medicamentId: i,
                consultationId: id,
            })
        });
    }

    if(req.body.examen){
        Array.from(req.body.examen).forEach( async (i)=> {
            await Resultat.create({
                examenId: i,
                consultationId: id,
            })
        });
    }

    req.flash("positive","consultation enregistrer avec succès")
    res.redirect("/fulltang/V0/doctor/consultation_history")

})


.get('/consultation_history',  async (req, res)=>{
    const list = await Consultation.findAll({ include: {model: Patient,required: true}, where: {date: {[Op.not]: null} },order: [["id","DESC"]] }) 
    res.render("medecin/consultation-history",{ consultation: list})    

})


////carnet du patient
.get('/carnet_patient/:id',  async (req, res)=>{

    let id=req.params.id;
    const patient= await Patient.findOne({ where: {id: id}, attributes: ["nom","prenom"] })

    if(patient){
        const carnet = await Consultation.findAll({ include:[{model: Examen,attributes: ["nom"]},{model: Personnel,attributes: ["nom"],required: true},{model: Medicament,attributes: ["nom"]},{model: Parametre, required: true}],attributes:["date","observation","diagnostic"] ,where:{ date: {[Op.not]: null},patientId: id},order: [["id","DESC"]] }) 
        res.render("medecin/carnet", {carnet: carnet, patient: patient}) 
    }else{
        res.redirect("/fulltang/V0/doctor/consultation_history")
    }
       
})


module.exports = router