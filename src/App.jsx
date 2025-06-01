import { useState, useEffect } from 'react';
import Header from 'components/Header';
import Grid from 'components/Grid';
import Keyboard from 'components/Keyboard';
import Alert from 'components/Alert';
import HintModal from 'components/HintModal';
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
  /*
  const [boardState, setBoardState] = useLocalStorage('boardState', {
    guesses: [],
    solutionIndex: '',
  });
  */
  const [sclue, setsclue] = useLocalStorage('state', 'M');
  const [displayhint1, setdisplayhint1] = useState('');
  const [displayhint2, setdisplayhint2] = useState('');
  const [displayhint3, setdisplayhint3] = useState('');

  const [mclue, setmclue] = useState('Loading...');
  const [mhint1, setmhint1] = useState('Loading...');
  const [mhint2, setmhint2] = useState('Loading...');
  const [mhint3, setmhint3] = useState('Loading...');
  const [mhintt1, setmhintt1] = useState('-Loading...');
  const [mhintt2, setmhintt2] = useState('-Loading...');
  const [mhintt3, setmhintt3] = useState('-Loading...');
  const [mdisplayhint1, setmdisplayhint1] = useLocalStorage('mdh1', '');
  const [mdisplayhint2, setmdisplayhint2] = useLocalStorage('mdh2', '');
  const [mdisplayhint3, setmdisplayhint3] = useLocalStorage('mdh3', '');
  const [mhintword, setmhintword] = useLocalStorage('mhw', WORDS[0]);
  const [mrevealed, setmrevealed] = useLocalStorage('mr', WORDS[0]);
  const [mvideo, setmvideo] = useState('www.example.com');
  const [msolution, setmsolution] = useState(WORDS[0]);
  const [manswerlength, setmanswerlength] = useState(0);
  const [mclueby, setmclueby] = useState('Loading...');

  const [dclue, setdclue] = useState('Loading...');
  const [dhint, setdhint] = useState('Loading...');
  const [ddisplayhint, setddisplayhint] = useLocalStorage('ddh', '');
  const [dhintword, setdhintword] = useLocalStorage('dhw', WORDS[0]);
  const [drevealed, setdrevealed] = useLocalStorage('dr', WORDS[0]);
  const [dvideo, setdvideo] = useState('Loading...');
  const [dsolution, setdsolution] = useState(WORDS[0]);
  const [danswerlength, setdanswerlength] = useState(0);

  function swapclue(x = '') {
    if (x === 'D') {
      setsclue('D');
      setdisplayhint1(ddisplayhint);
      setdisplayhint2('');
      setdisplayhint3('');
    } else if (x === 'M') {
      setsclue('M');
      setdisplayhint1(mdisplayhint1);
      setdisplayhint2(mdisplayhint2);
      setdisplayhint3(mdisplayhint3);
    } else if (sclue === 'M') {
      setsclue('D');
      setdisplayhint1(ddisplayhint);
      setdisplayhint2('');
      setdisplayhint3('');
    } else if (sclue === 'D') {
      setsclue('M');
      setdisplayhint1(mdisplayhint1);
      setdisplayhint2(mdisplayhint2);
      setdisplayhint3(mdisplayhint3);
    }
  }

  const [solutionIndex, setsolutionIndex] = useState(0);
  const [tomorrow, settomorrow] = useState(1);
  useEffect(() => {
    function initloadfetch(response) {
      const data =
        response.data.result.capturedTexts.clue.split(' ()big() ')[0];
      const ddata =
        response.data.result.capturedTexts.clue.split(' ()big() ')[1];
      const newsol = data.split(' ()minc() ')[1].replace(/ /g, '-');
      setmclue(data.split(' ()minc() ')[0]);
      setmsolution(newsol);
      setmhint1(data.split(' ()minc() ')[2]);
      setmhint2(data.split(' ()minc() ')[3]);
      setmhint3(data.split(' ()minc() ')[4]);
      setmhintt1(data.split(' ()minc() ')[5]);
      setmhintt2(data.split(' ()minc() ')[6]);
      setmhintt3(data.split(' ()minc() ')[7]);
      setmvideo(data.split(' ()minc() ')[8]);
      setmclueby(data.split(' ()minc() ')[9]);
      setmanswerlength(newsol.length);
      setmCurrentGuess(startguess(newsol));

      const newdsol = ddata.split(' ()dc() ')[0];
      setdclue(ddata.split(' ()dc() ')[1]);
      setdsolution(newdsol);
      setdhint(ddata.split(' ()dc() ')[3]);
      setdvideo(ddata.split(' ()dc() ')[2]);
      setdanswerlength(ddata.split(' ()dc() ')[0].length);
      function stringToHash(string) {
        return string.split('').reduce((hash, char) => {
          return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
        }, 0);
      }
      if (
        localStorage.getItem('fetchres') ===
        stringToHash(response.data.result.capturedTexts.clue).toString()
      ) {
        setmGuesses(mguessesc);
        setdGuesses(dguessesc);
        swapclue(sclue);
      } else {
        localStorage.clear();

        localStorage.setItem(
          'fetchres',
          stringToHash(response.data.result.capturedTexts.clue)
        );
        setIsInfoModalOpen(true);
        setsclue('M');
        setmdisplayhint1('');
        setmdisplayhint2('');
        setmdisplayhint3('');
        setddisplayhint('');
        setmhintword(
          tosolu(startguess(newsol)) +
            ' '.repeat(newsol.length - tosolu(startguess(newsol)).length)
        );
        setmrevealed(' '.repeat(newsol.length));
        setdhintword(
          startguess(newdsol) +
            ' '.repeat(newdsol.length - startguess(newdsol).length)
        );
        setdrevealed(' '.repeat(newdsol.length));
        setmGuessesc([]);
        setdGuessesc([]);
        setIsmGameWon(false);
        setIsdGameWon(false);
        setIsmGameLost(false);
        setIsdGameLost(false);
        setmhintused(0);
        setdhintused(0);
      }
    }
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
              initloadfetch(response);
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
          setmclue('Clue not found 404');
          setTimeout(() => {
            axios
              .post(url, payload, { headers })
              .then(response => {
                const taskId = response.data.result.id;
                const url = `https://api.browse.ai/v2/robots/ef597c3b-e228-4444-952d-6de2a65681c7/tasks/${taskId}`;
                axios
                  .get(url, { headers })
                  .then(response => {
                    initloadfetch(response);
                  })
                  .catch(error => {
                    console.error('Error making the request:', error);
                  });
              })
              .catch(error => {
                console.error('Error making the request:', error);
              });
          }, 60000);
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
  /*
  const [stats, setStats] = useLocalStorage('gameStats', {
    winDistribution: Array.from(new Array(MAX_CHALLENGES), () => 0),
    gamesFailed: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalGames: 0,
    successRate: 0,
  });
  */
  const [mcurrentGuess, setmCurrentGuess] = useState('');
  const [dcurrentGuess, setdCurrentGuess] = useState('');
  const [mguesses, setmGuesses] = useState([]);
  const [dguesses, setdGuesses] = useState([]);
  const [mguessesc, setmGuessesc] = useLocalStorage('mboard', []);
  const [dguessesc, setdGuessesc] = useLocalStorage('dboard', []);
  const [ismGameWon, setIsmGameWon] = useLocalStorage('mgw', false);
  const [isdGameWon, setIsdGameWon] = useLocalStorage('dgw', false);
  const [ismGameLost, setIsmGameLost] = useLocalStorage('mgl', false);
  const [isdGameLost, setIsdGameLost] = useLocalStorage('dgl', false);
  const [mhintused, setmhintused] = useLocalStorage('mhu', 0);
  const [dhintused, setdhintused] = useLocalStorage('dhu', 0);
  const [isJiggling, setIsJiggling] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHardMode, setIsHardMode] = useState(hardMode);
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const [isHighContrastMode, setIsHighContrastMode] = useState(highContrast);
  const [enterdisable, setenterdisable] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    setmGuessesc(mguesses);
  }, [mguesses, setmGuessesc]);

  useEffect(() => {
    setdGuessesc(dguesses);
  }, [dguesses, setdGuessesc]);

  // Check game winning or losing
  useEffect(() => {
    var guesses = sclue === 'M' ? mguesses : dguesses;
    var solution = sclue === 'M' ? msolution : dsolution;
    var isgamewon = sclue === 'M' ? ismGameWon : isdGameWon;
    var isgamelost = sclue === 'M' ? ismGameLost : isdGameLost;
    if (guesses.includes(solution.toUpperCase()) && !isgamewon) {
      if (sclue === 'M') {
        setIsmGameWon(true);
        setmhintused(
          (mdisplayhint1 === '' ? 0 : 1) +
            (mdisplayhint2 === '' ? 0 : 1) +
            (mdisplayhint3 === '' ? 0 : 1) +
            mrevealed.split('').filter(c => c !== '-').length -
            mrevealed.split('').filter(c => c === ' ').length
        );
        showhint1('✨ ');
        showhint2('✨ ');
        showhint3('✨ ');
      } else {
        setIsdGameWon(true);
        setdhintused(
          (ddisplayhint === '' ? 0 : 1) +
            drevealed.length -
            drevealed.split('').filter(c => c === ' ').length
        );
        showhint1('✨ ');
      }
      setTimeout(() => showAlert('Well done', 'success'), ALERT_DELAY);
      setTimeout(() => setIsStatsModalOpen(true), ALERT_DELAY + 1000);
    } else if (guesses.length === MAX_CHALLENGES && !isgamelost) {
      if (sclue === 'M') {
        setIsmGameLost(true);
        setmhintused(
          (mdisplayhint1 === '' ? 0 : 1) +
            (mdisplayhint2 === '' ? 0 : 1) +
            (mdisplayhint3 === '' ? 0 : 1) +
            mrevealed.split('').filter(c => c !== '-').length -
            mrevealed.split('').filter(c => c === ' ').length
        );
        showhint1('💀 ');
        showhint2('💀 ');
        showhint3('💀 ');
      } else {
        setIsdGameLost(true);
        setdhintused(
          (ddisplayhint === '' ? 0 : 1) +
            drevealed.length -
            drevealed.split('').filter(c => c === ' ').length
        );
        showhint1('💀 ');
      }
      setTimeout(
        () => showAlert(`The word is ${solution}`, 'error', true),
        ALERT_DELAY
      );
      setTimeout(() => setIsStatsModalOpen(true), ALERT_DELAY + 1000);
    } else if (guesses.length === MAX_CHALLENGES - 1) {
      setTimeout(() => showAlert('Last chance!', 'error', false), 500);
    }
  }, [mguesses, dguesses]);

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

  const getGuessStatuses = (guess, sol, revealed) => {
    const splitGuess = guess.toLowerCase().split('');
    const splitSolution = sol.split('');
    const statuses = [];
    const solutionCharsTaken = splitSolution.map(_ => false);

    // handle all correct cases first
    splitGuess.forEach((letter, i) => {
      if (letter === splitSolution[i]) {
        statuses[i] = 'correct';
        if (letter.toUpperCase() === revealed[i].toUpperCase()) {
          statuses[i] = 'revealed';
        } else {
          statuses[i] = 'correct';
        }
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
    var solution = sclue === 'M' ? msolution : dsolution;
    const splitSolution = solution.toUpperCase().split('');
    const revealed = sclue === 'M' ? mrevealed : drevealed;

    guesses.forEach(word => {
      word.split('').forEach((letter, i) => {
        if (!splitSolution.includes(letter))
          return (charObj[letter] = 'absent');
        if (letter === splitSolution[i] && letter === revealed[i])
          return (charObj[letter] = 'revealed');
        if (charObj[letter] !== 'revealed' && letter === splitSolution[i])
          return (charObj[letter] = 'correct');
        if (charObj[letter] !== 'revealed' && charObj[letter] !== 'correct')
          return (charObj[letter] = 'present');
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
      if (
        statuses[i] === 'correct' ||
        statuses[i] === 'present' ||
        statuses[i] === 'revealed'
      )
        lettersLeftArray.push(splitGuess[i]);

      if (
        (statuses[i] === 'correct' || statuses[i] === 'revealed') &&
        splitWord[i] !== splitGuess[i]
      )
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

  /*
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
  */

  const shareStatus = () => {
    const textToShare = `Cryptic Wordle
https://ucrypticwordle.netlify.app/

MCryptic Wordle #${solutionIndex} ${
      mdisplayhint1[0] === '🔓'[0] ? '🔓' : '🔒'
    }${mdisplayhint2[0] === '🔓'[0] ? '🔓' : '🔒'}${
      mdisplayhint3[0] === '🔓'[0] ? '🔓' : '🔒'
    }
- ${mclue}
${
  ismGameLost || ismGameWon
    ? `${ismGameLost ? '💀' : '✨'} ${
        ismGameLost ? 'X' : mguesses.length
      }/${MAX_CHALLENGES} guesses with ${mhintused}/${
        3 +
        mrevealed.split('').length -
        msolution.split('').filter(c => c === '-').length
      } hints!
${generateEmojiGrid(mguesses, msolution, mrevealed)}`
    : '❓ Unattempted/Unfinished'
}

DCryptic Wordle #${solutionIndex - 75} ${
      ddisplayhint[0] === '🔓'[0] ? '🔓' : '🔒'
    }
- ${dclue}
${
  isdGameLost || isdGameWon
    ? `${isdGameLost ? '💀' : '✨'} ${
        isdGameLost ? 'X' : dguesses.length
      }/${MAX_CHALLENGES} guesses with ${dhintused}/${
        1 + drevealed.length
      } hints!
${generateEmojiGrid(dguesses, dsolution, drevealed)}`
    : '❓ Unattempted/Unfinished'
}`;
    navigator.clipboard.writeText(textToShare);
  };

  const generateEmojiGrid = (guesses, sol, r) => {
    return guesses
      .map(guess => {
        const status = getGuessStatuses(guess, sol, r);
        const splitGuess = guess.split('');

        return splitGuess
          .map((_, i) => {
            if (guess[i] === '-') {
              return '➖';
            }
            switch (status[i]) {
              case 'revealed':
                return '🟪';
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

  const showhint1 = (x = '🔓 ') => {
    if (sclue === 'M') {
      if (mdisplayhint1 === '') {
        setmdisplayhint1(
          x +
            mhintt1.charAt(0).toUpperCase() +
            mhintt1.slice(1) +
            ' : ' +
            mhint1
        );
        setdisplayhint1(
          x +
            mhintt1.charAt(0).toUpperCase() +
            mhintt1.slice(1) +
            ' : ' +
            mhint1
        );
      }
    }
    if (sclue === 'D') {
      if (ddisplayhint === '') {
        setddisplayhint(x + 'Definition : "' + dhint + '"');
        setdisplayhint1(x + 'Definition : "' + dhint + '"');
      }
    }
  };

  const showhint2 = (x = '🔓 ') => {
    if (sclue === 'M') {
      if (mdisplayhint2 === '') {
        setmdisplayhint2(
          x +
            mhintt2.charAt(0).toUpperCase() +
            mhintt2.slice(1) +
            ' : ' +
            mhint2
        );
        setdisplayhint2(
          x +
            mhintt2.charAt(0).toUpperCase() +
            mhintt2.slice(1) +
            ' : ' +
            mhint2
        );
      }
    }
    if (sclue === 'D') {
      setdisplayhint2('');
    }
  };

  const showhint3 = (x = '🔓 ') => {
    if (sclue === 'M') {
      if (mdisplayhint3 === '') {
        setmdisplayhint3(
          x +
            mhintt3.charAt(0).toUpperCase() +
            mhintt3.slice(1) +
            ' : ' +
            mhint3
        );
        setdisplayhint3(
          x +
            mhintt3.charAt(0).toUpperCase() +
            mhintt3.slice(1) +
            ' : ' +
            mhint3
        );
      }
    }
    if (sclue === 'D') {
      setdisplayhint3('');
    }
  };

  const genmsg = l => {
    if (l === 'M') {
      const hintused =
        ismGameLost || ismGameWon
          ? mhintused
          : (mdisplayhint1 === '' ? 0 : 1) +
            (mdisplayhint2 === '' ? 0 : 1) +
            (mdisplayhint3 === '' ? 0 : 1) +
            mrevealed.split('').filter(c => c !== '-').length -
            mrevealed.split('').filter(c => c === ' ').length;
      return `${ismGameLost ? '💀' : ismGameWon ? '✨' : '🤔 At'} ${
        ismGameLost ? 'X' : mguesses.length
      }/${MAX_CHALLENGES} guesses with ${hintused}/${
        3 +
        mrevealed.split('').length -
        msolution.split('').filter(c => c === '-').length
      } hints!`;
    }
    if (l === 'D') {
      const hintused =
        isdGameLost || isdGameWon
          ? dhintused
          : (ddisplayhint === '' ? 0 : 1) +
            drevealed.length -
            drevealed.split('').filter(c => c === ' ').length;
      return `${isdGameLost ? '💀' : isdGameWon ? '✨' : '🤔 At'} ${
        isdGameLost ? 'X' : dguesses.length
      }/${MAX_CHALLENGES} guesses with ${hintused}/${
        1 + drevealed.length
      } hints!`;
    }
  };

  /*
  const gensharemsg = () => {
    return `Cryptic Wordle
https://ucrypticwordle.netlify.app/

MCryptic Wordle #${solutionIndex}
- ${mclue}

DCryptic Wordle #${solutionIndex - 75}
- ${dclue}`;
  };
  */

  const handleKeyDown = letter => {
    var currentGuess;
    if (sclue === 'M') {
      currentGuess = mcurrentGuess;
    } else {
      currentGuess = dcurrentGuess;
    }
    var isGameWon;
    if (sclue === 'M') {
      isGameWon = ismGameWon;
    } else {
      isGameWon = isdGameWon;
    }
    if (
      currentGuess.length < (sclue === 'M' ? manswerlength : danswerlength) &&
      !isGameWon
    ) {
      if (sclue === 'M') {
        setmCurrentGuess(currentGuess + letter);
      } else {
        setdCurrentGuess(currentGuess + letter);
      }
    }
  };

  const revealletter = j => {
    var oldhintword = sclue === 'M' ? mhintword : dhintword;
    var revealed = sclue === 'M' ? mrevealed : drevealed;
    var newhintword = '';
    var newrevealed = '';
    var solution = sclue === 'M' ? msolution : dsolution;
    for (let i = 0; i < solution.length; i++) {
      if (j === i) {
        newhintword += solution[i].toUpperCase();
        newrevealed += solution[i].toUpperCase();
      } else {
        newhintword += oldhintword[i];
        newrevealed += revealed[i];
      }
    }
    if (sclue === 'M') {
      setmhintword(newhintword);
    } else {
      setdhintword(newhintword);
    }
    if (sclue === 'M') {
      setmrevealed(newrevealed);
    } else {
      setdrevealed(newrevealed);
    }
  };

  const handleDelete = () => {
    var currentGuess;
    if (sclue === 'M') {
      currentGuess = mcurrentGuess;
    } else {
      currentGuess = dcurrentGuess;
    }
    if (
      currentGuess.length !== 0 &&
      isNaN(currentGuess[currentGuess.length - 1])
    ) {
      if (sclue === 'M') {
        setmCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
      } else {
        setdCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
      }
    }
  };

  const handleEnter = () => {
    if (sclue === 'M' && (ismGameWon || ismGameLost || enterdisable)) return;
    if (sclue === 'D' && (isdGameWon || isdGameLost || enterdisable)) return;
    var currentGuess = sclue === 'M' ? mcurrentGuess : dcurrentGuess;
    var guesses = sclue === 'M' ? mguesses : dguesses;
    var solution = sclue === 'M' ? msolution : dsolution;

    if (currentGuess.length < (sclue === 'M' ? manswerlength : danswerlength)) {
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

    /*
    if (tosolu(currentGuess) === solution.toUpperCase()) {
      setStats(addStatsForCompletedGame(stats, guesses.length));
    } else if (guesses.length + 1 === MAX_CHALLENGES) {
      setStats(addStatsForCompletedGame(stats, guesses.length + 1));
    }
    */

    setenterdisable(true);
    setTimeout(() => {
      setenterdisable(false);
    }, 500);

    var oldhintword;
    if (sclue === 'M') {
      oldhintword = mhintword;
    } else {
      oldhintword = dhintword;
    }
    var newhintword = '';
    for (let i = 0; i < solution.length; i++) {
      if (currentGuess[i] === solution[i].toUpperCase()) {
        newhintword += solution[i].toUpperCase();
      } else {
        newhintword += oldhintword[i];
      }
    }
    if (sclue === 'M') {
      setmhintword(newhintword);
    } else {
      setdhintword(newhintword);
    }

    if (sclue === 'M') {
      setmGuesses([...guesses, tosolu(currentGuess)]);
    } else if (sclue === 'D') {
      setdGuesses([...guesses, tosolu(currentGuess)]);
    }
    if (sclue === 'M') {
      setmCurrentGuess(startguess(solution));
    } else if (sclue === 'D') {
      setdCurrentGuess(startguess(solution));
    }
  };

  return (
    <div className={styles.container}>
      <Header
        setIsHintModalOpen={setIsHintModalOpen}
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        sharemsg={shareStatus}
        showAlert={showAlert}
        swapclue={swapclue}
        sclue={sclue}
      />
      <Alert />
      <Grid
        currentGuess={tosolu(mcurrentGuess)}
        guesses={mguesses}
        isJiggling={isJiggling}
        setIsJiggling={setIsJiggling}
        getGuessStatuses={getGuessStatuses}
        MAX_WORD_LENGTH={manswerlength}
        clue={mclue}
        sol={msolution}
        isGameWon={ismGameWon}
        hide={sclue !== 'M'}
        clueby={'Clue by ' + mclueby}
        revealed={mrevealed}
      />
      <Grid
        currentGuess={tosolu(dcurrentGuess)}
        guesses={dguesses}
        isJiggling={isJiggling}
        setIsJiggling={setIsJiggling}
        getGuessStatuses={getGuessStatuses}
        MAX_WORD_LENGTH={danswerlength}
        clue={dclue}
        displayhint1={ddisplayhint}
        displayhint2=""
        displayhint3=""
        sol={dsolution}
        isGameWon={isdGameWon}
        hide={sclue !== 'D'}
        clueby={''}
        revealed={drevealed}
      />
      <Keyboard
        onEnter={handleEnter}
        onDelete={handleDelete}
        onKeyDown={handleKeyDown}
        guesses={sclue === 'M' ? mguesses : dguesses}
        getStatuses={getStatuses}
      />
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        sclue={sclue}
        clue={sclue === 'M' ? mclue : dclue}
        sh1={showhint1}
        sh2={showhint2}
        sh3={showhint3}
        dh1={displayhint1}
        dh2={displayhint2}
        dh3={displayhint3}
        ht1={mhintt1}
        ht2={mhintt2}
        ht3={mhintt3}
        hintword={sclue === 'M' ? mhintword : dhintword}
        sol={sclue === 'M' ? msolution : dsolution}
        getGuessStatuses={getGuessStatuses}
        onclick={revealletter}
        revealed={sclue === 'M' ? mrevealed : drevealed}
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
        //gameStats={stats}
        numberOfGuessesMade={mguesses.length}
        ismGameWon={ismGameWon}
        ismGameLost={ismGameLost}
        isdGameWon={isdGameWon}
        isdGameLost={isdGameLost}
        isHardMode={isHardMode}
        guesses={mguesses}
        showAlert={showAlert}
        tomorrow={tomorrow}
        shareStatus={shareStatus}
        mclue={mclue}
        mv={mvideo}
        msol={msolution}
        mmsg={genmsg('M')}
        dclue={dclue}
        dv={dvideo}
        dsol={dsolution}
        dmsg={genmsg('D')}
        swap={swapclue}
      />
    </div>
  );
}

export default App;
