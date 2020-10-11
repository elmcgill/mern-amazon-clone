const sanitizeHtml = require("sanitize-html");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.validateInput = (data) => {
  const dirtyEmail = data.email;
  const dirtyPass = data.password;
  const dirtyName = data.nickName;

  const cleanedEmail = sanitizeHtml(dirtyEmail.trim());
  const cleanedPass = sanitizeHtml(dirtyPass.trim());
  const cleanedName = sanitizeHtml(dirtyName.trim());

  if (!cleanedEmail || !cleanedPass || !cleanedName) {
    return {
      user: null,
      message: "Username, password, or name seemed to be suspicious",
    };
  } else if (cleanedPass.length < 6) {
    return {
      user: null,
      message: "Password must be greater than 6 characters",
    };
  } else {
    return {
      user: {
        email: cleanedEmail,
        password: cleanedPass,
        name: cleanedName,
      },
      message: "User input is clean",
    };
  }
};

module.exports.hashPass = async (pass) => {
  await bcrypt.hash(pass, saltRounds, (err, hash) => {
    return hash;
  });
};

module.exports.checkPass = async (hash, pass) => {
  bcrypt.compare(pass, hash, (result) => {
    return result;
  });
};
