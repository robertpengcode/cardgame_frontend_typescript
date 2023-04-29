import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles';
import {GameContext} from '../context/GameContext';
import { ethers } from "ethers";
import PageHOC from '../components/PageHOC';
import CustomButton from '../components/CustomButton';
import Alert from '../components/Alert';
import InfoIcon from '../assets/util/infoIcon.svg';

type CharOption = {
    name: string;
    tokenId: number;
}

const CreateBattle: React.FC = () => {
  const { contract, walletAddress, setShowAlert, updateTokens, setUpdateTokens, disableStartBTN, setErrorMessage,
    showAlert, setDisableStartBTN, convertAddress, battleGround, setBattleGround, charactersObj} = useContext(GameContext);
  
  const [playerTokens, setPlayerTokens] = useState(['']);
  const [charactersArr, setCharactersArr] = useState(['']);
  const [charOptionsArr, setCharOptionsArr] = useState<CharOption[]>([]);
  const [charOption, setCharOption] = useState(0);
  const [useBerserk, setUseBerserk] = useState(false);
  const [useForceShield, setUseForceShield] = useState(false);
  const [showBattlePlayer, setShowBattlePlayer] = useState(""); //toDo in the future - need to move this to context
//toDo in the future - meant one treasue a time for now
  const [treasureId, setTreasureId] = useState(0);
  const [treasureQuantity, setTreasureQuantity] = useState(0);

  const navigate = useNavigate();

  const showWalletAddress = walletAddress ? convertAddress(walletAddress) : "";

  const battleGroundsArr = ["--choose a battle ground--", "castle", "forest", "throneroom"];

  useEffect(()=>{
    const convert = (playerTokens: string[]) => {
      const charactersArr = [];
      const charOptionsArr = [{name: "--choose a character--", tokenId: 0}];
      for (let i = 1; i <= 7; i++) {
        if (Number(playerTokens[i]) > 0) {
          charactersArr.push(`${charactersObj[i].name} (Attack:${charactersObj[i].attack}, Defense:${charactersObj[i].defense})`);
          charOptionsArr.push({name: charactersObj[i].name, tokenId: charactersObj[i].tokenId});
        }
      }
      setCharactersArr(charactersArr);
      setCharOptionsArr(charOptionsArr);
    }
  
    const getPlayerTokens = async () => {
      const _playerTokens = [];
      try {
        for (let i = 0; i <= 9; i++ ) {
          const amount = await contract?.getOwnedTokenAmount(walletAddress, i);
          _playerTokens.push(amount.toString());
        }
      } catch (error) {
        console.log('err',error);
        setErrorMessage(error);
      }
      setPlayerTokens(_playerTokens);
      convert(_playerTokens);
    }
    if (contract && walletAddress) getPlayerTokens();
  },[contract, updateTokens, setErrorMessage, walletAddress, charactersObj]);

  const handleBattlePlayer = () => {
    if (charOption > 0 ) {
      const berserk = useBerserk? " + Berserk" : "";
      const forceShield = useForceShield? " + ForceShield" : "";
      const _showBattlePlayer = charactersObj[charOption].name + berserk + forceShield;
      setShowBattlePlayer(_showBattlePlayer);
   }
  }

  const handleMintCharacter = async () => {
    const characterPrice = ethers.parseEther("0.001");
    try {
      const answer = await contract?.mintCharacter({value: characterPrice, gasLimit: 1000000});
      if (answer) {
        setShowAlert({
          status: true,
          type: 'info',
          message: `Mint request submitted! Please wait a few seconds for the confirmation.`,
        });
      }
      contract?.on("MintedCharacter", (player) => {
        setShowAlert({
          status: true,
          type: "success",
          message: "Character has been successfully minted",
        });
        setUpdateTokens(!updateTokens);
      });
    } catch(error) {
      console.log('err', error);
      setErrorMessage(error);
    }
  }

  const handleMintTreasures = async (treasureId: number, treasureQuantity: number) => {
    const treasurePrice = 0.0002;
    const _value = ethers.parseEther((treasurePrice * treasureQuantity).toString());
    try {
      const answer = await contract?.mintTreasure(treasureId, treasureQuantity, {value: _value});
      if (answer) {
        setShowAlert({
          status: true,
          type: 'info',
          message: `Mint request submitted! Please wait a few seconds for the confirmation.`,
        });
      }
      contract?.on("MintedTreasure", (player) => {
        setShowAlert({
          status: true,
          type: "success",
          message: "Treasure has been successfully minted",
        });
        setUpdateTokens(!updateTokens);
      });
    } catch(error) {
      console.log(error);
      setErrorMessage(error);
    }
  }

  const handleSubmit = async () => {
    handleBattlePlayer();
    try {
      await contract?.pickCharacter(charOption);
      if (useBerserk) {
        await contract?.useBerserk();
      }
      if (useForceShield) {
        await contract?.useForceShield();
      }
      setShowAlert({
        status: true,
        type: 'info',
        message: `Character & treasures submitted! Please wait a few seconds for the confirmation.`,
      });
      setCharOption(0);
      setUseBerserk(false);
      setUseForceShield(false);
      contract?.on("PickedCharacter", (player) => {
        setShowAlert({
          status: true,
          type: "success",
          message: "Character has been successfully selected",
        });
        setUpdateTokens(!updateTokens);
      });
      setDisableStartBTN(false);
    } catch(error) {
      console.log(error);
      setErrorMessage(error);
    }
  }

  const handleBattleGround = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bg = e.target.value;
    setBattleGround(bg);
    localStorage.setItem('battleground', bg);
  };

  const handleStartBattle = async () => {
    try {
      const answer = await contract?.playGame();
      if (answer) {
        setShowAlert({
          status: true,
          type: 'info',
          message: `Start battle submitted! Please wait a few seconds for the confirmation.`,
        });
      }
      contract?.on("StartedBattle", (player1, player2, battleId) => {
        setShowAlert({
          status: true,
          type: "success",
          message: "A new battle has been successfully started. You will be redirected in 3 Secs",
        });
        const timer = setTimeout(() => {
        navigate(`/Battle/${battleId}`);
        }, 3000);
        return () => clearTimeout(timer);
      });
    } catch (error) {
      console.log(error);
      setErrorMessage(error);
    }
  };

  const mintCharacterBTN = (
    <CustomButton
          title="Mint Character (0.001 MATIC)"
          handleClick={handleMintCharacter}
          //restStyles="mt-6"
        />
  )

  const mintBerserkBTN = (
    <CustomButton
          title="Mint Berserk (0.0002 MATIC)"
          handleClick={()=>{handleMintTreasures(8,1)}}
          //restStyles="mt-6"
        />
  )

  const mintForceShieldBTN = (
    <CustomButton
          title="Mint Force Shield (0.002 MATIC)"
          handleClick={()=>{handleMintTreasures(9,1)}}
          //restStyles="mt-6"
        />
  )

  const ShowBattlePlayerHere = () => (
    <p className={styles.infoText}>{showBattlePlayer}</p>
  )

  const ShowPlayerTokens = () => (
    <div className="my-2">
      <div className="flex flex-row">
        <p className={styles.infoText}>Characters You ({showWalletAddress}) Own : {charactersArr.join(", ")}</p>
        {charactersArr.length === 0 ? <img src={InfoIcon} alt="info icon"
         title="It's required to own at least one character to play. Please wait 20 secs for updating the list after you mint it." className="ml-1"/> : null}
      </div>
      <div className="flex flex-row">
        <p className={styles.infoText}>Berserk: {playerTokens[8]}</p>
        {playerTokens && Number(playerTokens[8]) === 0 ? <img src={InfoIcon} alt="info icon"
         title="It's optional to own. It increases attack by 1. Please wait 20 secs for updating the amount after you mint it." className="ml-1"/> : null}
      </div>
      <div className="flex flex-row">
        <p className={styles.infoText}>ForceShield: {playerTokens[9]}</p>
        {playerTokens && Number(playerTokens[9]) === 0 ? <img src={InfoIcon} alt="info icon"
         title="It's optional to own. It increases defense by 1. Please wait 20 secs for updating the amount after you mint it." className="ml-1"/> : null}
      </div>
      <div className="flex flex-row content-center">
        {mintCharacterBTN}  {mintBerserkBTN} {mintForceShieldBTN} </div>
    </div>
  )

  const SelectForm = () => (
    <form
    className="flex flex-col mt-2"
    onSubmit={(event)=> {
      event.preventDefault();
      handleSubmit()}}
    >
      <div className="flex flex-row">
      <label htmlFor="character" className={styles.label}>Choose a character (Required) :</label>
    <select value={charOption} name="character" id="character" onChange={(e) => {
                setCharOption(Number(e.target.value));
              }}
    className={styles.select}
    >
      {charOptionsArr? charOptionsArr.map((char, id)=> <option key={id} value={char.tokenId} className="font-play">{char.name}</option>): null}
    </select>
      </div>
   
    {Number(playerTokens[8])>0?          
    <label htmlFor="berserk" className={styles.label}>
      Use Berserk? (Optional) Yes <input type="checkbox" name="berserk" id="berserk" checked={useBerserk} onChange={() => {
                setUseBerserk(!useBerserk);
              }}/>
    </label>: null
    }   
    {Number(playerTokens[9])>0?
    <label htmlFor="forceShield" className={styles.label}>
      Use ForceShield? (Optional) Yes <input type="checkbox" name="forceShield" id="forceShield" checked={useForceShield} onChange={() => {
                setUseForceShield(!useForceShield);
              }}/>
    </label>: null
    }          
    {charOption > 0? <input type="submit" value="Submit Selections" className={styles.btn} /> : null}
  </form>
  )  

  const SelectBattleGround = () => (
    <form>
       <label htmlFor="battleGround" className={styles.label}>Choose a battle ground :</label>
      <select name="battleGround" id="battleGround" value={battleGround}
      className={styles.select} onChange={(e)=> handleBattleGround(e)}>
        {battleGroundsArr.map((bg, id)=><option key={id} value={bg} className="font-play">{bg}</option>)}
      </select>
    </form>
  );

  return (
    <>
      {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}
      <div className="flex flex-col">
        <div className="my-4"><ShowPlayerTokens /></div>
        <div className="my-4"><SelectForm /></div>
        <div className="my-4"><SelectBattleGround /></div>
        <div className="flex flex-row items-center">
          <div className ="mr-2"><ShowBattlePlayerHere/></div>
          <CustomButton
          title="Start Battle"
          handleClick={handleStartBattle}
          isDisabled={disableStartBTN}
          />
        </div>
      </div>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>Start a new Battle</>,
  <>Pick your character and treasures to start a battle</>,
);