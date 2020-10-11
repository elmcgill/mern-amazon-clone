const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", async (req, res) => {
  await authController.register(req, res);
});

router.post("/login", async (req, res) => {
  await authController.login(req, res);
});

router.get("/logout", async (req, res) => {
  await authController.logout(req, res);
});

router.get("/", async (req, res) => {
  await authController.checkJWT(req, res);
});

module.exports = router;
