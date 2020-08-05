const User = require("../models/UserModel");
const crypto = require("crypto-js");
const key = require("../shared/Encrypt");

var save = (req, res, next) => {
  console.log(req.body);
  User.find({ email: req.body.email }).then((response) => {
    if (response.length == 0) {
      let newUser = new User({
        username: req.body.username,
        password: crypto.AES.encrypt(req.body.password, key.key).toString(),
        email: req.body.email,
      });

      newUser
        .save()
        .then((saveResponse) => {
          res.json({ type: "success", obj: saveResponse });
        })
        .catch((err) => {
          res.json({ type: "error", error: err });
        });
    } else {
      res.json({ type: "error", error: "Email already exists!" });
    }
  });
};

var edit = (req, res, next) => {
  let Id = req.body.id;

  let editUser = Object.assign({
    username: req.body.username,
    email: req.body.email,
  });

  User.findByIdAndUpdated(Id, { $set: editUser })
    .then((response) => {
      res.json({ type: "success", obj: response });
    })
    .catch((err) => {
      res.json({ type: "error", error: err });
    });
};

var login = (req, res, next) => {
  User.find({ email: req.body.email }).then((response) => {
    if (response.length > 0) {
      let dbUser = response[0];
      if (
        crypto.AES.decrypt(dbUser.password, key.key).toString(crypto.enc.Utf8) ==
        req.body.password
      ) {
        res.json({ type: "success", obj: response[0] });
      } else {
        res.json({ type: "error", error: "Invalid username or password!" });
      }
    } else {
      res.json({ type: "error", error: "User not found!" });
    }
  });
};

var getall = (req, res, next) => {
  User.find()
    .then((response) => {
      res.json({ type: "success", results: response });
    })
    .catch((error) => {
      res.json({ type: "error", error: error });
    });
};

module.exports = {
  save,
  edit,
  login,
  getall
};
