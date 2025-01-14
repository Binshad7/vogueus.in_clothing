const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session')

// Middleware

const { PORT,SECRET } = require('./config/ENV_VARS');

app.use(session({
    secret:SECRET,
    resave:true,
    saveUninitialized:true
}))


const corsOptions = {  
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
 }
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(express.static('public'));


// Routes
// user

const userRouter = require('./routes/user.routes');
app.use('/api/v1/user', userRouter);


// admin

const adminRouter = require('./routes/admin.routes');
app.use('/api/v1/admin', adminRouter);



const connect = require('./config/db');



app.listen(PORT,()=>{
    connect();
    console.log(`Server is running on port ${PORT}`);
})
