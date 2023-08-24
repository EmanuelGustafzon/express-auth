const express = require('express')
const app = express()
require('dotenv').config();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth')
const readUsers = require('./routes/readUsers')
const accountRoutes = require('./routes/account')
const cors = require('cors');
const deleteOldRefreshToken = require('./node-cron/deleteRefreshTokens')

app.use(express.json())
const corsOptions = {
  origin: process.env.origin || 'https://3001-emanuelgust-expressauth-9r32l4zhkks.ws-eu104.gitpod.io',
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

mongoose.set('strictQuery', true);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DBURI);
}

app.get('/', (req, res) => {
    res.send('hello world')
  })

app.use('/auth', authRoutes)
app.use('/readUsers', readUsers)
app.use('/account', accountRoutes)


// delete all the expires refreshTokens
deleteOldRefreshToken()

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listening to ${port}`)
})