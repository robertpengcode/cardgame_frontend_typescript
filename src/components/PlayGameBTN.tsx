import styles from '../styles';
import CustomButton from './CustomButton';

type PlayGameBTNProps = {
  showWalletAddress: string;
  handlePlayGame: () => void;
}

const PlayGameBTN = ({showWalletAddress, handlePlayGame }: PlayGameBTNProps) => (
    <div className="flex flex-col">
    <p className={styles.normalText}>{showWalletAddress} registered!</p>
    <CustomButton
      title="Play Game"
      handleClick={handlePlayGame}
    />  
  </div>
);

export default PlayGameBTN;