const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session')
// Middleware


const { SECRET, PORT } = require('./config/ENV_VARS')
app.use(session({
    secret: SECRET,
    resave: true,
    saveUninitialized: true
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




// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send({ error: 'File size exceeds the 5MB limit!' });
        }
        return res.status(400).send({ error: err.message });
    } else if (err) {
        // Handle general errors
        return res.status(400).send({ error: err.message });
    }
    next();
});


// mongodb connect 
const connect = require('./config/db');



app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
})
