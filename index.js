// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./src/routes/authRoutes");
const occurrenceRoutes = require('./src/routes/occRoutes');
const userRoutes = require('./src/routes/userRoutes');
const vehiRoutes = require('./src/routes/vehiRoutes');
const rescueRoutes = require("./src/routes/recueRoutes")
const nfRoutes = require("./src/routes/nfRoutes")
const app = express();
const PORT = process.env.PORT || 3000;


// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Roteadores
app.use("/api/auth", authRoutes);
app.use("/api/occurrences", occurrenceRoutes);
app.use("/api/user", userRoutes);
app.use("/api/vehicles", vehiRoutes);
app.use("/api/rescue", rescueRoutes);
app.use("/api/notify", nfRoutes);

app.get("/", (req, res) => {
  res.send("Bem-vindo ao servidor do 193Mobile! Use as rotas da API iniciando com /api");
});
  
app.listen(PORT, () => {
 // console.log(`Servidor rodando na porta ${PORT} no ambiente ${process.env.NODE_ENV || 'desenvolvimento'}`);
});