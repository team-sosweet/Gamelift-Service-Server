const express = require('express');
const uuid = require('uuid');
const Err = require('../utils/Err');

let gamelift = require('../utils/aws');
let router = express.Router();

router.get('/create', async function(req, res, next) {
    try {
        let AliasId = req.query.AliasId;
        if(AliasId == undefined) next(new Err(400, 'Api required AliasId'));
        else {
            let sessions = await searchGameSessions(AliasId).catch(next);
            if(sessions == undefined || sessions == null) throw new Err(403, 'OUTDATED');
            else {
                if(sessions.GameSessions.length) {
                    let data = await createPlayerSession(sessions[0]).catch(next);
                    console.log(sessions[0]);
                    let playerInfo = data.PlayerSession;
                    res.json({
                        Address: `${playerInfo.IpAddress}:${playerInfo.Port}`,
                        PlayerId: playerInfo.PlayerId,
                        playerSessionId: playerInfo.PlayerSessionId
                    })
                } else {
                    console.log('nothing');
                    let gameSession = await createGameSession(AliasId).catch(next);
                    console.log(gameSession);
                    if(gameSession) {
                        setTimeout(
                            async function() {
                                let data = await createPlayerSession(gameSession.GameSession).catch(next);  
                                let playerInfo = data.PlayerSession;
                                res.json({
                                    Address: `${playerInfo.IpAddress}:${playerInfo.Port}`,
                                    PlayerId: playerInfo.PlayerId,
                                    playerSessionId: playerInfo.PlayerSessionId
                                })
                            },3000);
                    }
                }
            }
        }
    } catch (err) {
        next(err);
    }
});

function searchGameSessions(AliasId, next) {
    let searchParams = {
        AliasId: AliasId,
        FilterExpression: 'hasAvailablePlayerSessions= true',
        Limit: 1,
        SortExpression: 'hasAvailablePlayerSessions ASC'
    };

    return new Promise(function(resolve, reject) {
        gamelift.searchGameSessions(searchParams, function(err, data) {
            if(err) reject(err);
            else resolve(data);
        });
    })
}

function createGameSession(AliasId, next) {
    let createParams = {
        MaximumPlayerSessionCount: 6,
        AliasId: AliasId,
    }

    return new Promise(function(resolve, reject) {
        gamelift.createGameSession(createParams, function(err, data) {
            if(err) reject(err);
            resolve(data);
        })
    })
}

function createPlayerSession(gameSession, next) {
    let createParams = {
        GameSessionId: gameSession.GameSessionId,
        PlayerId: uuid.v4(),
    }

    return new Promise(function(resolve, reject) {
        gamelift.createPlayerSession(createParams, function(err, data) {
            if(err) reject(err);
            resolve(data);
        })
    })
}

module.exports = router;