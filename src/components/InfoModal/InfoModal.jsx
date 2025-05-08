import Modal from 'components/Modal';
import Cell from 'components/Cell';
import styles from './InfoModal.module.scss';

const InfoModal = ({ isOpen, onClose }) => {
  return (
    <Modal title={'How to play'} isOpen={isOpen} onClose={onClose}>
      <h3>
        Guess the CRYPTIC WORDLE based on the clue in 10 tries. Each guess must be a valid word. Hit the enter button to submit. After each guess, the color of the
        tiles will change to show how close your guess was to the word.
      </h3>
      <div style={{"max-width":"368px", "margin":"0 auto"}}>
      <div className={styles.row}>
        <Cell infocell="true" value="W" status="correct" isCompleted/>
        <Cell infocell="true" value="E" />
        <Cell infocell="true" value="A" />
        <Cell infocell="true" value="R" />
        <Cell infocell="true" value="Y" />
      </div>
      <h3>The letter W is in the word and in the correct spot.</h3>
      <div className={styles.row}>
        <Cell infocell="true" value="P" />
        <Cell infocell="true" value="I" status="present" isCompleted />
        <Cell infocell="true" value="L" />
        <Cell infocell="true" value="L" />
        <Cell infocell="true" value="S" />
      </div>
      <h3>The letter I is in the word but in the wrong spot.</h3>
      <div className={styles.row}>
        <Cell infocell="true" value="V" />
        <Cell infocell="true" value="A" />
        <Cell infocell="true" value="G" />
        <Cell infocell="true" value="U" status="absent" isCompleted />
        <Cell infocell="true" value="E" />
      </div>
      <h3>The letter U is not in the word in any spot.</h3>
      </div>
    </Modal>
  );
};

export default InfoModal;
