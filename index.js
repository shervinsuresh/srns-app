'use strict'
// import the require dependencies
//import express from 'express';
//import bcrypt from 'bcrypt'
const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3001
//import path from 'path';

app.set('view engine', 'ejs');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


app.use(session({
    secret: 'airline',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Sess : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Doubt, might have to remove later

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

const con = require('./modules/database')
const signup = require('./modules/signup')
const login = require('./modules/login')

// app.use('/login', login)
// app.use('/signup', signup)


console.log("Hello");

app.use(express.static("build"));
//app.use(express.static("public"));

app.listen(PORT);
console.log("Server Listening on port " + PORT);

app.post("/signup", function (req, res) {
    console.log(req.body);
    const email = req.body.email;
    // const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;
    const salt = bcrypt.genSaltSync(10);
    const encryptedpassword = bcrypt.hashSync(userPassword, salt);

    const name = req.body.name;
    const userName = req.body.userName;
    const phoneNumber = req.body.phoneNumber;

    con.query(
      "SELECT * FROM  user WHERE EMAIL=?",
      [email],
      (err, result) => {
        if(result.length == 0){
  
    con.query(
      "INSERT INTO user(EMAIL, PASSWORD, NAME, USERNAME, PHONENUMBER) VALUES (?,?,?,?,?)",
      [email, encryptedpassword, name, userName, phoneNumber],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            console.log("User already present!!");
            res.status(201).json({ message: "User already exists!" });
          }
        } else {
          const user = { username: req.body.username, password: req.body.password };
          req.session.user = user;
          res.status(200).json({ name: req.body.name, email: req.body.email });
        }
      }
    );
        }
        else{
          res.status(201).json({result});
        }
      })
  });

  app.post("/login", function (req, res) {
    const email = req.body.email;
    console.log(req.body.password)
  
    con.query(
      "SELECT * FROM  user WHERE EMAIL=?",
      [email],
      (err, result) => {
        if (result) {
          if (result.length) {
            bcrypt.compare(
              req.body.password,
              result[0].password,
              (err, results) => {
                console.log(result[0].password);
                console.log(results);
                if (results) {
                  let user = {
                    username: req.body.email,
                    password: req.body.password,
                  };
                  req.session.user = user;
                  console.log(results);
                  res.status(200).json({ result });
                  res.end("Successful Login");
                } else {
                  res.status(201).json({ message: "Invalid Password!" });
                }
              }
            );
          } else if (result.length === 0) {
            res.status(201).json({ message: "Invalid credentials!" });
          }
        }
      }
    );
  });

  app.post("/customerportaldata", function(req, res){
      const customerid = req.body.customerid;
      con.query(
          "SELECT * FROM user WHERE iduser =?",
          [customerid],
          (err, result)=>{
              if(result){
                  console.log(result);
                  res.status(200).json({ result });
                  
              }
          }
      )
  })

  app.post("/adminlogin", function (req, res) {
    const email = req.body.email;
    console.log(req.body.password)
  
    con.query(
      "SELECT * FROM  adminlogin WHERE username=?",
      [email],
      (err, result) => {
        if (result) {
          if (result.length) {
            console.log(result[0].password)
            if(req.body.password.normalize() === result[0].password.normalize()){
                console.log("200");
                res.status(200).json({ result });

            }
          } else if (result.length === 0) {
            res.status(201).json({ message: "Invalid credentials!" });
          }
        }
      }
    );
  });

  app.post("/adminAdd", function (req, res) {
    // console.log(req.body);
    const flightNumber= req.body.flightNumber;
    const capacity= req.body.capacity;
    const price= req.body.price;
    const distance= req.body.distance;
    const arrivalAirport= req.body.arrivalAirport;
    const arrivalCity= req.body.arrivalCity;
    const arrivalDate= req.body.arrivalDate;
    const arrivalTime= req.body.arrivalTime;
    const departureAirport= req.body.departureAirport;
    const departureCity= req.body.departureCity;
    const departureDate= req.body.departureDate;
    const departureTime= req.body.departureTime;

    con.query("SELECT * FROM  AvailableFlights WHERE flightNumber=?",
    [flightNumber],
    (err,result)=>{
      console.log(result.length)
      if(result.length == 0){

        
        con.query(
          "INSERT INTO AvailableFlights(flightNumber, capacity, price, distance, arrivalAirport, arrivalCity, arrivalDate, arrivalTime, departureAirport, departureCity, departureDate, departureTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
          [flightNumber,capacity,price,distance,arrivalAirport,arrivalCity,arrivalDate,arrivalTime,departureAirport,departureCity,departureDate,departureTime],
          (err, result) => {
            if (err) {
              // if (err.code === "ER_DUP_ENTRY") {
              //   console.log("User already present!!");
              //   res.status(409).json({ message: "User already exists!" });
              // }
            } else {
              console.log(result);
              console.log(result.flightNumber);
              // const user = { flightNumber: req.body.flightNumber };
              // req.session.user = user;
              res.status(200).json({result});
            }
          }
        );

      }
      else{
        
        console.log("flight exists")
        res.status(201).json({result});

      }
    })
  
    
  });

  app.get("/searchFlights", function(req, res){
    con.query(
        "SELECT * FROM AvailableFlights",
        (err, result)=>{
            if(result){
                console.log(result);
                res.status(200).json({ result });
                
            }
        }
    )
})

