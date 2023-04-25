# ECDSA Node
Alchemy University Week 1 Project

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

I decided to use the signature to verify the transaction. Before transfering funds, client-side application prompts user for his signature (that was created by sign.js) and sends it to the server. If the server verifies the signature using secp.verify() => transfer is allowed. Otherwise user is denied if he is unable to provide the valid signature.
