const express = require('express');
const mongoose = require('mongoose');
const router = require("./routes/user-routes");
const cookieParser = require('cookie-parser');
const cors = require('cors');
require ('dotenv').config();


const app = express();
app.use(cors({credentials:true, origin:"http://localhost:3000"}));
app.use(cookieParser());
app.use(express.json());
app.use('/api', router);

mongoose.connect(`mongodb+srv://vaibhavi062024:${process.env.MONGODB_PASSWORD}@cluster0.9hmba.mongodb.net/auth?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
  app.listen(5000);
  console.log("Dtatbase is connected! Listening to localhost 5000");
}).catch((err) => {
  console.log(err)
});

//LZw8cv3UXeZyhKMx

