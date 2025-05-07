import Modal from 'components/Modal';
import Cell from 'components/Cell';
import styles from './HintModal.module.scss';

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

const HintModal = ({ isOpen, onClose, sclue, clue, sh1, sh2, sh3, dh1, dh2, dh3, ht1, ht2, ht3 }) => {
  return (
    <Modal title={'Hints'} isOpen={isOpen} onClose={onClose} nogap={true}>
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
      <h3 class={styles.newh3}>Click a cell below to reveal a letter.</h3>
      <div className={styles.row}>
        <Cell hintcell="true" value="W" status="correct" isCompleted/>
        <Cell hintcell="true" value="E" />
        <Cell hintcell="true" value="A" />
        <Cell hintcell="true" value="R" />
        <Cell hintcell="true" value="Y" />
      </div>
      <button class={dh1===''? styles.showhintbut : styles.shownhintbut} onClick={sh1}>{dh1===''? `🔒 Show ${ht1}` : `🔓 ${dh1}`}</button>
      {sclue==='D' ? <></> : <><button class={dh2===''? styles.showhintbut : styles.shownhintbut} onClick={sh2}>{dh2===''? `🔒 Show ${ht2}` : `🔓 ${dh2}`}</button>
      <button class={dh3===''? styles.showhintbut : styles.shownhintbut} onClick={sh3}>{dh3===''? `🔒 Show ${ht3}` : `🔓 ${dh3}`}</button></>}
    </Modal>
  );
};

export default HintModal;
