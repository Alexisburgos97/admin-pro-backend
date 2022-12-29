const jwt = require('jsonwebtoken');

const { response } = require('express');
const {validationResult} = require("express-validator");

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

module.exports = {
    validarJWT
}
