const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Medico = require('../models/medico');

const {generarJWT} = require("../helpers/jwt");
const Hospital = require("../models/hospital");

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

const getMedicoById = async (req, resp = response) => {

    const id = req.params.id;

    try{

        const medico = await Medico.findById(id)
            .populate('usuario', 'nombre email img')
            .populate('hospital', 'nombre img');

        resp.status(200).json({
            ok: true,
            msg: "Get medico",
            medico: medico
        });

    }catch (error){
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Error inesperado, intente más tarde"
        });
    }


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

    const id = req.params.id;
    const uid = req.uid;

    try{

        const medicoDB = await Medico.findById(id);

        if( !medicoDB ){
            return resp.status(404).json({
                ok: false,
                msg: "Error, no existe un medico con ese id"
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        };

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true} );

        resp.status(200).json({
            ok: true,
            msg: "Medico actualizado correctamente",
            medicoActualizado: medicoActualizado
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

    const id = req.params.id;

    try{

        const medicoDB = await Medico.findById(id);

        if( !medicoDB ){
            return resp.status(404).json({
                ok: false,
                msg: "Error, no existe un medico con ese id"
            });
        }

        await Medico.findByIdAndDelete(id);

        resp.status(200).json({
            ok: true,
            msg: "Medico eliminado correctamente"
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
    getMedicoById,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}
