import styles from './Skeleton.module.css'

const Skeleton = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.skeleton} ${styles.date}`}></div>
        <div className={styles.content}>
          <div className={`${styles.skeleton} ${styles.title}`}></div>
          <div className={`${styles.skeleton} ${styles.tags}`}></div>
        </div>
        <div className={`${styles.skeleton} ${styles.comments}`}></div>
      </div>
      <div className={styles.container}>
        <div className={`${styles.skeleton} ${styles.date}`}></div>
        <div className={styles.content}>
          <div className={`${styles.skeleton} ${styles.title}`}></div>
          <div className={`${styles.skeleton} ${styles.tags}`}></div>
        </div>
        <div className={`${styles.skeleton} ${styles.comments}`}></div>
      </div>
      <div className={styles.container}>
        <div className={`${styles.skeleton} ${styles.date}`}></div>
        <div className={styles.content}>
          <div className={`${styles.skeleton} ${styles.title}`}></div>
          <div className={`${styles.skeleton} ${styles.tags}`}></div>
        </div>
        <div className={`${styles.skeleton} ${styles.comments}`}></div>
      </div>
    </>
  )
}

export default Skeleton