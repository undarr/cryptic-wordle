import { BsBarChart, BsGear, BsInfoCircle, BsFillQuestionDiamondFill, BsQuestionDiamond, BsShareFill} from 'react-icons/bs';
import './Header.module.scss';

const Header = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
  clue,
  showhint,
  displayhint,
  showAlert
}) => {
  return (
    <header>
      <div>
        <button onClick={() => setIsInfoModalOpen(true)}>
          <BsInfoCircle size="1.6rem" color="var(--color-icon)" />
        </button>
        <button onClick={() => showhint(true)}>
          {displayhint==='' ? <BsQuestionDiamond  size="1.6rem" color="var(--color-icon)" /> :
          <BsFillQuestionDiamondFill  size="1.6rem" color="var(--color-icon)" />}
        </button>
      </div>
      <h1><a href="https://www.minutecryptic.com/" target="_blank" rel="noopener noreferrer">CRYPTIC</a> <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" rel="noopener noreferrer">WORDLE</a></h1>
      <div>
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
