import CustomButton from './CustomButton';

type ConnectBTNProp = {
  handleConnectWallet: () => void;
}

const ConnectBTN = ({handleConnectWallet}: ConnectBTNProp) => (
  <div className="flex flex-col">
    <CustomButton
      title="Connect To Wallet"
      handleClick={handleConnectWallet}
    />  
  </div>
);

export default ConnectBTN;