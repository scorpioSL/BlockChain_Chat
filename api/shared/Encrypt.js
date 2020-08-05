const key = "BlockChain_Key";
const { generateKeyPair } = require("crypto");

let generateKeys = () => {
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
      return { public: publicKey, private: privateKey };
      // Handle errors and use the generated key pair.
    }
  );
};

module.exports = {
  generateKeys,
  key,
};
