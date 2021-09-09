import { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {
  // State variable to store our user's public wallet address.
  const [currAccount, setCurrentAccount] = useState("")
  const [userMessage, setUserMessage] = useState("")
  const [allWaves, setAllWaves] = useState([])

  const contractAddress = "0xaB2444cdc640B1C9f8D05407846058b7b9812E11"
  const contractABI = abi.abi

  const handleInputChange = ({ target }) => {
    let usermsg = target.value
    setUserMessage(usermsg)
  }

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
        console.log("Found and authorized account: ", account);
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

  const wave = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await waveportalContract.getTotalWaves()
    console.log("Retrieved total wave count...", count.toNumber())

    const waveTxn = await waveportalContract.wave(`${userMessage}`, { gasLimit: 300000 })
    console.log("Mining...", waveTxn.hash)
    await waveTxn.wait()
    console.log("Mined -- ", waveTxn.hash)
    count = await waveportalContract.getTotalWaves()
    console.log("Retreived total wave count...", count.toNumber())

  }

  const getAllWaves = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let waves = await waveportalContract.getAllWaves()

    let wavesCleaned = []
    waves.forEach(wave => {
      console.log("wave", wave)
      wavesCleaned.push({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message
      })
    })
    console.log("cleaned", wavesCleaned)
    setAllWaves(wavesCleaned)

    waveportalContract.on("NewWave", (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message)
      setAllWaves(oldArray => [...oldArray, {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message
      }])
    })
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
        <div className="form">
          <div className="bio">
            My name is Jacob and I'm learning Solidity. Connect your Ethereum wallet, enter your message, and wave at me!
          </div>
          <div className="formCenter">
            <textarea
              className="textarea"
              onChange={handleInputChange}
              placeholder="drop me a line and hit that wave button..."
            />
          </div>
          <div className="formCenter">
            <button className="waveButton gradient-button" onClick={wave}>
              Wave at Me and maybe win some ETH
            </button>
          </div>
          {currAccount ? null: (
            <button className="waveButton gradient-button" onClick={connectWallet}>
              Connect your MetaMask Wallet to Wave
            </button>
          )}
        </div>
          <div className="header">
            Previous Waves
          </div>
        {allWaves.slice(0).reverse().map((wave, index) => {
          return (
            <div className="waveCard" key={index}>
              <div style={{float: "left"}}>
                <div className="waveText">Address: {wave.address}</div>
                <div className="waveText">Time: {wave.timestamp.toString()}</div>
                <div className="waveText">Message: {wave.message}</div>
              </div>
              <div style={{float: 'right'}}>
                <img src='https://i.ibb.co/BC7TG9F/4691461-ethereum-icon.png' alt='ethereum logo' width='40' height='40' style={{margin: '15px'}}/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

