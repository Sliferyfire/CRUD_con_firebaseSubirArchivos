var conexion = require("./conexion").conexionPr;
const Producto = require("../modelos/Producto");

async function mostrarProductos(){
    var prods=[];
    try{
        var productos = await conexion.get();
        //console.log(productos.nombre);
        productos.forEach(producto => {
            var prod=new Producto(producto.id, producto.data());
            if (prod.bandera == 0){
                prods.push(prod.obtenerDatos);
            }
        });
    }
    catch(err){
        console.log("Error al recuperar productos de la BD: " + err);
    }
    return prods;
}

async function buscarPorID(id){
    var prod;
    try {
        var producto=await conexion.doc(id).get();
        var productoObjeto = new Producto(producto.id,producto.data());
        if (productoObjeto.bandera == 0){
            prod = productoObjeto.obtenerDatos;
        }
    } 
    catch (err) {
        console.log("Error al recuperar el producto: " + err);
    }
    return prod;    
}

async function nuevoProducto(datos){
    var prod = new Producto(null,datos);
    //console.log(prod);
    var error = 1;
    if (prod.bandera == 0){
        try {
            await conexion.doc().set(prod.obtenerDatos);

            console.log("Producto insertado a la BD");
            error = 0;
        } 
        catch (err) {
            console.log("Error al capturar el nuevo producto: " + err);
        }
    }
    return error;
}

async function modificarProducto(datos){
    var error = 1; 
    var respuestaBuscar = await buscarPorID(datos.id);
    if(respuestaBuscar!=undefined){
        var prod = new Producto(datos.id,datos);
        if (prod.bandera == 0){
            try {
                await conexion.doc(prod.id).set(prod.obtenerDatos);
                console.log("Producto actualizado");
                error = 0;
            } 
            catch (err) {
                console.log("Error al modificar el producto: "+err);    
            }
        }
    }
    return error;
}

async function borrarProducto(id){
    var error = 1;
    var prod = await buscarPorID(id)
    if(prod!=undefined){
        try {
            await conexion.doc(id).delete();
            console.log("Producto borrado");
            error = 0;
        } 
        catch (err) {
            console.log("Error al borrar al producto: "+err);    
        }
    }
    return error;
}

module.exports={
    mostrarProductos,
    buscarPorID,
    nuevoProducto,
    modificarProducto,
    borrarProducto
}







