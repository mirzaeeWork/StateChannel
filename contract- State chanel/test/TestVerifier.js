
// const { expect } = require("chai");

// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// describe("VerifierContract", function () {

//     it("should be able Verifier", async function () {
//         console.log('------------------------------------------')
//         const ExampVerifier = await hre.ethers.getContractFactory("Verifier");
//         const exampleVerifier = await ExampVerifier.deploy();

//         await exampleVerifier.deployed();

//         console.log("YourToken deployed to:", exampleVerifier.address);
//         const [addr1, addr2] = await ethers.getSigners();
//         console.log(addr1.address)
//         let message = "Hello World"
//         let signature =await addr1.signMessage(message)
//         let sig = ethers.utils.splitSignature(signature)
//         let promise = exampleVerifier.verifyString(message, sig.v, sig.r, sig.s);
//         promise.then(function (signer) {    // Check the computed signer matches the actual signer
//             console.log("wallet.address : " + addr1.address)
//             console.log("signer : " + signer)
//             console.log(signer === addr1.address);
//             console.log("V : "+ sig.v );
//             console.log("R : "+ sig.r);
//             console.log("S : "+ sig.s);

//         });

//         // const accounts = config.networks.hardhat.accounts;
//         // console.log("accounts : " + accounts.address)
//         // const index = 0; // first wallet, increment for next wallets
//         // const wallet1 = ethers.Wallet.fromMnemonic(accounts.mnemonic, accounts.path + `/${index}`);

//         // const privateKey1 = wallet1.privateKey
//         // console.log("privateKey1 : " + privateKey1)
//         // let wallet = new ethers.Wallet(privateKey1);

//         // let message = "Hello World";// Sign the message (this could also come from eth_signMessage)
//         // let signature =await wallet.signMessage(message)// Split the signature into its r, s and v (Solidity's format)
//         // let sig = ethers.utils.splitSignature(signature);// Call the contract with the message and signature
//         // let promise = exampleVerifier.verifyString(message, sig.v, sig.r, sig.s);
//         // promise.then(function (signer) {    // Check the computed signer matches the actual signer
//         //     console.log("wallet.address : " + wallet.address)
//         //     console.log("signer : " + signer)
//         //     console.log(signer === wallet.address);
//         // });
//     });



// });

