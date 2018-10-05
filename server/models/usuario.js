//exportamos mongoose
const mongoose = require('mongoose');

//llamamos al mongoose unique validator 
const uniqueValidator=require('mongoose-unique-validator');

let rolesValidos={
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

//obtenemos el esquema 
let Schema=mongoose.Schema;

//definimos el esquema
let usuarioSchema= new Schema({
    nombre:{
        type:String,
        required: [true,'El nombre es necesario']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'El correo es necesario']
    },
    password:{
        type:String,
        required:[true,'La contaseña es obligatoria']
    },
    img:{
        type:String,
        required:false
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});

//validamos para no mostrar el pasword
usuarioSchema.methods.toJSON= function(){

    let user= this;
    let userObject=user.toObject();
    delete userObject.password;

    return userObject;
};

//le decimos al esquema que use este plugin
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} dede de ser unico'})

//ahora lo exportamos
module.exports=mongoose.model('Usuario',usuarioSchema);//nombre y el valor a tomar