const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Routes = require("./Routes/Routes"); 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

const port = process.env.PORT || 5008;

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

app.use('/', Routes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
app.get("/", (req, res) => {
    res.send("Server is Running!");  
  });
  