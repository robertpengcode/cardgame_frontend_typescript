import styles from '../styles';

type ActionButtonProps = {
  imgUrl: string;
  handleClick: () => void;
  restStyles: string;
  titleText: string;
}

const ActionButton = ({ imgUrl, handleClick, restStyles, titleText }: ActionButtonProps) => (
  <div
    className={`${styles.gameMoveBox} ${styles.flexCenter} ${styles.glassEffect} ${restStyles} `}
    onClick={handleClick} title={titleText}
  >
    <img src={imgUrl} alt="action_img" className={styles.gameMoveIcon} title={titleText}/>
  </div>
);

export default ActionButton;