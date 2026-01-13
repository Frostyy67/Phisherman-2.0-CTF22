import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import rateLimit from 'express-rate-limit';
import { Solved } from './models/Solved.js'

dotenv.config();

const app = express()
const port = 3000
const secretKey = process.env.JWT_SECRET;
const DB_URL = process.env.ATLAS_URL;

let USE_MEMORY_DB = false;

// ==================== REGISTERED USERS ====================
const REGISTERED_USERS = {
  "admin123@phisherman.ctf": { password: "admin123", name: "Admin" },
  "admin2@phisherman.ctf": { password: "admin456", name: "Admin2" },
  "afnanothayi232500@gmail.com": { password: "afnan@123", name: "a.fnan" },
  "kiranng@yahoo.com": { password: "kiran@123", name: "Crzaycat007" },
  "nivednarayananm2@gmail.com": { password: "nived@123", name: "devil_42401" },
  "bansilsaji03@gmail.com": { password: "bansil@123", name: "bytetyson_71338" },
  "dhaneshupai7@gmail.com": { password: "dhanesh@123", name: "n70ue" }
};

// In-memory user storage
let memoryUsers = [];

// ==================== CHALLENGES ====================
const CHALLENGES = [
  { id: 0, title: "The Hidden Message", points: 100, flag: "Hello_CTF_Player{1m_a_bAs64_exp3rt}" },
  { id: 1, title: "SQL Injection Master", points: 500, flag: "CTF{sql_1nj3ct10n_m4st3r_2024}" },
  { id: 2, title: "Reverse Engineering", points: 300, flag: "CTF{r3v3rs3_mast3r}" },
  { id: 3, title: "Network Forensics", points: 450, flag: "CTF{network_forensics_pro}" }
];

const LEVEL2_CHALLENGE = {
  id: 0,
  title: "SQL Injection - Juice Shop",
  basePoints: 100,
  flag: "PHISH{sqli_hidden_product}"
};

// ==================== RATE LIMITING ====================
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again later" }
});

const flagLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many flag submissions, slow down!" }
});

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100
});

// ==================== JWT MIDDLEWARE ====================
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
    req.userEmail = user.email;
    next();
  });
};

// ==================== DATABASE HELPERS ====================
const findUser = async (email) => {
  if (USE_MEMORY_DB) {
    return memoryUsers.find(u => u.email === email.toLowerCase()) || null;
  }
  return await Solved.findOne({ email: email.toLowerCase() });
};

const findAllUsers = async () => {
  if (USE_MEMORY_DB) {
    return memoryUsers;
  }
  return await Solved.find({});
};

const updateUser = async (email, updates) => {
  if (USE_MEMORY_DB) {
    const userIndex = memoryUsers.findIndex(u => u.email === email.toLowerCase());
    if (userIndex !== -1) {
      memoryUsers[userIndex] = { ...memoryUsers[userIndex], ...updates };
      return true;
    }
    return false;
  }
  await Solved.updateOne({ email: email.toLowerCase() }, { $set: updates });
  return true;
};

const createUser = async (email, name) => {
  const userData = {
    email: email.toLowerCase(),
    name,
    score: 0,
    solves: 0,
    flag1: "",
    flag2: "",
    flag3: "",
    flag4: "",
    flag5: "",
    lastSolveTime: null
  };
  
  if (USE_MEMORY_DB) {
    memoryUsers.push(userData);
  } else {
    await Solved.create(userData);
  }
  return userData;
};

// ==================== DATABASE CONNECTION ====================
const connectDB = async () => {
  if (!DB_URL) {
    console.warn("⚠️  ATLAS_URL is undefined - Using in-memory database");
    USE_MEMORY_DB = true;
    return;
  }
  
  try {
    await mongoose.connect(DB_URL);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.warn("⚠️  MongoDB connection failed - Using in-memory database");
    USE_MEMORY_DB = true;
  }
};

connectDB();

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);

// ==================== ROUTES ====================

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Get user progress
app.post('/solved', authenticateToken, async (req, res) => {
  const user = await findUser(req.userEmail);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const solvedArray = [];
  const levelUnlocks = [];
  
  for (let i = 0; i < 4; i++) {
    const isSolved = user[`flag${i + 1}`] === "SOLVED";
    if (isSolved) {
      solvedArray.push(i);
    }
    levelUnlocks.push(isSolved);
  }

  res.json({
    success: true,
    already_solved: solvedArray,
    solved: {
      name: user.name,
      email: user.email,
      score: user.score || 0,
      solves: user.solves || solvedArray.length
    },
    level: levelUnlocks
  });
});

