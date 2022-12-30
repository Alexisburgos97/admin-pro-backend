const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Medico = require('../models/medico');

const {generarJWT} = require("../helpers/jwt");

const getMedicos = async (req, resp = response) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre email img')
        .populate('hospital', 'nombre img');

    resp.status(200).json({
        ok: true,
        msg: "Get medicos",
        medicos: medicos
    });
};

const crearMedico = async (req, resp = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        medico: '',
        ...req.body
    });

    try{

        const medicoDB = await medico.save();

        // const existeEmail = await Usuario.find({email: email});
        //
        // console.log(existeEmail)
        //
        // if( Array.isArray(existeEmail) && existeEmail.length > 0 ){
        //     return resp.status(400).json({
        //         ok: false,
        //         msg: "Error, el correo ya está registrado"
        //     });
        // }
        //
        // const usuario = new Usuario(req.body);
        //
        // //Encriptar contraseña
        // const salt = bcryptjs.genSaltSync();
        // usuario.password = bcryptjs.hashSync(password, salt);
        //
        // await usuario.save();
        //
        // //Generar JWT
        // const token = await generarJWT(usuario.id);
        //
        resp.status(201).json({
            ok: true,
            msg: "Medico creado correctamente",
            medico: medicoDB
        });

    }catch (error){
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Error inesperado, intente más tarde"
        });
    }
}

const actualizarMedico = async (req, resp = response) => {

    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ){
            return resp.status(404).json({
                ok: false,
                msg: "Error, no existe un usuario con ese id"
            });
        }

        const campos = req.body;
        delete campos.password;
        delete campos.google;

        if( usuarioDB.email === req.body.email ){
            delete campos.email;
        }else{

            const existeEmail = await Usuario.findOne({email: req.body.email});

            if( existeEmail ){
                return resp.status(400).json({
                    ok: false,
                    msg: "Error, el correo ya está registrado"
                });
            }

        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true} );

        resp.status(200).json({
            ok: true,
            msg: "Usuario actualizado correctamente",
            usuarioActualizado: usuarioActualizado
        });

    }catch (error){
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Error inesperado, intente más tarde"
        });
    }

}

const eliminarMedico = async (req, resp = response) => {

    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ){
            return resp.status(404).json({
                ok: false,
                msg: "Error, no existe un usuario con ese id"
            });
        }

        await Usuario.findByIdAndDelete(uid);

        resp.status(200).json({
            ok: true,
            msg: "Usuario eliminado correctamente"
        });

    }catch (error){
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Error inesperado, intente más tarde"
        });
    }

}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}
