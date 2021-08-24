const express = require("express");
const connectDB = require("./config/db");


const app = express();
// Connecting to Data base
connectDB();

// Init Middleware
app.use(express.json({ extend: false }));

app.get("/", (req, res) => res.send("API Running"));

// Defining Routes
app.use("/api/user", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/post", require("./routes/api/post"));
const PORT = process.env.PORT || 5000; // Setting up port either the port available in envoirment or Port 5000
app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
