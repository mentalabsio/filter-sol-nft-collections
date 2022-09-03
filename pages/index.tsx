/** @jsxImportSource theme-ui */
import Head from "next/head"

import { Heading, Text, Label } from "@theme-ui/components"

export default function Home() {
  return (
    <>
      <main
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "64rem",
          margin: "0 auto",
          marginTop: "4rem",
        }}
      >
        <Heading mb=".8rem" variant="heading1">
          Themed App
        </Heading>
      </main>
    </>
  )
}
