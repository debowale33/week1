const fs = require("fs"); //this line imports the file system module
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/; //this is a regular expression that checks for the pragma solidity version that is set in the contract and sets it to the variable "solidityRegex"

const verifierRegex = /contract Verifier/; //this is a regular expression that checks for the declaration of the contract verifier and stores it in the variable verifierRegex

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", {
  encoding: "utf-8",
});
let bumped = content.replace(solidityRegex, "pragma solidity ^0.8.0"); //this replaces the old solidity version in the contract with ^0.8.0
bumped = bumped.replace(verifierRegex, "contract HelloWorldVerifier"); //this changes the declaration of the contract from "Verifier" to "HelloWorldVerifier"

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped); // fs.writeFileSync() applies the changes stored in the variable "bumped" to the contract  ./contracts/HelloWorldVerifier.sol

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

let content_ = fs.readFileSync("./contracts/Multiplier3Verifier.sol", {
  encoding: "utf-8",
}); //this line specifies utf-8 to be the encoding of the contract "./contracts/Multiplier3Verifier.sol"
let bumped_ = content_.replace(solidityRegex, "pragma solidity ^0.8.0"); //this line changes the old solidity version in the contract to ^0.8.0
bumped_ = bumped_.replace(verifierRegex, "contract Multiplier3Verifier"); //this changes the declaration of the contract from "Verifier" to "Multiplier3Verifier"

fs.writeFileSync("./contracts/Multiplier3Verifier.sol", bumped_); // fs.writeFileSync() applies the changes stored in the variable "bumped_" to the contract  "./contracts/Multiplier3Verifier.sol"
