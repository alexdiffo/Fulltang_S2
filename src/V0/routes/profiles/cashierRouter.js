const express = require('express')
const router = express.Router()
const io=require('../../../../index')

const Patient = require('../../models/Patient')
const Personnel = require('../../models/Personnel')
const Consultation = require('../../models/Consultation')
const Resultat = require('../../models/Resultat')
const Examen = require('../../models/Examen')
const { Op } = require('sequelize')



router.use(express.json())

router.use((req,res,next)=>{
    if(req.session.user.specialite!="cashier"){ 
        if(["receptionnist","administrator","labtechnician"].includes(req.session.user.specialite)){ 
            res.redirect("/fulltang/V0/"+req.session.user.specialite)
          }else{
              res.redirect("/fulltang/V0/doctor")
          }  

    }else{
        next()
    }
})

// all cashier routes implemented here

//liste des consultation
.get('/',  async (req, res)=>{
    const list = await Consultation.findAll({ include: {model: Patient,required: true}, where: {paye: null},order: [["id","DESC"]] }) 
    res.render("caissier/caissierList",{ consultation: list})    
 })



//valider le payement
.get('/payer/:id', async(req, res)=>{
    const requestedID = req.params.id
    const list = await Consultation.findOne({ include: {model: Patient,required: true}, where: {id: requestedID} }) 

    if(list){
        res.render("caissier/print",{consultation: list})
    }
    else{
        res.redirect("/fulltang/V0/cashier")
    }
    
    
})

 //payer la consultation
 .post('/payer/:id', async(req, res)=>{
    const requestedID = req.params.id
    await Consultation.update({paye: "payer"},{where: { id: requestedID }}) 

    //socket
    data= await Consultation.findOne({ include: {model: Patient,attributes:["nom","prenom","sexe"], required: true}, where: {id: requestedID} }) 

    io.emit('consultation_paid', data)
     
    req.flash("positive","payement effectué avec succès")
    res.redirect("/fulltang/V0/cashier/consultation_paid") 
})


 // historique des consultation payer
 .get('/consultation_paid',  async (req, res)=>{
    const list = await Consultation.findAll({ include: {model: Patient,required: true}, where: {paye: "payer"},order: [["updatedAt","DESC"]] }) 
    res.render("caissier/consultation-paid",{consultation: list})    
 })


//reimprimer le recu
.get('/print/:id',  async (req, res)=>{
    const requestedID = req.params.id
    const list = await Consultation.findOne({ include: {model: Patient,required: true}, where: {id: requestedID} }) 

    if(list){
        res.render("caissier/print",{consultation: list})
    }
    else{
        res.redirect("/fulltang/V0/cashier/consultation_paid") 
    }    
})

.post('/print/:id', async(req, res)=>{

    res.redirect("/fulltang/V0/cashier/consultation_paid") 
})
 


// liste des examens
.get('/examen_list',  async (req, res)=>{
    const list = await Consultation.findAll({ include:[{model: Examen,attributes: ["id","nom"],required: true},{model: Patient, attributes: ["nom","prenom"], required: true}],attributes:["specialite"] ,where:{'$examens.result.paye$': null},order: [["id","DESC"]] }) 
    res.render("caissier/examen-list",{consultation: list})
 })


//facture examen
.get('/payer_examen/:id',  async (req, res)=>{

    const id = req.params.id.split("_")
    if(id.length==2){
        const list = await Consultation.findAll({ include:[{model: Examen,attributes: ["nom"],required: true },{model: Patient, attributes: ["nom","prenom"], required: true }],attributes: [] ,where:{'$examens.result.consultationId$': id[0],'$examens.result.examenId$': id[1]} }) 

        if(list.length!=0){
            res.render("caissier/print-examen",{consultation: list})
        }else{
            res.redirect("/fulltang/V0/cashier/examen_list")
        }
        
    }else{
        res.redirect("/fulltang/V0/cashier/examen_list")
    }
    
   
})

.post('/payer_examen/:id',  async (req, res)=>{

    const id = req.params.id.split("_")
    
    await Resultat.update({paye: "payer", date: new Date()},{where: { consultationId: id[0] ,examenId: id[1] }}) 
    req.flash("positive","payement effectué avec succès")
    res.redirect("/fulltang/V0/cashier/examen_paid") 

})

.get('/print_examen/:id',  async (req, res)=>{

    const id = req.params.id.split("_")
    if(id.length==2){
        const list = await Consultation.findAll({ include:[{model: Examen,attributes: ["nom"],required: true },{model: Patient, attributes: ["nom","prenom"], required: true }],attributes: [] ,where:{'$examens.result.consultationId$': id[0],'$examens.result.examenId$': id[1]} }) 

        if(list.length!=0){
            res.render("caissier/print-examen",{consultation: list})
        }else{
            res.redirect("/fulltang/V0/cashier/examen_paid")
        }
        
    }else{
        res.redirect("/fulltang/V0/cashier/examen_paid")
    }
    
   
})

.post('/print_examen/:id',  async (req, res)=>{
    res.redirect("/fulltang/V0/cashier/examen_paid")
})


//examen payer
.get('/examen_paid',  async (req, res)=>{
    const list = await Consultation.findAll({ include:[{model: Examen,attributes: ["id","nom"],required: true},{model: Patient, attributes: ["nom","prenom"], required: true}],attributes:["specialite"] ,where:{'$examens.result.paye$': "payer"},order: [["id","DESC"]] }) 
    res.render("caissier/examen-paid",{consultation: list})
})

.get('/dar',  async (req, res)=>{
    let f=["1","3","7"]
    const list = await Patient.findAll({ include: {model: Consultation, where:{id :{ [Op.or]:f} },attributes: ["id","observation"],required: true},attributes: ["nom","prenom"]}) 
    res.send(list)
})
//afficher profil
.get('/profil',  async (req, res)=>{
    const user = await Personnel.findOne({ where:{id: req.session.user.id } }) 
    res.render("caissier/profil",{User: user})
    
})

//modifier profil
.get('/modifier_profil',  async (req, res)=>{
    const user = await Personnel.findOne({ where:{id: req.session.user.id} }) 
    res.render("caissier/modifier-profil",{User: user})
    
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
        req.flash("positive","profil modifier avec succès")
        res.redirect("/fulltang/V0/cashier/profil")
    
    
})

.get('/profil/password',  async (req, res)=>{
    
    res.render("caissier/modifier-password")
    
})
.post('/profil/password',  async (req, res)=>{
    
    let data= req.body
    const user = await Personnel.findOne({ where:{id: req.session.user.id ,password: data.password}}) 

    if(user){
        
        if(data.n_password == data.c_password){

            await Personnel.update({password:data.n_password},{where: { id: req.session.user.id}})
            req.flash("positive","mot de passe modifier avec succès")
            res.redirect("/fulltang/V0/cashier/profil")

        }else{
            req.flash("negative","mot de passe de confirmation incorrect")
            res.redirect("/fulltang/V0/cashier/profil/password")
        }

    }else{
        req.flash("negative","mot de passe actuel incorrect")
        res.redirect("/fulltang/V0/cashier/profil/password")
    }

    
})


module.exports = router