app.post("/shoppingflights", function (req, res) {
  const cardname = req.body.name;
  const cardnumber = req.body.cardnumber;
  const expmonth = req.body.expmonth;
  const expyear = req.body.expyear;
  const cvv = req.body.cvv;
  
  con.query(
    "INSERT INTO payment(cardname, cardnumber, expmonth, expyear, cvv) VALUES (?,?,?,?,?)",
    [cardname, cardnumber, expmonth, expyear, cvv],
    (err, result) => {
      if (err) {
        // if (err.code === "ER_DUP_ENTRY") {
        //   console.log("User already present!!");
        //   res.status(409).json({ message: "User already exists!" });
        // }
      } else {
        console.log(result);
        console.log(result.flightNumber);
        // const user = { flightNumber: req.body.flightNumber };
        // req.session.user = user;
        res.status(200).json({result});
      }
    }
  );
});


app.post("/bookedflights", function (req, res) {
  // console.log(req.body);

  const customerid = req.body.customerid
  const flightNumber= req.body.flightNumber;
  const price= req.body.price;
  const arrivalAirport= req.body.arrivalAirport;
  const arrivalCity= req.body.arrivalCity;
  const arrivalDate= req.body.arrivalDate;
  const arrivalTime= req.body.arrivalTime;
  const departureAirport= req.body.departureAirport;
  const departureCity= req.body.departureCity;
  const departureDate= req.body.departureDate;
  const departureTime= req.body.departureTime;
  const distance = req.body.distance;
  console.log(customerid);
  console.log("start");
  console.log(distance);


      
      con.query(
        "INSERT INTO BookedFlights(customerid,flightNumber, arrivalAirport, arrivalCity, arrivalDate, arrivalTime, departureAirport, departureCity, departureDate, departureTime, price) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        [customerid, flightNumber,arrivalAirport,arrivalCity,arrivalDate,arrivalTime,departureAirport,departureCity,departureDate,departureTime,price],
        (err, result) => {
          if (err) {
            // if (err.code === "ER_DUP_ENTRY") {
            //   console.log("User already present!!");
            //   res.status(409).json({ message: "User already exists!" });
            // }

          } else {
            con.query("UPDATE AvailableFlights SET passengerCount = passengerCount + 1 WHERE flightNumber =?",
            [flightNumber]
            );

            con.query("UPDATE user SET miles = miles + ? WHERE iduser =?",
            [distance,customerid]
            );
            console.log(result);
            console.log(result.flightNumber);
            // const user = { flightNumber: req.body.flightNumber };
            // req.session.user = user;
            res.status(200).json({result});
            console.log("gggg");
          }
        }
      );
  });

  app.post("/customerFlights", function(req, res){
    const customerid = req.body.customerid;
    console.log(customerid)
    con.query(
        "SELECT * FROM BookedFlights WHERE customerid = ?",
        [customerid],
        (err, result)=>{
            if(result){
                console.log(result);
                res.status(200).json({ result });
                
            }
        }
    )
}) 


app.post("/updateinfo", function (req, res) {
  console.log(req.body);
  const email = req.body.email;
  // const userEmail = req.body.userEmail;
  const userPassword = req.body.userPassword;
  const salt = bcrypt.genSaltSync(10);
  const encryptedpassword = bcrypt.hashSync(userPassword, salt);

  const name = req.body.name;
  const userName = req.body.userName;
  const phoneNumber = req.body.phoneNumber;
  const customerid = req.body.customerid;

  con.query(
    "SELECT * FROM  user WHERE iduser=?",
    [customerid],
    (err, result) => {
      if(result.length > 0){
        console.log("Helloworld");
        console.log(customerid);
        console.log(email);

  con.query(
    "UPDATE user SET EMAIL=?, PASSWORD=?, NAME=? , USERNAME=? , PHONENUMBER=? WHERE iduser =?",
    [email, encryptedpassword, name, userName, phoneNumber, customerid],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          console.log("User already present!!");
          res.status(201).json({ message: "User already exists!" });
        }
      } else {
        const user = { username: req.body.username, password: req.body.password };
        req.session.user = user;
        res.status(200).json({ name: req.body.name, email: req.body.email });
      }
    }
  );
      }
      else{
        res.status(201).json({result});
      }
    })
});

