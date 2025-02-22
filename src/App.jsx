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
  const [boardState, setBoardState] = useLocalStorage('boardState', {
    guesses: [],
    solutionIndex: '',
  });

  const [clue, setclue] = useState('Loading...');
  const [solution, setsolution] = useState(WORDS[0]);
  const [solutionIndex, setsolutionIndex] = useState(0);
  const [tomorrow, settomorrow] = useState(1);
  const [answerlength, setanswerlength] = useState(0);
  useEffect(() => {
    const epochMs = new Date(2022, 0).valueOf();
    const now = Date.now();
    const msInDay = 86400000;
    const index = Math.floor((now - epochMs) / msInDay);
    const nextday = (index + 1) * msInDay + epochMs;
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
              const clue = response.data.result.capturedTexts.clue;
              setclue(clue.split(' ()minc() ')[0]);
              setsolution(clue.split(' ()minc() ')[1]);
              setanswerlength(clue.split(' ()minc() ')[1].length);
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
          setclue('Refreshing clue, please wait... (~45 seconds)');
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
  const [guesses, setGuesses] = useState(() => {
    if (boardState.solutionIndex !== solutionIndex) return [];
    return boardState.guesses;
  });
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
      `Cryptic Wordle
  #${solutionIndex} 
  ${isGameLost ? 'X' : guesses.length}/${MAX_CHALLENGES} 
  ${isHardMode ? 'Hard Mode' : ''}
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

  const handleKeyDown = letter =>
    currentGuess.length < answerlength &&
    !isGameWon &&
    setCurrentGuess(currentGuess + letter);

  const handleDelete = () =>
    setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));

  const handleEnter = async () => {
    if (isGameWon || isGameLost) return;

    if (currentGuess.length < answerlength) {
      setIsJiggling(true);
      return showAlert('Not enough letters', 'error');
    }

    const wv = await isWordValid(currentGuess);

    if (!wv) {
      setIsJiggling(true);
      return showAlert('Not in word list', 'error');
    }

    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(currentGuess, guesses);
      if (firstMissingReveal) {
        setIsJiggling(true);
        return showAlert(firstMissingReveal, 'error');
      }
    }

    if (currentGuess === solution.toUpperCase()) {
      setStats(addStatsForCompletedGame(stats, guesses.length));
    } else if (guesses.length + 1 === MAX_CHALLENGES) {
      setStats(addStatsForCompletedGame(stats, guesses.length + 1));
    }

    setGuesses([...guesses, currentGuess]);
    setCurrentGuess('');
  };

  return (
    <div className={styles.container}>
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
      />
      <Alert />
      <Grid
        currentGuess={currentGuess}
        guesses={guesses}
        isJiggling={isJiggling}
        setIsJiggling={setIsJiggling}
        getGuessStatuses={getGuessStatuses}
        MAX_WORD_LENGTH={answerlength}
        clue={clue}
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
      />
    </div>
  );
}

export default App;
