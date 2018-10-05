//llamamos al jwt
const jwt = require('jsonwebtoken');


//verificar token 
let verificaToken=(req, res, next)=>{
   let  token = req.get('token');
   //comprobamos si el token es correcto
   jwt.verify(  token, process.env.SEED, (err, decoded)=>{
       if(err){
           return res.status(401).json({
               ok: false,
               err:{
                   message: 'token no valido'
               }
           })
       }
       req.usuario = decoded.usuario;
       next();
   })//1 el token que se recibe,2 SEED, 3  callback
};


//verifica ADMIN_ROLE

let verificaAdmin_Role=(req, res, next)=>{

    let usuario=req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok:false,
            err:{
                message:'El usuario no es administrador'
            }
        });
    }
}

module.exports={
    verificaToken,
    verificaAdmin_Role
}   