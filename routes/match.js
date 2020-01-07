const express = require('express');
const uuid = require('uuid');
const Err = require('../utils/Err');
let gamelift = require('../utils/aws');

let router = express.Router();

/*
    매치메이킹 시작 API
    query parameter : ticketId, 추후: LatencyInMs
*/
router.get('/start', function(req, res, next) {
    const ticketId = req.query.ticketId;
    const LatencyInMs = Number.parseInt(req.query.LatencyInMs);

    let searchParams = {
        AliasId: 'alias-41f04e45-e6d5-421f-ae51-f4165685f18f',
        FilterExpression: 'hasAvailablePlayerSessions= true',
        Limit: 1,
        SortExpression: 'hasAvailablePlayerSessions ASC'
    }

    let matchParams = {
        ConfigurationName: 'v1-1',
        Players: [
            {
                LatencyInMs: {
                    'ap-northeast-2': LatencyInMs,
                },
                PlayerAttributes: {},
                PlayerId: uuid.v4(),
                Team: 'team'
            }
        ],
        TicketId: ticketId
    };

    gamelift.searchGameSessions(searchParams, function(err, data) {
        if (err) next(new Err(err.statusCode, err.message));
        else {
            console.log(data);
            const sessions = data.GameSessions.length;
            if(sessions) {
                res.status(200).json({
                    IpAddress: data.GameSessions[0].IpAddress,
                    Port: data.GameSessions[0].Port
                })
            } else {
                gamelift.startMatchmaking(matchParams, function(err, data) {
                    if (err) next(new Err(err.statusCode, err.message));
                    else {
                        console.log(data);
                        let describe = setInterval(function test() {
                            gamelift.describeMatchmaking({TicketIds: [ticketId]}, function(err, data) {
                                if (err) console.error(err, err.stack);
                                else {
                                    let status = data.TicketList[0].Status;
                                    
                                    if(status === "TIMED_OUT" || status === "FAILED" || status === "CANCELLED") {
                                        clearInterval(describe);
                                        next(new Err(403, status));
                                    }
                                    
                                    if(status === "COMPLETED")  {
                                        clearInterval(describe);
                                        res.json(data);
                                    }
                                }
                            });
                            return test;
                        }(), 10000);
                    }
                })
            }
        }
    })
})

/*
    매치메이킹 취소 API
    queryParameter : ticketId
*/ 
router.delete('/cancel', function(req, res, next) {
    const ticketId = req.query.ticketId;

    gamelift.stopMatchmaking({TicketId: ticketId}, function(err, data) {
        if (err) next(new Err(err.statusCode, err.message));
        else res.status(200).json({description: "match canceled successfully."})
    })
})

module.exports = router;