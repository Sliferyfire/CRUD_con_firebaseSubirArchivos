var conexion = require("./conexion").conexion;
var {encriptarPassword} = require("../funciones/funcionesPassword");
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
    var {hash,salt}= encriptarPassword(datos.password);
    datos.password = hash;
    datos.salt = salt;
    var user = new Usuario(null,datos);
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
    // console.log(datos.foto); undefined
    // console.log(datos.fotoVieja); 
    // console.log(datos.password); ""
    // console.log(datos.passwordViejo); 
    var error = 1; 
    var respuestaBuscar = await buscarPorID(datos.id);
    if (respuestaBuscar != undefined){
        if(datos.password = ""){
            datos.password = datos.passwordViejo;
            datos.salt = datos.saltViejo;
        }
        else{
            var{salt,hash} = encriptarPassword(datos.password);
            datos.password = hash;
            datos.salt = salt;
        }
            
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

async function buscarPorUsuario(usuario){
    // console.log(usuario);
    // console.log("-------");
    // var usr;
    // try {
    //     var user=await conexion.doc(usuario).get();
    //     var usuarioObjeto = new Usuario(user.id,user.data());
    //     console.log(usuarioObjeto);
    //     console.log("------");
    //     if (usuarioObjeto.bandera == 0){
    //         usr = usuarioObjeto.obtenerDatos;
    //     }
    // } 
    // catch (err) {
    //     console.log("Error al recuperar al usuario: " + err);
    // }
    // return usr;   
    var data={};
    const users = conexion;
    const snapshot = await users.where('usuario', '==', usuario).get();
    if (snapshot.empty) {
        console.log('No se encontraron documentos');
        return;
    }  
    snapshot.forEach(doc => {
        //console.log(doc.id, '=>', doc.data());
        data=doc
    });
    //console.log(data);
    return data;
}

module.exports={
    mostrarUsuarios,
    buscarPorID,
    nuevoUsuario,
    modificarUsuario,
    borrarUSuario,
    buscarPorUsuario
}







