require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

const bcrypt = require('bcrypt')
const { response } = require('express')
const saltRounds = 10;
var hashPass;

bcrypt.hash(process.env.ADMIN_PASS, saltRounds, (err, hash) => {
    if (err) {
        console.log('bcrypt ran into an error')
    }

    hashPass = hash
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

            if (hash = hashPass) {
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

app.listen(port, () => console.log(`Example app listening on ${port}`))