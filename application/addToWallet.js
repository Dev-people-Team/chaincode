const fs = require("fs");
const { Wallets } = require("fabric-network");
const path = require("path");

async function main() {
    // Main try/catch block
    try {
        // A wallet stores a collection of identities

        const username = "kihyun11";

        const wallet = await Wallets.newFileSystemWallet("wallet");
        // const wallet = await Wallets.newFileSystemWallet("wallet");
        
        const checkidentity = await wallet.get(username);
        if (checkidentity) {
            console.log(
                `An identity for the user ${username} already exists in the wallet`
            );
            return;
        }

        // Identity to credentials to be stored in the wallet
        const credPath = path.join(__dirname, "msp");
        const certificate = fs
            .readFileSync(
                path.join(
                    credPath,
                    "/org3.example.com/users/signcerts/User1@org3.example.com-cert.pem"
                )
            )
            .toString();
        const privateKey = fs
            .readFileSync(
                path.join(credPath, "/org3.example.com/users/keystore/priv_sk")
            )
            .toString();

        // Load credentials into wallet
        const identityLabel = username;

        const identity = {
            credentials: {
                certificate,
                privateKey,
            },
            mspId: "Org3MSP",
            type: "X.509",
        };

        await wallet.put(identityLabel, identity);
        console.log(`Successfully import an user(${username}) into the wallet`);
    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

main();
