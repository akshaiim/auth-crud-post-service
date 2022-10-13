require('dotenv').config()
require("./database/db").connect();
const express = require('express');
const userRouter = require('./routers/userRouter')
const postRouter = require('./routers/postRouter')


const app = express();

app.use(express.json({limit: "50mb"}))
const PORT = process.env.PORT || 8000


app.use('/user', userRouter)
app.use('/posts', postRouter)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})