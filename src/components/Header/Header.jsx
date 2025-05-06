import { BsBarChart, BsGear, BsInfoCircle, BsShareFill} from 'react-icons/bs';
import styles from './Header.module.scss';
import './Header.module.scss';

const Header = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
  clue,
  showhint1,
  showhint2,
  showhint3,
  displayhint1,
  displayhint2,
  displayhint3,
  hinttype1,
  hinttype2,
  hinttype3,
  showAlert
}) => {
  return (
    <header>
      <div className={styles.butcon}>
        <button style={{height: "1.6rem"}} onClick={() => setIsInfoModalOpen(true)}>
          <BsInfoCircle size="1.6rem" color="var(--color-icon)" />
        </button>
        <button className={displayhint1==='' ? styles.rlogo1 : styles.rlogo2} onClick={() => showhint1(true)}>
          {hinttype1.charAt(0).toLowerCase()}
        </button>
        <button className={displayhint2==='' ? styles.rlogo1 : styles.rlogo2} onClick={() => showhint2(true)}>
          {hinttype2.charAt(0).toLowerCase()}
        </button>
        <button className={displayhint3==='' ? styles.rlogo1 : styles.rlogo2} onClick={() => showhint3(true)}>
          {hinttype3.charAt(0).toLowerCase()}
        </button>
      </div>
      <h1><a href="https://www.minutecryptic.com/" target="_blank" rel="noopener noreferrer">CRYPTIC</a> <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" rel="noopener noreferrer">WORDLE</a></h1>
      <div className={styles.butcon2}>
        <button onClick={() => {navigator.clipboard.writeText(clue+"\nhttps://ucrypticwordle.netlify.app/"); showAlert('Clue copied to clipboard', 'success');}}>
          <BsShareFill size="1.6rem" color="var(--color-icon)"/>
        </button>
        <button onClick={() => setIsStatsModalOpen(true)}>
          <BsBarChart size="1.6rem" color="var(--color-icon)" />
        </button>
        <button onClick={() => setIsSettingsModalOpen(true)}>
          <BsGear size="1.6rem" color="var(--color-icon)" />
        </button>
      </div>
    </header>
  );
};

export default Header;
