const express = require("express")
const app = express()
const cors = require('cors')
app.use(express.json())

app.get('/',(req , res)=>{
res.send('Welcome')
})
app.listen(5000,()=>{
    console.log("Server has been started on port ")
})