var conexion = require("./conexion").conexion;
const Usuario = require("../modelos/Usuario");

async function mostrarUsuarios(){
    var users=[];
    try{
        var usuarios = await conexion.get();
        //console.log(usuarios.usuario);
        usuarios.forEach(usuario => {
            var user=new Usuario(usuario.id, usuario.data());
            if (user.bandera == 0){
                users.push(user.obtenerDatos);
            }
        });
    }
    catch(err){
        console.log("Error al recuperar usuarios de la BD: " + err);
    }
    return users;
}

async function buscarPorID(id){
    var user;
    try {
        var usuario=await conexion.doc(id).get();
        var usuarioObjeto = new Usuario(usuario.id,usuario.data());
        if (usuarioObjeto.bandera == 0){
            user = usuarioObjeto.obtenerDatos;
        }
    } 
    catch (err) {
        console.log("Error al recuperar al usuario: " + err);
    }
    return user;    
}

async function nuevoUsuario(datos){
    var user = new Usuario(null,datos);
    //console.log(user);
    var error = 1;
    if (user.bandera == 0){
        try {
            await conexion.doc().set(user.obtenerDatos);

            console.log("Usuario insertado a la BD");
            error = 0;
        } 
        catch (err) {
            console.log("Error al capturar el nuevo usuario: " + err);
        }
    }
    return error;
}

async function modificarUsuario(datos){
    var error = 1; 
    var respuestaBuscar = await buscarPorID(datos.id);
    if (respuestaBuscar != undefined){
        var user = new Usuario(datos.id,datos);
        if (user.bandera == 0){
            try {
                await conexion.doc(user.id).set(user.obtenerDatos);
                console.log("Registro actualizado");
                error = 0;
            } 
            catch (err) {
                console.log("Error al modificar al usuario: "+err);    
            }
        }
    }
    return error;
}

async function borrarUSuario(id){
    var error=1;
    var user = await buscarPorID(id);
    if (user != undefined){
        try {
            await conexion.doc(id).delete();
            console.log("Registro borrado");
            error=0;
        } 
        catch (err) {
            console.log("Error al borrar al usuario: "+err);    
        }
    }
    return error;
}

module.exports={
    mostrarUsuarios,
    buscarPorID,
    nuevoUsuario,
    modificarUsuario,
    borrarUSuario
}







