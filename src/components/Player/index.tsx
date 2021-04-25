import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import {usePlayer} from '../../contexts/PlayerContext'

import styles from './styles.module.scss'
import {convertDurationToTimeString} from '../../utils/convertDurationToTimeString'

export function Player() {
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const router = useRouter()

  const isDisabled = router.asPath !== '/'

  const {
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    isLooping,
    toggleLoop,
    toggleShuffle,
    isShuffling
  } = usePlayer()

  useEffect(() => {
    if(!audioRef.current) {
      return
    }

    if(isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current?.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    playNext()
  }

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
    <header>
      <img src="/playing.svg" alt="Tocando agora" />
      <strong>Tocando agora</strong>
    </header>

    {episode ? (
      <div className={styles.currentEpisode}>
        <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
        <strong>{episode.title}</strong>
        <span>{episode.members}</span>
      </div>
    ) : (
      <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
    )}

    <footer className={!episode ? styles.empty : ''}>
      <div className={styles.progress}>
        <span>{convertDurationToTimeString(!progress ? 0 : progress)}</span>
        <div className={styles.slider}>
          {episode ? (
            <Slider 
              max={episode.duration}
              value={progress}
              onChange={handleSeek}
              trackStyle={{backgroundColor: '#04d461'}}
              railStyle={{backgroundColor: '#9f75ff'}}
              handleStyle={{borderColor: '#04d461', borderWidth: 4}}
            />
          ) : (
            <div className={styles.emptySlider} />
          )}
        </div>
        <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
      </div>

      {episode && (
        <audio 
          ref={audioRef}
          src={episode.url}
          autoPlay
          onEnded={handleEpisodeEnded}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          loop={isLooping}
          onLoadedMetadata={setupProgressListener}
        />
      )}

      <div className={styles.buttons}>
        <button 
          type="button" 
          disabled={!episode || isDisabled}
          onClick={toggleShuffle}
          className={isShuffling ? styles.isActive : ''}
        >
          <img src="/shuffle.svg" alt="Embaralhar"/>
        </button>
        <button type="button" disabled={!episode || isDisabled} onClick={playPrevious}>
          <img src="/play-previous.svg" alt="Tocar anterior"/>
        </button>
        <button 
          type="button" 
          className={styles.playButton} 
          disabled={!episode}
          onClick={togglePlay}
        >
          {isPlaying
            ? <img src="/pause.svg" alt="Pausar"/>
            : <img src="/play.svg" alt="Tocar"/>
          }
        </button>
        <button type="button" disabled={!episode || isDisabled} onClick={playNext}>
          <img src="/play-next.svg" alt="Tocar próxima"/>
        </button>
        <button 
          type="button" 
          disabled={!episode} 
          onClick={toggleLoop}
          className={isLooping ? styles.isActive : ''}
        >
          <img src="/repeat.svg" alt="Repetir"/>
        </button>
      </div>
    </footer>
  </div>
  )
}