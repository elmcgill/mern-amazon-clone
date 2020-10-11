const bcrypt = require("bcrypt");
const saltRounds = 10;
const authMethods = require("../util/authUtil");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  try {
    profileKeys = ["email", "password"];
    if (!profileKeys.every((item) => req.body.hasOwnProperty(item))) {
      res.status(400).json({
        message:
          "Not all keys supplied in request body. Must contain email, password, and nickName",
      });
    } else {
      const dirtyUser = req.body;
      const cleaned = authMethods.validateInput(dirtyUser);
      if (cleaned.user === null) {
        return res.status(403).json({
          message: cleaned.message,
        });
      }
      const cleanedUser = cleaned.user;

      await bcrypt.hash(cleanedUser.password, saltRounds, async (err, hash) => {
        try {
          const userEmail = cleanedUser.email.toLowerCase();
          const userPass = hash;
          const userName = cleanedUser.name;

          const saveUser = new User({
            email: userEmail,
            password: userPass,
            nickName: userName,
          });

          const saved = await saveUser.save();

          res.status(200).json({
            user: saved._id,
            message: "User saved successfully",
          });
        } catch (err) {
          res.status(500).json({
            message: err.message,
          });
        }
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    profileKeys = ["email", "password"];
    if (!profileKeys.every((item) => req.body.hasOwnProperty(item))) {
      res.status(400).json({
        message:
          "Not all keys supplied in request body. Must contain email, password",
      });
    } else {
      const userData = req.body;
      const email = userData.email.toLowerCase();
      const find = await User.find({ email: email });
      if (!find) {
        res.status(400).json({
          message: "Email or password incorrect",
        });
      } else {
        await bcrypt.compare(
          userData.password,
          find.password,
          async (result) => {
            if (!result) {
              res.status(400).json({ message: "Email or password incorrect" });
            } else {
              const sessionId = await uuidv4();
              const token = jwt.sign(
                {
                  data: sessionId,
                },
                "supersecretpass",
                { expiresIn: "30 days" }
              );
              const updatedUser = await User.findOneAndUpdate(
                { email: email },
                { jwtToken: token }
              );
              res.status(200).json({
                user: {
                  id: updatedUser._id,
                  email: updatedUser.email,
                },
                jwt: token,
                message:
                  "User signed in, please use the jwt token for each new response",
              });
            }
          }
        );
      }
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.logout = async (req, res) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).json({ message: "Missing autohorization token" });
  } else {
    jwt.verify(token, "supersecretpass", async (err) => {
      if (err) {
        const updatedUser = await User.findOneAndUpdate(
          { jwtToken: token },
          { jwtToken: null }
        );
        res.status(403).json({
          message: "JWT token is invalid",
        });
      } else {
        const updatedUser = await User.findOneAndUpdate(
          { jwtToken: token },
          { jwtToken: null }
        );
        res.status(200).json({
          message: "User has been logged out",
        });
      }
    });
  }
};

module.exports.checkJWT = async (req, res) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).json({ message: "User not logged in" });
  } else {
    jwt.verify(token, "supersecretpass", async (err) => {
      if (err) {
        res.status(403).json({
          message: "Token invalid or expired, relogin",
        });
      } else {
        const find = await User.findOne({ jwtToken: token });
        res.status(200).json({
          user: {
            id: find._id,
            email: find.email,
          },
          message: "User is valid and logged in",
        });
      }
    });
  }
};
