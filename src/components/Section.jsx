import React, { useState, useEffect, useRef } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import styled from '@emotion/styled'
import anime from 'animejs'
import useMeasure from 'use-measure'

import { breakpoints } from './design'

const Container = styled.div`
  margin: 4em 0;

  @media screen and (${breakpoints.xsmall}) {
    margin: 3em 0;
  }
`

const HeaderContainer = styled.div`
  display: inline-flex;
  align-items: center;
  padding-right: 1em;
  cursor: pointer;

  @media screen and (${breakpoints.mobile}) {
    padding-left: 0 !important;
  }

  @media screen and (${breakpoints.xsmall}) {
    font-size: .9em;
  }
`

const Caret = styled.i`
  font-size: 1.8em;
  margin-right: .25rem;
`

const Header = styled.h2`
  padding: .25em 0;

  @media screen and (${breakpoints.mobile}) {
    padding-left: 0 !important;
  }
`

const Cards = styled.div`
  height: 0;
  overflow: hidden;

  @media screen and (${breakpoints.mobile}) {
    margin: 0 -1em;
    padding: 0 1em;
  }
`

const CardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 3em;

  @media screen and (${breakpoints.large}) {
    padding: 0 2em;
  }

  @media screen and (${breakpoints.mid}) {
    padding: 0 1em;
  }

  @media screen and (${breakpoints.mobile}) {
    padding: 0;
  }
`

const Postcard = styled.div`
  position: relative;
  width: 75%;
  padding: 1em;
  margin: 1.5em 0;
  transform: translateY(-100%) rotate(0);
  align-self: ${props => props.align ? props.align : "center"};
  background: #f2ebe8;
  background: url(${props => props.url}) no-repeat center center;
  background-size: contain;
  color: #4a453f;
  text-align: center;

  &::after {
    display: block;
    content: "";
    width: 100%;
    padding-top: calc(553 / 859 * 100%);
  }

  @media screen and (${breakpoints.tablet}) {
    width: 85%;
  }

  @media screen and (${breakpoints.large}) {
    width: 90%;
  }

  @media screen and (${breakpoints.mobile}) {
    width: 100%;
    align-self: center;
  }
`

const PostcardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0%;
  padding: 2em;
  font-size: 1.1em;

  ul, ol {
    padding: 0 1em;
    text-align: left;
  }

  & > * + * {
    margin-top: .4em;
  }

  @media screen and (${breakpoints.large}) {
    padding: 1.5em;
  }

  @media screen and (${breakpoints.mid}) {
    font-size: 1em;
  }

  @media screen and (${breakpoints.mobile}) {
    ul, ol {
      padding: 0 1.5em;
    }
  }

  @media screen and (${breakpoints.xsmall}) {
    padding: 1.2em;
    font-size: .9em;
  }
`

const StaticPostcard = styled(Postcard)`
  width: 100%;
  background: transparent;

  &::after {
    display: none;
  }
`

const Section = ({ className, header, postcards }) => {
  // State //
  const [showSection, setShowSection] = useState(false)

  // Hooks //
  // useMeasure() hook to later animate 'psuedo-auto'
  const measureRef = useRef()
  const { height: cardsWrapperHeight } = useMeasure(measureRef)

  // Toggle postcard animation
  useEffect(() => {
    // Remove any current animation instance
    anime.remove(`${className} *`)
    let tl = anime.timeline({
      easing: "spring(1, 100, 50, 0)"
    })

    // Run different animation timelines depending on the toggle
    if (showSection) {    // Expand section, then show postcards
      tl
      .add({
        targets: `.${className} .cards`,
        height: cardsWrapperHeight
      })
      .add({
        targets: `.${className} .caret`,
        rotate: 90
      }, 0)
      .add({
        targets: `.${className} .postcard`,
        delay: anime.stagger(65),
        opacity: 1,
        translateY: "0%",
        rotate: (_, i) => {
          const { stagnant = false, rotateOffset, clockwise = true } = postcards[i]
          if (stagnant) { return 0 }
          return rotateOffset + (clockwise ? 5 : -5)
        }
      }, 130)
    } else {    // Hide postcards first, then collapse section
      tl
      .add({
        targets: `.${className} .postcard`,
        delay: anime.stagger(65),
        opacity: 0,
        translateY: "-100%",
        rotate: (_, i) => {
          const { stagnant = false, rotateOffset } = postcards[i]
          if (stagnant) { return 0 }
          return rotateOffset
        }
      })
      .add({
        targets: `.${className} .caret`,
        rotate: 0
      }, 0)
      .add({
        targets: `.${className} .cards`,
        height: 0
      }, 130)
    }

    // For touch devices, toggle hover animation on click
    hoverAnim(showSection)
  }, [showSection, cardsWrapperHeight])

  // Animations //
  // Toggleable animation for hovering headers
  const hoverAnim = hover => {
    const targets = `.${className} .headerContainer, .${className} .header`
    anime.remove(targets)
    anime({
      targets: targets,
      paddingLeft: hover ? 20 : 0,
      easing: "spring(1, 100, 50, 0)"
    })
  }

  // GraphQL //
  const { postcardImage: { publicURL: postcardURL }} = useStaticQuery(graphql`
    query {
      # Get URL of postcard background image
      postcardImage: file(name: {eq: "postcard"}) {
        publicURL
      }
    }
  `)

  return (
    <Container className={className}>
      <HeaderContainer
        className="headerContainer"
        onClick={() => setShowSection(!showSection)}
        onMouseEnter={() => hoverAnim(true)}
        onMouseLeave={() => hoverAnim(false)}
      >
        <Caret className="caret fas fa-fw fa-angle-right"/>
        <Header className="header">{header}</Header>
      </HeaderContainer>
      <Cards className="cards">
        <CardsWrapper ref={measureRef}>
          {postcards.map(({ stagnant = false, alignSelf, content }, i) =>
            stagnant ? (
              <StaticPostcard key={i} className="postcard">
                {content}
              </StaticPostcard>
            ) : (
              <Postcard key={i} className="postcard" url={postcardURL} align={alignSelf}>
                <PostcardWrapper>
                  {content}
                </PostcardWrapper>
              </Postcard>
            )
          )}
        </CardsWrapper>
      </Cards>
    </Container>
  )
}

export default Section
