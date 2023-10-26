var ruta = require("express").Router();
var subirArchivo = require("../middleWares/subirArchivos");
var borrarArchivo = require("../middleWares/borrarArchivos");
var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarPorID, borrarUSuario, buscarPorUsuario} = require("../bd/usuariosBD");
const { encriptarPassword, validarPassword, autorizado, admin } = require("../funciones/funcionesPassword");

ruta.get("/",(req,res)=>{
    if(req.session.usuario){
        if(req.session.admin){
            res.redirect("/productos");
        }
        else{
            res.redirect("/mostrarUsuario");
        }
    } 
    else
        res.render("usuarios/login")
});

ruta.get("/mostrarUsuario",autorizado,async(req,res)=>{
        var usuarios = await mostrarUsuarios();
        res.render("usuarios/mostrar",{usuarios, foto:req.session.foto});
})

ruta.get("/nuevousuario", async(req,res)=>{
    res.render("usuarios/nuevo"),{foto:req.session.foto};
});

ruta.post("/nuevousuario", subirArchivo(), async(req,res)=>{
    var user = await buscarPorUsuario(req.body.usuario);
    try {
        if(user.data().usuario === req.body.usuario){
            console.log("Ya existe el usuario");
            mensaje = "INVALID USER"
            res.render("usuarios/wrong", {mensaje, foto:req.session.foto});
        }
    } 
    catch (error) {
        req.body.foto= req.file.originalname;
        var error = await nuevoUsuario(req.body);
        res.render("usuarios/success"),{foto:req.session.foto};
    }
    
});

ruta.get("/editar/:id",async (req,res)=>{
    var user = await buscarPorID(req.params.id);
    res.render("usuarios/modificar",{user, foto:req.session.foto})
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
    res.redirect("/mostrarUsuario");
});

ruta.get("/borrar/:id", async(req,res)=>{
    var usr = await buscarPorID(req.params.id);
    borrarArchivo(usr.foto);
    await borrarUSuario(req.params.id);
    res.redirect("/mostrarUsuario");
    //res.end();
});

ruta.post("/validarLogin", async(req,res)=>{
    var mensaje;
    var user = await buscarPorUsuario(req.body.usuario);
    try {
        var verificar = await validarPassword(req.body.password,user.data().password,user.data().salt);
    } catch (error) {
        console.log("Usuario no encontrado");
        mensaje = "INVALID USER"
        res.render("usuarios/wrong",{mensaje, foto:req.session.foto})
    }
    
    //console.log(verificar);
    if(verificar == true){
        console.log("Usuario verificado");
        req.session.foto=user.data().foto;
        req.session.usuario=user.data().usuario;
        if(user.data().admin == true){
            console.log("Admin");
            req.session.admin=req.session.usuario;
        }
        else{
            console.log("Usuario");
            req.session.usuario=req.session.usuario;
        }
        res.render("usuarios/success"),{foto:req.session.foto};
    }
    else{
        console.log("Password incorrecto");
        mensaje = "INVALID PASSWORD"
        res.render("usuarios/wrong", {mensaje,foto:req.session.foto});
    }
});

ruta.get("/cerrarSesion",(req,res)=>{
    req.session=null;
    res.redirect("/");
});

ruta.get("/success",(req,res)=>{
    console.log("-------------------");
    console.log(req.session.usuario);
    console.log("-------------------");
    res.redirect("/") 
});

ruta.get("/wrong", (req,res)=>{
    res.redirect("/")
});

module.exports=ruta;
                      