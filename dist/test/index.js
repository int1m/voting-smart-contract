"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
describe('VotingPlatform', () => {
    let owner;
    let user;
    let contract;
    beforeEach(async () => {
        [owner, user] = await hardhat_1.ethers.getSigners();
        const AucEngine = await hardhat_1.ethers.getContractFactory('AucEngine', owner);
        contract = await AucEngine.deploy();
        await contract.deployed();
    });
    it('Test deployed', async () => {
        const result = contract.test(0);
    });
});
