'use strict'
const MatchDay = require('../models/match-day.model');
const League = require('../models/league.model');
const pdf = require("html-pdf")

function createMatchDay(req, res) {//Crea la jornada
    var LeagueId = req.params.LeagueId;

    if (req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para generar las jornadas' })
    League.findById(LeagueId, (err, foundLeague) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });
        if (!foundLeague) return res.status(500).send({ message: 'Error al encontrar la Liga' });

        var quantity = foundLeague.teams.length;
        var x = 2;
        var matchDayArray = [{
            number: 1,
            leagueId: LeagueId,
            match: [],
            date: new Date()
        }];

        for (let i = 0; i < quantity - 2; i++) {

            matchDayArray.push({
                number: x,
                leagueId: LeagueId,
                match: [],
                date: new Date(Date.now())
            });
            x++;
        }

        MatchDay.insertMany(matchDayArray, (err, saveMatchDay) => {
            if (err) return res.status(500).send({ message: 'Error en la petición', err });
            if (!saveMatchDay) return res.status(500).send({ message: `Error al guardar la Jornada: ${x}` });
            return res.status(200).send(saveMatchDay);
        })
    })

}

function changeDate(req, res) {
    var idMatchDay = req.params.idMatchDay
    var params = req.body

    if (req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para cambiar la fecha.' })

    var newDate = new Date(params.date)

    if (newDate.getTime() < Date.now()) return res.status(500).send({ message: 'No puedes escoger una fecha anterior a la actual' })


    MatchDay.findByIdAndUpdate(idMatchDay, { date: newDate }, { new: true, useFindAndModify: false }, (err, editedDate) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' })
        if (!editedDate) return res.status(500).send({ message: 'Error al editar la fecha' })
        return res.status(200).send({ editedDate })
    })

}

