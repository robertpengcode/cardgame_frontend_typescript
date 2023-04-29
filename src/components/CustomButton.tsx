import styles from '../styles';

type CustomButtonProps = {
  title: string;
  handleClick: () => void;
  isDisabled?: boolean;
}

const CustomButton = ({ title, handleClick, isDisabled }: CustomButtonProps) => (
  <button
    type="button"
    className={isDisabled ? `${styles.btnDisabled}`: `${styles.btn}`}
    onClick={handleClick}
    disabled={isDisabled}
  >
    {title}
  </button>
);

export default CustomButton;
