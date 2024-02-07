const express = require("express")
const app = express()
const cors = require('cors')
const router = require('./routes/index')

app.use(express.json())
app.use(cors())
app.use('/v1',router)

app.get('/',(req , res)=>{
res.send('Welcome')
})
app.listen(5000,()=>{
    console.log("Server has been started on port ")
})