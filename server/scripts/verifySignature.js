const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

function hashMessage(msg) {
  const bytes = utf8ToBytes(msg);
  const hash = keccak256(bytes);
  return hash;
}

function verify(publicKey, signature, msg) {
  const bool = secp.verify(signature, hashMessage(msg), publicKey);
  return bool;
}

module.exports = {
  verify,
};
