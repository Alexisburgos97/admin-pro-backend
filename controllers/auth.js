const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const {generarJWT} = require("../helpers/jwt");
const {googleVerify} = require("../helpers/google-verify");
const {getMenuFrontEnd} = require("../helpers/menu-frontend");

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
            token: token,
            menu: getMenuFrontEnd( usuarioDB.role )
        });

    }catch (error){
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Error inesperado, intente más tarde"
        });
    }
};

const googleSignIn = async (req, resp = response) => {

    try{

        const {email, name, picture} = await googleVerify(req.body.token);

        const usuarioDB = await Usuario.findOne({email: email});

        if( !usuarioDB ){

            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google:true
            });

        }else{

            usuario = usuarioDB;
            usuario.google = true;
            // usuario.password = '@@@';

        }

        //Guadar usuario
        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id);

        resp.status(200).json({
            ok: true,
            email: email,
            name: name,
            picture: picture,
            token: token,
            menu: getMenuFrontEnd( usuario.role )
        });

    }catch (error){
        console.log(error);
        resp.status(400).json({
            ok: false,
            msg: "Error, token de Google no es correcto"
        });
    }

};

const renewToken = async (req, resp = response) => {

    const uid = req.uid;

    //Generar JWT
    const token = await generarJWT(uid);

    //Obtener el usuario por UID
    const usuario = await Usuario.findById(uid);

    resp.status(200).json({
        ok: true,
        token: token,
        usuario: usuario,
        menu: getMenuFrontEnd( usuario.role )
    });

};

module.exports = {
    login,
    googleSignIn,
    renewToken
}
