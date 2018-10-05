//llamamos a la app 
const express = require('express');

//llamamos al bcrypt para encriptar contaseñas
const bcryptjs = require('bcryptjs');

//importamos al underscore que sirve para validar los update
const _=require('underscore');

//inportamos el usuario con sus campos en usuario/models
const Usuario=require('../models/usuario');

//importamos la validacion del token
//destructuramos autenticacion solo retirando el validaToken
const {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion')

const app = express();

//usamos un middlewares que va en primer parametro 
app.get('/usuario',verificaToken,(req,res)=>{
    //agregamos los paramoetros de donde a donde quiere el usuario
    let desde= req.query.desde || 0;
    //lo trasformamos a un número
    desde=Number(desde);

    //manejamos el limite
    let limite = req.query.limite || 5;

    limite = Number(limite);

    //para hacer la peticiond de todos los usuarios
    Usuario.find({ estado:true }, 'nombre email role estado google img')//en el {se pone los especificaciones como ={google: true}}
            .skip(desde)
            .limit(limite)
            .exec((err,usuarios)=>{
                if(err){
                    res.status(400).json({
                        ok:false,
                        err
                    })
                }

                Usuario.count({estado:true},(err, conteo)=>{//aqui debe de ir lo que va arriba
                    res.json({
                        ok:true,
                        usuarios,
                        conteo: conteo
                    })
                })  
            })
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req,res)=>{

    let body=req.body;

    let usuario = new Usuario({
        nombre:body.nombre,
        email: body.email,
        //encriptamos la contraseña
        password: bcryptjs.hashSync(body.password, 10),//parametro 1 dampo a almacenar, 2 número de vueltas
        role:body.role
    })

    usuario.save((err,usuariodb) => {
        if(err){
            res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            usuario:usuariodb
        })
    })
})


app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req,res)=>{
    let id=req.params.id;
    //usamos el undercore
    let body = _.pick(req.body,['nombre','email','img','role','estado']);//1el objeto del que recoje los valores,2 los campos que se van a actualizar en un areglo
    //le decimos que busque por el id y lo actualize
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true }, (err,usuariodb)=>{//el metodo find... tiene como primer parametro es el id, 2 es las opciones que es un objeto, 3 el objeto 4 el callback
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }  

        res.json({
            ok:true,
            usuario: usuariodb 
        })
    })
})

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req,res)=>{
    //para eliminar fisicamente el user
    let id=req.params.id;
    /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if(!usuarioBorrado){
            return res.status(400).json({
                ok:true,
                err:{
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok:true,
            usuario:usuarioBorrado
        });
    });*/
    let cambioaEstado={
        estado:false
    }
    Usuario.findByIdAndUpdate(id,cambioaEstado,{new: true}, (err,usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            usuario:usuarioBorrado
        })

    })
});
module.exports=app;