const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { verify } = require("./scripts/verifySignature");

app.use(cors());
app.use(express.json());

const balances = {
  "04fa510117d58587cc8658140f304a67adf71891939f49014ad1162a99ae2cba1b90a65ea5162beef115674f6d5cac3ab718a499f7fd55bc037efb0af92a6111ae": 100, // private key: 0af3e0951389d6eb7c19087d3c9dbe4d48691b95646bd8a745c010680fd52c14
  "04bd2d6cb996185ddd41d3716bbe87409ff17689481c05aad492e935f25f642834163827b382de270bd5b2a025f0cda30a484b21bcbf262dcf202e11f331e0c38f": 50, // 420e7df32e49b8125a9a555c7c54c9055fa5dde56e815241a96c2c2895811732
  "045a46c1b0e42b3370e103d5b9c27b51998d88a39a8deab8d00c4df7bf57ae514df4a15334a55cd04c18f8455f875fd4174b4adb5a08bd10f3298a74fffcb337b0": 75, // a038efd12b7b0d862e8508c6b3b3f525a45c32f81b98694c191821f8d2fa4348
};

let currentSender, currentRecipient, currentAmount;
const msg = "0x0"; // Used for msgHash in verifying signature

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  currentSender = sender;
  currentRecipient = recipient;
  currentAmount = amount;

  setInitialBalance(sender);
  setInitialBalance(recipient);
});

app.post("/send-signature", (req, res) => {
  const { data } = req.body;
  console.log(`Received data from the client: ${data}`);

  // Verifying the signature received from the client, using the verify.js script from "scripts" folder
  const verified = verify(currentSender, data, msg);

  if (verified == true) {
    if (balances[currentSender] < currentAmount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[currentSender] -= currentAmount;
      balances[currentRecipient] += currentAmount;
      res.send({
        balance: balances[currentSender],
        message: "Signature verified succesfully!",
      });
    }
  } else {
    console.log("Invalid signature");
    res.status(400).send({ message: "Invalid signature!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
