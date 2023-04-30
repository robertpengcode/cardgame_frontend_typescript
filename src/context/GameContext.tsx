import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ABI, ADDRESS } from '../contract/CardBattle';

type Alert = {
  status: boolean;
  type: 'info' | 'success' | 'failure';
  message: string;
}

type GameContextType = {
  contract: ethers.Contract|null;
  walletAddress: string|null;
  provider: ethers.BrowserProvider|null;
  showAlert: Alert;
  setShowAlert: (showAlert: Alert) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string|unknown>>;
  connectWallet: () => void;
  isPlayer: boolean | null;
  setIsPlayer: React.Dispatch<React.SetStateAction<boolean|null>>;
  battleGround: string;
  convertAddress: (address: string) => string;
  charactersObj: {[key: number]: {name: string, attack: number, defense: number, tokenId: number};};
  setBattleGround: React.Dispatch<React.SetStateAction<string>>;
  updateTokens: boolean;
  setUpdateTokens: React.Dispatch<React.SetStateAction<boolean>>;
  disableStartBTN: boolean;
  setDisableStartBTN: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: unknown|string;
  updateEvent: boolean;
  setUpdateEvent: React.Dispatch<React.SetStateAction<boolean>>;
  updateMove: boolean;
  setUpdateMove: React.Dispatch<React.SetStateAction<boolean>>;
}

type GameContextProviderProps = {
  children: React.ReactNode;
}

export const GameContext = createContext({} as GameContextType);

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const [walletAddress, setWalletAddress] = useState<string|null>(null);
  const [battleGround, setBattleGround] = useState('');
  const [contract, setContract] = useState<ethers.Contract|null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isPlayer, setIsPlayer] = useState<boolean|null>(null);
  const [showAlert, setShowAlert] = useState<Alert>({ status: false, type: 'info', message: '' });
  const [errorMessage, setErrorMessage] = useState<unknown|string>('');
  const [updateEvent, setUpdateEvent] = useState(false);
  const [updateTokens, setUpdateTokens] = useState(false);
  const [disableStartBTN, setDisableStartBTN] = useState(true);
  const [updateMove, setUpdateMove] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await newProvider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      const signer = await newProvider.getSigner();
      window.localStorage.setItem("connected", accounts[0]);

      const newContract = new ethers.Contract(ADDRESS, ABI, signer);

      setProvider(newProvider);
      setContract(newContract);
      
      const isPlayer = await newContract.isPlayer(accounts[0]);
      setIsPlayer(isPlayer);
      
    } else {
        setErrorMessage("Please Install MetaMask!!!");
    }
  }

  const restore = async () => {
    const newProvider = new ethers.BrowserProvider(window.ethereum);
      const account = window.localStorage.getItem("connected");
      setWalletAddress(account);
      const signer = await newProvider.getSigner();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);
      setContract(newContract);
      setProvider(newProvider);
      const isPlayer = await newContract.isPlayer(account);
      setIsPlayer(isPlayer);
  }

  //* Set the wallet address to the state
  const updateAddress = async (accounts: string[]) => {
    if (accounts.length === 0) {
      window.localStorage.removeItem("connected");
      setWalletAddress(null);
      setContract(null);
      setIsPlayer(false);
    } else if (accounts[0] === walletAddress) {
      return;
    } else {
      setWalletAddress(accounts[0]);
      window.localStorage.setItem("connected", accounts[0]);
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await newProvider.getSigner();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);
      setContract(newContract);
      setProvider(newProvider);
      const isPlayer = await newContract.isPlayer(accounts[0]);
      setIsPlayer(isPlayer);
    }
  };

  const convertAddress = (addr: string) => {
    return addr.slice(0, 5) + "..." + addr.slice(addr.length - 4);
  };

  const charactersObj = {
    1: {name: "Jeff", attack: 8, defense: 2, tokenId: 1},
    2: {name: "Charlie", attack: 7, defense: 3, tokenId: 2},
    3: {name: "Henley", attack: 7, defense: 3, tokenId: 3},
    4: {name: "Jack", attack: 6, defense: 4, tokenId: 4},
    5: {name: "Bob", attack: 6, defense: 4, tokenId: 5},
    6: {name: "Sophie", attack: 5, defense: 5, tokenId: 6},
    7: {name: "Steve", attack: 5, defense: 5, tokenId: 7}
  }

  useEffect(() => {
    window?.ethereum?.on('accountsChanged', (accounts) => updateAddress(accounts));
  });

  //* Handle alerts
  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: 'info', message: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  //* Handle error messages
  useEffect(() => {
    if (errorMessage) {
      console.log(errorMessage);
      setShowAlert({
        status: true,
        type: 'failure',
        message: 'Something went wrong!',
      });
    }
  }, [errorMessage]);

  useEffect(()=>{
    if(window.ethereum && window.localStorage.getItem("connected")) {
      restore();
    } else {
      //console.log('no need to do anything');
      return;
    }
  },[]);

  return (
    <GameContext.Provider
      value={{
        battleGround,
        setBattleGround,
        provider,
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
        errorMessage,
        setErrorMessage,
        connectWallet,
        isPlayer,
        setIsPlayer,
        updateEvent,
        setUpdateEvent,
        updateTokens,
        setUpdateTokens,
        disableStartBTN,
        setDisableStartBTN,
        updateMove,
        setUpdateMove,
        convertAddress,
        charactersObj,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
