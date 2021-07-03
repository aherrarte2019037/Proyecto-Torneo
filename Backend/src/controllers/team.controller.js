'use strict'

const teamModel = require('../models/team.model')

const Team = require('../models/team.model')

function createTeam(req,res){
    var teamModel = new Team();
    var params = req.body;

    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: "No tienes permisos para crear un equipo."})
    
    if(params.name && params.coach){
        teamModel.name = params.name
        teamModel.coach = params.coach
        teamModel.emblem = params.emblem
    
        teamModel.save((err, teamSaved) => {
            if(err) return res.status(500).send({ message: 'Error en la petición' })
            if(!teamSaved) return res.status(500).send({ message: 'Error al guardar el equipo' })
            return res.status(200).send({ teamSaved })
        })
    }else {
        return res.status(500).send({ message: 'Faltan datos por ingresar'})
    }
}

function editTeam(req,res){
    var idTeam = req.params.idTeam
    var params = req.body

    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes permisos para editar el equipo'})
    Team.findById(idTeam, (err, teamFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición'})
        if(!teamFound) return res.status(500).send({ message: 'Equipo no encontrado'})

        Team.findByIdAndUpdate(idTeam, params, { new:true, useFindAndModify: false}, (err, editedTeam) => {
            if(err) return res.status(500).send({ message: 'Error en la petición'})
            if(!editedTeam) return res.status(500).send({ message: 'Error al editar el equipo'})
            return res.status(200).send({ editedTeam })
        })
    })
}

function getTeamID(req,res){
    var idTeam = req.params.idTeam

    Team.findById(idTeam, (err, teamFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición'})
        if(!teamFound) return res.status(500).send({ message: 'Equipo no encontrado'})
        return res.status(200).send({ teamFound })
    })
}

function deleteTeam(req,res){
    var idTeam = req.params.idTeam

    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes permisos para editar el equipo'})

    Team.findByIdAndDelete(idTeam, (err, teamDeleted) => {
        if(err) return res.status(500).send({ message: 'Error en la petición'})
        if(!teamDeleted) return res.status(500).send({ message: 'Error al eliminar el equipo'})
        return res.status(200).send({ teamDeleted })
    })
}

function addPlayer(req,res){
    var idTeam = req.params.idTeam
    var params = req.body

    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes permisos para editar el equipo'})

    Team.findById(idTeam, (err, teamFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición'})
        if(!teamFound) return res.status(500).send({ message: 'Equipo no encontrado'})

        Team.findByIdAndUpdate(idTeam, {$push: { players: { name: params.name, lastname: params.lastname, number: params.number } } }, { new: true, useFindAndModify: false}, (err, addedPlayers) => {
            if(err) return res.status(500).send({ message: 'Error en la petición'})
            if(!addedPlayers) return res.status(500).send({ message: 'Error al agregar el jugador'})
            return res.status(500).send({ addedPlayers})
        })
    })
}


module.exports = {
    createTeam,
    editTeam,
    getTeamID,
    deleteTeam,
    addPlayer
}

