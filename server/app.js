const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');
// Middleware

const { FRONTEND_URL, SECOND_FRONTEND_URL, PORT, SECRET } = require('./config/ENV_VARS');

app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));


const corsOptions = {
    origin: [FRONTEND_URL,SECOND_FRONTEND_URL],
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));


// static files

app.use(express.static('public'));

// user routes

const userRouter = require('./routes/user.routes');
app.use('/api/v1/user', userRouter);


// admin routes

const adminRouter = require('./routes/admin.routes');
app.use('/api/v1/admin', adminRouter);




// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {

            return res.status(400).send({ success: false, message: 'File size exceeds the 5MB limit!' });
        }

        return res.status(400).send({ success: false, message: err.message });
    } else if (err) {
        // Handle general errors

        return res.status(400).send({ success: false, message: err.message });
    }
    next();
});



// mongodb connect 
const connect = require('./config/db');

// C:\Users\HP\Downloads
// scp -r -i "C:\Users\HP\Downloads\vogueus-services.pem" ./dist  ubuntu@ec2-13-200-32-103.ap-south-1.compute.amazonaws.com/var/www/html
// 
app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
})
