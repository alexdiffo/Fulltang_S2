const express = require('express')
const router = express.Router()
const Patient = require('../../models/Patient')
const Personnel = require('../../models/Personnel')

router.use(express.json())

// all receptionnist routes implemented here



//get all patients
router.get('/',  async (req, res)=>{
    const patients = await Patient.findAll()
    res.render("receptionniste/patientList")
    
})

//supprimer un patient  [uniquement si le patient n'a pas d'historique de prise en charge]
// prevoir une requete pr le cas echeant

router.post ('/',  async (req, res)=>{
    const patients = await Patient.findAll()
    res.render("receptionniste/patientList")
    req.flash("suppression effectué avec succes")

    
})

// formulaire d ajout
// router.get('/register',  async (req, res)=>{
    
//     res.render("receptionniste/patientList")
// })

//register a new patient
.get('/register',  async (req, res)=>{

//    await Patient.create(req.body)
//    req.flash("suppression effectué avec succes")
//     res.redirect("/fulltang/V0/receptionnist")  
Patient.bulkCreate([
    { name: "Daren",
      surname: "Ndize",
      address: "rue des manguies",
      sex: "male",
      phone: "666234859",
      email: "ndize@gmail.com",
      CNI: "10042865",
      birthdate: new Date()
      
    }
    
])
})


//get a patient by ID
.get('/patient/:id', async(req, res)=>{
    const requestedID = req.params.id
    const patient = await Patient.findOne({where: {id:requestedID}})
    res.render("receptionniste/info-patient")
})


//Update patient

//delete patient
.post('/patient/:id', async(req, res)=>{
    const requestedID = req.params.id
    const patient = await Patient.destroy({where: {id:requestedID}})
    res.render("receptionniste/info-patient")
})

//set patient state



module.exports = router