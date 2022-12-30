const fs = require('fs');

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const borrarImagen = ( path ) => {
    if( fs.existsSync(path) ){
        //Borramos la imagen
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {

    let pathViejo = '';

    switch (tipo){

        case 'medicos':

            const medico = await Medico.find({id:id}).limit(1);

            if( !medico ) return false;

            pathViejo = `./uploads/medicos/${medico[0].img}`;

            borrarImagen(pathViejo);

            medico[0].img = nombreArchivo;
            await medico[0].save();

            return true;

        break;

        case 'hospitales':

            const hospital = await Hospital.find({id:id}).limit(1);

            if( !hospital ) return false;

            pathViejo = `./uploads/medicos/${hospital[0].img}`;

            borrarImagen(pathViejo);

            hospital[0].img = nombreArchivo;
            await hospital[0].save();

            return true;

        break;

        case 'usuarios':

            const usuario = await Usuario.find({id:id}).limit(1);

            if( !usuario ) return false;

            pathViejo = `./uploads/medicos/${usuario[0].img}`;

            borrarImagen(pathViejo);

            usuario[0].img = nombreArchivo;
            await usuario[0].save();

            return true;

        break;

        default:
            return resp.status(400).json({
                ok: false,
                msg: "La tabla tiene que ser usuarios/medicos/hospitales"
            });
    }

}

module.exports = {
    actualizarImagen
}
