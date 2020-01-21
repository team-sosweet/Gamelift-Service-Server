const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

let Err = require('./utils/Err');
let indexRouter = require('./routes/index');

dotenv.config();
let app = express();

app.set('port', 8080);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan(':method :url , :date'))

app.use('/', indexRouter);

app.use((req, res, next) => {
    next(new Err(404, "Not Found"));
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        description: err.message || 'unknown internal server error.'
    })
})

app.listen(app.get('port'), ()=> {
    console.log(`server is listening on ${app.get('port')} port.`);
})