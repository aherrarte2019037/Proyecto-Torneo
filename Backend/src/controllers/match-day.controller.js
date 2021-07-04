'use strict'
const { Model, model } = require('mongoose');
const MatchDay = require('../models/match-day.model');
const League = require('../models/league.model');

function createMatchDay(req, res) {//Crea la jornada
    var LeagueId = req.params.LeagueId;
    var modelMatchDay = new MatchDay();

    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para agregar equipos a esta liga.'})
    League.findById(LeagueId, (err, foundLeague) =>{
        if(err) return res.status(500).send({ message: 'Error en la petición'});
        if(!foundLeague) return res.status(500).send({ message: 'Error al encontrar la Liga'});
        
        var quantity = foundLeague.teams.length;
        var x = 1;
        
        for (let i = 0; i < quantity-1; i++) {
            modelMatchDay[i].number = x;
            modelMatchDay[i].leagueId = LeagueId;
            modelMatchDay[i].match = [];
            modelMatchDay[i].date = "";
            modelMatchDay[i].save((err, saveMatchDay)=>{
                if(err) return res.status(500).send({ message: 'Error en la petición' });
                if(!saveMatchDay) return res.status(500).send({message: `Error al guardar la Jornada: ${x}`});
            })
            x++;
        }
        console.log(quantity, x);
        return res.status(200).send({message: 'Se crearon las Jornadas.'});
    })

}


module.exports = {
    createMatchDay
}