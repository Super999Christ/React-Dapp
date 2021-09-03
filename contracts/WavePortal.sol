// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract WavePortal {
  uint numberOfWaves;
  constructor() {
    console.log("Hello Jacob! It's %s", msg.sender);
  }

  function wave() public {
    numberOfWaves += 1;
    console.log("%s is waved!", msg.sender);
  }

  function totalWaves() view public returns (uint) {
    console.log("We have %d total waves", numberOfWaves);
    return numberOfWaves;
  }

  // struct User {
  //   address userAddress;
  //   uint waves;
  // }
  // mapping(address => User) private _userInfo;

}