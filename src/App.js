import logo from './logo.svg';

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

import WavePortal from './artifacts/contracts/WavePortal.sol/WavePortal.json'

export default function App() {
  // State variable to store our user's public wallet address.
  const [currAccount, setCurrentAccount] = useState("")

  const checkIfWalletIsConnected = () => {
    // make sure we have access to window.ethereum
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure your have metamask!")
      return
    } else {
      console.log("We have the ethereum object", ethereum)
    }
    
    // Check if we're authorized to access the user's wallet
    ethereum.request({ method: 'eth_accounts' })
    .then(accounts => {
      // We could have multiple accounts. Check for one.
      if(accounts.length !== 0) {
        // grab the first account we have access to.
        const account = accounts[0];
        console.log("Found and authorized account: ", account)
        
        // Store the users public wallet address for later
        setCurrentAccount(account);
      } else {
        console.log("Noauthorized account found")
      }
    })
  }

  const connectWallet = ( )=> {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get metamask!")
    }

    ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log("Connected", accounts[0])
        setCurrentAccount(accounts[0])
      })
      .catch(err => console.log(err));
  }

  // This runs our function on page load
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hello there...
        </div>

        <div className="bio">
        My name is Jacob and I'm learning Solidity. Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton gradient-button" onClick={null}>
          Wave at Me
        </button>
        {currAccount ? null: (
          <button className="waveButton gradient-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

