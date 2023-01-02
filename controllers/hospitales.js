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

    const id = req.params.id;
    const uid = req.uid;

    try{

        const hospitalDB = await Hospital.findById(id);

        if( !hospitalDB ){
            return resp.status(404).json({
                ok: false,
                msg: "Error, no existe un hospital con ese id"
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        };

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true} );

        resp.status(200).json({
            ok: true,
            msg: "Hospital actualizado correctamente",
            hospitalActualizado: hospitalActualizado
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

    const id = req.params.id;

    try{

        const hospitalDB = await Hospital.findById(id);

        if( !hospitalDB ){
            return resp.status(404).json({
                ok: false,
                msg: "Error, no existe un hospital con ese id"
            });
        }

        await Hospital.findByIdAndDelete(id);

        resp.status(200).json({
            ok: true,
            msg: "Hospital eliminado correctamente"
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
