var crypto = require("crypto");
var bandera = false;

function encriptarPassword(password) {
    var salt = crypto.randomBytes(32);
    var hash = crypto.scryptSync(password, salt, 100000, 64, 'sha512').toString('hex');
    return {
        salt,
        hash
    }
} 

function validarPassword(password,hash,salt) {
    var hashEvaluar = crypto.scryptSync(password, salt, 100000, 64, 'sha512').toString('hex');
    if(hashEvaluar === hash) bandera = true;
    return  (hashEvaluar === hash);
}

function autorizado(req,res,cb) {
    if(req.session.usuario || req.session.admin){
        cb();
    }
    else{
        res.redirect("/");
    }
}

function admin(req,res,cb) {
    if(req.session.admin)
        cb();
    else{
        if(req.session.usuario){
            res.redirect("/mostrarUsuario")
        }
        else{
            res.redirect("/")
        }
    }     
}

module.exports = {
    encriptarPassword,
    validarPassword,
    autorizado,
    admin
}





