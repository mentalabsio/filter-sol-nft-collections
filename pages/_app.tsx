import React from "react"
import Head from "next/head"
import { ThemeProvider } from "theme-ui"
import Router, { AppProps } from "next/dist/shared/lib/router/router"

// @ts-ignore
import withGA from "next-ga"

import defaultTheme from "../styles/theme"

function App(props: AppProps) {
  const { Component, pageProps } = props

  return (
    <ThemeProvider theme={defaultTheme}>
      <Head>
        {/** Load font styles directly on the document to prevent flashes */}
        <title>Filter Solana NFT Collections</title>
        <link href="/fonts/fonts.css" rel="stylesheet" />
      </Head>

      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default withGA(process.env.NEXT_PUBLIC_GA_ID, Router)(App)
