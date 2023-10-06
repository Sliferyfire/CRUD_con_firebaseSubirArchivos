//var multer = require("multer");
const fs = require('fs').promises

function borrarArchivo(foto){
    fs.unlink('./web/images/' + foto)
    .then(() => {
        console.log('Imagen borrada')
    }).catch(err => {
        console.error('No se pudo borrar la imagen', err)
    })
}

module.exports = borrarArchivo;











