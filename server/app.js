const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session')
// Middleware


const { SECRET, PORT,FRONTEND_URL,SECOND_FRONTEND_URL } = require('./config/ENV_VARS')
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000 * 3, // 3 hour
        httpOnly:true
    }
}));


const corsOptions = {
    origin: [FRONTEND_URL,SECOND_FRONTEND_URL],
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




// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            console.log('error in middleware size limit is high ',err.message);
            
            return res.status(400).send({ success: false, message: 'File size exceeds the 5MB limit!' });
        }
        console.log('error in middleware size limit is high ',err.message);

        return res.status(400).send({ success: false, message: err.message });
    } else if (err) {
        // Handle general errors
        console.log('error in middleware size limit is high ',err.message);

        return res.status(400).send({ success: false, message: err.message });
    }
    next();
});



// mongodb connect 
const connect = require('./config/db');



app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
})
