import Link from 'next/link'
import styles from "./not-found.module.css";
 
export default function NotFound() {
  return (
    <div className={styles.notFoundBg}>
      <h2>Page Not Found</h2>
      <Link href="/">Back to Daniel&#39;s Home</Link>
      <div className={styles.leftSpotLight}></div>
      <div className={styles.rightSpotLight}></div>
    </div>
  )
}