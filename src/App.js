import { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {
  // State variable to store our user's public wallet address.
  const [currAccount, setCurrentAccount] = useState("")
  const contractAddress = "0xB7181CCd1c5fDC2De598a4B3Bd38656f8868BEBf"
  const contractABI = abi.abi

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

        getAllWaves()
      } else {
        console.log("Noauthorized account found")
      }
    })
  }

  const connectWallet = ()=> {
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

  const [allWaves, setAllWaves] = useState([])
  async function getAllWaves() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let waves = await waveportalContract.getAllWaves()

    let wavesCleaned = []
    waves.forEach(wave => {
      wavesCleaned.push({
        address: wave.address,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message
      })
      // console.log(wave.address)
    })

    setAllWaves(wavesCleaned)
  }

  const wave = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await waveportalContract.getTotalWaves()
    console.log("Retrieved total wave count...", count.toNumber())

    const waveTxn = await waveportalContract.wave("this is a message")
    console.log("Mining...", waveTxn.hash)
    await waveTxn.wait()
    console.log("Mined -- ", waveTxn.hash)

    count = await waveportalContract.getTotalWaves()
    console.log("Retreived total wave count...", count.toNumber())
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

        <button className="waveButton gradient-button" onClick={wave}>
          Wave at Me
        </button>

        {currAccount ? null: (
          <button className="waveButton gradient-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          // console.log(wave)
          return (
            <div style={{backgroundColor: "OldLace", marginTop: "16px", padding: "8px"}} key={index}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

