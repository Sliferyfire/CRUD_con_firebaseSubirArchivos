var ruta = require("express").Router();
var subirArchivo = require("../middleWares/subirArchivosProd");
var borrarArchivo = require("../middleWares/borrarArchivosProd");
var {mostrarProductos, modificarProducto, borrarProducto, nuevoProducto, buscarPorID} = require("../bd/productosBD");
const { encriptarPassword, validarPassword, autorizado, admin } = require("../funciones/funcionesPassword"); 

ruta.get("/productos",admin,async(req,res)=>{
    var productos = await mostrarProductos();
    res.render("productos/mostrar",{productos, foto:req.session.foto});
})

ruta.get("/nuevoproducto",admin,async(req,res)=>{
    res.render("productos/nuevo",{foto:req.session.foto});
});

ruta.post("/nuevoproducto",admin, subirArchivo(),async(req,res)=>{
    req.body.foto= req.file.originalname;
    var error = await nuevoProducto(req.body);
    res.redirect("/productos")
});

ruta.get("/editarproducto/:id",admin,async (req,res)=>{
    var prod = await buscarPorID(req.params.id);
    //console.log(prod);
    //res.end();
    res.render("productos/modificar",{prod, foto:req.session.foto})
});

ruta.post("/editarproducto",admin, subirArchivo(),async(req,res)=>{
    var prod = await buscarPorID(req.body.id);
    try {
        req.body.foto= req.file.originalname;
        if(req.file)
            borrarArchivo(prod.foto); 
    } catch (error) {
        req.body.foto= prod.foto;
    }
    var error = await modificarProducto(req.body);
    res.redirect("/productos")
});

ruta.get("/borrarproducto/:id",admin, async(req,res)=>{
    var prod = await buscarPorID(req.params.id);
    borrarArchivo(prod.foto);
    await borrarProducto(req.params.id);
    res.redirect("/productos");
});

ruta.get("/cerrarSesion",(req,res)=>{
    req.session=null;
    res.redirect("/");
});

module.exports=ruta