function assignTeams(req, res) {
    var idMatchDay = req.params.idMatchDay
    var params = req.body
    var contOne = 0
    var contTwo = 0

    if (req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para agregar equipos al torneo.' })

    MatchDay.findById(idMatchDay, (err, matchDayFound) => {
        if (err) return res.status(500).send({ message: 'Error en la peticióna' })
        if (!matchDayFound) return res.status(500).send({ message: 'Error al encontrar la jornada' })

        League.findById(matchDayFound.leagueId, (err, leagueFound) => {
            if (err) return res.status(500).send({ message: 'Error en la peticiónb' })
            if (!leagueFound) return res.status(500).send({ message: 'Error al encontrar la liga' })

            var quantity = leagueFound.teams.length
            var quantityT = quantity / 2
            var matchs = matchDayFound.match.length

            if (matchs === quantityT) return res.status(500).send({ message: 'Ya no puedes agregar mas partidos.' })

            for (let i = 0; i < matchDayFound.match.length; i++) {

                if (params.idTeamOne === matchDayFound.match[i].teamIdOne.toString() || params.idTeamOne === matchDayFound.match[i].teamIdTwo.toString()) {
                    contOne++
                }

                if (params.idTeamTwo === matchDayFound.match[i].teamIdOne.toString() || params.idTeamTwo === matchDayFound.match[i].teamIdTwo.toString()) {
                    contTwo++
                }

            }

            if (contOne === 1 || contTwo === 1) return res.status(500).send({ message: 'No puedes asignar dos veces en una jornada a un equipo.' })

            var winnerId = "";
            if (params.goalsTeamOne > params.goalsTeamTwo) {
                winnerId = params.idTeamOne;
            } else {
                winnerId = params.idTeamTwo;
            }

            if (params.goalsTeamOne === params.goalsTeamTwo) {
                winnerId = "null";//es nulo por que es empate
            }

            MatchDay.findByIdAndUpdate(idMatchDay, { $push: { match: { teamIdOne: params.idTeamOne, teamIdTwo: params.idTeamTwo, goalsTeamOne: params.goalsTeamOne, goalsTeamTwo: params.goalsTeamTwo, winner: winnerId } } }, { new: true, useFindAndModify: false }, (err, addedMatch) => {
                if (err) return res.status(500).send({ message: 'Error en la petición' })
                if (!addedMatch) return res.status(500).send({ message: 'Error al guardar el partido' })
                return res.status(200).send({ addedMatch })
            })

        })

    })


}


function getResults(req, res) {
    var LeagueId = req.params.LeagueId;

    if (req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos Necesarios.' })
    League.findById(LeagueId, (err, foundLeague) => {
        MatchDay.find({ leagueId: LeagueId }).populate('leagueId ', 'name idCreator').exec((err, foundMatchDay) => {
            //return res.status(200).send({foundMatchDay});
            var resultsArray = [{
                _id: "",
                team: "",
                emblem: "",
                pts: 0,
                goalsFavor: 0,
                goalsAgainst: 0,
                goalsDifference: 0,
                matchesPlayed: 0
            }];

            for (let i = 0; i < foundLeague.teams.length; i++) {
                resultsArray.push({
                    _id: foundLeague.teams[i]._id,
                    team: foundLeague.teams[i].name,
                    emblem: foundLeague.teams[i].emblem

                })

            }

            resultsArray.shift();
            var ptsVar = 0;
            var goalsFavorVar = 0;
            var goalsAgainstVar = 0;
            var goalsDifferenceVar = 0;
            var matchesPlayedVar = 0;

            for (let i = 0; i < foundLeague.teams.length; i++) {

                ptsVar = 0;
                goalsFavorVar = 0;
                goalsAgainstVar = 0;
                goalsDifferenceVar = 0;
                matchesPlayedVar = 0;

                for (let x = 0; x < foundMatchDay.length; x++) {

                    for (let y = 0; y < foundMatchDay[x].match.length; y++) {
                        //puntos
                        if (resultsArray[i]._id == foundMatchDay[x].match[y].teamIdOne.toString() || resultsArray[i]._id == foundMatchDay[x].match[y].teamIdTwo.toString()) {

                            if (resultsArray[i]._id == foundMatchDay[x].match[y].winner.toString()) {
                                ptsVar += 3;
                            } else {
                                ptsVar += 0;
                            }

                            if (foundMatchDay[x].match[y].winner.toString() == "null") {
                                ptsVar += 1;
                            }
                        }


                        //goles a favor
                        if (resultsArray[i]._id == foundMatchDay[x].match[y].teamIdOne.toString()) {
                            goalsFavorVar += foundMatchDay[x].match[y].goalsTeamOne;
                        }
                        if (resultsArray[i]._id == foundMatchDay[x].match[y].teamIdTwo.toString()) {
                            goalsFavorVar += foundMatchDay[x].match[y].goalsTeamTwo;
                        }


                        //goles en contra
                        if (resultsArray[i]._id == foundMatchDay[x].match[y].teamIdOne.toString()) {
                            goalsAgainstVar += foundMatchDay[x].match[y].goalsTeamTwo;
                        }
                        if (resultsArray[i]._id == foundMatchDay[x].match[y].teamIdTwo.toString()) {
                            goalsAgainstVar += foundMatchDay[x].match[y].goalsTeamOne;
                        }


                        //diferencia de Goles
                        goalsDifferenceVar = (goalsFavorVar - goalsAgainstVar);
                        if (goalsDifferenceVar < 0) {
                            goalsDifferenceVar *= -1;
                        }


                        //Partidos Jugados
                        if (resultsArray[i]._id == foundMatchDay[x].match[y].teamIdOne.toString() || resultsArray[i]._id == foundMatchDay[x].match[y].teamIdTwo.toString()) {
                            matchesPlayedVar += 1;
                        }


                        resultsArray[i] = {
                            _id: foundLeague.teams[i]._id,
                            team: foundLeague.teams[i].name,
                            emblem: foundLeague.teams[i].emblem,
                            pts: ptsVar,
                            goalsFavor: goalsFavorVar,
                            goalsAgainst: goalsAgainstVar,
                            goalsDifference: goalsDifferenceVar,
                            matchesPlayed: matchesPlayedVar
                        }
                    }
                }
            }
            resultsArray.sort(function (a, b) {
                return (b.pts - a.pts);
            })
            return res.status(200).send({ resultsArray });

        })
    })

}


function createPDF(req, res) {
    var idLeague = req.params.idLeague

    if (req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos Necesarios.' })

    League.findById(idLeague).populate('idCreator', 'name lastname').exec((err, leagueFound) => {

        var contenido = '';
        var arrayG = [];
        var cabecera = `
        <style type="text/css">
        html,
        body {
            height: 100%;
        }

        body {
            margin: 0;
            background: linear-gradient(45deg, #49a09d, #5f2c82);
            font-family: sans-serif;
            font-weight: 100;
        }

        .container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        table {
            width: 800px;
            border-collapse: collapse;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        th,
        td {
            padding: 15px;
            background-color: rgba(255,255,255,0.2);
            color: #fff;
        }

        th {
            text-align: left;
        }

        thead {
            th {
                background-color: #55608f;
            }
        }

        tbody {
            tr {
                &:hover {
                    background-color: rgba(255,255,255,0.3);
                }
            }
            td {
                position: relative;
                &:hover {
                    &:before {
                        content: "";
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: -9999px;
                        bottom: -9999px;
                        background-color: rgba(255,255,255,0.2);
                        z-index: -1;
                    }
                }
            }
        }
        </style>    
            <h1>Resultados de la liga</h1><br>
            <p>Nombre: <strong>${leagueFound.name}</strong></p>
            <p>Dueño: <strong>${leagueFound.idCreator.name} ${leagueFound.idCreator.lastname}</strong><br></p>
            <img style="border-radius: 5px;"  width="250"  src="${leagueFound.emblem}">
            <table>
                <tr style="background-color: #FF5733;">
                    <th>Emblema</th>
                    <th>Equipo</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th>DG</th>
                    <th>PJ</th>
                    <th>PTS</th>
                </tr>
            <hr>
            `;
        if (err) return res.status(500).send({ mensaje: 'Error en la peticiÓn' })
        if (!leagueFound) return res.status(500).send({ mensaje: 'Error al obtener datos de la liga' })

        MatchDay.find({ leagueId: idLeague }).populate('leagueId ', 'name idCreator').exec((err, foundMatchDay) => {
            //return res.status(200).send({foundMatchDay});
            var resultsArray = [{
                _id: "",
                team: "",
                emblem: "",
                pts: 0,
                goalsFavor: 0,
                goalsAgainst: 0,
                goalsDifference: 0,
                matchesPlayed: 0
            }];

            for (let i = 0; i < leagueFound.teams.length; i++) {
                resultsArray.push({
                    _id: leagueFound.teams[i]._id,
                    team: leagueFound.teams[i].name,
                    emblem: leagueFound.teams[i].emblem

                })

            }

            resultsArray.shift();
            var ptsVar = 0;
            var goalsFavorVar = 0;
            var goalsAgainstVar = 0;
            var goalsDifferenceVar = 0;
            var matchesPlayedVar = 0;

            for (let i = 0; i < leagueFound.teams.length; i++) {

                ptsVar = 0;
                goalsFavorVar = 0;
                goalsAgainstVar = 0;
                goalsDifferenceVar = 0;
                matchesPlayedVar = 0;

                for (let x = 0; x < foundMatchDay.length; x++) {

                    for (let y = 0; y < foundMatchDay[x].match.length; y++) {
                        //puntos
                        if (resultsArray[i]._id == foundMatchDay[x].match[y].teamIdOne.toString() || resultsArray[i]._id == foundMatchDay[x].match[y].teamIdTwo.toString()) {

                            if (resultsArray[i]._id == foundMatchDay[x].match[y].winner.toString()) {
                                ptsVar += 3;
                            } else {
                                ptsVar += 0;
                            }

                            if (foundMatchDay[x].match[y].winner.toString() == "null") {
                                ptsVar += 1;
                            }
                        }


                        //goles a favor
                        if (resultsArray[i]._id == foundMatchDay[x].match[y].teamIdOne.toString()) {
                            goalsFavorVar += foundMatchDay[x].match[y].goalsTeamOne;
                        }
                        if (resultsArray[i]._id == foundMatchDay[x].match[y].teamIdTwo.toString()) {
                            goalsFavorVar += foundMatchDay[x].match[y].goalsTeamTwo;
                        }


                        //goles en contra
                        if (resultsArray[i]._id == foundMatchDay[x].match[y].teamIdOne.toString()) {
                            goalsAgainstVar += foundMatchDay[x].match[y].goalsTeamTwo;
                        }
                        if (resultsArray[i]._id == foundMatchDay[x].match[y].teamIdTwo.toString()) {
                            goalsAgainstVar += foundMatchDay[x].match[y].goalsTeamOne;
                        }


                        //diferencia de Goles
                        goalsDifferenceVar = (goalsFavorVar - goalsAgainstVar);
                        if (goalsDifferenceVar < 0) {
                            goalsDifferenceVar *= -1;
                        }


                        //Partidos Jugados
                        if (resultsArray[i]._id == foundMatchDay[x].match[y].teamIdOne.toString() || resultsArray[i]._id == foundMatchDay[x].match[y].teamIdTwo.toString()) {
                            matchesPlayedVar += 1;
                        }


                        resultsArray[i] = {
                            _id: leagueFound.teams[i]._id,
                            team: leagueFound.teams[i].name,
                            emblem: leagueFound.teams[i].emblem,
                            pts: ptsVar,
                            goalsFavor: goalsFavorVar,
                            goalsAgainst: goalsAgainstVar,
                            goalsDifference: goalsDifferenceVar,
                            matchesPlayed: matchesPlayedVar
                        }
                    }
                }
            }
            resultsArray.sort(function (a, b) {
                return (b.pts - a.pts);
            })

            for (var i = 0; i < resultsArray.length; i++) {
                arrayG[i] = `
                    <tr>
                        <td><img style="border-radius: 5px;"  width="10"  src="${resultsArray[i].emblem}"></td>
                        <td>${resultsArray[i].team}</td>
                        <td>${resultsArray[i].goalsFavor}</td>
                        <td>${resultsArray[i].goalsAgainst}</td>
                        <td>${resultsArray[i].goalsDifference}</td>
                        <td>${resultsArray[i].matchesPlayed}</td>
                        <td>${resultsArray[i].pts}</td>
                    </tr>
                `;
                contenido += arrayG[i]
            }
            contenido = cabecera + contenido + `</table>`
            pdf.create(contenido).toFile(`${leagueFound.name}.pdf`, (err, pdfCreado) => {
                if (err) return res.status(500).send({ err })
                return res.status(200).send({ pdfCreado })
            })
        })
    })
}


module.exports = {
    createMatchDay,
    changeDate,
    assignTeams,
    getResults,
    createPDF
}