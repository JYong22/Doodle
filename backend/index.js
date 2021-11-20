const express = require('express');
const cors = require("cors");
const app = express();

const mysql = require('mysql');
app.use(express.static('static'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use(express.static(__dirname + '/public'));

//create database connection
const db = mysql.createConnection({
    host: '34.130.215.63',
    user: 'root',
    password: 'password',
    database: 'CRUDDatabase'
});

//get all the guest doodles
app.get('/api/get',(req,res) =>{
    const sqlSelect =
    "SELECT * FROM guestDoodle";
    db.query(sqlSelect, (err, result) =>{
        res.send(result);
    });

});

//get all doodle times
app.get('/api/getDoodles',(req,res) =>{
    const sqlSelect =
    "SELECT * FROM doodleTimes";
    db.query(sqlSelect, (err, result) =>{
        res.send(result);
    });

});


//gets the admin user
app.get('/api/getAdmin', (req,res) =>{

    const sqlSelect = "SELECT * from adminDoodle";
    db.query(sqlSelect, (err,result) =>{
        res.send(result);
    });
});

//logs in
app.put('/api/loggedin', (req,res) =>{
    const sqlUpdate = `UPDATE adminDoodle SET loggedIn = '1' WHERE adminName = 'admin'`;
    db.query(sqlUpdate, (err, result) =>{
        res.send(result);
    });

});
//logs out
app.put('/api/signout', (req,res) =>{

    const sqlUpdate = `UPDATE adminDoodle SET loggedIn = '0' where adminName = 'admin'`;
    db.query(sqlUpdate, (err, result) =>{
        res.send(result);
    });

});


//update the time ranges
app.put('/api/updateTime', (req,res) =>{
    const timeId = req.body.timeId;
    const sTime = req.body.startTime;
    const eTime = req.body.endTime
    const sqlUpdate = `UPDATE doodleTimes SET startTime = '${sTime}', endTime = '${eTime}' WHERE timeId = '${timeId}'`;
    db.query(sqlUpdate, (err, result) =>{
        res.send(result);
    });

});


//insert new card/doodle
app.post('/api/insert', (req, res) =>{
    const guestName = req.body.guestName;
    const timeData = req.body.timeData;
    

    const sqlInsert = `INSERT INTO guestDoodle (guestName, guestTime) VALUES ('${guestName}','${timeData}')` //insert 3 values: guestName, guestDoodle and guestDate with the guest form 
    db.query(sqlInsert, (err, result) =>{
        console.log(result);
    });
});

//delete the card using parameters
app.delete("/api/delete/:gId",(req,res) =>{

    const id = req.params.gId;
    const sqlDelete = `DELETE FROM guestDoodle WHERE id = ?`
    
    db.query(sqlDelete,id, (err, result) =>{
        if (err)
            console.log(err);
    }); 

})

app.listen(80, () =>{
    console.log("running on port 80")
});
