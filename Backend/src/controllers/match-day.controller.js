'use strict'
const MatchDay = require('../models/match-day.model');
const League = require('../models/league.model');

function createMatchDay(req, res) {//Crea la jornada
    var LeagueId = req.params.LeagueId;

    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para generar las jornadas'})
    League.findById(LeagueId, (err, foundLeague) =>{
        if(err) return res.status(500).send({ message: 'Error en la petición'});
        if(!foundLeague) return res.status(500).send({ message: 'Error al encontrar la Liga'});
        
        var quantity = foundLeague.teams.length;
        var x = 2;
        var matchDayArray = [{
            number  :1,
            leagueId:LeagueId,
            match   :[],
            date    :new Date()
        }];

        for (let i = 0; i < quantity-2; i++) {

            matchDayArray.push({
                number: x,
                leagueId: LeagueId,
                match: [],
                date: new Date(Date.now())
            });
            x++;
        }
        
        MatchDay.insertMany(matchDayArray,(err, saveMatchDay)=>{
            if(err) return res.status(500).send({ message: 'Error en la petición', err });
            if(!saveMatchDay) return res.status(500).send({message: `Error al guardar la Jornada: ${x}`});
            return res.status(200).send({message: 'Se crearon las Jornadas.'});
        })
    })

}

function changeDate(req,res){
    var idMatchDay = req.params.idMatchDay
    var params = req.body

    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para cambiar la fecha.'})

    var newDate = new Date(params.date)

    if(newDate.getTime() < Date.now()) return res.status(500).send({ message: 'No puedes escoger una fecha anterior a la actual' })


    MatchDay.findByIdAndUpdate(idMatchDay, { date: newDate }, { new: true, useFindAndModify: false}, (err, editedDate) => {
        if(err) return res.status(500).send({ message: 'Error en la petición'})
        if(!editedDate) return res.status(500).send({ message: 'Error al editar la fecha' })
        return res.status(200).send({ editedDate })
    })

}

function assignTeams(req, res){
    var idMatchDay = req.params.idMatchDay
    var params = req.body
    var contOne = 0
    var contTwo = 0

    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para agregar equipos al torneo.'})

    MatchDay.findById(idMatchDay, (err, matchDayFound) => {
        if(err) return res.status(500).send({ message: 'Error en la peticióna'})
        if(!matchDayFound) return res.status(500).send({ message: 'Error al encontrar la jornada'})

        League.findById(matchDayFound.leagueId, (err, leagueFound) => {
            if(err) return res.status(500).send({ message: 'Error en la peticiónb'})
            if(!leagueFound) return res.status(500).send({ message: 'Error al encontrar la liga'})

            var quantity = leagueFound.teams.length
            var quantityT = quantity/2
            var matchs = matchDayFound.match.length
            console.log(quantity, matchs, quantityT);

            if(matchs === quantityT) return res.status(500).send({ message: 'Ya no puedes agregar mas partidos.'})

            for (let i = 0; i < matchDayFound.match.length; i++) {
                console.log(matchDayFound.match[i].teamIdOne.toString() === params.idTeamOne);
                
                if(params.idTeamOne === matchDayFound.match[i].teamIdOne.toString() || params.idTeamOne === matchDayFound.match[i].teamIdTwo.toString()){
                    contOne++
                }

                if(params.idTeamTwo === matchDayFound.match[i].teamIdOne.toString() || params.idTeamTwo === matchDayFound.match[i].teamIdTwo.toString()){
                    contTwo++
                }
                
            }
            console.log(contOne, contTwo);

            if(contOne === 1 || contTwo === 1) return res.status(500).send({ message: 'No puedes asignar dos veces en una jornada a un equipo.'})

            MatchDay.findByIdAndUpdate(idMatchDay, { $push: { match: { teamIdOne: params.idTeamOne, teamIdTwo: params.idTeamTwo, goalsTeamOne: params.goalsTeamOne, goalsTeamTwo: params.goalsTeamTwo } } }, { new: true, useFindAndModify: false}, (err, addedMatch) => {
                if(err) return res.status(500).send({ message: 'Error en la peticiónc'})
                if(!addedMatch) return res.status(500).send({ message: 'Error al guardar el partido'})
                return res.status(200).send({ addedMatch })
            } )

        })

    })


}


module.exports = {
    createMatchDay,
    changeDate,
    assignTeams
}