import classNames from 'classnames';
import styles from './Cell.module.scss';

const Cell = ({ value, status, position, isCompleted, wordlength, infocell}) => {
  var width;
  if (window.innerWidth <= 480) {
    width = Math.min(55,Math.floor((window.innerWidth-100)/wordlength));
  } else {
    width = '60px'; // Default margin for larger screens
  }

  const classes = classNames({
    [styles.cell]: true,
    [styles.absent]: status === 'absent',
    [styles.present]: status === 'present',
    [styles.correct]: status === 'correct',
    [styles.fill]: value,
    [styles.reveal]: isCompleted,
    [styles.infocell]: infocell,
  });

  const animationDelay = `${position * 0.35}s`;

  return (
    <div className={classes} style={{ animationDelay, "width": width  }}>
      <span className={styles.letter} style={{ animationDelay}}>
        {value}
      </span>
    </div>
  );
};

export default Cell;
