import classNames from 'classnames';
import CountDown from 'react-countdown';
import Modal from 'components/Modal';
import styles from './StatsModal.module.scss';

const StatsModal = ({
  isOpen,
  onClose,
  gameStats,
  numberOfGuessesMade,
  ismGameWon,
  ismGameLost,
  isdGameWon,
  isdGameLost,
  isHardMode,
  guesses,
  showAlert,
  tomorrow,
  shareStatus,
  mclue, mv, msol, mmsg, dclue, dv, dsol, dmsg, swap
}) => {
  const handleShare = () => {
    shareStatus();
    showAlert('Game copied to clipboard', 'success');
  };

  return (
    <Modal title="Status" isOpen={isOpen} onClose={onClose} nogap={true}>
      {true ? <></> : <div className={styles.statsBar}>
        <StatItem label="Played" value={gameStats.totalGames} />
        <StatItem label="Win Rate %" value={gameStats.successRate} />
        <StatItem label="Current Streak" value={gameStats.currentStreak} />
        <StatItem label="Best Streak" value={gameStats.bestStreak} />
      </div>}
      {true ? <></> : <><h2>Guess Distribution (del)</h2>
        <div className={styles.winDistribution}>
        {gameStats.winDistribution.map((value, i) => (
          <Progress
            key={i}
            index={i}
            currentDayStatRow={numberOfGuessesMade === i + 1}
            size={90 * (value / Math.max(...gameStats.winDistribution))}
            label={String(value)}
          />
      ))}</div></>}

      <h2>Minute Cryptic</h2>
      <h3 style={{"marginBottom" : 0}}>{mclue}</h3>
      <h3 style={{"marginBottom" : 0}}>{mmsg}</h3>
      {(ismGameWon || ismGameLost) ? <div className={styles.bgrid}><div className={styles.result}><button onClick={() => {window.open("https://www.google.com/search?q="+msol+"+definition", '_blank');}}>Definition</button></div>
      <div className={styles.result}><button onClick={() => {window.open(mv, '_blank');}}>Explanation</button></div></div> :
      <div className={styles.result}><button onClick={() => {swap("M"); onClose();}}>Attempt</button></div>}
      <h2>Daily Cryptic</h2>
      <h3 style={{"marginBottom" : 0}}>{dclue}</h3>
      <h3 style={{"marginBottom" : 0}}>{dmsg}</h3>
      {(isdGameWon || isdGameLost) ? <div className={styles.bgrid}><div className={styles.result}><button onClick={() => {window.open("https://www.google.com/search?q="+dsol+"+definition", '_blank');}}>Definition</button></div>
      <div className={styles.result}><button onClick={() => {window.open(dv, '_blank');}}>Explanation</button></div></div> :
      <div className={styles.result}><button onClick={() => {swap("D"); onClose();}}>Attempt</button></div>}

      {(ismGameWon || ismGameLost || isdGameWon || isdGameLost) && (<>
        <div className={styles.bgrid}>
          <div className={styles.countDown}>
            <h2 style={{"width" : "100%"}}>Next words in</h2>
            <CountDown
              date={tomorrow}
              daysInHours={true}
              className={styles.time}
            />
          </div>
          <div className={styles.share}>
            <button onClick={handleShare}>Share</button>
          </div>
        </div></>
      )}
    </Modal>
  );
};

const StatItem = ({ label, value }) => {
  return (
    <div className={styles.statItem}>
      <h3 className={styles.value}>{value}</h3>
      <span className={styles.label}>{label}</span>
    </div>
  );
};

const Progress = ({ index, label, size, currentDayStatRow }) => {
  const classes = classNames({
    [styles.line]: true,
    [styles.blue]: currentDayStatRow,
    [styles.gray]: !currentDayStatRow,
  });

  return (
    <div className={styles.progress}>
      <div className={styles.index}>{index + 1}</div>
      <div className={styles.row}>
        <div className={classes} style={{ width: `${8 + size}%` }}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
