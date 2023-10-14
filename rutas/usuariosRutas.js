var ruta = require("express").Router();
var subirArchivo = require("../middleWares/subirArchivos");
var borrarArchivo = require("../middleWares/borrarArchivos");
var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarPorID, borrarUSuario, buscarPorUsuario} = require("../bd/usuariosBD");
const { encriptarPassword, validarPassword } = require("../funciones/funcionesPassword");

ruta.get("/",async(req,res)=>{
    var usuarios = await mostrarUsuarios();
    res.render("usuarios/mostrar",{usuarios});
})

ruta.get("/nuevousuario", async(req,res)=>{
    res.render("usuarios/nuevo");
});

ruta.post("/nuevousuario", subirArchivo(), async(req,res)=>{
    //console.log(req.file);
    req.body.foto= req.file.originalname;
    //console.log(req.body);
    var error = await nuevoUsuario(req.body);
    res.redirect("/")
});

ruta.get("/editar/:id",async (req,res)=>{
    var user = await buscarPorID(req.params.id);
    res.render("usuarios/modificar",{user})
});

ruta.post("/editar", subirArchivo(), async(req,res)=>{
    // try {
    //     req.body.foto= req.file.originalname;
    //     if(req.file)
    //         borrarArchivo(usr.foto);
    // } catch (error) {
    //     var usr = await buscarPorID(req.body.id);
    //     req.body.foto= usr.foto;
    // }
    
    if(req.file != undefined)
        req.body.foto = req.file.originalname
    else
        req.body.foto = req.body.fotoVieja;


    var error = await modificarUsuario(req.body);
    res.redirect("/")
});

ruta.get("/borrar/:id", async(req,res)=>{
    var usr = await buscarPorID(req.params.id);
    borrarArchivo(usr.foto);
    await borrarUSuario(req.params.id);
    res.redirect("/");
    //res.end();
});

ruta.get("/login",(req,res)=>{
    res.render("usuarios/login")
});

ruta.post("/validarLogin", async(req,res)=>{
    var user = await buscarPorUsuario(req.body.usuario);
    try {
        var verificar = await validarPassword(req.body.password,user.data().password,user.data().salt);
    } catch (error) {
        console.log("Usuario no encontrado");
        res.render("usuarios/wrong")
    }
    
    //console.log(verificar);
    if(verificar == true){
        console.log("Usuario verificado");
        res.render("usuarios/success")
    }
    else{
        console.log("Password incorrecto");
        res.render("usuarios/wrong")
    }
    res.end();
});

ruta.get("/success",(req,res)=>{
    res.redirect("/") 
});

ruta.get("/wrong", (req,res)=>{
    res.redirect("/login")
});

module.exports=ruta;
                      