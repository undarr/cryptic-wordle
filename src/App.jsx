import { useState, useEffect } from 'react';
import Header from 'components/Header';
import Grid from 'components/Grid';
import Keyboard from 'components/Keyboard';
import Alert from 'components/Alert';
import InfoModal from 'components/InfoModal';
import SettingModal from 'components/SettingModal';
import StatsModal from 'components/StatsModal';
import useLocalStorage from 'hooks/useLocalStorage';
import useAlert from 'hooks/useAlert';
import { VALID_GUESSES } from 'constants/validGuesses';
import { WORDS } from 'constants/wordList';
import { ALERT_DELAY, MAX_CHALLENGES } from 'constants/settings';
import styles from './App.module.scss';
import 'styles/_transitionStyles.scss';
import axios from 'axios';

function App() {
  function startguess(x) {
    let s = '';
    let t = 0;
    for (let i = 0; i < x.length; i++) {
      t += 1;
      if (x[i] === '-') {
        s += (t - 1).toString();
        t = 0;
      }
    }
    return s;
  }
  function tosolu(x) {
    let s = '';
    for (let i of x) {
      if (!isNaN(i)) {
        s += ' '.repeat(Number(i)) + '-';
      } else if (s.includes(' ')) {
        s = s.replace(' ', i);
      } else {
        s += i;
      }
    }
    return s;
  }
  const [boardState, setBoardState] = useLocalStorage('boardState', {
    guesses: [],
    solutionIndex: '',
  });
  const [clue, setclue] = useState('Loading...');
  const [hint, sethint] = useState('Loading...');
  const [displayhint, setdisplayhint] = useState('');
  const [video, setvideo] = useState('www.example.com');
  const [solution, setsolution] = useState(WORDS[0]);
  const [solutionIndex, setsolutionIndex] = useState(0);
  const [tomorrow, settomorrow] = useState(1);
  const [answerlength, setanswerlength] = useState(0);
  useEffect(() => {
    const epochMs = 1740355200000;
    const now = Date.now();
    const msInDay = 86400000;
    const index = 4 + Math.floor((now - epochMs) / msInDay);
    const nextday = (index - 3) * msInDay + epochMs;
    setsolutionIndex(index);
    settomorrow(nextday);
    const tdy = Date.now();
    const startOfToday =
      Math.floor(tdy / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
    const url =
      'https://api.browse.ai/v2/robots/ef597c3b-e228-4444-952d-6de2a65681c7/tasks';
    const headers = {
      Authorization:
        'Bearer 11a6fede-63f1-4708-9708-839af383cbb9:c6250626-cd55-4f9f-984d-fa0c959ca892',
    };
    const params = { page: 1, fromDate: Math.floor(startOfToday / 1000) };
    axios
      .get(url, { headers, params })
      .then(response => {
        const items = response.data.result.robotTasks.items.filter(
          item => item.status === 'successful'
        );
        if (items.length !== 0) {
          const taskId = items[items.length - 1].id;
          const url = `https://api.browse.ai/v2/robots/ef597c3b-e228-4444-952d-6de2a65681c7/tasks/${taskId}`;
          axios
            .get(url, { headers })
            .then(response => {
              const data =
                response.data.result.capturedTexts.clue.split(' ()big() ')[0];
              setclue(data.split(' ()minc() ')[0]);
              const newsol = data.split(' ()minc() ')[1].replace(/ /g, '-');
              setsolution(newsol);
              sethint(data.split(' ()minc() ')[2]);
              setvideo(data.split(' ()minc() ')[3]);
              setanswerlength(newsol.length);
              setCurrentGuess(startguess(newsol));
            })
            .catch(error => {
              console.error('Error making the request:', error);
            });
        } else {
          const payload = {
            inputParameters: {
              originUrl: 'https://u-stscrap.streamlit.app/~/+/',
            },
          };
          const url =
            'https://api.browse.ai/v2/robots/ef597c3b-e228-4444-952d-6de2a65681c7/tasks';
          setclue('Clue not found 404');
          setTimeout(() => {
            axios
              .post(url, payload, { headers })
              .then(response => {
                const taskId = response.data.result.id;
                const url = `https://api.browse.ai/v2/robots/ef597c3b-e228-4444-952d-6de2a65681c7/tasks/${taskId}`;
                axios
                  .get(url, { headers })
                  .then(response => {
                    const clue = response.data.result.capturedTexts.clue;
                    setclue(clue.split(' ()minc() ')[0]);
                    setsolution(clue.split(' ()minc() ')[1]);
                    setanswerlength(clue.split(' ()minc() ')[1].length);
                  })
                  .catch(error => {
                    console.error('Error making the request:', error);
                  });
              })
              .catch(error => {
                console.error('Error making the request:', error);
              });
          }, 45000);
        }
      })
      .catch(error => {
        console.error('Error making the request:', error);
      });
  }, []);

  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const [highContrast, setHighContrast] = useLocalStorage(
    'high-contrast',
    false
  );
  const [hardMode, setHardMode] = useLocalStorage('hard-mode', false);
  const [stats, setStats] = useLocalStorage('gameStats', {
    winDistribution: Array.from(new Array(MAX_CHALLENGES), () => 0),
    gamesFailed: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalGames: 0,
    successRate: 0,
  });
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [isJiggling, setIsJiggling] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHardMode, setIsHardMode] = useState(hardMode);
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const [isHighContrastMode, setIsHighContrastMode] = useState(highContrast);
  const { showAlert } = useAlert();

  // Show welcome modal
  useEffect(() => {
    if (!boardState.solutionIndex)
      setTimeout(() => setIsInfoModalOpen(true), 1000);
    // eslint-disable-next-line
  }, []);

  // Save boardState to localStorage
  useEffect(() => {
    setBoardState({
      guesses,
      solutionIndex,
    });
    // eslint-disable-next-line
  }, [guesses]);

  // Check game winning or losing
  useEffect(() => {
    if (guesses.includes(solution.toUpperCase())) {
      setIsGameWon(true);
      setTimeout(() => showAlert('Well done', 'success'), ALERT_DELAY);
      setTimeout(() => setIsStatsModalOpen(true), ALERT_DELAY + 1000);
    } else if (guesses.length === MAX_CHALLENGES) {
      setIsGameLost(true);
      setTimeout(
        () => showAlert(`The word was ${solution}`, 'error', true),
        ALERT_DELAY
      );
      setTimeout(() => setIsStatsModalOpen(true), ALERT_DELAY + 1000);
    }
    // eslint-disable-next-line
  }, [guesses]);

  useEffect(() => {
    if (isDarkMode) document.body.setAttribute('data-theme', 'dark');
    else document.body.removeAttribute('data-theme');

    if (isHighContrastMode)
      document.body.setAttribute('data-mode', 'high-contrast');
    else document.body.removeAttribute('data-mode');
  }, [isDarkMode, isHighContrastMode]);

  function isWordsValid(word, solution) {
    if (word.toLowerCase() === solution.toLowerCase()) {
      return true;
    }
    if (word.includes('-')) {
      return word.split('-').every(i => isWordValid(i));
    } else {
      return isWordValid(word);
    }
  }

  const isWordValid = word => {
    return (
      VALID_GUESSES.includes(word.toLowerCase()) ||
      WORDS.includes(word.toLowerCase())
    );
  };

  const getGuessStatuses = guess => {
    const splitGuess = guess.toLowerCase().split('');
    const splitSolution = solution.split('');

    const statuses = [];
    const solutionCharsTaken = splitSolution.map(_ => false);

    // handle all correct cases first
    splitGuess.forEach((letter, i) => {
      if (letter === splitSolution[i]) {
        statuses[i] = 'correct';
        solutionCharsTaken[i] = true;
        return;
      }
    });

    splitGuess.forEach((letter, i) => {
      if (statuses[i]) return;

      if (!splitSolution.includes(letter)) {
        // handles the absent case
        statuses[i] = 'absent';
        return;
      }

      // now we are left with "present"s
      const indexOfPresentChar = splitSolution.findIndex(
        (x, index) => x === letter && !solutionCharsTaken[index]
      );

      if (indexOfPresentChar > -1) {
        statuses[i] = 'present';
        solutionCharsTaken[indexOfPresentChar] = true;
        return;
      } else {
        statuses[i] = 'absent';
        return;
      }
    });

    return statuses;
  };

  const getStatuses = guesses => {
    const charObj = {};
    const splitSolution = solution.toUpperCase().split('');

    guesses.forEach(word => {
      word.split('').forEach((letter, i) => {
        if (!splitSolution.includes(letter))
          return (charObj[letter] = 'absent');
        if (letter === splitSolution[i]) return (charObj[letter] = 'correct');
        if (charObj[letter] !== 'correct') return (charObj[letter] = 'present');
      });
    });

    return charObj;
  };

  const findFirstUnusedReveal = (word, guesses) => {
    if (guesses.length === 0) {
      return false;
    }

    const lettersLeftArray = [];
    const guess = guesses[guesses.length - 1];
    const statuses = getGuessStatuses(guess);
    const splitWord = word.toUpperCase().split('');
    const splitGuess = guess.toUpperCase().split('');

    for (let i = 0; i < splitGuess.length; i++) {
      if (statuses[i] === 'correct' || statuses[i] === 'present')
        lettersLeftArray.push(splitGuess[i]);

      if (statuses[i] === 'correct' && splitWord[i] !== splitGuess[i])
        return `Must use ${splitGuess[i]} in position ${i + 1}`;
    }

    // check for the first unused letter, taking duplicate letters
    // into account - see issue #198
    let n;
    for (const letter of splitWord) {
      n = lettersLeftArray.indexOf(letter);
      if (n !== -1) {
        lettersLeftArray.splice(n, 1);
      }
    }

    if (lettersLeftArray.length > 0)
      return `Guess must contain ${lettersLeftArray[0]}`;

    return false;
  };

  const addStatsForCompletedGame = (gameStats, count) => {
    // Count is number of incorrect guesses before end.
    const stats = { ...gameStats };

    stats.totalGames += 1;

    if (count >= MAX_CHALLENGES) {
      // A fail situation
      stats.currentStreak = 0;
      stats.gamesFailed += 1;
    } else {
      stats.winDistribution[count] += 1;
      stats.currentStreak += 1;

      if (stats.bestStreak < stats.currentStreak) {
        stats.bestStreak = stats.currentStreak;
      }
    }

    stats.successRate = getSuccessRate(stats);

    return stats;
  };

  const getSuccessRate = gameStats => {
    const { totalGames, gamesFailed } = gameStats;

    return Math.round(
      (100 * (totalGames - gamesFailed)) / Math.max(totalGames, 1)
    );
  };

  const shareStatus = (guesses, isGameLost, isHardMode) => {
    const textToShare =
      `${clue}
https://ucrypticwordle.netlify.app/

Cryptic Wordle
#${solutionIndex}, ${displayhint === '' ? '🔒' : '🔓'} ${
        isGameLost ? 'X' : guesses.length
      }/${MAX_CHALLENGES} 
${isHardMode ? 'Hard Mode' : 'Normal Mode'}
\n` + generateEmojiGrid(guesses);

    navigator.clipboard.writeText(textToShare);
  };

  const generateEmojiGrid = guesses => {
    return guesses
      .map(guess => {
        const status = getGuessStatuses(guess);
        const splitGuess = guess.split('');

        return splitGuess
          .map((_, i) => {
            if (guess[i] === '-') {
              return '➖';
            }
            switch (status[i]) {
              case 'correct':
                return '🟩';
              case 'present':
                return '🟨';
              default:
                return '⬜';
            }
          })
          .join('');
      })
      .join('\n');
  };

  const handleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const handleHighContrastMode = () => {
    setIsHighContrastMode(!isHighContrastMode);
    setHighContrast(!isHighContrastMode);
  };

  const handleHardMode = () => {
    setIsHardMode(!isHardMode);
    setHardMode(!isHardMode);
  };

  const showhint = () => {
    setdisplayhint('Hint: ' + hint);
  };

  const handleKeyDown = letter =>
    currentGuess.length < answerlength &&
    !isGameWon &&
    setCurrentGuess(currentGuess + letter);

  const handleDelete = () => {
    if (
      currentGuess.length !== 0 &&
      isNaN(currentGuess[currentGuess.length - 1])
    ) {
      setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
    }
  };

  const handleEnter = () => {
    if (isGameWon || isGameLost) return;

    if (currentGuess.length < answerlength) {
      setIsJiggling(true);
      return showAlert('Not enough letters', 'error');
    }

    const wv = isWordsValid(tosolu(currentGuess), solution);

    if (!wv) {
      setIsJiggling(true);
      return showAlert('Not in word list', 'error');
    }

    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(
        tosolu(currentGuess),
        guesses
      );
      if (firstMissingReveal) {
        setIsJiggling(true);
        return showAlert(firstMissingReveal, 'error');
      }
    }

    if (tosolu(currentGuess) === solution.toUpperCase()) {
      setStats(addStatsForCompletedGame(stats, guesses.length));
    } else if (guesses.length + 1 === MAX_CHALLENGES) {
      setStats(addStatsForCompletedGame(stats, guesses.length + 1));
    }

    setGuesses([...guesses, tosolu(currentGuess)]);
    setCurrentGuess(startguess(solution));
  };

  return (
    <div className={styles.container}>
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        clue={clue}
        showhint={showhint}
        displayhint={displayhint}
        showAlert={showAlert}
      />
      <Alert />
      <Grid
        currentGuess={tosolu(currentGuess)}
        guesses={guesses}
        isJiggling={isJiggling}
        setIsJiggling={setIsJiggling}
        getGuessStatuses={getGuessStatuses}
        MAX_WORD_LENGTH={answerlength}
        clue={clue}
        displayhint={displayhint}
      />
      <Keyboard
        onEnter={handleEnter}
        onDelete={handleDelete}
        onKeyDown={handleKeyDown}
        guesses={guesses}
        getStatuses={getStatuses}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
      <SettingModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        isHardMode={isHardMode}
        isDarkMode={isDarkMode}
        isHighContrastMode={isHighContrastMode}
        setIsHardMode={handleHardMode}
        setIsDarkMode={handleDarkMode}
        setIsHighContrastMode={handleHighContrastMode}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        gameStats={stats}
        numberOfGuessesMade={guesses.length}
        isGameWon={isGameWon}
        isGameLost={isGameLost}
        isHardMode={isHardMode}
        guesses={guesses}
        showAlert={showAlert}
        tomorrow={tomorrow}
        shareStatus={shareStatus}
        v={video}
      />
    </div>
  );
}

export default App;
