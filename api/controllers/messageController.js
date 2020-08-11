const message = require('../models/MessageModel');
const crypto = require("crypto-js");
const key = require("../shared/Encrypt");

var getAll = (req, res, next) => {
    message.find().
        populate("sender", ["username", "email", "_id"]).
        populate("receiver", ["username", "email", "_id"])
        .then(response => {
            res.json({ type: "success", result: response });
        });
}

var getContactMessages = (req, res, next) => {
    message.find({ room_id: req.body.room_id }).
        populate("sender", ["username", "email", "_id"]).
        populate("receiver", ["username", "email", "_id"]).
        then(response => {
            if (response != null) {
                response.forEach(element => {
                    if (element.receiver._id == req.body.userid || element.sender._id == req.body.userid) {
                        element.message = crypto.AES.decrypt(element.message, key.key).toString(crypto.enc.Utf8);
                    }
                });
            }

            res.json({ type: "success", result: response });
        });
}

module.exports = {
    getAll,
    getContactMessages
}