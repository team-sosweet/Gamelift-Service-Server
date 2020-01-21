const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../utils/swagger');

let matchRouter = require('./match');
let latencyRouter = require('./latency');
let sessionRouter = require('./session');

let router = express.Router();

router.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.use('/match', matchRouter);
router.use('/latency', latencyRouter);
router.use('/session', sessionRouter);
router.get('/ping', (req, res) => {
  res.status(200).json({description: "ping test success."});
})

/** 
 * @swagger
 * tags:
 *  -   name: match
 *      description: matchmaking APIs
 *  -   name: latency(deprecated)
 *      description: checking latency APIs
 *  -   name: ping
 *      description: server ping test
*/

/**
 * @swagger
 * /match/start:
 *  get:
 *      summary: 매치메이킹 시작 요청 및 매치메이킹 성공 시 까지 대기
 *      tags: [match]
 *      parameters:
 *          - in: query
 *            name: ticketId
 *            required: true
 *            type: string
 *          - in: query
 *            name: LatencyInMs
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: 매치메이킹 성공
 *              schema:
 *                  type: object
 *                  properties:
 *                      Address:
 *                        type: string
 *                        example: 52.79.248.26:7777
 *                      PlayerId:
 *                        type: string
 *                        example: 62d9fae6-f51e-4125-9e3b-742d40939ea7
 *                      PlayerSessionId:
 *                        type: string
 *                        example: psess-1baa0bac-88f7-42b5-9971-15373ae8f5f8
 *                                      
 *          403:    
 *              description: TIMED_OUT or FAILED or CANCELLED
 *              schema:
 *                  type: object
 *                  properties:
 *                      description:
 *                          type: string
 *                          example: TIMED_OUT
 * 
 * /match/cancel:
 *  delete:
 *      summary: 매치메이킹 취소 요청(매치메이킹 진행 중에만 가능)
 *      tags: [match]
 *      parameters:
 *          - in: query
 *            name: ticketId
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: 매치메이킹 취소 성공
 *              schema:
 *                  type: object
 *                  properties:
 *                      description:
 *                          type: string
 *                          example: match canceled successfully.
 *          400:
 *              description: 매치메이킹 취소 실패
 *              schema:
 *                  type: object
 *                  properties:
 *                      description:
 *                          type: string
 *                          example: Matchmaking ticket is in TIMED_OUT status and cannot be canceled.
 */

/**
 * @swagger
 * /latency/start:
 *  get:
 *      summary: latency 측정 시작
 *      tags: [latency(deprecated)]
 *      parameters: 
 *          - in: query
 *            name: id
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              schema:
 *                  type: object
 *                  properties:
 *                      description:
 *                          type: string
 *                          example: latency checking started.
 * 
 * /latency/end:
 *  get:
 *      summary: latency 측정 완료
 *      tags: [latency(deprecated)]
 *      parameters:
 *          - in: query
 *            name: id
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: 측정 완료된 latecy 값 (측정 완료 시각 - 측정 시작 시각, millisecond)
 *              schema:
 *                  type: object
 *                  properties:
 *                      latency:
 *                          type: integer
 */

 /** 
  * @swagger
  * /ping:
  *  get:
  *     summary: 서버 ping 테스트
  *     tags: [ping]
  *     responses:
  *         200:
  *             description: ping test 성공
  *             schema:
  *                 type: object
  *                 properties:
  *                     description:
  *                         type: string
  *                         example: ping test success.
  */
module.exports = router;