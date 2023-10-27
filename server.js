const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500", // or your frontend origin
    methods: ["GET", "POST"],
  },
});

const cors = require("cors");
const axios = require("axios");

app.use(
  cors({
    origin: "http://127.0.0.1:5500", // or your frontend origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // enable set cookie
  })
);

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.emit("serverEvent", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("customEvent", async (data) => {
    console.log(data);
    try {
      // Make API request using Axios (or any other HTTP library)
      const response = await axios.get(
        "https://1cf8-180-183-230-85.ngrok-free.app/api/v1/employees/list"
      );
      // Emit the API response back to the client
      socket.emit("empData", response.data);
    } catch (error) {
      console.error("Error fetching data from API:", error.message);
      // Emit an error event to the client
      socket.emit("apiError", { message: "Error fetching data from API" });
    }
  });

  socket.on("empScan", async () => {
    try {
      // Make API request using Axios (or any other HTTP library)
      const response = await axios.get(
        "https://1cf8-180-183-230-85.ngrok-free.app/api/v1/employees/list"
      );
      // Emit the API response back to the client
      socket.emit("updateEmp", response.data);
    } catch (error) {
      console.error("Error fetching data from API:", error.message);
      // Emit an error event to the client
      socket.emit("apiError", { message: "Error fetching data from API" });
    }
  });
});
server.listen(3000, () => {
  console.log("listening on *:3000");
});
