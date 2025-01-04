const express = require('express');
const admin_router = express.Router();

const { adminLogin,adminLogout } = require('../controllers/admin.controller');
// auth routes
admin_router.post('/login',adminLogin)
admin_router.get('/logout',adminLogout);

admin_router.get('/demo',(req,res)=>{
    console.log("hit admin demo");
     res.send("hit admin demo");
});



module.exports = admin_router;