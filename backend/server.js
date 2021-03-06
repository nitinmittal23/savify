const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 1423;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex:true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const usersRouter = require("./routes/users")
app.use('/users', usersRouter);


app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})




