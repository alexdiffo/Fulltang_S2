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

router.use(express.json())

// all receptionnist routes implemented here



//liste des patient a consulter
.get('/',  async (req, res)=>{
    const list = await Consultation.findAll({ include: {model: Patient,required: true}, where: {paye: "payer", specialite: "generaliste",date: null},order: [["id","DESC"]] }) 
    res.render("medecin/patient-list",{ consultation: list})    
 })


//consulter un patient
.get('/consultation/:id',  async (req, res)=>{
    const requestedID = req.params.id
    const list = await Consultation.findOne({ include: {model: Patient,required: true}, where: {id: requestedID ,paye: "payer",date: null, specialite: "generaliste"} })
    if(list){
        const examen= await Examen.findAll()
        const medicament = await Medicament.findAll()
        res.render("medecin/consultation",{patient: list.patient, medicament: medicament, examen: examen})  
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

    await Consultation.update({date: new Date(), diagnostic: req.body.diagnostic, observation: req.body.observation},{where: { id: id }})

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
    const list = await Consultation.findAll({ include: {model: Patient,required: true}, where: { paye: "payer", date: {[Op.not]: null} },order: [["id","DESC"]] }) 
    res.render("medecin/consultation-history",{ consultation: list})    

})


module.exports = router