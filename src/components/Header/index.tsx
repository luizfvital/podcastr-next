import Link from 'next/link'
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'

import {usePlayer} from '../../contexts/PlayerContext'

import styles from './styles.module.scss'

export function Header() {
  const {clearPlayerState} = usePlayer()
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR
  })
  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <img onClick={clearPlayerState} src="/logo.svg" alt="Podcastr" />
      </Link>

      <p>O melhor prara você ouvir, sempre</p>

      <span>{currentDate}</span>
    </header>
  )
}