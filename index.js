const express = require('express')
const app = express()

require('dotenv').config()

app.use(express.urlencoded({extended:false}))
app.use(express.json())

const identifyRouter = require('./routes/identify.router')

app.use('/identify',identifyRouter)

app.get('/',(req,res)=>{
    res.json({message:"Hello, There. Please perform the POST routes on `/identify` to test the functionality! For additional help go through readme.md of https://github.com/AbdulMuheeth/Identity-Reconciliation"})
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log("Server is up and running...")
})