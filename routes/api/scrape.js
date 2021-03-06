const router = require("express").Router();
const cheerio = require("cheerio");
const axios = require('axios')

router
    .get("/topBets", (req,res,next)=> {   
        axios.get("http://www.vegasinsider.com/top-betting-trends/").then(function(response) {  
            const $ = cheerio.load(response.data);
            const topBetsTableData = $("td.viCellBg1, td.viCellBg2")
            const results = [];
            topBetsTableData.each(function(i, element) {
                const data = $(this).text()
                results.push(data);
            })
            const bets = []
            for (let i = 0; i < results.length; i += 8) {
                let key = results[i + 2] + results[i + 3] + results[i + 4];
                key = key.split(" ");
                key = key.join("");
                key = key.split(".");
                key = key.join("");
                const bet = {
                    rank: results[i],
                    league: results[i + 1],
                    rotation: results[i + 2],
                    team: results[i + 3],
                    type: results[i + 4],
                    lvhCurrentLine: results[i + 7],
                    key: key
                }
                bets.push(bet)
            }
            res.send(bets)
        })
    })
    .get("/mlb/:day", function(req,res) {
        const day = req.params.day
        const games = [];
        axios.get("http://www.vegasinsider.com/mlb/scoreboard/scores.cfm/game_date/" + day).then(function(response) {
            const $ = cheerio.load(response.data);
            const gameTable = $("tbody")
            const oddsInfo = [];
            gameTable.each(function(i, element) {
                const row = $(this).children("tr.tanBg")
                row.each(function(i, element) {
                    const teamData = {
                        team: $(this).children("td.sportPicksBorderL2, td.sportPicksBorderL").children("b").children("a.black").text(),
                    }
                    const data = [];
                    const stat = $(this).children("td.sportPicksBorderL2, td.sportPicksBorderL")
                    stat.each(function(i, element) {
                        const info = $(this).text()
                        switch (info) {
                            case "" :
                                break;
                            default:
                                data.push(info)
                                break;
                        }     
                    })
                    teamData.moneyLine = data[2];
                    teamData.overUnder = data[3];
                    oddsInfo.push(teamData);
                })
            })
            for (i = 0; i < oddsInfo.length; i+=2) {
                const currentDate = req.params.day
                let key = currentDate + oddsInfo[i].team + "vs" + oddsInfo[i + 1].team;
                key = key.split(" ")
                key = key.join("")
                key = key.split(".")
                key = key.join("")
                games.push({
                    team1: oddsInfo[i],
                    team2: oddsInfo[i + 1],
                    key: key
                })
            }
            res.send(games)
        })
    })
    .get("/seasonOdds/:league", function(req,res,next) {
        axios.get("http://www.vegasinsider.com/" + req.params.league + "/odds/futures/").then(function(response) {
            const $ = cheerio.load(response.data);
            const descriptions = $("div.viHeaderNorm")
            let oddsInfo = [];
            descriptions.each(function(i, element) {
                switch (i) {
                    case 0:
                        oddsInfo.push($(this).text());
                        break;
                    default:
                        break;
                }    
            })
            const teamRows = $("table.table-wrapper").children("tbody").children("tr.viCellBg1, tr.viCellBg2")
            teamRows.each(function(i, element) {
                if (i <= 31) {
                    let key = $(this).children("td.font-bold").text() + oddsInfo[0];
                    key = key.split(" ");
                    key = key.join("");
                    key = key.split(".");
                    key = key.join("");
                    key= key.slice(0, key.length - 8)
                    const team = {
                        name: $(this).children("td.font-bold").text(),
                        odds: $(this).children("td.last").text(),
                        key: key
                    }
                    oddsInfo.push(team);
                }  
            })
            res.send(oddsInfo)
        })
    })

module.exports = router;