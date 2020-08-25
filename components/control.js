import styles from './control.module.css'
export default function control({children, ...props}) {
  return(
    <div className={styles.container} {...props}>
      {children}
    </div>
  )
}