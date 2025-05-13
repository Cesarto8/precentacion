const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

let players = [];
let currentQuestion = 0;

io.on("connection", (socket) => {
  console.log("Nuevo jugador conectado");

  socket.on("join", (playerName) => {
    players.push({ id: socket.id, name: playerName, score: 0 });
    io.emit("playersUpdate", players);  // Actualiza la lista de jugadores
  });

  socket.on("answer", (answerIndex) => {
    const isCorrect = checkAnswer(answerIndex);
    const player = players.find(p => p.id === socket.id);
    if (isCorrect) {
      player.score++;
    }
    io.emit("updateScore", players);  // Actualiza los puntajes en todos los jugadores
  });

  socket.on("disconnect", () => {
    console.log("Jugador desconectado");
    players = players.filter(p => p.id !== socket.id);
    io.emit("playersUpdate", players);  // Actualiza la lista de jugadores
  });
});

function checkAnswer(answerIndex) {
  // Lógica para verificar si la respuesta es correcta
  return answerIndex === correctAnswerIndex;
}

const port = process.env.PORT || 3000;  // Usa el puerto proporcionado por Heroku, o 3000 en desarrollo.
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// server.listen(3000, () => {
//   console.log("Servidor corriendo en http://localhost:3000");
// });
