import styles from '../styles';
import king from '../assets/util/king.png';
import dead from '../assets/util/dead.png';
import neutral from '../assets/util/neutral.png';

const healthPoints = 10;
const noOne = "0x000...0000";
const healthLevel = (points: number) => (points >= 7 ? 'bg-green-500' : points >= 3 ? 'bg-orange-500' : 'bg-red-500');
const marginIndexing = (index: number) => (index !== healthPoints - 1 ? 'mr-1' : 'mr-0');

type PlayerInfoProps = {
  player: string;
  health: number;
  status: string
}

const PlayerInfo = ({ player, health, status}: PlayerInfoProps) => (

  <div className={`${styles.flexCenter} flex-col`}>

    {status === "Won" || status === "Lost" || status === "Tied" ?
     <img src={status === "Won"? king : status === "Lost" ? dead : neutral} className="w-[50px] h-[50px]" alt="icon"/> : null
    }
    
    <div className={styles.playerText}>{player === noOne ? "Waiting for player2..." : `Player: ${player} ${status}`}</div>
    <div
      data-tip={`Health: ${health}`}
      className={styles.playerHealth}
    >
      
      {
        // @ts-ignore 
      [...Array(health).keys()].map((item, index) => (
        <div
          key={`player-item-${item}`}
          className={`${styles.playerHealthBar} ${healthLevel(health)} ${marginIndexing(index)}`}
        />
      ))}
    </div>

  </div>
);

export default PlayerInfo;