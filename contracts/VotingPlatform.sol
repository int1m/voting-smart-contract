//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./VotingPlatformLib.sol";
import "./Vote.sol";

contract VotingPlatform {
    address public owner;
    Vote[] private votes;

    event VoteAdded(uint index);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'Caller is not the owner');
        _;
    }

    function getVotesCount() external view returns (uint) {
        return votes.length;
    }

    function createVote(
        bool _multipleChoice,
        uint _dateOfStart,
        uint _dateOfEnd,
        VotingPlatformLib.Candidate[] memory _candidates,
        uint _modulus,
        uint _exponent
    ) external onlyOwner {
        votes.push(
            new Vote(
                _multipleChoice,
                _dateOfStart,
                _dateOfEnd,
                _candidates,
                _modulus,
                _exponent
            )
        );
        emit VoteAdded(votes.length - 1);
    }
}
