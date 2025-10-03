const fs = require("fs");
const https = require("https");
const http = require("http");
const WebSocket = require("ws");
const { spawn, execFile } = require("child_process");
const jwt = require("jsonwebtoken");
const path = require("path");

// Configuration
const SECRET_KEY = process.env.SECRET_KEY;
const USE_SSL = process.env.USE_SSL === "true";
const PORT = 8080;
const CERT_PATH = "./certs/server.crt"; // Public certificate path
const KEY_PATH = "./certs/server.key";  // Private key path
const MAX_MESSAGES_PER_SECOND = 5;      // Rate limiting configuration
const MC_NAME = process.env.MC_NAME || "minecraft"; // Minecraft container name
const DOCKER_BIN = process.env.DOCKER_BIN || "docker"; // allow pinning docker path

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in docker-compose.yml");
}

// Validate container name to avoid weird argv/option shenanigans
const DOCKER_NAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$/;
if (!DOCKER_NAME_RE.test(MC_NAME)) {
  throw new Error("Invalid MC_NAME format");
}

// Absolute cert/key paths (avoid CWD surprises)
const CERT_ABS = path.join(__dirname, CERT_PATH);
const KEY_ABS  = path.join(__dirname, KEY_PATH);

// HTTP request handler for serving the certificate
function handleRequest(req, res) {
  if (req.method === "GET" && req.url === "/getcert") {
    res.writeHead(200, {
      "Content-Type": "application/x-x509-ca-cert",
      "Content-Disposition": 'attachment; filename="server.crt"',
    });
    fs.createReadStream(CERT_ABS).pipe(res);
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
}

// JWT authentication
function authenticate(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (e) {
    console.error("Authentication error:", e.message);
    return null;
  }
}

// ---- Safe command runners (no shell) ----

// Broadcast helper
function broadcastStdout(text) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(text);
    }
  });
}

// Run docker with explicit argv; collect output to broadcast like before
function runDocker(args, cb) {
  const ps = spawn(DOCKER_BIN, args, { shell: false });
  let stdout = "";
  let stderr = "";

  ps.stdout.on("data", (d) => { stdout += d.toString(); });
  ps.stderr.on("data", (d) => { stderr += d.toString(); });

  ps.on("close", (code) => {
    if (code !== 0) {
      console.error(`docker ${args.join(" ")} exited with code ${code}`);
      if (stderr) console.error(`Command error: ${stderr}`);
    } else if (stdout) {
      console.log(`Command output: ${stdout}`);
      broadcastStdout(stdout);
    }
    if (typeof cb === "function") cb(code, stdout, stderr);
  });

  ps.on("error", (err) => {
    console.error("Failed to start docker:", err.message);
    if (typeof cb === "function") cb(1, "", err.message);
  });

  return ps;
}

// Restart server command
function restartServer() {
  console.log("Restarting the Minecraft server...");
  runDocker(["restart", MC_NAME]);
}

// Validate and sanitize WebSocket messages to prevent command/option abuse
function validateMessage(message) {
  // allow alnum, space, underscore, dash; disallow leading '-' (option injection),
  // and keep messages reasonably short
  if (typeof message !== "string" || message.length === 0 || message.length > 500) return false;
  if (message.startsWith("-")) return false;
  return /^[a-zA-Z0-9_\- ]+$/.test(message);
}

// Create server with or without SSL
let server;
let useSSL = USE_SSL;

if (useSSL) {
  try {
    fs.accessSync(CERT_ABS, fs.constants.F_OK);
    fs.accessSync(KEY_ABS, fs.constants.F_OK);
  } catch (err) {
    console.warn("=================================================================");
    console.warn("WARNING: SSL certificates not found. Starting server without SSL.");
    console.warn("=================================================================");
    useSSL = false;
  }
}

if (useSSL) {
  server = https.createServer(
    {
      cert: fs.readFileSync(CERT_ABS),
      key: fs.readFileSync(KEY_ABS),
    },
    handleRequest
  );
} else {
  server = http.createServer();
}

// WebSocket server setup
const wss = new WebSocket.Server({ server });

server.listen(PORT, () => {
  console.log(`WebSocket server is listening on port ${PORT}${useSSL ? " with SSL enabled" : " with SSL disabled"}`);
});

wss.on("connection", (ws, request) => {
  console.log("New client connected");

  const url = new URL(request.url, `${useSSL ? "wss" : "ws"}://${request.headers.host}`);
  const token = url.searchParams.get("token");

  const user = authenticate(token);
  if (!user) {
    ws.close(4001, "Authentication failed");
    return;
  }

  // Tail docker logs safely (already used spawn previously)
  const logProcess = spawn(DOCKER_BIN, ["logs", "-f", MC_NAME], { shell: false });

  logProcess.stdout.on("data", (data) => {
    ws.send(data.toString());
  });

  logProcess.stderr.on("data", () => {
    ws.send("Error occurred.");
  });

  logProcess.on("close", (code) => {
    console.log(`logProcess exited with code ${code}`);
  });

  let messageCount = 0;
  let startTime = Date.now();

  ws.on("message", (message) => {
    const msgString = message.toString();
    const currentTime = Date.now();

    // Reset message count every second
    if (currentTime - startTime > 1000) {
      messageCount = 0;
      startTime = currentTime;
    }

    // Rate limiting
    if (messageCount >= MAX_MESSAGES_PER_SECOND) {
      ws.send("Rate limit exceeded. Please slow down.");
      return;
    }

    messageCount++;

    console.log(`Received message: ${msgString}`);

    if (!validateMessage(msgString)) {
      ws.send("Invalid input.");
      return;
    }

    if (msgString === "admincraft restart-server") {
      restartServer();
    } else {
      // No shell: every token is its own argv item.
      // `send-command` runs inside the container; user text becomes a single argument.
      runDocker(["exec", MC_NAME, "send-command", msgString]);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    logProcess.kill();
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error.message);
  });

  ws.send(`${user.userId} connected`);
});

