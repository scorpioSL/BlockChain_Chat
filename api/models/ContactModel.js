const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    last_updated: {
      type: Date,
    },
    public_key: {
      type: String,
    },
    private_key: {
      type: String,
    },
    room_id:{
      type:String
    }
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
