import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('VotePlatform', () => {
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let contract: Contract;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const VotePlatform = await ethers.getContractFactory('VotePlatform', owner);
    contract = await VotePlatform.deploy();
    await contract.deployed();
  });
});
