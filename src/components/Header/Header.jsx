import { BsBarChart, BsGear, BsInfoCircle } from 'react-icons/bs';
import './Header.module.scss';

const Header = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
}) => {
  return (
    <header>
      <div>
        <button onClick={() => setIsInfoModalOpen(true)}>
          <BsInfoCircle size="1.6rem" color="#fff" />
        </button>
      </div>
      <h1>WORDLE</h1>
      <div>
        <button onClick={() => setIsStatsModalOpen(true)}>
          <BsBarChart size="1.6rem" color="#fff" />
        </button>
        <button onClick={() => setIsSettingsModalOpen(true)}>
          <BsGear size="1.6rem" color="#fff" />
        </button>
      </div>
    </header>
  );
};

export default Header;
