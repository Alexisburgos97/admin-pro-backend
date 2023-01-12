const jwt = require('jsonwebtoken');

const { response } = require('express');
const {validationResult} = require("express-validator");

const Usuario = require('../models/usuario');

const validarJWT = (req, resp = response, next) => {

    const token = req.header('x-token');

    if( !token ){
        return resp.status(401).json({
            ok: false,
            msg: 'Error, no existe token'
        });
    }

    try{

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;

    }catch (error){
        return resp.status(401).json({
            ok: false,
            msg: 'Error, token no válido'
        });
    }

    next();
}

const validarADMIN_ROLE = async ( req, resp, next ) => {

    const uid = req.uid;

    try{

        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ){
            return resp.status(401).json({
                ok: false,
                msg: 'Error, usuario no existe'
            });
        }

        if( usuarioDB.role !== 'ADMIN_ROLE' ){
            return resp.status(403).json({
                ok: false,
                msg: 'Error, no tiene autorización'
            });
        }

    }catch (error){
        return resp.status(401).json({
            ok: false,
            msg: 'Error, intente más tarde'
        });
    }

}

const validarADMIN_ROLE_o_MismoUsuario = async ( req, resp, next ) => {

    const uid = req.uid;
    const id = req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ){
            return resp.status(401).json({
                ok: false,
                msg: 'Error, usuario no existe'
            });
        }

        if( usuarioDB.role === 'ADMIN_ROLE' && uid === id ){

            next();

        }else{
            return resp.status(403).json({
                ok: false,
                msg: 'Error, no tiene autorización'
            });
        }

    }catch (error){
        return resp.status(401).json({
            ok: false,
            msg: 'Error, intente más tarde'
        });
    }

}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}
