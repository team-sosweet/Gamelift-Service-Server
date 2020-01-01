const express = require('express');
const uuid = require('uuid');
const Err = require('../utils/Err');
let gamelift = require('../utils/aws');

let router = express.Router();

/*
    메치메이킹 시작 API
    query parameter : ticketId, 추후: LatencyInMs
*/
router.get('/start', function(req, res, next) {
    const ticketId = req.query.ticketId;

    let params = {
        ConfigurationName: 'v1-1',
        Players: [
            {
                LatencyInMs: {
                    'ap-northeast-2': 50
                },
                PlayerAttributes: {},
                PlayerId: uuid.v4(),
                Team: 'team'
            }
        ],
        TicketId: ticketId
    };


    gamelift.startMatchmaking(params, function(err, data) {
        if (err) console.error(err, err.stack);
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
})

router.delete('/cancel', function() {

})

module.exports = router;