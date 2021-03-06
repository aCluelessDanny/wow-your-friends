import React, { useState } from 'react'
import styled from '@emotion/styled'

import { breakpoints } from '../components/design'
import Layout from "../components/Layout"
import Hero from "../components/Hero"
import Journal from "../components/Journal"
import Milestones from '../components/Milestones';
import QnA from '../components/QnA'
import Footer from '../components/Footer'

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  padding: 2em 4em;
  margin: 0 auto;

  @media screen and (${breakpoints.large}) {
    padding: 1em 1.5em;
  }

  @media screen and (${breakpoints.mid}) {
    padding: 1em;
  }

  @media screen and (${breakpoints.mobile}) {
    padding: .5em 1em;
  }
`

const IndexPage = () => {
  // State //
  const [heroLoaded, setHeroLoaded] = useState(false)

  return (
    <Layout set={setHeroLoaded}>
      <Container>
        <Hero loaded={heroLoaded}/>
        <Journal/>
        <Milestones/>
        <QnA/>
      </Container>
      <Footer/>
    </Layout>
  )
}

export default IndexPage
