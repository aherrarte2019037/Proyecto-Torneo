'use strict';

const userModel = require('../models/user.model')

const User = require('../models/user.model')
const bcrypt = require("bcrypt-nodejs")
const jwt = require('../services/user.jwt')

function createAdmin(req,res){
    var userModel = new User()
    var username = "ADMIN"
    var pass = "deportes123"
    var rol = "ROL_ADMIN"
    var email = "admin@email.com"

    if(username === "ADMIN" && pass === "deportes123" && rol === "ROL_ADMIN" && email === 'admin@email.com'){
        userModel.username = username
        userModel.password = pass
        userModel.rol = rol
        userModel.email = email
        userModel.image = null;
        userModel.name = 'Angel';
        userModel.lastname = 'Herrarte'

        User.find( { $or: [
            { username: userModel.username }
        ] } ).exec((err, userFound) => {
            if(err) return console.log("Error in the request")

            if(userFound && userFound.length >= 1){
                console.log(`User ${userModel.username} already exists`)
            }else {
                bcrypt.hash(pass, null, null, (err, passEncrypted) =>{
                    userModel.password = passEncrypted

                    userModel.save((err, userSaved) =>{
                        if(err) return console.log('Error saving user')
                        if(userSaved){
                            //console.log(userSaved)
                        }else {
                            return console.log('Register failed')
                        }
                    })
                })
            }
        })
    }
}

function login(req,res){
    var params = req.body

    User.findOne( { username: params.username }, (err, userFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición' })
        
        if(userFound){
            bcrypt.compare(params.password, userFound.password, (err, passCorrect) =>{
                if(passCorrect){
                    if(params.getToken === true){
                        userFound.password = undefined;
                        userFound.__v = undefined;
                        return res.status(200).send({ token: jwt.createToken(userFound), userFound: userFound })
                    }else {
                        userFound.password = undefined
                        return res.status(200).send({ userFound })
                    }
                }else {
                    return res.status(404).send({ mensaje: 'Credenciales incorrectas' })
                }
            })
        }else {
            return res.status(404).send({ mensaje: 'Usuario no registrado' })
        }
    } )
}

function registerUser(req,res){
    var userModel = new User()
    var params = req.body

    delete params.rol

    if(params.name && params.lastname && params.username && params.email && params.password){
        userModel.name = params.name
        userModel.lastname = params.lastname
        userModel.username = params.username
        userModel.email = params.email
        userModel.password = params.password
        userModel.rol = 'ROL_USER'
        userModel.image = params.img

        User.find( { $or:[
            { username: userModel.username },
            { email: userModel.email }
        ] } ).exec((err, userFound ) => {
            if(err) res.status(500).send({ message: 'Error in the request' })

            if(userFound && userFound.length >= 1){
                return res.status(500).send({ message: 'El usuario ya existe' })
            }else {
                bcrypt.hash(params.password, null, null, (err, passEncrypted) => {
                    userModel.password = passEncrypted
                    userModel.save((err, userSaved) => {
                        if(err) return res.status(500).send({ message: 'Error al guardar el usuario' })

                        if(userSaved){
                            res.status(200).send(userSaved)
                        }else {
                            res.status(404).send({ message: 'No se ha podido guardar el usuario' })
                        }
                    })
                })
            }
        })

    }else {
        return res.status(500).send({ message: 'Faltan datos por ingresar' })
    }

}

function editUser(req,res){
    var idUser = req.params.idUser
    var params = req.body

    delete params.password
    delete params.rol

    User.find({ $or: [
        { username: params.username },
        { email: params.email }
    ] }).exec(( err, userFound ) => {
        if(userFound.rol === 'ROL_ADMIN' ) return res.status(500).send({ message: 'No puedes editar esta cuenta' })
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(userFound && userFound.length >= 1){
            return res.status(500).send({ message: 'El usuario ya existe' })

        }else {
            User.findByIdAndUpdate(idUser, params, {new: true, useFindAndModify: false}, (err, editedUser) => {
                if(err) return res.status(500).send({ message: 'Error in the request' })
                if(!editedUser) return res.status(500).send({ message: 'No se ha podido encontrar el usuario' })
                editedUser.password = undefined;
                editedUser.__v = undefined;
                return res.status(200).send( editedUser )
            })
        }
    } )
}

function getUserID(req,res){
    var idUser = req.params.idUser;

    User.findById(idUser, (err, userFound) => {
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(!userFound) return res.status(500).send({ message: 'No se encontró el usuario' })
        userFound.__v = undefined;
        userFound.password = undefined;
        return res.status(200).send( userFound )
    })
}

function deleteUser(req,res){
    var idUser = req.params.idUser

    User.findByIdAndDelete(idUser, (err, userDeleted) => {
        if(userDeleted.rol === 'ROL_ADMIN' ) return res.status(500).send({ message: 'No puedes editar la cuenta' })
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(!userDeleted) return res.status(500).send({ message: 'Error al eliminar el usuario' })

        return res.status(200).send({ userDeleted })
    })

}

async function uploadProfileImage( req, res ) {
    const fileExtensions = ['png', 'jpg', 'gif', 'jpeg' ];
    if( !req.files ) return res.status(400).send({ fileUploaded: false, error: 'No file found' });
    if( !req.params.id ) return res.status(400).send({ fileUploaded: false, error: 'Missing data' });

    const user = req.params.id;
    const file = req.files?.files;
    const type = file.mimetype.split('/')[1];
    const filename = `profileImg${user}.${type}`
    if( !fileExtensions.includes(type) ) return res.status(400).send({ fileUploaded: false, error: 'Invalid file extension', extension: type, availableExtensions: fileExtensions });

    try {
        await file.mv( `uploads/${filename}` );
        await User.findByIdAndUpdate( user, { image: filename } );
        res.status(200).send({ fileUploaded: true, filename: `${filename}` });

    } catch (error) {
        res.status(400).send({ fileUploaded: false, error: error });
    }
}

async function getProfileImage( req, res ) {
    const id = req.params.id;
    res.download(`uploads/${id}`, (error) => {
        if( error ) return res.status(404).send({ error: error });
    })
}

module.exports = {
    createAdmin,
    login,
    registerUser,
    editUser,
    getUserID,
    deleteUser,
    uploadProfileImage,
    getProfileImage
}