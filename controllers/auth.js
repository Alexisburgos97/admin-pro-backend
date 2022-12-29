const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const {generarJWT} = require("../helpers/jwt");

const login = async (req, resp = response) => {

    const {email, password} = req.body;

    try{

        const usuarioDB = await Usuario.findOne({email: email});

        if( !usuarioDB ){
            return resp.status(404).json({
                ok: false,
                msg: "Error, el email no es válido"
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);

        if( !validPassword ){
            return resp.status(400).json({
                ok: false,
                msg: "Error, la contraseña no es válida"
            });
        }

        //Generar JWT
        const token = await generarJWT(usuarioDB.id);

        resp.status(200).json({
            ok: true,
            token: token
        });

    }catch (error){
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Error inesperado, intente más tarde"
        });
    }
};

module.exports = {
    login
}
