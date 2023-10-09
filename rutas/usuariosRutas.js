var ruta = require("express").Router();
var subirArchivo = require("../middleWares/subirArchivos");
var borrarArchivo = require("../middleWares/borrarArchivos");
var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarPorID, borrarUSuario} = require("../bd/usuariosBD")

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
    try {
        req.body.foto= req.file.originalname;
        if(req.file)
            borrarArchivo(usr.foto);
    } catch (error) {
        var usr = await buscarPorID(req.body.id);
        req.body.foto= usr.foto;
    }
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

module.exports=ruta;
                      