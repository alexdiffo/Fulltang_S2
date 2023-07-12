const express = require('express')
const router = express.Router()
const io=require('../../../../index')

const Patient = require('../../models/Patient')
const Consultation = require('../../models/Consultation')
const Parametre = require('../../models/Parametres')
const Examen = require('../../models/Examen')
const Medicament = require('../../models/Medicament')
const { Op } = require('sequelize')
const Personnel = require('../../models/Personnel')



router.use(express.json())

router.use((req,res,next)=>{
    if(req.session.user.specialite!="receptionnist"){
        if(["cashier","administrator","labtechnician"].includes(req.session.user.specialite)){ 
            res.redirect("/fulltang/V0/"+req.session.user.specialite)
          }else{
              res.redirect("/fulltang/V0/doctor")
          }
      
    }else{
        next()
    }
})



// all receptionnist routes implemented here

//get all patients
.get('/',  async (req, res)=>{
    const patients = await Patient.findAll({ order: [["id","DESC"]],})
    res.render("receptionniste/patientList",{patient: patients})
    
})

//supprimer un patient  [uniquement si le patient n'a pas d'historique de prise en charge]
// prevoir une requete pr le cas echeant

.post ('/',  async (req, res)=>{

    const id=req.body.id
    
    const consultation = await Consultation.findOne({where: {patientId: id}})

    if(consultation){
        req.flash("negative","impossible de supprimer ce patient car il a déja effectué des actions dans le systeme")
        res.redirect("/fulltang/V0/receptionnist") 
    }
    else{
        await Patient.destroy({ where: {id: id}})
        req.flash("positive","le patient a été supprimer")
        res.redirect("/fulltang/V0/receptionnist") 

    }
   
    
})


//register form
.get('/register',  async (req, res)=>{
    res.render("receptionniste/add-patient")    
 })

 //register a patient
.post('/register',  async (req, res)=>{

    await Patient.create(req.body)
    req.flash("positive","nouveau patient ajouté")
    res.redirect("/fulltang/V0/receptionnist") 
})


//get a patient by ID
.get('/patient/:id', async(req, res)=>{
    const requestedID = req.params.id
    const patient = await Patient.findOne({where: {id:requestedID}})
    if(patient){
        res.render("receptionniste/info-patient",{patient: patient})
    }
    else{
        res.redirect("/fulltang/V0/receptionnist") 
    }
    
})

//delete patient
.post('/patient/:id', async(req, res)=>{
    const id = req.params.id

    const consultation = await Consultation.findOne({where: {patientId: id}})

    if(consultation){
        req.flash("negative","impossible de supprimer ce patient car il a déja effectué des actions dans le systeme")
        res.redirect("/fulltang/V0/receptionnist/patient/"+id) 
    }
    else{
        await Patient.destroy({ where: {id: id}})
        req.flash("positive","le patient a été supprimé")
        res.redirect("/fulltang/V0/receptionnist") 

    }
})

//update form
.get('/edit/:id', async(req, res)=>{
    const requestedID = req.params.id
    const patient = await Patient.findOne({where: {id:requestedID}})
    if(patient){
        res.render("receptionniste/edit-patient",{patient: patient})
    }
    else{
        res.redirect("/fulltang/V0/receptionnist") 
    }  
    
})


//Update patient
.post('/edit/:id', async(req, res)=>{
    const requestedID = req.params.id
    await Patient.update(req.body,{where: { id: requestedID }})
    req.flash("positive","informations modifiées avec succès")
    res.redirect("/fulltang/V0/receptionnist/patient/"+requestedID) 
})

// new consultation
.get('/new_consultation/:id',  async (req, res)=>{
    const requestedID = req.params.id
    const patient = await Patient.findOne({where: {id:requestedID}})
    if(patient){
        const carnet = await Consultation.findAll({ include:[{model: Examen,attributes: ["nom"]},{model: Personnel,attributes: ["nom"],required: true},{model: Medicament,attributes: ["nom"]},{model: Parametre, required: true}],attributes:["date","observation","diagnostic"] ,where:{ date: {[Op.not]: null},patientId: requestedID},order: [["id","DESC"]] }) 
        res.render("receptionniste/new-consultation",{patient: patient, carnet: carnet})
    }
    else{
        res.redirect("/fulltang/V0/receptionnist") 
    }    
 })

.post('/new_consultation/:id',  async (req, res)=>{

    let data=req.body 

    if(data.rendez_vous){
        data.paye="non payer"

    }else{
        
        data.rendez_vous="non"

    }

    await Consultation.create(data)

    const list = await Consultation.findOne({ include: {model: Patient,attributes:["nom","prenom","sexe"],where:{id :data.patientId }, required: true}, order: [["id","DESC"]] }) 

    if(list.rendez_vous=="oui"){
        io.emit('consultation_paid', list )
    }else{
        io.emit('new_consultation', list)
    }

    req.flash("positive","consultation creé avec succès")
    res.redirect("/fulltang/V0/receptionnist/consultation_history") 

})


// historique des consultation
.get('/consultation_history',  async (req, res)=>{
    const list = await Consultation.findAll({ include: Patient,order: [["id","DESC"]] }) 
    res.render("receptionniste/consultation-list",{consultation: list})
    
})

.post('/consultation_history',  async (req, res)=>{

    const id=req.body.id

    const list = await Consultation.findOne({where: { id: id}})
    if(list.paye=="payer" || list.date!= null){
        req.flash("negative","impossible de supprimer cette consultation a déja été effectué")
        res.redirect("/fulltang/V0/receptionnist/consultation_history")
    }else{
        await Consultation.destroy({ where: {id: id}})
        req.flash("positive","consultation effectué avec succès")
        res.redirect("/fulltang/V0/receptionnist/consultation_history")
    }

})

//afficher profil
.get('/profil',  async (req, res)=>{
    const user = await Personnel.findOne({ where:{id: req.session.user.id } }) 
    res.render("receptionniste/profil",{User: user})
    
})

//modifier profil
.get('/modifier_profil',  async (req, res)=>{
    const user = await Personnel.findOne({ where:{id: req.session.user.id} }) 
    res.render("receptionniste/modifier-profil",{User: user})
    
})
.post('/modifier_profil',  async (req, res)=>{

    let data=req.body
    if(req.files){
        let image=req.files.image
        image.mv("./static/upload/"+image.name)
        data.url_image="/upload/"+image.name 
        req.session.user.url="/upload/"+image.name 
    }
   
    await Personnel.update(data,{where: { id: req.session.user.id}})
        req.flash("positive","profil modifié avec succès")
        res.redirect("/fulltang/V0/receptionnist/profil")
    
    
})
.get('/profil/password',  async (req, res)=>{
    
    res.render("receptionniste/modifier-password")
    
})
.post('/profil/password',  async (req, res)=>{
    
    let data= req.body
    const user = await Personnel.findOne({ where:{id: req.session.user.id ,password: data.password}}) 

    if(user){
        
        if(data.n_password == data.c_password){

            await Personnel.update({password:data.n_password},{where: { id: req.session.user.id}})
            req.flash("positive","mot de passe modifié avec succès")
            res.redirect("/fulltang/V0/receptionnist/profil")

        }else{
            req.flash("negative","mot de passe de confirmation incorrect")
            res.redirect("/fulltang/V0/receptionnist/profil/password")
        }

    }else{
        req.flash("negative","mot de passe actuel incorrect")
        res.redirect("/fulltang/V0/receptionnist/profil/password")
    }

    
})


module.exports = router