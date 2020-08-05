const contact = require("../models/ContactModel");
const { generateKeyPair } = require("crypto");

var add = async (req, res, next) => {
  generateKeyPair(
    "rsa",
    {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: "top secret",
      },
    },
    (err, publicKey, privateKey) => {
      let obj = new contact({
        owner: { _id: req.body.uid, email: req.body.email },
        receiver: req.body.contact,
        last_updated: Date.now(),
        public_key: publicKey,
        private_key: privateKey,
        room_id: req.body.uid + req.body.contact._id,
      });

      obj.save().then(
        (saveres) => {
          saveres.populate("owner", ["username", "email", "_id"]);
          saveres.populate("receiver", ["username", "email", "_id"]);
          saveres.execPopulate().then((pop) => {
            console.log(pop, "pop");
            console.log(saveres);
            res.json({ type: "success", obj: saveres });
          });
        },
        (error) => {
          res.json({ type: "error", error: error });
        }
      );
    }
  );
};

var getList = async (req, res, next) => {
  await contact
    .find({ $or: [{ owner: req.body.uid }, { receiver: req.body.uid }] })
    .populate("owner", ["username", "email", "_id"])
    .populate("receiver", ["username", "email", "_id"])
    .select("public_key private_key room_id")
    .sort({ last_updated: -1 })
    .then((response) => {
      res.json({ type: "success", result: response });
    });
};

module.exports = {
  add,
  getList,
};
