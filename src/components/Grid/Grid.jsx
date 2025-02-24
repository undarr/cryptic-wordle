import { useEffect } from 'react';
import classNames from 'classnames';
import Cell from 'components/Cell';
import { MAX_CHALLENGES } from 'constants/settings';
import styles from './Grid.module.scss';

const Grid = ({ currentGuess, guesses, isJiggling, setIsJiggling, getGuessStatuses, MAX_WORD_LENGTH, clue, displayhint}) => {
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

  return (
    <div className={styles.grid}>
      <h2 style={{ textAlign: 'center' }}>{clue.split(' ').map((word, index) => {
        if (index!==clue.split(' ').length-1) {
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
      <p style={{ textAlign: 'center' }}>{displayhint}</p>
      {guesses.map((guess, i) => (
        <CompletedRow key={i} guess={guess} getGuessStatuses={getGuessStatuses} MAX_WORD_LENGTH={MAX_WORD_LENGTH}/>
      ))}
      {guesses.length < MAX_CHALLENGES && (
        <CurrentRow guess={currentGuess} isJiggling={isJiggling} MAX_WORD_LENGTH={MAX_WORD_LENGTH}/>
      )}
      {empties.map((_, i) => (
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
        <Cell key={index} value={letter} />
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
        <Cell key={index} />
      ))}
    </div>
  );
};

export default Grid;
