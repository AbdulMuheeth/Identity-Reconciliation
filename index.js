const express = require('express')
const app = express()

require('dotenv').config()

app.use(express.urlencoded({extended:false}))
app.use(express.json())

const identifyRouter = require('./routes/identify.router')

app.use('/identify',identifyRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log("Server is up and running...")
})