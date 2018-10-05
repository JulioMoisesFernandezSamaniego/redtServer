const express = require('express');

let {verificaToken}=require('../middlewares/autenticacion')

let app=express();

let Producto=require('../models/Producto');

//OBTENER TODOS LOS PRODUCTOS
app.get('/producto',verificaToken,(req,res)=>{
    let desde = req.query.desde || 0;
    desde= Number(desde);

    Producto.find({disponible:true})
            .skip(desde)
            .limit(5)
            .populate('usuario','nombre email')//de donde se saca la informacion, 2 la info
            .populate('categoria','descripcion')
            .exec((err,productos)=>{
                if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
                }
                res.json({
                    ok:true,
                    productos
                })
            })

});

//OBTENER UN PRODUCTO
app.get('/producto/:id',verificaToken,(req, res)=>{
    let id= req.params.id;

    Producto.fingById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
            .exec((err, productoDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }
                if(!productoDB){
                    return res.status(400).json({
                        ok:false,
                        err:{
                                message: 'No existe ese producto'
                        }
                    })
                } 

                res.json({
                    ok:true,
                    producto: productoDB
                })
    })
});

//BUSCAR UN PRODUCTO
app.get('/producto/buscar/:termino',verificaToken,(req,res)=>{

    let termino = req.params.termino;

    //hacemos que se busque por sus iniciales como expresion regular al poner ensalada que me mueste todas las
    let regex=new RegExp(termino, 'i');

    Producto.find({nombre: regex})
            .populate('categoria', 'nombre')
            .exec((err,producto)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                res.json({
                    ok:true,
                    producto
                })
            })  
});

//CREAR UN PRODUCTO
app.post('/producto',verificaToken,(req,res)=>{
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    
    producto.save((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        res.status(201).json({
            ok:true,
            producto: productoDB
        })
    })
});

//ACTUALIZAR UN PRODUCTO
app.put('/producto/:id',verificaToken,(req,res)=>{
    let id=req.params.id;
    let body = req.body;

    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        };
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'No existe el producto'
                }
            })
        }

        productoDB.nombre=body.nombre;
        productoDB.precioUni=body.precioUni;
        productoDB.descripcion=body.descripcion;
        productoDB.disponible=body.disponible;
        productoDB.categoria=body.categoria;

        productoDB.save((err,guardarProducto)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                producto: {
                    guardarProducto,
                    message:'Actualizado'
                }
            })
        })
    })
});

//ELIMINA UN PRODUCTO
app.delete('/producto/:id',verificaToken,(req,res)=>{
    let id=req.params.id;

    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El producto no existe'
                }
            })
        }
        productoDB.disponible=false;
        productoDB.save((err,productoBorrado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                producto: productoBorrado,
                message:'Producto borrado'
            })
        })
    })
})


module.exports=app;