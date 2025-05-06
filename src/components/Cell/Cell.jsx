import classNames from 'classnames';
import styles from './Cell.module.scss';

const Cell = ({ value, status, position, isCompleted, wordlength, infocell, guesslength}) => {
  var width;
  var height;
  var fs;
  if (window.innerWidth <= 480) {
    width = Math.min(55,Math.floor((window.innerWidth-100)/wordlength));
    height = Math.min(55,Math.floor((window.innerHeight*0.5)/guesslength));
    fs = `${Math.round(height*26/55)/10}rem`;

  } else {
    width = Math.min(60,Math.floor((window.innerWidth-100)/wordlength));
    height = Math.min(60,Math.floor((window.innerHeight*0.3)/guesslength));
    console.log(height);
    fs = `${Math.round(height*26/60)/10}rem`;
  }

  const classes = classNames({
    [styles.cell]: true,
    [styles.absent]: status === 'absent',
    [styles.present]: status === 'present',
    [styles.correct]: status === 'correct',
    [styles.fill]: value && value!==" ",
    [styles.reveal]: isCompleted,
    [styles.infocell]: infocell,
  });

  const animationDelay = `${position * 0.35}s`;

  return (
    <div className={classes} style={{ animationDelay, "width": width , "height": height, "font-size":fs}}>
      <span className={styles.letter} style={{ animationDelay}}>
        {value}
      </span>
    </div>
  );
};

export default Cell;
