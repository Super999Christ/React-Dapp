// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
  uint totalWaves;

  // google what events are in Solidity
  event NewWave(address indexed from, uint timestamp, string message);

  // created a struct here named Wave.
  // a struct is a custom stattype where we can customize what we want to hold inside it.
  struct Wave {
    // the address of the user who waved
    address waver; 
    // The message the user sent
    string message;
    // the timestamp when the user waved
    uint timestamp;
  }

  // declare a variable waves that lets me store an array of structs. this is what lets us hold all the waves anyone sends to us
  Wave[] waves;

  constructor() payable {
    console.log("we have been constructed");
  }

  // we delta'd the wave function a little as well and now it requires a string called message. This is the message our user sends us from the frontend.
  function wave(string memory _message) public {
    totalWaves += 1;
    console.log("%s waved w/ message %s", msg.sender, _message);

  // this is where we store the wave data in the array
  waves.push(Wave(msg.sender, _message, block.timestamp));

  // add some fanciness, google it to figure out what it is
  emit NewWave(msg.sender, block.timestamp, _message);

  uint prizeAmount = 0.0001 ether;
  require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has.");
  (bool success,) = (msg.sender).call{value: prizeAmount}("");
  require(success, "Failed to withdraw money from contract.");
  }

  // add function totalWaves which returns the struct array waces to us. this makes it easy to retrieve the waves from our website
  function getAllWaves() view public returns (Wave[] memory) {
    return waves;
  }

  function getTotalWaves() view public returns (uint) {
    return totalWaves;
  }
}