const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");

const message = "0x0";
const privateKey = process.argv[2];

function hashMessage(msg) {
  const bytes = utf8ToBytes(msg);
  const hash = keccak256(bytes);
  return hash;
}

async function signMessage(msg) {
  const hash = hashMessage(msg);
  const signature = secp.sign(hash, privateKey);
  return signature;
}

async function main() {
  const signature = await signMessage(message);
  console.log("signature: ", toHex(signature));
}

main();

// Using sign.js we can generate a signature that will be later verified
// It probably makes sense to use secp.verify(signature, msgHash, publicKey(address)) to verify that the tx was signed
