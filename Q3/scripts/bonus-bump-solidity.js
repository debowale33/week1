const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

// let content = fs.readFileSync("./contracts/SystemOfEquationsVerifier.sol", { encoding: 'utf-8' });
// let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
// bumped = bumped.replace(verifierRegex, 'contract SystemOfEquationsVerifier');

// fs.writeFileSync("./contracts/SystemOfEquationsVerifier.sol", bumped);

// writing a scipt for test compile

let content_ = fs.readFileSync("./contracts/LessThan10TestVerifier.sol", { encoding: 'utf-8' });
let bumped_ = content_.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped_ = bumped_.replace(verifierRegex, 'contract LessThan10TestVerifier');

fs.writeFileSync("./contracts/LessThan10TestVerifier.sol", bumped_);
