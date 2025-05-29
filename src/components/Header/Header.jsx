import { BsBarChart, BsGear, BsInfoCircle, BsShareFill, BsQuestionDiamond} from 'react-icons/bs';
import styles from './Header.module.scss';
import './Header.module.scss';

const Header = ({
  setIsHintModalOpen,
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
  sharemsg,
  showAlert,
  swapclue,
  sclue
}) => {
  return (
    <header>
      <div id="div1" className={styles.butcon}>
        <button style={{height: "1.6rem"}} onClick={() => setIsInfoModalOpen(true)}>
          <BsInfoCircle size="1.6rem" color="var(--color-icon)" />
        </button>
        <button style={{height: "1.6rem"}} onClick={() => setIsHintModalOpen(true)}>
          <BsQuestionDiamond size="1.6rem" color="var(--color-icon)" />
        </button>
      </div>
      <h1>{sclue==="M" ? <a href="https://www.minutecryptic.com/" target="_blank" rel="noopener noreferrer">MCRYPTIC</a> : <a href="https://dailycrypticle.com/dailyclue.html" target="_blank" rel="noopener noreferrer">DCRYPTIC</a>} <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" rel="noopener noreferrer">WORDLE</a></h1>
      <div id="div2" className={styles.butcon2}>
        <button style={{height: "1.6rem"}} onClick={() => {sharemsg(); showAlert('Game copied to clipboard', 'success');}}>
          <BsShareFill size="1.6rem" color="var(--color-icon)"/>
        </button>
        <button style={{height: "1.6rem"}} onClick={() => setIsStatsModalOpen(true)}>
          <BsBarChart size="1.6rem" color="var(--color-icon)" />
        </button>
        <button style={{height: "1.6rem"}} onClick={() => setIsSettingsModalOpen(true)}>
          <BsGear size="1.6rem" color="var(--color-icon)" />
        </button>
        <button className={styles.rlogo1} onClick={() => swapclue(true)}>
          {sclue==="M" ? "D" : "M"}
        </button>
      </div>
    </header>
  );
};

export default Header;
