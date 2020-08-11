require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const { response } = require('express')
const saltRounds = 10
var hashPass

bcrypt.hash(process.env.ADMIN_PASS, saltRounds, (err, hash) => {
    if (err) {
        console.log('bcrypt ran into an error')
    }

    hashPass = hash
})

var con = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: 'clutch_crutch',
})

con.connect((err) => {
    if (err) throw err
    console.log('Connected to SQL!')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/client'))

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/client/login.html')
})

app.post('/admin', (req, res) => {
    var password = req.body.password
    if (password) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.log('bcrypt ran into an error')
            }

            if ((hash = hashPass)) {
                res.sendFile(__dirname + '/client/admin.html')
            } else {
                res.send('Password incorrect!')
            }
        })
    } else {
        res.send('Please enter a password!')
        res.end()
    }
})

app.post('/order', (req, res) => {
    console.log('Connected to SQL for order registration.')
    let query = `INSERT INTO jobs (startdate, clientname, clientemail, amount, clientaddress) VALUES ('${req.body.date}', '${req.body.name}', '${req.body.email}', ${req.body.amount}, '${req.body.address}')`
    con.query(query, (err, result) => {
        if (err) throw err
        console.log('1 job inserted in database.')
        res.redirect('/')
        // TODO: Send confirmation email
    })
})

async function getAllJobs(callback) {
    let query = `SELECT * FROM jobs ORDER BY startdate ASC`
    con.query(query, (err, results) => {
        if (err) throw err
        callback(results)
    })
}

app.get('/jobs', (req, res) => {
    switch (req.query.filter) {
        case 'all':
            console.log('Requesting all jobs...')
            getAllJobs((results) => {
                console.log(results)
                res.end(JSON.stringify(results))
            })
    }
})

app.listen(port, () => console.log(`Example app listening on ${port}`))
