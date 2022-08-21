const {Router} = require('express')
const router=Router();
const { User } = require("../db.js");
const sgMail = require('@sendgrid/mail')

require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)



// const User = require('../models/User')
const jwt = require('jsonwebtoken') //me permite crear y validar tokens
const config = require('../config')
const verifyToken = require('./verifyToken')

//similar al /signup
//funciona
router.post('/auth/register', async (req,res,next)=>{
    const { username, email, password } = req.body;
    console.log()
    const emailEnBD = await User.findOne({ where: { email: email } })
    
    if(!emailEnBD){

        const user = await User.create({
            username, email, password
        
                });
                //si no funca, quizas sea que no toma bien el id
                //usamos config.secret para codificar el token
            const token = jwt.sign({id: user.id}, config.secret, {expiresIn: 60 * 60 * 24}) //me permite crear un token
        
            const msg = {
                to: `${email}`,
                from: 'nahux28@gmail.com',
                subject: 'Bienvenido al maravilloso mundo de Disney',
                text: 'Gracias por registrarte, estás a un paso de validar tu registro en nuestra web'
            }
            sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })
               
            res.json({auth: true, token})
    }
    else{
        return res.status(400).send("Ya hay un usuario creado con ese email");
    }
    

})


//funciona
router.post('/auth/login', async (req,res,next)=>{
    const{email,password}=req.body;
    
    const user=await User.findOne({ where: { email: email } });
   
    if(!user){
        
        return res.status(404).send("The email doesn't exists");
    }

    if(password === user.password){
        const token= jwt.sign({id:user.id},config.secret,{
            expiresIn:60*60*24
        });
        
        res.json({auth:true,token});

    }else{
        res.status(401).json({auth:false,token:null});
    }

})



module.exports = router;