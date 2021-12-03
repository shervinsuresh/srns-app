// 'use strict';
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const con = require('./database');

// router.post('/login', (req, res) => {
//     var userEmail = req.body.userName;
//     var userPassword = req.body.userPassword;

//     const loginCheckQuery = "SELECT COUNT(0) AS COUNT FROM USERS WHERE USER_EMAIL = '" + userEmail + "'";
//     con.query(loginCheckQuery, function (err, result, fields) {
//         if (err) {
//             res.status(400).send("Error");
//         } else {
//             if (result[0].COUNT == 1) {
//                 const loginQuery = "SELECT * FROM USERS WHERE USER_EMAIL = '" + userEmail + "'";
//                 con.query(loginQuery, function (err, result, fields) {
//                     if (err) {
//                         res.status(400).send("Error");
//                     } else {
//                         const userDBPassword = result[0].USER_PASSWORD;
//                         const userID = result[0].USER_ID;

//                         let passCheck = bcrypt.compareSync(userPassword, userDBPassword)
//                         if (passCheck) {
//                             req.session.user = result[0];
//                             console.log("login success");
//                             res.status(200).json({
//                                 userID: result[0].USER_ID,
//                                 userName: result[0].USER_NAME
//                             });

//                         } else {
//                             res.status(201).send("Login Failed");
//                             console.log("login failed");
//                         }
//                     }
//                 });

//             } else {
//                 res.status(201).send("Invalid Credentials");
//                 console.log("Invalid Credentials");
//             }
//         }
//     });
// });

// module.exports = router