const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

function unstringifyBigInts(o) {
  if (typeof o == "string" && /^[0-9]+$/.test(o)) {
    return BigInt(o);
  } else if (typeof o == "string" && /^0x[0-9a-fA-F]+$/.test(o)) {
    return BigInt(o);
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
    if (o === null) return null;
    const res = {};
    const keys = Object.keys(o);
    keys.forEach((k) => {
      res[k] = unstringifyBigInts(o[k]);
    });
    return res;
  } else {
    return o;
  }
}

describe("HelloWorld", function () {
  let Verifier;
  let verifier;

  beforeEach(async function () {
    Verifier = await ethers.getContractFactory("HelloWorldVerifier");
    verifier = await Verifier.deploy();
    await verifier.deployed();
  });

  it("Should return true for correct proof", async function () {
    //[assignment] Add comments to explain what each line is doing
    const { proof, publicSignals } = await groth16.fullProve(
      { a: "1", b: "2" },
      "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm",
      "contracts/circuits/HelloWorld/circuit_final.zkey"
    );

    console.log("1x2 =", publicSignals[0]);

    const editedPublicSignals = unstringifyBigInts(publicSignals);
    const editedProof = unstringifyBigInts(proof);
    const calldata = await groth16.exportSolidityCallData(
      editedProof,
      editedPublicSignals
    );

    const argv = calldata
      .replace(/["[\]\s]/g, "")
      .split(",")
      .map((x) => BigInt(x).toString());

    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = argv.slice(8);

    expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
  });
  it("Should return false for invalid proof", async function () {
    let a = [0, 0];
    let b = [
      [0, 0],
      [0, 0],
    ];
    let c = [0, 0];
    let d = [0];
    expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
  });
});

describe("Multiplier3 with Groth16", function () {
  let Verifier;
  let verifier;

  beforeEach(async function () {
    Verifier = await ethers.getContractFactory("Multiplier3Verifier");
    verifier = await Verifier.deploy();
    await verifier.deployed();
  });

  it("Should return true for correct proof", async function () {
    //[assignment] Add comments to explain what each line is doing
    const { proof, publicSignals } = await groth16.fullProve(
      { in1: "2", in2: "3", in3: "5" },
      "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm",
      "contracts/circuits/Multiplier3/circuit_final.zkey"
    ); // this function takes in the inputs for the proof, the wasm file and the zkey and generates a proof anf publicsignals

    console.log("2x3x5 =", publicSignals[0]);

    const editedPublicSignals = unstringifyBigInts(publicSignals);
    const editedProof = unstringifyBigInts(proof);
    const calldata = await groth16.exportSolidityCallData(
      editedProof,
      editedPublicSignals
    ); // this function takes in the proof and public signals and generates a calldata in the format that the groth16 smart contract verifier needs

    const argv = calldata
      .replace(/["[\]\s]/g, "")// this is a regular expression to remove all the square brackets, spaces and quotation marks in the calldata
      .split(",")
      .map((x) => BigInt(x).toString());

    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = argv.slice(8);

    expect(await verifier.verifyProof(a, b, c, Input)).to.be.true; //this function passes in the inputs to the verifier contract
  });

  it("Should return false for invalid proof", async function () { // this function passes in a wrong value and tests.. It should return false
    let a = [0, 0];
    let b = [
      [0, 0],
      [0, 0],
    ];
    let c = [0, 0];
    let d = [0];
    expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
  });
});

describe("Multiplier3 with PLONK", function () {
  let Verifier;
  let verifier;

  beforeEach(async function () {
    Verifier = await ethers.getContractFactory("PlonkVerifier");
    verifier = await Verifier.deploy();
    await verifier.deployed();
  });

  it("Should return true for correct proof", async function () {
    //[assignment] Add comments to explain what each line is doing
    const { proof, publicSignals } = await plonk.fullProve(
      { in1: "2", in2: "3", in3: "5" },
      "contracts/circuits/_plonk/Multiplier3_js/Multiplier3.wasm",
      "contracts/circuits/_plonk/circuit_final.zkey"
    );// this line takes in the inputs for the proof, the wasm file and the zkey and generates a proof andd publicsignals

    console.log("2x3x5 =", publicSignals[0]);
    const editedPublicSignals = unstringifyBigInts(publicSignals);
    //console.log("this is publicsignals -->",editedPublicSignals);
    const editedProof = unstringifyBigInts(proof);
    const calldata = await plonk.exportSolidityCallData(
      editedProof,
      editedPublicSignals
    ); // this function takes in the proof and public signals and generates a calldata in the format that the plonk smart contract verifier needs
    
    const argv = calldata.split(","); //this splits the calldata by the comma
   
    let proof_ = argv[0];
    let cleanedPub_ = argv[1].replace(/["[\]\s]/g, ""); // this is a regular expression to remove all the square brackets, spaces and quotation marks on the public signals
    let pub_ = [BigInt(cleanedPub_)]; // this function turns the public signals into BigInts and puts it in an array so it can be passed into the smart contract verifier in the right format

    expect(await verifier.verifyProof(proof_, pub_)).to.be.true; //this function passes in the correct inputs to the verifier smart contract and should be return true 
  });

  it("Should return false for invalid proof", async function () {
    let proof_ = 0x00;
    let pub_ = [0];
    expect(await verifier.verifyProof(proof_, pub_)).to.be.false;//this function passes in the wrong inputs to the verifier smart contract and should return false 
  });
});
