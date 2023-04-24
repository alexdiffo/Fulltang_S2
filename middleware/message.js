const message=(req,res,next)=>{

    if(req.session.flash){

        res.locals.message=req.session.flash
        req.session.flash=undefined

    }
    


    req.flash=(content)=>{

        req.session.flash=content
    }

    next()

}

module.exports=message