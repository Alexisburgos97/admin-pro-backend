const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Hospital = require('../models/hospital');

const {generarJWT} = require("../helpers/jwt");

const getHospitales = async (req, resp = response) => {

    const hospitales = await Hospital.find().populate('usuario', 'nombre email img');

    resp.status(200).json({
        ok: true,
        msg: "Get hospitales",
        hospitales: hospitales,
        uid: req.uid
    });
};

const crearHospital = async (req, resp = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try{

        const hospitalDB = await hospital.save();

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
            msg: "Hospital creado correctamente",
            hospital: hospitalDB
        });

    }catch (error){
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Error inesperado, intente más tarde"
        });
    }
}

const actualizarHospital = async (req, resp = response) => {

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

const eliminarHospital = async (req, resp = response) => {

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
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}
