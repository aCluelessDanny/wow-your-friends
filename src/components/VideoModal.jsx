import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import anime from 'animejs'
import ReactPlayer from 'react-player'

import { breakpoints } from './design'

const Overlay = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #0009;
  z-index: 20;
`

const PlayerWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 960px;
  padding: 1em;
  margin: 0 4em;
  background: #bac1d6;

  &::before {
    display: block;
    content: "";
    width: 100%;
    padding-top: calc((9 / 16) * 100%);
  }

  > .video {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1em;
  }

  @media screen and (${breakpoints.mobile}) {
    margin: 0 1em;

    > .video {
      padding: .5em;
    }
  }
`

const PlayerDecor = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 10%;
  border-radius: 0 0 1.5em 1.5em;
  background: #bac1d6;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 15%;
    background: #808ca9;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 8%;
    bottom: 0;
    right: 8%;
    border-left: .25em solid #808ca9;
    border-right: .25em solid #808ca9;
  }
`

const FullFlexCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 2em;

  * + * {
    margin-top: 0.25em;
  }
`

const Error = styled.p`
  color: #333;
  text-align: center;
  font-size: 1.2em;

  @media screen and (${breakpoints.mobile}) {
    font-size: 1em;
  }
`

const ErrorHeader = styled.h3`
  color: #222;
  font-size: 1.5em;

  @media screen and (${breakpoints.mobile}) {
    font-size: 1.2em;
  }
`

const LoadingDot = styled.p`
  font-size: 3.5em;
  text-shadow: 0 1px #333;

  @media screen and (${breakpoints.mobile}) {
    font-size: 2.5em;
  }
`

const VideoModal = ({ url, set }) => {
  // State //
  const [videoURL, setVideoURL] = useState("")
  const [error, setError] = useState(false)

  // Hooks //
  // Set error if videoURL cannot be played for ReactPlayer
  useEffect(() => {
    setError(videoURL && !ReactPlayer.canPlay(videoURL))
  }, [videoURL])

  // Toggle animations for video player
  useEffect(() => {
    // Remove any current animation instance
    const targets = ".video-overlay, .player"
    anime.remove(targets)

    // Animation for loading indicator
    const loadingDotAnim = anime({
      targets: ".loading-dot",
      easing: "easeInOutCirc",
      duration: 1000,
      loop: true,
      autoplay: false,
      translateX: [
        { value: ["400%", "-400%"] },
        { value: "400%" }
      ],
      scale: [
        { value: ["1, 1", "2.8, 0.5"] },
        { value: "1, 1" },
        { value: "2, 0.5" },
        { value: "1, 1" }
      ]
    })

    // Animation for displaying and hiding video player
    const tl = anime.timeline({
      easing: "spring(1, 100, 50, 0)",
      begin: () => {
        anime.set(".video-overlay", { display: (url || videoURL) ? "flex" : "none" })
        loadingDotAnim.restart()
      },
      complete: () => {
        anime.set(".video-overlay", { display: url ? "flex" : "none" })
        setVideoURL(url)
        if (!url) { loadingDotAnim.pause() }
      }
    })

    tl
    .add({
      targets: ".video-overlay",
      opacity: url ? 1 : 0
    })
    .add({
      targets: ".player",
      translateX: url ? "0%" : "100%"
    }, 0)
  }, [url])

  // Simulate modal close by "immediately moving to an open state first"
  const closeModal = () => {
    setVideoURL(url)
    set("")
  }

  const videoPlayer = () => {
    if (error === false && videoURL) {    // If nothing went wrong, display the video
      return <ReactPlayer className="video" url={videoURL} playing={url !== ""} controls height="100%" width="100%"/>
    } else if (error) {   // Else if the video is unable to be played, show a link instead
      return (
        <FullFlexCenter>
          <ErrorHeader>Well that's a problem...</ErrorHeader>
          <Error>Looks like I can't play the video from here. But you can still access it through this <a href={videoURL} target="_blank" rel="noopener noreferrer">link</a>!</Error>
        </FullFlexCenter>
      )
    } else {    // Default case is that the animation is ongoing and loading
      return (
        <FullFlexCenter>
          <LoadingDot className="loading-dot">•</LoadingDot>
        </FullFlexCenter>
      )
    }
  }

  return (
    <Overlay className="video-overlay" onClick={closeModal}>
      <PlayerWrapper className="player">
        {videoPlayer()}
        <PlayerDecor/>
      </PlayerWrapper>
    </Overlay>
  )
}

export default VideoModal
