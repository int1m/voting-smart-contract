import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { delay } from '@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService';
import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
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
    await contract.createVote(
      false,
      Math.round(Date.now() / 1000) - 60,
      Math.round(Date.now() / 1000) + 84600,
      Math.round(Date.now() / 1000) + 84600,
      oracle.candidates,
      100,
      oracle.modulus,
      oracle.exponent,
    );
  });

  it('should get Vote by index and call Vote method', async () => {
    contract.on('VoteAdded', async (eIndex: BigNumber) => {
      const candidatesArrayLength = ethers.BigNumber.from(
        await contract.votes[eIndex.toNumber()].getCandidateCount(),
      ).toNumber();
      expect(candidatesArrayLength).to.be.equal(1);
    });

    await delay(1000);
    await contract.createVote(
      false,
      Math.round(Date.now() / 1000) - 60,
      Math.round(Date.now() / 1000) + 84600,
      Math.round(Date.now() / 1000) + 84600,
      oracle.candidates,
      100,
      oracle.modulus,
      oracle.exponent,
    );

    await delay(3000);
  }).timeout(5000);

  it('should emitted event added vote', async () => {
    await expect(
      contract.createVote(
        false,
        Math.round(Date.now() / 1000) - 60,
        Math.round(Date.now() / 1000) + 84600,
        Math.round(Date.now() / 1000) + 84600,
        oracle.candidates,
        100,
        oracle.modulus,
        oracle.exponent,
      ),
    ).to.emit(contract, 'VoteAdded').withArgs(0);
  });

  it('should return votes array length', async () => {
    await contract.createVote(
      false,
      Math.round(Date.now() / 1000) - 60,
      Math.round(Date.now() / 1000) + 84600,
      Math.round(Date.now() / 1000) + 84600,
      oracle.candidates,
      100,
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
        Math.round(Date.now() / 1000) + 84600,
        oracle.candidates,
        100,
        oracle.modulus,
        oracle.exponent,
      ),
    ).to.be.revertedWith('Caller is not the owner');
  });
});
