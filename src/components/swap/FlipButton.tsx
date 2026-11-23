import styles from "./FlipButton.module.css";

export function FlipButton({ onClick }: { onClick: () => void }) {
  return (
    <button className={styles.flip} onClick={onClick} title="Поменять местами">
      ↓↑
    </button>
  );
}
