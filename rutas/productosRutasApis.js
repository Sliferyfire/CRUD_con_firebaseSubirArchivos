var ruta = require("express").Router();
var {mostrarProductos, modificarProducto, borrarProducto, nuevoProducto, buscarPorID} = require("../bd/productosBD");
const subirArchivo = require("../middleWares/subirArchivosProd");

ruta.get("/api/mostrarProductos",async(req,res)=>{
    var productos = await mostrarProductos();
    if(productos.length>0)
        res.status(200).json(productos)
        
    else    
        res.status(400).json("No hay productos");
})

ruta.post("/api/nuevoProducto", subirArchivo(),async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error = await nuevoProducto(req.body);
    if(error == 0)
        res.status(200).json("Producto registrado");
    else    
        res.status(400).json("Error al registrar el producto");
});

ruta.get("/api/buscarProductoPorId/:id",async (req,res)=>{
    var prod = await buscarPorID(req.params.id);
    console.log(prod);
    if(prod.length=="")
        res.status(400).json("Producto no encontrado");
    else    
        res.status(200).json(prod);
});

ruta.post("/api/editarProducto", subirArchivo(),async(req,res)=>{
    req.body.foto= req.file.originalname;
    var error = await modificarProducto(req.body);
    if(error == 0)
        res.status(200).json("Producto modificado");
    else
        res.status(400).json("Error al modificar el producto");
});

ruta.get("/api/borrarProducto/:id", async(req,res)=>{
    var error = await borrarProducto(req.params.id);
    if(error == 0)
        res.status(200).json("Producto borrado");
    else    
        res.status(400).json("Error al borrar el producto");
});

module.exports=ruta
