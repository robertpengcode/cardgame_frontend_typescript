import styles from '../styles';
import AlertIcon from '../assets/AlertIcon';

type AlertProps = {
  type: 'info' | 'success' | 'failure';
  message: string;
}

const Alert = ({ type, message }: AlertProps) => (
  <div className={`${styles.alertContainer} ${styles.flexCenter}`}>
    <div className={`${styles.alertWrapper} ${styles[type]}`} role="alert">
      <AlertIcon type={type} /> {message}
    </div>
  </div>
);

export default Alert;