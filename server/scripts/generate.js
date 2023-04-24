const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.utils.randomPrivateKey();

console.log("private key: ", toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

const address = keccak256(publicKey.slice(1)).slice(-20);

// I decided not to slice the publicKey as it makes it impossible to verify the signature with secp.verify
console.log("address: ", toHex(publicKey));
