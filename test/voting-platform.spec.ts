import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { Oracle } from '../scripts/Oracle';

describe('VotingPlatform', () => {
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let contract: Contract;
  const oracle = new Oracle();

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const VotePlatform = await ethers.getContractFactory('VotingPlatform', owner);
    contract = await VotePlatform.deploy();
    await contract.deployed();
  });

  it('should create vote', async () => {
    const result = await contract.createVote(
      false,
      Math.round(Date.now() / 1000) - 60,
      Math.round(Date.now() / 1000) + 84600,
      oracle.candidates,
      oracle.modulus,
      oracle.exponent,
    );

    const ballotIndex = ethers.BigNumber.from(result.value).toNumber();

    await expect(ballotIndex).to.be.equal(0);
  });

  it('should return votes array length', async () => {
    await contract.createVote(
      false,
      Math.round(Date.now() / 1000) - 60,
      Math.round(Date.now() / 1000) + 84600,
      oracle.candidates,
      oracle.modulus,
      oracle.exponent,
    );

    const votesArrayLength = ethers.BigNumber.from(
      await contract.getVotesCount(),
    ).toNumber();
    expect(votesArrayLength).to.be.equal(1);
  });

  it('should throw an error caller is not the owner', async () => {
    await expect(
      contract.connect(user).createVote(
        false,
        Math.round(Date.now() / 1000) - 60,
        Math.round(Date.now() / 1000) + 84600,
        oracle.candidates,
        oracle.modulus,
        oracle.exponent,
      ),
    ).to.be.revertedWith('Caller is not the owner');
  });
});
