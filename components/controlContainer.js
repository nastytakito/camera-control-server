import styles from './controlContainer.module.css'
export default function controlContainer({children}) {
  return(
    <div className={styles.container} children={children} />
  )
}