var ruta = require("express").Router();
var subirArchivo = require("../middleWares/subirArchivosProd");
var borrarArchivo = require("../middleWares/borrarArchivosProd");
var {mostrarProductos, modificarProducto, borrarProducto, nuevoProducto, buscarPorID} = require("../bd/productosBD");

ruta.get("/productos",async(req,res)=>{
    var productos = await mostrarProductos();
    res.render("productos/mostrar",{productos});
})

ruta.get("/nuevoproducto",async(req,res)=>{
    res.render("productos/nuevo");
});

ruta.post("/nuevoproducto", subirArchivo(),async(req,res)=>{
    req.body.foto= req.file.originalname;
    var error = await nuevoProducto(req.body);
    res.redirect("/productos")
});

ruta.get("/editarproducto/:id",async (req,res)=>{
    var prod = await buscarPorID(req.params.id);
    //console.log(prod);
    //res.end();
    res.render("productos/modificar",{prod})
});

ruta.post("/editarproducto", subirArchivo(),async(req,res)=>{
    try {
        req.body.foto= req.file.originalname;
    } catch (error) {
        var usr = await buscarPorID(req.body.id);
        req.body.foto= usr.foto;
    }
    
    var error = await modificarProducto(req.body);
    res.redirect("/productos")
});

ruta.get("/borrarproducto/:id", async(req,res)=>{
    var usr = await buscarPorID(req.params.id);
    borrarArchivo(usr.foto);
    await borrarProducto(req.params.id);
    res.redirect("/productos");
});

module.exports=ruta
