import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { keyGeneration, sign } from './rsablind';

interface Candidate {
  id: number,
  name: string,
}

class Oracle {
  public candidates: Array<Candidate> = [{ id: 0, name: 'yes' }, { id: 1, name: 'no' }];

  private validatorKeys = keyGeneration({ b: 256 });

  public modulus = this.validatorKeys.keyPair.n.toString();

  public exponent = this.validatorKeys.keyPair.e.toString();

  public singBallot(ballot: unknown): BigInteger {
    return sign({
      message: ballot,
      key: this.validatorKeys,
    });
  }

  public async createTestVoting(
    owner: SignerWithAddress,
    multipleChoice = false,
    dateOfStart: number = Math.round(Date.now() / 1000) - 60,
    dateOfEnd: number = Math.round(Date.now() / 1000) + 86400,
    dateOfEndAddPrivateKeys: number = Math.round(Date.now() / 1000) + 86400,
    votersCount = 100,
  ): Promise<Contract> {
    const Vote = await ethers.getContractFactory('Vote', owner);
    const contract = await Vote.deploy(
      multipleChoice,
      dateOfStart,
      dateOfEnd,
      dateOfEndAddPrivateKeys,
      this.candidates,
      votersCount,
      this.modulus,
      this.exponent,
    );
    await contract.deployed();
    return contract;
  }
}

export { Oracle, Candidate };
