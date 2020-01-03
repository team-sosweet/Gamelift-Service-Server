const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../utils/swagger');

let matchRouter = require('./match');
let latencyRouter = require('./latency');

let router = express.Router();

router.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.use('/match', matchRouter);
router.use('/latency', latencyRouter);

/** 
 * @swagger
 * tags:
 *  -   name: match
 *      description: matchmaking APIs
 *  -   name: latency
 *      description: checking latency APIs
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
 *                      MatchmakingTicket:
 *                          type: object
 *                          properties:
 *                              TicketId: 
 *                                  type: string
 *                              ConfigurationName:
 *                                  type: string
 *                              ConfigurationArn:
 *                                  type: string
 *                              Status:
 *                                  type: string
 *                                  example: COMPLETED
 *                              StatusReason:
 *                                  type: string
 *                              StatusMessage:
 *                                  type: string
 *                              StartTime: 
 *                                  type: string
 *                                  format: date-time
 *                              EndTime:
 *                                  type: string
 *                                  format: date-time
 *                              Players:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          PlayerId:
 *                                              type: string
 *                                          PlayerAttributes:
 *                                              type: object
 *                                          Team:       
 *                                              type: string
 *                                          LatencyInMs:
 *                                              type: object
 *                              GameSessionConnectionInfo:
 *                                  type: object
 *                                  properties:
 *                                      GameSessionArn: 
 *                                          type: string
 *                                      IpAddress:
 *                                          type: string
 *                                      DnsName:
 *                                          type: string
 *                                      Port:
 *                                          type: integer
 *                                      MatchedPlayerSessions:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  PlayerId: string
 *                                                  PlayerSessionId: string
 *                              EstimatedWaitTime:
 *                                  type: integer
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
 *      tags: [latency]
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
 *      tags: [latency]
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

module.exports = router;