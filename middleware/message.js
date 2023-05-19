const message=(req,res,next)=>{

    if(req.session.flash){

        res.locals.message=req.session.flash[1]
        res.locals.type=req.session.flash[0]
        req.session.flash=undefined

    }
    


    req.flash=(type,content)=>{

        req.session.flash=[type,content]
    }

    next()

}

module.exports=message