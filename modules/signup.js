'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const con = require('./database');
const { response } = require('express');

router.post('/', (req, res) => {
    // name emailid and password, email id should be unique
    const userName = req.body.userName;
    // const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;
    console.log(userName + userPassword)
    let signupFlag = false;

    const signupCheckQuery = "SELECT COUNT(0) AS COUNT FROM user WHERE EMAIL = '" + userName + "'";

    con.query(signupCheckQuery, function (err, result, fields) {
        if (err) throw err;

        if (result[0].COUNT > 0) {
            res.status(201).send("Email already exists.");
            console.log("Email already exists");
        } else {
            //const encryptedPassword = async(userPassword) => await bcrypt.hash(userPassword, await bcrypt.genSalt());
            const hashedPassword = bcrypt.hashSync(userPassword, 10);
            const signupQuery = "INSERT INTO user(EMAIL, PASSWORD) VALUES ('" + userName + "','" + hashedPassword + "')";
            con.query(signupQuery, function (err, result, fields) {
            
                    signupFlag = true
                    console.log("Hello")
                    res.status(200);
                    // res.status(200).json({ userID: result[0].USER_ID });
                    // res.status(200).send("Signup successful");
                    // if (signupFlag) {
                    //     const getUserIDQuery = "SELECT USER_ID FROM USER WHERE USER_EMAIL = '" + userName + "'"
                    //     con.query(getUserIDQuery, function (err, result, fields) {
                    //         if (err) {
                    //             res.status(500).send('Error');
                    //             console.log("123")
                    //         } else {
                    //             res.cookie('cookie', result[0].USER_ID, { maxAge: 900000, httpOnly: false, path: '/' });
                    //             req.session.user = result[0];

                    //         }
                    //     })
                    // }
            });
        };
    });

});

module.exports = router