app.post("/adminEdit", function (req, res) {
  // console.log(req.body);
  const flightNumber= req.body.flightNumber;
  const capacity= req.body.capacity;
  const price= req.body.price;
  const distance= req.body.distance;
  const arrivalAirport= req.body.arrivalAirport;
  const arrivalCity= req.body.arrivalCity;
  const arrivalDate= req.body.arrivalDate;
  const arrivalTime= req.body.arrivalTime;
  const departureAirport= req.body.departureAirport;
  const departureCity= req.body.departureCity;
  const departureDate= req.body.departureDate;
  const departureTime= req.body.departureTime;

  con.query("SELECT * FROM  AvailableFlights WHERE flightNumber=?",
  [flightNumber],
  (err,result)=>{
    console.log(result.length)
    if(result.length > 0){

      
      con.query(
        "UPDATE AvailableFlights SET flightNumber=?, capacity=?, price=?, distance=?, arrivalAirport=?, arrivalCity=?, arrivalDate=?, arrivalTime=?, departureAirport=?, departureCity=?, departureDate=?, departureTime=? WHERE flightNumber=?",
        [flightNumber,capacity,price,distance,arrivalAirport,arrivalCity,arrivalDate,arrivalTime,departureAirport,departureCity,departureDate,departureTime,flightNumber],
        (err, result) => {
          if (err) {
            // if (err.code === "ER_DUP_ENTRY") {
            //   console.log("User already present!!");
            //   res.status(409).json({ message: "User already exists!" });
            // }
          } else {
            console.log(result);
            console.log(result.flightNumber);
            // const user = { flightNumber: req.body.flightNumber };
            // req.session.user = user;
            res.status(200).json({result});
          }
        }
      );

    }
    else{
      
      console.log("flight exists")
      res.status(201).json({result});

    }
  })

  
});

app.post("/adminDelete", function (req, res) {
  // console.log(req.body);
  const flightNumber= req.body.flightNumber;

  con.query("SELECT * FROM  AvailableFlights WHERE flightNumber=?",
  [flightNumber],
  (err,result)=>{
    console.log(result.length)
    if(result.length > 0){

      
      con.query(
        "DELETE FROM AvailableFlights WHERE flightNumber=?",
        [flightNumber],
        (err, result) => {
          if (err) {
            // if (err.code === "ER_DUP_ENTRY") {
            //   console.log("User already present!!");
            //   res.status(409).json({ message: "User already exists!" });
            // }
          } else {
            console.log(result);
            console.log(result.flightNumber);
            // const user = { flightNumber: req.body.flightNumber };
            // req.session.user = user;
            res.status(200).json({result});
          }
        }
      );

    }
    else{
      
      console.log("flight exists")
      res.status(201).json({result});

    }
  })

  
});

app.post("/updateadmininfo", function (req, res) {
  console.log(req.body);
  const adminid = req.body.adminid;
  const userPassword = req.body.password;
  console.log("start");
  console.log(adminid);

  const userName = req.body.userName;

  con.query(
    "SELECT * FROM  adminlogin WHERE idadmin=?",
    [adminid],
    (err, result) => {
      if(result.length > 0){
        console.log("Helloworld");


  con.query(
    "UPDATE adminlogin SET USERNAME=?, PASSWORD=? WHERE idadmin =?",
    [userName, userPassword, adminid],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          console.log("User already present!!");
          res.status(201).json({ message: "User already exists!" });
        }
      } else {
        // const user = { username: req.body.username, password: req.body.password };
        // req.session.user = user;
        res.status(200).json({ result });
      }
    }
  );
      }
      else{
        res.status(201).json({result});
      }
    })
});

app.post("/milesupdate", function (req, res) {
  const userid = req.body.userid;

  con.query(
    "SELECT * FROM  user WHERE iduser=?",
    [userid],
    (err, result) => {
      if (result) {
        // console.log(results);
        res.status(200).json({ result });
      
          
      }
        
      
        }

  );
});

app.post("/cancelflight", function (req, res) {
  const userid = req.body.customerid;
  const flightNumber = req.body.flightNumber;

  con.query(
    "DELETE FROM BookedFlights WHERE customerid=? AND flightNumber=?",
    [userid, flightNumber],
    (err, result) => {
      if (result) {
        // console.log(results);
        res.status(200).json({ result });
      
          
      }
        
      
        }

  );
});

// app.get('*',(req,res) =>{
//   res.sendFile("build");
// });







