var ruta = require("express").Router();
var subirArchivo = require("../middleWares/subirArchivos");
var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarPorID, borrarUSuario} = require("../bd/usuariosBD")

ruta.get("/api/mostrarUsuarios",async(req,res)=>{
    var usuarios = await mostrarUsuarios();
    //console.log(usuarios);
    //res.render("usuarios/mostrar",{usuarios});
    if(usuarios.length>0)
        res.status(200).json(usuarios);
    else
        res.status(400).json("No hay usuarios");
})

ruta.post("/api/nuevousuario",subirArchivo(),async(req,res)=>{
    console.log(req.bpdy);
    req.body.foto=req.file.originalname;
    var error = await nuevoUsuario(req.body);
    if(error==0)
        res.status(200).json("Usuario registrado");
    else    
        res.status(400).json("Datos incorrectos");
});

ruta.get("/api/buscarUsuarioPorId/:id",async (req,res)=>{
    var user = await buscarPorID(req.params.id);
    console.log(user);
    if(user.length=="")
        res.status(400).json("No se encontro ese usuario");
    else
        res.status(200).json(user);
});

ruta.post("/api/editarUsuario",async(req,res)=>{
    try {
        req.body.foto= req.file.originalname;
    } catch (error) {
        var usr = await buscarPorID(req.body.id);
        req.body.foto= usr.foto;
    }
    var error = await modificarUsuario(req.body);
    //res.redirect("/")
    if(error == 0)
        res.status(200).json("Usuario actualizado");
    else    
        res.status(400).json("Error al actualizar el usuario");
});

ruta.get("/api/borrarUsuario/:id", async(req,res)=>{
    error = await borrarUSuario(req.params.id);
    //res.redirect("/");
    if(error == 0)
        res.status(200).json("Usuario borrado");
    else
        res.status(400).json("Error al borrar el usuario");
});

module.exports=ruta;
                      