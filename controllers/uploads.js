const path = require('path');
const fs = require('fs');

const { response } = require('express');

const { v4: uuid4 } = require('uuid');

const {actualizarImagen} = require("../helpers/actualizar-imagen");

const fileUpload = async (req, resp = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales','medicos','usuarios'];

    if( !tiposValidos.includes(tipo) ){
        resp.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital (tipo)'
        });
    }

    //Validar que exista el archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return resp.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    //Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length -1 ];

    //Validar extension
    const extensionesValida = ['png','jpg','jpeg', 'gif'];

    if( !extensionesValida.includes(extensionArchivo) ){
        resp.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    //Generar nombre de la imagen
    const nombreArchivo = `${ uuid4() }.${ extensionArchivo }`;

    //Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {

        if (err){
             return resp.status(500).json({
                 ok: false,
                 msg: 'Error al mover la imagen'
             });
        }

        //Actualizar base de datos
        actualizarImagen( tipo, id, nombreArchivo );

        resp.status(200).json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo: nombreArchivo
        });

    });
};

const retornaImagen = async (req, resp = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${tipo}/${foto}` );

    //imagen por defecto
    if( fs.existsSync(pathImg) ){
        resp.sendFile(pathImg);
    }else{
        const pathImg = path.join( __dirname, `../uploads/no-img.jpg` );
        resp.sendFile(pathImg);
    }

};

module.exports = {
    fileUpload,
    retornaImagen
}
