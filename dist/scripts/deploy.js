"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
async function main() {
    const Greeter = await hardhat_1.ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, Hardhat!");
    await greeter.deployed();
    console.log("Greeter deployed to:", greeter.address);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
