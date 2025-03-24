// const express = require("express");
// const connectDB = require("./config/database.js");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const app = express();
// const http = require("http");

// const authRouter = require("./routes/auth.js");
// const requestRouter = require("./routes/request.js");
// const profileRouter = require("./routes/profile.js");
// const userRouter = require("./routes/user.js");
// const initializeSocket = require("./utils/socket.js");
// const chatRouter = require("./routes/chat.js");

// app.use(
//   cors({
//     origin: "http://localhost:5175", // Updated to match your frontend's origin
//     methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // Middleware to handle preflight requests
// app.options("*", (req, res) => {
//   console.log("Handling OPTIONS request for ", req.url);
//   res.header(
//     "Access-Control-Allow-Origin",
//     "http://localhost:5173" ||
//       "http://localhost:5175 || https://dev-book-alpha.vercel.app/"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, DELETE, OPTIONS"
//   ); // Ensure PATCH is included
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.sendStatus(200);
// });

// app.use(express.json());
// app.use(cookieParser());

// app.use("/", authRouter);
// app.use("/", requestRouter);
// app.use("/", profileRouter);
// app.use("/", userRouter);
// app.use("/", chatRouter);

// const server = http.createServer(app);

// initializeSocket(server);
// connectDB()
//   .then(() => {
//     console.log("Database connection established...");
//     server.listen(7777, () => {
//       console.log("Server is successfully listening on port 7777");
//     });
//   })
//   .catch((err) => {
//     console.error("Database cannot be connected!", err);
//   });

const express = require("express");
const http = require("http");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Importing routes
const authRouter = require("./routes/auth.js");
const requestRouter = require("./routes/request.js");
const profileRouter = require("./routes/profile.js");
const userRouter = require("./routes/user.js");
const chatRouter = require("./routes/chat.js");

// Importing utilities
const initializeSocket = require("./utils/socket.js");

const app = express();
const PORT = 7777;

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5175",
      "https://dev-book-alpha.vercel.app",
    ], // Allowed origins
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to handle preflight requests
app.options("*", (req, res) => {
  console.log("Handling OPTIONS request for", req.url);
  res.header("Access-Control-Allow-Origin", req.get("Origin") || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// Standard middlewares
app.use(express.json());
app.use(cookieParser());

// Registering routes
app.use("/auth", authRouter);
app.use("/request", requestRouter);
app.use("/profile", profileRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);

// Creating HTTP server and initializing sockets
const server = http.createServer(app);
initializeSocket(server);

// Database connection and server start
connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(PORT, () => {
      console.log(`Server is successfully listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed!", err);
    process.exit(1); // Exit the process if DB connection fails
  });

// Error handling for server errors
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1); // Exit the process on server error
});
