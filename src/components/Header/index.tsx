import Link from 'next/link'
import Image from 'next/image'
import styles from './header.module.scss'

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <a>
          <Image src="/images/Logo.svg" width="238.62px"
            height="25.63px"
          />
        </a>
      </Link>
    </header>
  )
}
