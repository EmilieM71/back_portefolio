const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../pool");

const privateKey = process.env.JWT_SECRET;
const router = express.Router();

const extractJwtUser = async (req) => {
  const { token } = req.cookies;
  if (!token) return null;
  try {
    const { ...decoded } = await jwt.verify(token, privateKey);
    return decoded;
  } catch (err) {
    return null;
  }
};

const checkJwtMw = async (req, res, next) => {
  const user = await extractJwtUser(req);
  if (!user) return res.sendStatus(401);
  req.user = user;
  return next();
};

// Middleware check email and password
const checkAuthFields = (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({
      error: "E-mail et mot de passe obligatoires.",
    });
  }
  const isEmail = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (!email.match(isEmail)) {
    return res.status(422).json({
      error: "Veuillez vérifier si votre e-mail est bien écrit.",
    });
  }
  return next();
};

// Create a user
router.post("/register", checkAuthFields, async (req, res) => {
  // console.log(req, res);
  try {
    const { email, password } = req.body;
    const passwordHashed = await bcrypt.hash(password, 14);
    await pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      passwordHashed,
      1,
    ]);
    const newAdmin = await pool.query(
      `SELECT id, email FROM users WHERE email=?`,
      [email]
    );
    return res.status(201).json(newAdmin[0]);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// LogIn user
router.post("/login", checkAuthFields, async (req, res) => {
  const { email, password } = req.body;
  const sql =
    "SELECT id, password hash FROM users WHERE BINARY email = BINARY ?";
  try {
    const [users] = await pool.query(sql, [email]);
    const [user] = users;
    // pas de user => 401
    if (!user) {
      return res.status(401).json({
        error: "Cet e-mail n est pas reconnu.",
      });
    }
    // comparer le mdp en clair avec le mdp haché venant de la BDD
    const passwordsMatch = await bcrypt.compare(password, user.hash);
    if (!passwordsMatch) {
      return res.status(401).json({
        error: "Mauvais e-mail et/ou mot de passe.",
      });
    }
    // générer un JWT propre à cet utilisateur (contenant l'id de l'utilisateur)
    console.log(privateKey);
    const token = await jwt.sign({ id: user.id }, privateKey);
    res.cookie("token", token, {
      httpOnly: true,
    });
    return res.json({ id: user.id, email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message,
    });
  }
});

router.post("/verify-account", async (req, res) => {
  try {
    const [[user]] = pool.query(
      "SELECT email, token FROM user WHERE email = ?",
      [req.body.email]
    );
    if (!user) return res.sendStatus(401);
    const alreadyHasPassword = user.token !== req.body.token;
    return res.json({ alreadyHasPassword });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

router.post("/logout", checkJwtMw, async (req, res) => {
  try {
    res.clearCookie("token");
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message,
    });
  }
});

router.get("/check", checkJwtMw, async (req, res) => {
  res.send(req.user);
});

router.get("/info", checkJwtMw, async (req, res) => {
  const [[user]] = await pool.query("SELECT id, email FROM user WHERE id = ?", [
    req.user.id,
  ]);
  res.send(user);
});

module.exports = router;
