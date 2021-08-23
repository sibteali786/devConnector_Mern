const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("API Running"));
const PORT = process.env.PORT || 5000; // Setting up port either the port available in envoirment or Port 5000
app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
