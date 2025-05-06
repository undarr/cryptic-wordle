import { useEffect } from 'react';
import classNames from 'classnames';
import Cell from 'components/Cell';
import { MAX_CHALLENGES } from 'constants/settings';
import styles from './Grid.module.scss';

const Grid = ({ currentGuess, guesses, isJiggling, setIsJiggling, getGuessStatuses, MAX_WORD_LENGTH, clue, 
  displayhint1, 
  displayhint2, 
  displayhint3,
  isGameWon}) => {
  const empties =
    MAX_CHALLENGES > guesses.length
      ? Array(MAX_CHALLENGES - guesses.length - 1).fill()
      : [];

  useEffect(() => {
    setTimeout(() => {
      if (isJiggling) setIsJiggling(false);
    }, 500);
    // eslint-disable-next-line
  }, [isJiggling]);

  const splitline = (inputText,n=30) => {
    if (window.innerWidth <= 480) {
      const words = inputText.split(' ');
      const lines = [];
      let currentLinelc = '';
      words.forEach((word) => {
          if (word!=='') {
              if ((currentLinelc + word).length < n) {
                  currentLinelc += (currentLinelc ? ' ' : '') + word;
                  } else {
                  lines.push(currentLinelc.trim());
                  currentLinelc = word;
                  }
          }
      });

      if (currentLinelc) {
          lines.push(currentLinelc.trim());
      }
      return (lines.join(' \n '));
    } else {
      return(inputText.trim())
    }
  };

  return (
    <div className={styles.grid}>
      <h2 style={{ textAlign: 'center' }}>{splitline(clue).split(' ').map((word, index) => {
        if (index!==splitline(clue).split(' ').length-1 && word!=="\n") {
            return (
                <a
                    key={index}
                    href={"https://www.google.com/search?q="+word+"+synonym"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginRight: '5px' }}
                >
                    {word}
                </a>
            );
        }
        return (
            <span key={index} style={{ marginRight: '5px' }}>
                {word}
            </span>
        );
    })}</h2>
      <p style={{ textAlign: 'center', color: "var(--color-text-primary)"}}>{displayhint1}</p>
      <p style={{ textAlign: 'center', color: "var(--color-text-primary)"}}>{displayhint2}</p>
      <p style={{ textAlign: 'center', color: "var(--color-text-primary)"}}>{displayhint3}</p>
      {guesses.map((guess, i) => (
        <CompletedRow key={i} guess={guess} getGuessStatuses={getGuessStatuses} MAX_WORD_LENGTH={MAX_WORD_LENGTH}/>
      ))}
      {!isGameWon && guesses.length < MAX_CHALLENGES && (
        <CurrentRow guess={currentGuess} isJiggling={isJiggling} MAX_WORD_LENGTH={MAX_WORD_LENGTH}/>
      )}
      {true ? <></> : empties.map((_, i) => ( //infinte guesses
        <EmptyRow key={i} MAX_WORD_LENGTH={MAX_WORD_LENGTH} />
      ))}
    </div>
  );
};

const CurrentRow = ({ guess, isJiggling, MAX_WORD_LENGTH }) => {
  const emptyCells = Array(MAX_WORD_LENGTH - guess.length).fill('');
  const cells = [...guess, ...emptyCells];

  const classes = classNames({
    [styles.row]: true,
    [styles.jiggle]: isJiggling,
  });

  return (
    <div className={classes} style={{"grid-template-columns": "repeat("+MAX_WORD_LENGTH+", 1fr)"}}>
      {cells.map((letter, index) => (
        <Cell key={index} value={letter} wordlength={MAX_WORD_LENGTH} />
      ))}
    </div>
  );
};

const CompletedRow = ({ guess, getGuessStatuses, MAX_WORD_LENGTH}) => {
  const cells = guess.split('');
  const statuses = getGuessStatuses(guess);

  return (
    <div className={styles.row} style={{"grid-template-columns": "repeat("+MAX_WORD_LENGTH+", 1fr)"}}>
      {cells.map((letter, index) => (
        <Cell
          key={index}
          position={index}
          value={letter}
          isCompleted
          status={statuses[index]}
          wordlength={MAX_WORD_LENGTH}
        />
      ))}
    </div>
  );
};

const EmptyRow = ({MAX_WORD_LENGTH}) => {
  const cells = Array(MAX_WORD_LENGTH).fill();

  return (
    <div className={styles.row} style={{"grid-template-columns": "repeat("+MAX_WORD_LENGTH+", 1fr)"}}>
      {cells.map((_, index) => (
        <Cell key={index} wordlength={MAX_WORD_LENGTH}/>
      ))}
    </div>
  );
};

export default Grid;
