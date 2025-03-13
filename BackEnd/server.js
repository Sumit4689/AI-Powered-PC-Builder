const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 2002;
const cors = require('cors');
const connectDb = require('./config/dbConnection');
connectDb();

const app = express();
app.use(cors());

app.use(express.json());

app.use('/register', require('./routes/registerRouter'));



app.listen(port, () => {    
    console.log(`Server is running on the port: ${port}`);
    console.log(`http://localhost:${port}`);
});