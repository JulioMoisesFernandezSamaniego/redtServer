const express=require('express');

let {verificaToken, verificaAdmin_Role}=require('../middlewares/autenticacion');

let app= express();

let Categoria = require('../models/categoria');


//MOSTRAR TODAS LAS CATEGORIAS
app.get('/categoria',verificaToken, (req, res)=>{
    Categoria.find({})
            .sort('descripcion')//lo ordena por la descripcion
            .populate('usuario', 'nombre email')//Regresa la informacion del usuario,1 de donde se saca la info,2 los campos que solo se quiere mostrar
            .exec((err,categorias)=>{
                if(err){
                    return res.status(500).json({
                        ok: false, 
                        err
                    })
                }
                res.json({
                    ok:true,
                    categorias
                }) 
            })
});

//MOSTRAR UNA CATEGORIA POR ID
app.get('/categoria/:id',verificaToken, (req,res)=>{
    let id = req.params.id;
    Categoria.findById(id,(err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(500).json({
                ok:false,
                err:{
                    message:'No existe el id'
                }
            })
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })
    })
});

//CREAR UNA NUEVA CATEGORIA
app.post('/categoria', verificaToken,(req,res)=>{
    let body = req.body;
    let categoria = new Categoria({
        descripcion : body.descripcion,
        usuario: req.usuario._id
    });
    //guardamos en la db
    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false, 
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false, 
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})

//ACTUALIZA LA CATEGORIA 
app.put('/categoria/:id',verificaToken, (req,res)=>{
    let id = req.params.id;
    let body = req.body;

    let descCategoria={
        descripcion: body.descripcion
    }
    
    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true },(err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false, 
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false, 
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})


//ELIMINA LA CATEGORIA
app.delete('/categoria/:id',[verificaToken,verificaAdmin_Role],(req,res)=>{
    let id=req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false, 
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false, 
                err:{
                    message:'El id no existe'
                }
            })
        }
        res.json({
            ok:true,
            message:'Categoria borrada'
        })
    })
})


module.exports=app;