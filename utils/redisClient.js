const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

let client = redis.createClient(process.env.redisPort, process.env.redisHost);

client.auth(process.env.redisPassword);

module.exports = client;