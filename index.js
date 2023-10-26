var express = require("express");
var cors = require("cors");
var path = require("path");
// var session = require("express-session");  Se almacena en el servidor 
var session = require("cookie-session");
require("dotenv").config();
var rutas = require("./rutas/usuariosRutas");
var rutasPr = require("./rutas/productosRutas");
var rutasUsuariosApis = require("./rutas/usuariosRutasApis");
var rutasProductosApis = require("./rutas/productosRutasApis");



var app = express();
app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(session({
    name: 'session',
    keys: ["ahfhafhafueaf17rbqcb17eb"],
    maxAge: 24 * 60 * 60 * 1000,
    cookie: {
        secure: true,
        httpOnly: true,
      }
}));
app.use("/", express.static(path.join(__dirname,"/web")))
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/icons', express.static(__dirname + '/node_modules/bootstrap-icons/font/fonts'))
app.use("/",rutas);
app.use("/",rutasPr);
app.use("/",rutasUsuariosApis);
app.use("/",rutasProductosApis);

var port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});










