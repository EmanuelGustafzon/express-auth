const express = require('express')
const app = express()
require('dotenv').config();
const mongoose = require('mongoose');
const UsersRoutes = require('./routes/users')
const cors = require('cors');


app.use(express.json())
app.use(cors())

mongoose.set('strictQuery', true);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DBURI);
}

app.get('/', (req, res) => {
    res.send('hello world')
  })

  app.use('/users', UsersRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listening to ${port}`)
})