const swaggerJsDoc = require('swagger-jsdoc');

// Swagger definition
var swaggerDefinition = {
    info: {
        title: 'Saucewich Service Server',
        version: '1.1.0',
        description: 'Saucewich Service Server API Document'
    },
    host: 'localhost:3000',
    basePath: '/',
}

var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./routes/index.js'],
}

var swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;