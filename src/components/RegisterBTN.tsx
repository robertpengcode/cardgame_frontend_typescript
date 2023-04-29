import styles from '../styles';
import CustomButton from './CustomButton';

type RegisterBTNProps = {
  showWalletAddress: string;
  handleRegisterPlayer: () => void;
}

const RegisterBTN = ({showWalletAddress, handleRegisterPlayer }: RegisterBTNProps) => (
  <div className="flex flex-col">
    <p className={styles.normalText}>{showWalletAddress} connected!</p>
    <CustomButton
      title="Register To Play"
      handleClick={handleRegisterPlayer}
    /> 
  </div>
);

export default RegisterBTN;