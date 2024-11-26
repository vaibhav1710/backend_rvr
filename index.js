require('dotenv').config();
const express = require('express');
const app = express();
var path = require('path');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json()); // this takes the data and attachs it to the req handler, so we can then access it req.body.something
app.use(cookieParser());


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL); 
        console.log(`DataBase Connected: ${conn.connection.host}`); 
    } catch (error) {
        console.log(process.env.DATABASE_URL);
        console.log("Failed to connect to DB: ",error);
    }
}
connectDB();


app.get("/", (req,res)=>{
    res.send("Hello World");
})

app.use("/api/v2", require("./routes/user_routes"))
app.use("/api/v2", require("./routes/application_routes"))


const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})