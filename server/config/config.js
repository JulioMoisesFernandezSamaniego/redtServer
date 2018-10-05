//configurando el puerto de la nube
process.env.PORT= process.env.PORT || 3000;

//ENTORNO para saber si entoy en dessarollo o en producion 
//comprobamos si la bariable global de heroku existe y si no estamos en dessarollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//FECHA DE EXPIRACION DEL TOKEN

process.env.CADUCIDAD_TOKEN = '48h';

//SEDD

process.env.SEED=process.env.SEED || 'este-es-el-seed-desarrollo';

//BASE DE DATOS 
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB='mongodb://localhost:27017/cafe'
}else{
    urlDB= process.env.MONGO_URI;
}

//declaramos una variable local 

process.env.URLDB = urlDB;

//configuramos el google cliend id
process.env.CLIENT_ID=process.env.CLIENT_ID||'163777314274-hpptc01fsuhph5ds103otrbdk6pjah31.apps.googleusercontent.com';