// Submit flag for Level 1
app.post('/solve', authenticateToken, flagLimiter, async (req, res) => {
  const { id, flag } = req.body;
  const challengeId = parseInt(id);

  if (isNaN(challengeId) || challengeId < 0 || challengeId >= CHALLENGES.length) {
    return res.status(400).json({ success: false, message: "Invalid challenge" });
  }

  const challenge = CHALLENGES[challengeId];
  if (flag !== challenge.flag) {
    return res.status(400).json({ success: false, message: "Incorrect flag" });
  }

  const user = await findUser(req.userEmail);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (user[`flag${challengeId + 1}`] === "SOLVED") {
    return res.status(400).json({ success: false, message: "Already solved" });
  }

  const currentScore = parseInt(user.score) || 0;
  const currentSolves = parseInt(user.solves) || 0;
  const now = new Date();
  
  await updateUser(req.userEmail, {
    score: currentScore + challenge.points,
    solves: currentSolves + 1,
    lastSolveTime: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
    [`flag${challengeId + 1}`]: "SOLVED"
  });

  res.json({ success: true, message: "Correct!", points: challenge.points });
});

// Submit flag for Level 2
app.post('/solve-level2', authenticateToken, flagLimiter, async (req, res) => {
  const { flag, hintPenalty } = req.body;

  if (flag !== LEVEL2_CHALLENGE.flag) {
    return res.status(400).json({ success: false, message: "Incorrect flag" });
  }

  const user = await findUser(req.userEmail);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (user.flag5 === "SOLVED") {
    return res.status(400).json({ success: false, message: "Already solved" });
  }

  const penalty = parseInt(hintPenalty) || 0;
  const pointsEarned = Math.max(0, LEVEL2_CHALLENGE.basePoints - penalty);
  const currentScore = parseInt(user.score) || 0;
  const currentSolves = parseInt(user.solves) || 0;
  const now = new Date();

  await updateUser(req.userEmail, {
    score: currentScore + pointsEarned,
    solves: currentSolves + 1,
    lastSolveTime: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
    flag5: "SOLVED"
  });

  res.json({ success: true, message: "Correct!", points: pointsEarned });
});

// Check Level 2 status
app.post('/check-level2', authenticateToken, async (req, res) => {
  const user = await findUser(req.userEmail);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, solved: user.flag5 === "SOLVED" });
});

// Scoreboard
app.post('/scoreboard', async (req, res) => {
  const users = await findAllUsers();
  
  const toSeconds = (time) => {
    if (!time) return Infinity;
    const [h, m, s = 0] = String(time).split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  const sorted = [...users].sort((a, b) => {
    const scoreA = parseInt(a.score) || 0;
    const scoreB = parseInt(b.score) || 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return toSeconds(a.lastSolveTime) - toSeconds(b.lastSolveTime);
  });

  const collections = sorted.map((user, i) => ({
    rank: i + 1,
    name: user.name,
    score: user.score || 0,
    solves: user.solves || 0
  }));

  res.json({
    success: true,
    collections,
    players: users.length,
    total_solves: collections.reduce((sum, u) => sum + (parseInt(u.solves) || 0), 0)
  });
});

// Login
app.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  const registeredUser = REGISTERED_USERS[email.toLowerCase()];
  if (!registeredUser) {
    return res.status(401).json({ success: false, message: "Email not registered" });
  }

  if (password !== registeredUser.password) {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }

  let user = await findUser(email);
  if (!user) {
    user = await createUser(email, registeredUser.name);
  }

  const token = jwt.sign({ email: email.toLowerCase() }, secretKey, { expiresIn: '7d' });
  res.cookie("token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });
  
  res.json({ success: true, name: registeredUser.name });
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  res.json({ success: true });
});

// Check login status
app.post('/checklogin', authenticateToken, async (req, res) => {
  const user = await findUser(req.userEmail);
  if (user) {
    res.json({ success: true, username: user.name });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

// Time-based availability check
app.post('/unavailable', (req, res) => {
  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  res.json({ success: totalMinutes >= 735 });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
