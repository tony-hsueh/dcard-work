import { Alert as BootstrapAlert } from "react-bootstrap";
import styles from './Alert.module.css'

const Alert = ({show, status, msg}) => {
  return (
    <BootstrapAlert
      className={styles.responseAlert}
      show={show} 
      variant={status}
    >
      <BootstrapAlert.Heading className="text-center mb-0">
        {msg}
      </BootstrapAlert.Heading>
    </BootstrapAlert>
  )
}

export default Alert