import React from 'react';
import Tilt from 'react-parallax-tilt';
import styles from '../styles';

type CardProps = {
  card: string;
  charImg: string;
  charName: string;
  restStyles: string;
  //cardRef: string;
  attack: number;
  defense: number
}

const Card = ({ card, charImg, charName, restStyles, attack, defense }: CardProps) => (
  <Tilt>
    <div className={`${styles.cardContainer} ${restStyles}`}>
      <img src={card} alt="game card" className={styles.cardImg} />

      <div className={`${styles.charImgContainer} bottom-[18%] sm:left-[22.8%] left-[22.8%] ${styles.flexCenter}`} title="character">
        <img src={charImg} alt="character" className={`${styles.charImg}`} />
      </div>

      <div className={`${styles.cardPointContainer} bottom-[88%] sm:left-[5.8%] left-[5.8%] ${styles.flexCenter}`} title="attack value">
        <p className={`${styles.cardPoint} text-red-500`}>{attack}</p>
      </div>
      <div className={`${styles.cardPointContainer} bottom-[88%] sm:right-[5.8%] right-[5.8%] ${styles.flexCenter}`} title="defense value">
        <p className={`${styles.cardPoint} text-green-700`}>{defense}</p>
      </div>

      <div className={`${styles.cardPointContainer} bottom-[1%] sm:left-[5.8%] left-[5.8%] ${styles.flexCenter}`} title="defense value">
        <p className={`${styles.cardPoint} text-green-700`}>{defense}</p>
      </div>
      <div className={`${styles.cardPointContainer} bottom-[1%] sm:right-[5.8%] right-[5.8%] ${styles.flexCenter}`} title="attack value">
        <p className={`${styles.cardPoint} text-red-500`}>{attack}</p>
      </div>

      <div className={`${styles.cardTextContainer} ${styles.flexCenter}`}>
        <p className={styles.cardText}>{charName}</p>
      </div>
    </div>
  </Tilt>
);

export default Card;