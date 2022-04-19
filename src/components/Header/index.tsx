import Link from 'next/link'
import Image from 'next/image'
import styles from './header.module.scss'
import commonStyles from '../../styles/common.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div
        className={`${styles.headerContainer} ${commonStyles.container}`}>
        <Link href="/">
          <a>
            <Image src="/images/Logo.svg" width="238.62px"
              height="25.63px"
              alt='logo'
            />
          </a>
        </Link>
      </div>
    </header>
  )
}
