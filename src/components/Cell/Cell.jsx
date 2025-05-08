import classNames from 'classnames';
import styles from './Cell.module.scss';
import { MAX_CHALLENGES } from 'constants/settings';

const Cell = ({ value, status, position, isCompleted, wordlength, infocell, hintcell, guesslength, actionpos, onclick}) => {
  var width;
  var height;
  var fs;
  if (window.innerWidth <= 480) {
    if (infocell==="true") {
      width = 55;
      height = 55;
      fs = "2.4rem";
    }
    else if (hintcell==="true") {
      width = Math.min(55,Math.floor((window.innerWidth-100)/wordlength));
      height = 55;
      fs = "2.4rem";
    }
    else {
      width = Math.min(55,Math.floor((window.innerWidth-100)/wordlength));
      height = Math.min(55,Math.floor((window.innerHeight*0.33)/Math.min(guesslength,MAX_CHALLENGES-1)));
      fs = `${Math.round(height*26/55)/10}rem`;
    }
  } else {
    if (infocell==="true") {
      width = 60;
      height = 60;
      fs = "2.6rem";
    }
    else if (hintcell==="true") {
      width = Math.min(60,Math.floor((360)/wordlength));
      height = 60;
      fs = "2.6rem";
    }
    else {
      width = Math.min(60,Math.floor((window.innerWidth-100)/wordlength));
      height = Math.min(60,Math.floor((window.innerHeight*0.33)/guesslength));
      fs = `${Math.round(height*26/60)/10}rem`;
    }
  }

  const classes = classNames({
    [styles.cell]: true,
    [styles.absent]: status === 'absent',
    [styles.present]: status === 'present',
    [styles.revealed]: status === 'revealed',
    [styles.correct]: status === 'correct',
    [styles.fill]: value && value!==" ",
    [styles.reveal]: isCompleted,
  });

  const animationDelay = `${position * 0.35}s`;

  return (
    <div className={classes} style={{animationDelay, "width": width , "height": height, "fontSize": fs,
    "cursor": (hintcell === "true" && status === 'absent') ? "pointer" : "default"}}
    onClick={(hintcell === "true" && status === 'absent') ? () => {onclick(actionpos);} : () => {}}>
      <span className={styles.letter} style={{animationDelay}}>
        {value}
      </span>
    </div>
  );
};

export default Cell;
